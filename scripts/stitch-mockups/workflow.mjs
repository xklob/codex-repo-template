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
  await writeIndex(paths.indexPath, options, copiedReference, generatedOptions);
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
 * Writes the index users inspect when choosing among generated options.
 */
async function writeIndex(indexPath, options, reference, generatedOptions) {
  const lines = [
    "# UI Mockup Options",
    "",
    `Plan: \`${options.plan}\``,
    `Device: \`${options.device}\``,
    `Reference: \`${reference.kind}\``,
    "",
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
