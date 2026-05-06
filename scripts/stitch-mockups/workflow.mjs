/**
 * Orchestrates the local preparation and networked Stitch generation workflow.
 *
 * Offline-testable helpers handle argument parsing, reference detection, and
 * style extraction before this module calls the Stitch SDK.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { parseArgs, resolveWorkflowPaths } from "./args.mjs";
import { buildStitchPrompt } from "./prompt.mjs";
import { copyReferenceArtifacts, detectReference } from "./reference.mjs";
import { generateStitchOptions } from "./stitch.mjs";
import { extractReferenceStyle, writeReferenceStyle } from "./style.mjs";

/**
 * Runs the full mockup generation workflow from CLI arguments.
 */
export async function runCli(argv, env = process.env) {
  const options = parseArgs(argv);

  if (options.help) {
    return { help: true, message: usage() };
  }

  const repoRoot = path.resolve(options.repoRoot);
  const promptPath = path.resolve(repoRoot, options.promptFile);
  const featurePrompt = await fs.readFile(promptPath, "utf8");
  const paths = resolveWorkflowPaths(repoRoot, options.plan);
  const reference = options.reference
    ? await detectReference(path.resolve(repoRoot, options.reference))
    : { kind: "none", files: [] };

  assertStitchCredentials(env);
  await fs.mkdir(paths.mockupsDir, { recursive: true });

  const copiedReference = await copyReferenceArtifacts(reference, paths.referenceDir);
  const style = await extractReferenceStyle(copiedReference);
  await writeReferenceStyle(style, paths.styleJsonPath, paths.styleMarkdownPath);

  const stitchPrompt = buildStitchPrompt(featurePrompt, style, copiedReference);
  await fs.writeFile(paths.stitchPromptPath, stitchPrompt, "utf8");

  const generatedOptions = await generateStitchOptions(options, copiedReference, stitchPrompt, paths.mockupsDir);
  await writeIndexFiles(paths, options, copiedReference, generatedOptions);
  await writeDecisionTemplate(paths.decisionPath, generatedOptions);

  return {
    options,
    paths,
    generatedOptions,
  };
}

/**
 * Ensures Stitch authentication exists before creating plan artifacts.
 */
function assertStitchCredentials(env) {
  if (!env.STITCH_API_KEY && !(env.STITCH_ACCESS_TOKEN && env.GOOGLE_CLOUD_PROJECT)) {
    throw new Error("Missing STITCH_API_KEY, or STITCH_ACCESS_TOKEN plus GOOGLE_CLOUD_PROJECT, for Stitch generation");
  }
}

/**
 * Writes the index files users inspect when choosing among generated options.
 */
export async function writeIndexFiles(paths, options, reference, generatedOptions) {
  await writeMarkdownIndex(paths.indexPath, options, reference, generatedOptions);
  await writeHtmlIndex(paths.htmlIndexPath, options, reference, generatedOptions);
}

/**
 * Writes the Markdown index for source review and plain-text diffs.
 */
async function writeMarkdownIndex(indexPath, options, reference, generatedOptions) {
  const lines = [
    "# UI Mockup Options",
    "",
    `Plan: \`${options.plan}\``,
    `Device: \`${options.device}\``,
    `Reference: \`${reference.kind}\``,
    "",
    "Open `index.html` in a browser to preview every option on one page.",
    "Review each option's PNG first, then open the matching HTML when available to inspect spacing, typography, and layout details.",
    "",
  ];

  for (const option of generatedOptions) {
    lines.push(`## ${option.optionSlug}`);
    lines.push("");
    lines.push(`- Screenshot: \`${path.basename(option.imagePath)}\``);
    lines.push(`- HTML: \`${option.htmlPath ? path.basename(option.htmlPath) : "not available"}\``);
    lines.push(`- Notes: \`${path.basename(option.notesPath)}\``);
    lines.push("");
  }

  await fs.writeFile(indexPath, `${lines.join("\n")}\n`, "utf8");
}

/**
 * Writes a browser-friendly preview page with embedded screenshots.
 */
async function writeHtmlIndex(indexPath, options, reference, generatedOptions) {
  const optionCards = generatedOptions.map((option) => renderOptionCard(option)).join("\n");
  const html = [
    "<!doctype html>",
    "<html lang=\"en\">",
    "<head>",
    "  <meta charset=\"utf-8\">",
    "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
    `  <title>${escapeHtml(options.plan)} UI Mockups</title>`,
    "  <style>",
    "    :root { color-scheme: light dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: Canvas; color: CanvasText; }",
    "    body { margin: 0; padding: 32px; }",
    "    main { max-width: 1180px; margin: 0 auto; }",
    "    header { margin-bottom: 28px; }",
    "    h1 { margin: 0 0 8px; font-size: 2rem; line-height: 1.15; }",
    "    p { margin: 0; color: color-mix(in srgb, CanvasText 72%, transparent); line-height: 1.5; }",
    "    .meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }",
    "    .chip { border: 1px solid color-mix(in srgb, CanvasText 18%, transparent); border-radius: 999px; padding: 6px 10px; font-size: 0.875rem; }",
    "    .grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); }",
    "    article { border: 1px solid color-mix(in srgb, CanvasText 16%, transparent); border-radius: 8px; overflow: clip; background: color-mix(in srgb, Canvas 94%, CanvasText 6%); }",
    "    article img { display: block; width: 100%; height: auto; background: white; }",
    "    .body { padding: 16px; }",
    "    h2 { margin: 0 0 12px; font-size: 1.125rem; }",
    "    ul { display: flex; flex-wrap: wrap; gap: 10px; list-style: none; margin: 0; padding: 0; }",
    "    a { color: LinkText; }",
    "  </style>",
    "</head>",
    "<body>",
    "  <main>",
    "    <header>",
    "      <h1>UI Mockup Options</h1>",
    "      <p>Preview the generated screenshots here, then open the source HTML or notes for implementation details.</p>",
    "      <div class=\"meta\">",
    `        <span class=\"chip\">Plan: ${escapeHtml(options.plan)}</span>`,
    `        <span class=\"chip\">Device: ${escapeHtml(options.device)}</span>`,
    `        <span class=\"chip\">Reference: ${escapeHtml(reference.kind)}</span>`,
    "      </div>",
    "    </header>",
    "    <section class=\"grid\" aria-label=\"Generated mockup options\">",
    optionCards,
    "    </section>",
    "  </main>",
    "</body>",
    "</html>",
  ].join("\n");

  await fs.writeFile(indexPath, `${html}\n`, "utf8");
}

/**
 * Renders one generated option into the preview grid.
 */
function renderOptionCard(option) {
  const imageName = path.basename(option.imagePath);
  const notesName = path.basename(option.notesPath);
  const htmlName = option.htmlPath ? path.basename(option.htmlPath) : undefined;
  const links = [
    `<li><a href="${escapeAttribute(imageName)}">Open PNG</a></li>`,
    htmlName ? `<li><a href="${escapeAttribute(htmlName)}">Open HTML</a></li>` : "<li>HTML unavailable</li>",
    `<li><a href="${escapeAttribute(notesName)}">Notes</a></li>`,
  ].join("");

  return [
    "      <article>",
    `        <a href="${escapeAttribute(imageName)}"><img src="${escapeAttribute(imageName)}" alt="${escapeAttribute(option.optionSlug)} screenshot"></a>`,
    "        <div class=\"body\">",
    `          <h2>${escapeHtml(option.optionSlug)}</h2>`,
    `          <ul>${links}</ul>`,
    "        </div>",
    "      </article>",
  ].join("\n");
}

/**
 * Escapes text rendered into HTML element content.
 */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/**
 * Escapes text rendered into quoted HTML attributes.
 */
function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("\"", "&quot;");
}

/**
 * Writes a decision template that should be completed before implementation.
 */
async function writeDecisionTemplate(decisionPath, generatedOptions) {
  const optionList = generatedOptions.map((option) => `- ${option.optionSlug}:`).join("\n");
  const content = [
    "# Mockup Decision",
    "",
    "Complete this before implementation begins.",
    "",
    "## Options Reviewed",
    "",
    optionList,
    "",
    "## Selected Direction",
    "",
    "- Selected option:",
    "- Changes requested before implementation:",
    "- Notes to record in the ExecPlan Decision Log:",
    "",
  ].join("\n");

  await fs.writeFile(decisionPath, content, "utf8");
}

/**
 * Returns command usage for `--help` and argument errors.
 */
export function usage() {
  return [
    "Usage:",
    "  npm run stitch:mockups -- --plan 00-plan-name --prompt-file prompt.md [options]",
    "",
    "Options:",
    "  --reference <path>     Local PNG/JPG/WEBP image, HTML/CSS file, or Stitch export folder",
    "  --variants <1-5>       Number of mockup options to generate (default: 4)",
    "  --device <type>        DESKTOP, MOBILE, TABLET, or AGNOSTIC (default: DESKTOP)",
    "  --model <id>           GEMINI_3_PRO or GEMINI_3_FLASH (default: GEMINI_3_PRO)",
    "  --project-id <id>      Reuse an existing Stitch project",
    "  --title <title>        Title for a newly created Stitch project",
    "  --repo-root <path>     Repository root for tests or nonstandard invocation",
  ].join("\n");
}
