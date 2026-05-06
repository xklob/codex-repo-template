---
name: ui-mockups
description: Create several selectable UI mockup options before implementation for substantial UI additions, UI refactors, major responsive/layout changes, new design directions, or feature plans that need user choice among visual approaches. Use this skill when planning meaningful browser, Electron, rendered documentation, or frontend presentation work, especially when the user supplies a reference image or Google Stitch export bundle. Do not use for small UI fixes, copy tweaks, already-approved designs, or post-implementation screenshot review.
---

# UI Mockups

Use this skill before implementation when a UI change needs visual direction.
The goal is to give the user several concrete options, let them choose or
combine directions, and record that choice in the active ExecPlan before code
changes begin.

## Boundaries

Use `.agents/skills/review-ui-screenshots/SKILL.md` after implementation for
the final screenshot UX review. This skill is earlier in the workflow: it
creates candidate mockups and gathers the user's design decision.

Use the reference sample for style by default. Copy palette, typography,
spacing rhythm, density, radius, shadows, component feel, and design language.
Do not clone the sample's layout or content unless the user explicitly asks for
that. If the requested feature needs a different information architecture, let
the feature win.

## Workflow

1. Confirm there is an active ExecPlan or create one using `PLANS.md`.
   Mockups must be saved under `plans/<plan-stem>/mockups/`, where
   `<plan-stem>` is the ExecPlan filename without `.md`.
2. Read `DESIGN.md`, the active ExecPlan, and the UI files or screenshots that
   describe the current surface. If the user supplied a sample, confirm it is
   safe to copy into the repository and contains no secrets or restricted
   third-party material.
3. Write a short prompt file that describes the feature outcome, target
   surface, primary workflow, platform, important states, and any constraints.
   Keep the prompt about what the user needs, not implementation details.
4. Run the Stitch tooling from the repository root:

       npm run stitch:mockups -- --plan <plan-stem> --prompt-file <prompt.md> --reference <sample-path> --variants 4 --device DESKTOP

   Omit `--reference` only when no visual sample exists. Use `--device MOBILE`,
   `TABLET`, or `AGNOSTIC` when the main design question is device-specific.
5. Open the clickable `file://` URL printed by the command. It points to
   `plans/<plan-stem>/mockups/index.html`, a browser preview page that embeds
   every generated PNG and links to each option's generated HTML and notes.
   Also inspect `plans/<plan-stem>/mockups/index.md` for a source-friendly
   text summary. Present the user with a concise option matrix that covers
   visual direction, workflow fit, risks, and the option you recommend.
6. Stop for the user's choice. Do not implement the UI until the user selects
   an option, asks for a hybrid, or requests another mockup round.
7. Record the selected direction in `plans/<plan-stem>/mockups/decision.md` and
   in the ExecPlan `Decision Log`, `Plan of Work`, and `Visual Evidence`
   sections. Use the selected mockup files as implementation references.

## Reference Inputs

The v1 tooling supports local files and local folders only:

- Image file: `.png`, `.jpg`, `.jpeg`, or `.webp`.
- Google Stitch export bundle: a folder containing a preview image plus
  optional HTML and CSS.
- HTML or CSS file: useful when the visual reference is a code export without
  a screenshot.

When a Stitch export bundle includes both image and HTML/CSS, prefer it over an
image-only sample. The image gives visual intent; the HTML/CSS gives exact
colors, spacing, fonts, radius, and shadow values that reduce guesswork.

## Tooling Notes

The command requires `STITCH_API_KEY`, or `STITCH_ACCESS_TOKEN` with
`GOOGLE_CLOUD_PROJECT`, in the local environment. If credentials are missing,
explain that live Stitch generation could not run and do not fake generated
mockups.

The command copies only supported reference artifacts into
`plans/<plan-stem>/mockups/reference/` and extracts design-language clues into
`reference-style.json` and `reference-style.md`. Generated options are saved as
`option-01.png`, `option-01.html`, `option-01-notes.md`, and matching numbered
files. The command also writes `index.html` and prints a clickable `file://`
link to that preview page in the terminal when generation completes.
