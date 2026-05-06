/**
 * Calls Google Stitch and downloads generated mockup artifacts.
 *
 * This module is the only part of the workflow that requires network access
 * and Stitch credentials.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Calls Stitch to generate either image-reference variants or prompt variants.
 */
export async function generateStitchOptions(options, reference, stitchPrompt, outputDir) {
  const { stitch } = await import("@google/stitch-sdk");
  const projectTitle = options.title ?? `${options.plan} UI mockups`;
  const project = options.projectId ? stitch.project(options.projectId) : await stitch.createProject(projectTitle);
  let screens;

  if (reference.imagePath && typeof project.uploadImage === "function") {
    screens = await generateFromImageReference(project, reference.imagePath, projectTitle, options, stitchPrompt);
  } else {
    screens = await generateFromPrompt(project, options, stitchPrompt);
  }

  const generatedOptions = [];

  for (let index = 0; index < screens.length; index += 1) {
    generatedOptions.push(await downloadScreenArtifacts(screens[index], index + 1, outputDir));
  }

  return generatedOptions;
}

/**
 * Uploads a reference image to Stitch and generates style-guided variants.
 */
async function generateFromImageReference(project, imagePath, projectTitle, options, stitchPrompt) {
  const [referenceScreen] = await project.uploadImage(imagePath, {
    title: `${projectTitle} reference`,
    createScreenInstances: true,
  });

  return referenceScreen.variants(
    stitchPrompt,
    variantOptions(options.variants),
    options.device,
    options.model,
  );
}

/**
 * Generates a base screen from text and variants from that base screen.
 */
async function generateFromPrompt(project, options, stitchPrompt) {
  const baseScreen = await project.generate(stitchPrompt, options.device);
  const remainingCount = Math.max(0, options.variants - 1);

  if (remainingCount === 0) {
    return [baseScreen];
  }

  const variants = await baseScreen.variants(
    stitchPrompt,
    variantOptions(remainingCount),
    options.device,
    options.model,
  );

  return [baseScreen, ...variants];
}

/**
 * Returns the shared variant configuration used for mockup alternatives.
 */
function variantOptions(variantCount) {
  return {
    variantCount,
    creativeRange: "EXPLORE",
    aspects: ["LAYOUT", "COLOR_SCHEME", "TEXT_FONT", "IMAGES"],
  };
}

/**
 * Downloads one Stitch screen's screenshot and HTML into deterministic files.
 */
async function downloadScreenArtifacts(screen, optionNumber, outputDir) {
  const optionSlug = `option-${String(optionNumber).padStart(2, "0")}`;
  const imagePath = path.join(outputDir, `${optionSlug}.png`);
  const htmlPath = path.join(outputDir, `${optionSlug}.html`);
  const notesPath = path.join(outputDir, `${optionSlug}-notes.md`);
  const warnings = [];

  const imageUrl = await screen.getImage();
  await downloadUrl(imageUrl, imagePath);

  try {
    const htmlUrl = await screen.getHtml();
    await downloadUrl(htmlUrl, htmlPath);
  } catch (error) {
    warnings.push(`Could not download HTML for ${optionSlug}: ${error.message}`);
  }

  await writeOptionNotes(notesPath, screen, optionSlug, imagePath, htmlPath, warnings);

  return {
    optionSlug,
    screenId: screen.screenId ?? screen.id ?? "unknown",
    imagePath,
    htmlPath: warnings.length ? undefined : htmlPath,
    notesPath,
    warnings,
  };
}

/**
 * Downloads a signed Stitch URL to a local file.
 */
async function downloadUrl(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed with HTTP ${response.status}: ${url}`);
  }

  const body = new Uint8Array(await response.arrayBuffer());
  await fs.writeFile(outputPath, body);
}

/**
 * Writes per-option metadata for later review and implementation.
 */
async function writeOptionNotes(notesPath, screen, optionSlug, imagePath, htmlPath, warnings) {
  await fs.writeFile(
    notesPath,
    [
      `# ${optionSlug}`,
      "",
      `- Stitch screen id: ${screen.screenId ?? screen.id ?? "unknown"}`,
      `- Screenshot: ${path.basename(imagePath)}`,
      `- HTML: ${warnings.length ? "not available" : path.basename(htmlPath)}`,
      ...warnings.map((warning) => `- Warning: ${warning}`),
      "",
    ].join("\n"),
    "utf8",
  );
}
