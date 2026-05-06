/**
 * Handles local reference images and Stitch export bundles for UI mockups.
 *
 * The copy step intentionally keeps only supported image, HTML, and CSS files
 * so a broad reference folder cannot silently copy secrets into `plans/`.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const HTML_EXTENSIONS = new Set([".html", ".htm"]);
const CSS_EXTENSIONS = new Set([".css"]);
const MAX_REFERENCE_DEPTH = 3;

/**
 * Detects whether a user-supplied reference is an image, web file, or bundle.
 */
export async function detectReference(referencePath) {
  if (!referencePath) {
    return { kind: "none", files: [] };
  }

  const stat = await fs.stat(referencePath);
  if (stat.isFile()) {
    return detectReferenceFile(referencePath);
  }

  if (!stat.isDirectory()) {
    throw new Error(`Reference is neither a file nor directory: ${referencePath}`);
  }

  return detectReferenceBundle(referencePath);
}

/**
 * Detects a single reference file type.
 */
function detectReferenceFile(referencePath) {
  const extension = path.extname(referencePath).toLowerCase();

  if (IMAGE_EXTENSIONS.has(extension)) {
    return { kind: "image", imagePath: referencePath, cssPaths: [], files: [referencePath] };
  }

  if (HTML_EXTENSIONS.has(extension)) {
    return { kind: "html", htmlPath: referencePath, cssPaths: [], files: [referencePath] };
  }

  if (CSS_EXTENSIONS.has(extension)) {
    return { kind: "css", cssPaths: [referencePath], files: [referencePath] };
  }

  throw new Error("Reference file must be PNG, JPG, JPEG, WEBP, HTML, HTM, or CSS");
}

/**
 * Detects primary artifacts inside a local Stitch export or similar bundle.
 */
async function detectReferenceBundle(referencePath) {
  const files = await listReferenceFiles(referencePath, MAX_REFERENCE_DEPTH);
  const imageFiles = files.filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()));
  const htmlFiles = files.filter((file) => HTML_EXTENSIONS.has(path.extname(file).toLowerCase()));
  const cssFiles = files.filter((file) => CSS_EXTENSIONS.has(path.extname(file).toLowerCase()));
  const primaryImage = choosePrimaryFile(imageFiles, ["preview", "design", "screenshot", "screen", "mockup"]);
  const primaryHtml = choosePrimaryFile(htmlFiles, ["index", "screen", "design", "mockup"]);

  if (!primaryImage && !primaryHtml && cssFiles.length === 0) {
    throw new Error("Reference directory must contain at least one image, HTML file, or CSS file");
  }

  return {
    kind: "bundle",
    root: referencePath,
    imagePath: primaryImage,
    htmlPath: primaryHtml,
    cssPaths: cssFiles,
    files: [...new Set([primaryImage, primaryHtml, ...cssFiles].filter(Boolean))],
  };
}

/**
 * Lists shallow reference files and skips dependency/build folders.
 */
async function listReferenceFiles(rootDir, maxDepth, currentDepth = 0) {
  if (currentDepth > maxDepth) {
    return [];
  }

  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      if ([".git", "node_modules", "dist", "build"].includes(entry.name)) {
        continue;
      }

      files.push(...await listReferenceFiles(fullPath, maxDepth, currentDepth + 1));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

/**
 * Chooses a likely primary file by preferring descriptive filenames.
 */
function choosePrimaryFile(files, preferredNameParts) {
  if (files.length === 0) {
    return undefined;
  }

  const preferred = files.find((file) => {
    const basename = path.basename(file).toLowerCase();
    return preferredNameParts.some((part) => basename.includes(part));
  });

  return preferred ?? files[0];
}

/**
 * Copies only supported reference artifacts into the plan-owned folder.
 */
export async function copyReferenceArtifacts(reference, referenceDir) {
  const copied = {
    kind: reference.kind,
    files: [],
    imagePath: undefined,
    htmlPath: undefined,
    cssPaths: [],
  };

  if (reference.kind === "none") {
    return copied;
  }

  await fs.mkdir(referenceDir, { recursive: true });

  for (const sourcePath of reference.files) {
    const targetPath = path.join(referenceDir, path.basename(sourcePath));
    await fs.copyFile(sourcePath, targetPath);
    copied.files.push(targetPath);

    if (sourcePath === reference.imagePath) {
      copied.imagePath = targetPath;
    }

    if (sourcePath === reference.htmlPath) {
      copied.htmlPath = targetPath;
    }

    if (reference.cssPaths?.includes(sourcePath)) {
      copied.cssPaths.push(targetPath);
    }
  }

  return copied;
}
