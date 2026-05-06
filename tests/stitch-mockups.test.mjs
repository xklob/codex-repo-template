/**
 * Tests the offline portions of the Stitch mockup generation workflow.
 *
 * These tests protect argument validation, reference artifact handling, CSS
 * extraction, and credential failures without calling the live Stitch service.
 */

import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parseArgs, resolveWorkflowPaths } from "../scripts/stitch-mockups/args.mjs";
import { buildStitchPrompt } from "../scripts/stitch-mockups/prompt.mjs";
import { copyReferenceArtifacts, detectReference } from "../scripts/stitch-mockups/reference.mjs";
import { extractReferenceStyle, writeReferenceStyle } from "../scripts/stitch-mockups/style.mjs";
import { runCli, writeIndexFiles } from "../scripts/stitch-mockups/workflow.mjs";

test("parseArgs validates required options and default values", () => {
  const options = parseArgs([
    "--plan",
    "00-dashboard-redesign",
    "--prompt-file",
    "prompt.md",
    "--variants",
    "3",
  ], "/repo");

  assert.equal(options.plan, "00-dashboard-redesign");
  assert.equal(options.promptFile, "prompt.md");
  assert.equal(options.variants, 3);
  assert.equal(options.device, "DESKTOP");
  assert.equal(options.model, "GEMINI_3_PRO");
  assert.equal(options.repoRoot, "/repo");
});

test("parseArgs rejects unsafe plan names", () => {
  assert.throws(
    () => parseArgs(["--plan", "../escape", "--prompt-file", "prompt.md"]),
    /plan filename stem/,
  );
  assert.throws(
    () => parseArgs(["--plan", "dashboard", "--prompt-file", "prompt.md"]),
    /NN-short-kebab-name/,
  );
});

test("reference bundles are detected and copied with supported files only", async () => {
  const tempDir = await makeTempDir();
  const bundleDir = path.join(tempDir, "bundle");
  const referenceDir = path.join(tempDir, "plans", "00-ui", "mockups", "reference");
  await fs.mkdir(path.join(bundleDir, "screen"), { recursive: true });
  await fs.mkdir(path.join(bundleDir, "theme"), { recursive: true });
  await fs.mkdir(path.join(bundleDir, "nested"), { recursive: true });
  await fs.writeFile(path.join(bundleDir, "preview.png"), "fake image");
  await fs.writeFile(path.join(bundleDir, "screen", "index.html"), "<link rel=\"stylesheet\" href=\"../theme/styles.css\"><main></main>");
  await fs.writeFile(path.join(bundleDir, "theme", "styles.css"), "main { color: #123456; }");
  await fs.writeFile(path.join(bundleDir, "nested", "styles.css"), "main { color: #abcdef; }");
  await fs.writeFile(path.join(bundleDir, ".env"), "SECRET=value");

  const reference = await detectReference(bundleDir);
  const copied = await copyReferenceArtifacts(reference, referenceDir);

  assert.equal(reference.kind, "bundle");
  assert.equal(path.basename(reference.imagePath), "preview.png");
  assert.equal(path.basename(reference.htmlPath), "index.html");
  assert.deepEqual(copied.files.map((file) => path.relative(referenceDir, file)).sort(), [
    path.join("nested", "styles.css"),
    "preview.png",
    path.join("screen", "index.html"),
    path.join("theme", "styles.css"),
  ]);
  const style = await extractReferenceStyle(copied);
  assert.ok(style.colors.includes("#123456"));
  assert.ok(style.colors.includes("#abcdef"));
  await assert.rejects(() => fs.access(path.join(referenceDir, ".env")));
});

test("standalone HTML references copy local linked stylesheets", async () => {
  const tempDir = await makeTempDir();
  const referenceDir = path.join(tempDir, "plans", "00-ui", "mockups", "reference");
  const htmlPath = path.join(tempDir, "reference.html");
  const cssPath = path.join(tempDir, "styles.css");
  await fs.writeFile(htmlPath, "<link rel=\"stylesheet\" href=\"styles.css?v=1\"><main></main>");
  await fs.writeFile(cssPath, "main { color: #654321; padding: 12px; }");

  const reference = await detectReference(htmlPath);
  const copied = await copyReferenceArtifacts(reference, referenceDir);
  const style = await extractReferenceStyle(copied);

  assert.equal(reference.kind, "html");
  assert.deepEqual(copied.files.map((file) => path.relative(referenceDir, file)).sort(), [
    "reference.html",
    "styles.css",
  ]);
  assert.ok(style.colors.includes("#654321"));
  assert.ok(style.spacing.some((value) => value.includes("padding")));
  assert.deepEqual(style.warnings, []);
});

test("extractReferenceStyle reads linked CSS and writes summaries", async () => {
  const tempDir = await makeTempDir();
  const htmlPath = path.join(tempDir, "index.html");
  const cssPath = path.join(tempDir, "styles.css");
  const jsonPath = path.join(tempDir, "reference-style.json");
  const markdownPath = path.join(tempDir, "reference-style.md");

  await fs.writeFile(htmlPath, [
    "<html><head><link rel=\"stylesheet\" href=\"styles.css\"></head>",
    "<body><nav></nav><button style=\"margin-top: 8px\">Save</button></body></html>",
  ].join(""));
  await fs.writeFile(cssPath, [
    ".card {",
    "  color: #123456;",
    "  font-family: Inter, sans-serif;",
    "  border-radius: 12px;",
    "  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);",
    "  padding: 24px;",
    "}",
  ].join("\n"));

  const style = await extractReferenceStyle({ kind: "html", htmlPath, cssPaths: [] });
  await writeReferenceStyle(style, jsonPath, markdownPath);
  const markdown = await fs.readFile(markdownPath, "utf8");

  assert.ok(style.colors.includes("#123456"));
  assert.ok(style.fontFamilies.includes("Inter,sans-serif"));
  assert.ok(style.radii.includes("12px"));
  assert.ok(style.spacing.some((value) => value.includes("padding")));
  assert.match(markdown, /# Reference Style/);
});

test("buildStitchPrompt keeps reference influence style-only", () => {
  const prompt = buildStitchPrompt(
    "Add a project settings screen.",
    {
      colors: ["#123456"],
      fontFamilies: ["Inter,sans-serif"],
      radii: ["12px"],
      shadows: [],
      spacing: [],
    },
    { kind: "bundle", imagePath: "/tmp/preview.png" },
  );

  assert.match(prompt, /visual language/);
  assert.match(prompt, /Do not clone/);
  assert.match(prompt, /Add a project settings screen/);
  assert.match(prompt, /#123456/);
});

test("runCli fails clearly when Stitch credentials are missing", async () => {
  const repoRoot = await makeTempDir();
  const promptPath = path.join(repoRoot, "prompt.md");
  await fs.writeFile(promptPath, "Design a billing settings view.");

  await assert.rejects(
    () => runCli([
      "--repo-root",
      repoRoot,
      "--plan",
      "00-billing-settings",
      "--prompt-file",
      "prompt.md",
    ], {}),
    /Missing STITCH_API_KEY/,
  );
});

test("resolveWorkflowPaths keeps artifacts inside the plan folder", () => {
  const paths = resolveWorkflowPaths("/repo", "00-settings-ui");

  assert.equal(paths.mockupsDir, "/repo/plans/00-settings-ui/mockups");
  assert.equal(paths.referenceDir, "/repo/plans/00-settings-ui/mockups/reference");
  assert.equal(paths.htmlIndexPath, "/repo/plans/00-settings-ui/mockups/index.html");
});

test("writeIndexFiles creates browser preview and markdown indexes", async () => {
  const tempDir = await makeTempDir();
  const paths = {
    indexPath: path.join(tempDir, "index.md"),
    htmlIndexPath: path.join(tempDir, "index.html"),
  };
  const generatedOptions = [
    {
      optionSlug: "option-01",
      imagePath: path.join(tempDir, "option-01.png"),
      htmlPath: path.join(tempDir, "option-01.html"),
      notesPath: path.join(tempDir, "option-01-notes.md"),
    },
    {
      optionSlug: "option-02",
      imagePath: path.join(tempDir, "option-02.png"),
      notesPath: path.join(tempDir, "option-02-notes.md"),
    },
  ];

  await writeIndexFiles(paths, { plan: "00-settings-ui", device: "DESKTOP" }, { kind: "none" }, generatedOptions);
  const markdown = await fs.readFile(paths.indexPath, "utf8");
  const html = await fs.readFile(paths.htmlIndexPath, "utf8");

  assert.match(markdown, /Open `index.html`/);
  assert.match(html, /<title>00-settings-ui UI Mockups<\/title>/);
  assert.match(html, /<img src="option-01\.png"/);
  assert.match(html, /href="option-01\.html"/);
  assert.match(html, /HTML unavailable/);
});

/**
 * Creates a test-owned temporary directory.
 */
async function makeTempDir() {
  return fs.mkdtemp(path.join(os.tmpdir(), "stitch-mockups-"));
}
