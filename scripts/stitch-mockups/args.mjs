/**
 * Parses and validates command-line options for Stitch mockup generation.
 *
 * Keeping this logic separate makes the networked Stitch workflow easier to
 * test without real credentials.
 */

import path from "node:path";

const DEVICE_TYPES = new Set(["DESKTOP", "MOBILE", "TABLET", "AGNOSTIC"]);
const MODEL_IDS = new Set(["GEMINI_3_PRO", "GEMINI_3_FLASH"]);
const DEFAULT_VARIANTS = 4;
const MAX_VARIANTS = 5;

/**
 * Parses command-line arguments into a small options object.
 */
export function parseArgs(argv, defaultRepoRoot = process.cwd()) {
  const options = {
    variants: DEFAULT_VARIANTS,
    device: "DESKTOP",
    model: "GEMINI_3_PRO",
    repoRoot: defaultRepoRoot,
  };
  const valueArgs = new Set([
    "--plan",
    "--prompt-file",
    "--reference",
    "--variants",
    "--device",
    "--project-id",
    "--title",
    "--repo-root",
    "--model",
  ]);

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (!valueArgs.has(arg)) {
      throw new Error(`Unknown argument: ${arg}`);
    }

    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${arg}`);
    }

    index += 1;
    options[toCamelCase(arg.slice(2))] = value;
  }

  if (options.help) {
    return options;
  }

  validateRequiredOptions(options);
  options.variants = validateVariantCount(options.variants);
  options.device = validateEnum("device", options.device, DEVICE_TYPES);
  options.model = validateEnum("model", options.model, MODEL_IDS);
  assertSafePlanStem(options.plan);

  return options;
}

/**
 * Converts kebab-case command option names into object keys.
 */
function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Verifies that required CLI options are present before any filesystem work.
 */
function validateRequiredOptions(options) {
  if (!options.plan) {
    throw new Error("Missing required --plan <plan-stem>");
  }

  if (!options.promptFile) {
    throw new Error("Missing required --prompt-file <path>");
  }
}

/**
 * Validates the requested number of generated options.
 */
function validateVariantCount(rawValue) {
  const variants = Number.parseInt(String(rawValue), 10);

  if (!Number.isInteger(variants) || variants < 1 || variants > MAX_VARIANTS) {
    throw new Error(`--variants must be an integer from 1 to ${MAX_VARIANTS}`);
  }

  return variants;
}

/**
 * Validates a command-line value against a fixed set of allowed values.
 */
function validateEnum(optionName, rawValue, allowedValues) {
  const value = String(rawValue).toUpperCase();

  if (!allowedValues.has(value)) {
    throw new Error(`--${optionName} must be one of: ${Array.from(allowedValues).join(", ")}`);
  }

  return value;
}

/**
 * Rejects plan names that could escape the repository-owned `plans/` folder.
 */
export function assertSafePlanStem(planStem) {
  const validPlanStem = /^[0-9]{2}-[a-z0-9][a-z0-9-]*$/;

  if (path.isAbsolute(planStem) || planStem.includes("/") || planStem.includes("\\")) {
    throw new Error("--plan must be a plan filename stem, not a path");
  }

  if (!validPlanStem.test(planStem)) {
    throw new Error("--plan must look like NN-short-kebab-name, for example 00-dashboard-redesign");
  }
}

/**
 * Builds the output paths owned by a single ExecPlan mockup run.
 */
export function resolveWorkflowPaths(repoRoot, planStem) {
  const planDir = path.join(repoRoot, "plans", planStem);
  const mockupsDir = path.join(planDir, "mockups");

  return {
    planDir,
    mockupsDir,
    referenceDir: path.join(mockupsDir, "reference"),
    indexPath: path.join(mockupsDir, "index.md"),
    htmlIndexPath: path.join(mockupsDir, "index.html"),
    decisionPath: path.join(mockupsDir, "decision.md"),
    styleJsonPath: path.join(mockupsDir, "reference-style.json"),
    styleMarkdownPath: path.join(mockupsDir, "reference-style.md"),
    stitchPromptPath: path.join(mockupsDir, "stitch-prompt.md"),
  };
}
