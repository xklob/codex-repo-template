/**
 * Extracts design-language signals from copied HTML and CSS references.
 *
 * The extracted values are prompt hints for Google Stitch, not a replacement
 * for human review of generated mockup options.
 */

import * as cheerio from "cheerio";
import * as csstree from "css-tree";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Extracts reusable colors, typography, spacing, and component clues.
 */
export async function extractReferenceStyle(reference) {
  const style = emptyReferenceStyle();
  let cssText = "";

  if (reference.htmlPath) {
    const html = await fs.readFile(reference.htmlPath, "utf8");
    const $ = cheerio.load(html);

    cssText += collectStyleTags($);
    cssText += collectInlineStyles($);
    cssText += await collectLinkedStylesheets($, reference.htmlPath, style);
    style.componentHints = extractComponentHints($);
  }

  for (const cssPath of reference.cssPaths ?? []) {
    try {
      cssText += `\n${await fs.readFile(cssPath, "utf8")}`;
    } catch (error) {
      style.warnings.push(`Could not read CSS file ${cssPath}: ${error.message}`);
    }
  }

  collectStyleDeclarations(cssText, style);
  return style;
}

/**
 * Creates the style summary object used by tests and JSON output.
 */
function emptyReferenceStyle() {
  return {
    colors: [],
    fontFamilies: [],
    radii: [],
    shadows: [],
    spacing: [],
    declarations: {},
    componentHints: [],
    warnings: [],
  };
}

/**
 * Collects CSS embedded in HTML style tags.
 */
function collectStyleTags($) {
  let cssText = "";

  $("style").each((_, element) => {
    cssText += `\n${$(element).html() ?? ""}`;
  });

  return cssText;
}

/**
 * Wraps inline styles in a dummy selector so the CSS parser can read them.
 */
function collectInlineStyles($) {
  let cssText = "";

  $("[style]").each((_, element) => {
    const inlineStyle = $(element).attr("style");
    if (inlineStyle) {
      cssText += `\n.inline-reference { ${inlineStyle} }`;
    }
  });

  return cssText;
}

/**
 * Reads local CSS files linked from a copied HTML reference.
 */
async function collectLinkedStylesheets($, htmlPath, style) {
  let cssText = "";

  for (const href of collectLocalCssLinks($)) {
    const cssPath = path.resolve(path.dirname(htmlPath), href);
    try {
      cssText += `\n${await fs.readFile(cssPath, "utf8")}`;
    } catch (error) {
      style.warnings.push(`Could not read linked CSS file ${href}: ${error.message}`);
    }
  }

  return cssText;
}

/**
 * Finds local stylesheet links that can be read from a copied HTML bundle.
 */
function collectLocalCssLinks($) {
  const links = [];

  $('link[rel="stylesheet"][href]').each((_, element) => {
    const href = $(element).attr("href");
    if (href && !href.startsWith("http://") && !href.startsWith("https://") && !href.startsWith("//")) {
      links.push(href);
    }
  });

  return links;
}

/**
 * Extracts coarse component hints without copying screen content.
 */
function extractComponentHints($) {
  const selectors = [
    "header",
    "nav",
    "aside",
    "main",
    "section",
    "article",
    "form",
    "button",
    "a",
    "input",
    "select",
    "textarea",
    "table",
    "[role]",
  ];
  const hints = [];

  for (const selector of selectors) {
    const count = $(selector).length;
    if (count > 0) {
      hints.push(`${selector}: ${count}`);
    }
  }

  return hints.slice(0, 24);
}

/**
 * Parses CSS declarations and stores values useful for style matching.
 */
function collectStyleDeclarations(cssText, style) {
  if (!cssText.trim()) {
    return;
  }

  let ast;
  try {
    ast = csstree.parse(cssText, { parseValue: true, positions: false });
  } catch (error) {
    style.warnings.push(`Could not parse all CSS: ${error.message}`);
    return;
  }

  csstree.walk(ast, (node) => {
    if (node.type !== "Declaration") {
      return;
    }

    const property = node.property.toLowerCase();
    const value = csstree.generate(node.value).trim();

    if (isInterestingDeclaration(property)) {
      style.declarations[property] ??= [];
      addUnique(style.declarations[property], value, 8);
    }

    collectSpecialValue(property, value, style);
  });
}

/**
 * Returns true for CSS properties that are useful in a design prompt.
 */
function isInterestingDeclaration(property) {
  return (
    property.startsWith("--") ||
    property.includes("color") ||
    property.includes("background") ||
    property.includes("font") ||
    property.includes("radius") ||
    property.includes("shadow") ||
    property === "gap" ||
    property.endsWith("gap") ||
    property.startsWith("padding") ||
    property.startsWith("margin") ||
    property.startsWith("border")
  );
}

/**
 * Stores specific CSS values in friendly top-level categories.
 */
function collectSpecialValue(property, value, style) {
  const colorMatches = value.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)|hsla?\([^)]+\)/g) ?? [];
  for (const color of colorMatches) {
    addUnique(style.colors, color, 16);
  }

  if (property === "font-family") {
    addUnique(style.fontFamilies, value, 8);
  }

  if (property.includes("radius")) {
    addUnique(style.radii, value, 8);
  }

  if (property.includes("shadow")) {
    addUnique(style.shadows, value, 8);
  }

  if (property === "gap" || property.endsWith("gap") || property.startsWith("padding") || property.startsWith("margin")) {
    addUnique(style.spacing, `${property}: ${value}`, 16);
  }
}

/**
 * Adds a value to a list once, up to a maximum size.
 */
function addUnique(list, value, limit) {
  if (list.length >= limit || list.includes(value)) {
    return;
  }

  list.push(value);
}

/**
 * Writes machine-readable and human-readable reference style summaries.
 */
export async function writeReferenceStyle(style, jsonPath, markdownPath) {
  await fs.writeFile(jsonPath, `${JSON.stringify(style, null, 2)}\n`, "utf8");
  await fs.writeFile(markdownPath, renderReferenceStyleMarkdown(style), "utf8");
}

/**
 * Renders extracted reference styling as compact Markdown.
 */
function renderReferenceStyleMarkdown(style) {
  const lines = ["# Reference Style", ""];

  for (const [label, values] of [
    ["Colors", style.colors],
    ["Font Families", style.fontFamilies],
    ["Radii", style.radii],
    ["Shadows", style.shadows],
    ["Spacing", style.spacing],
    ["Component Hints", style.componentHints],
    ["Warnings", style.warnings],
  ]) {
    lines.push(`## ${label}`, "");

    if (values.length === 0) {
      lines.push("- None detected", "");
      continue;
    }

    for (const value of values) {
      lines.push(`- ${value}`);
    }

    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}
