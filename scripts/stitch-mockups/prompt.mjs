/**
 * Builds Stitch prompts from feature intent and reference styling.
 *
 * The prompt makes the reference's role explicit: it supplies visual language,
 * while the requested feature supplies layout, workflow, and content.
 */

/**
 * Builds the final Stitch prompt used for generation and variants.
 */
export function buildStitchPrompt(featurePrompt, style, reference) {
  const lines = [
    "Create UI mockup options for the requested feature.",
    "",
    "Use the requested feature for layout, content, workflow, and information architecture.",
    "Use any supplied reference only for visual language: palette, typography, spacing rhythm, corner radius, shadows, density, icon feel, and component treatment.",
    "Do not clone the reference screen's layout or content unless the feature prompt explicitly asks for that.",
    "",
    "## Feature Request",
    featurePrompt.trim(),
    "",
  ];

  if (reference.kind !== "none") {
    lines.push("## Reference Handling");
    lines.push(`A local ${reference.kind} reference was supplied and copied into the plan mockups folder.`);

    if (reference.imagePath) {
      lines.push("If an image was uploaded to Stitch, treat it as the style reference and generate new screens that borrow its design language.");
    }

    lines.push("");
  }

  lines.push("## Extracted Style Signals");
  lines.push(`Colors: ${style.colors.length ? style.colors.join(", ") : "none detected"}`);
  lines.push(`Font families: ${style.fontFamilies.length ? style.fontFamilies.join(", ") : "none detected"}`);
  lines.push(`Corner radius: ${style.radii.length ? style.radii.join(", ") : "none detected"}`);
  lines.push(`Shadows: ${style.shadows.length ? style.shadows.join(", ") : "none detected"}`);
  lines.push(`Spacing: ${style.spacing.length ? style.spacing.join("; ") : "none detected"}`);
  lines.push("");
  lines.push("Generate polished, high-fidelity alternatives that are materially different from one another while staying consistent with these style signals.");

  return `${lines.join("\n")}\n`;
}
