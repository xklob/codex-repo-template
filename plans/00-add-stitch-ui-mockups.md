# Add Stitch-backed UI mockups

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

Maintain this document according to `PLANS.md`. This plan adds a repo-local skill and contributor tooling that let future UI-affecting work generate several Google Stitch mockup options before implementation, including options based on a supplied reference image or local Stitch export bundle.

## Purpose / Big Picture

After this change, a contributor planning a meaningful UI addition or refactor can use `.agents/skills/ui-mockups/SKILL.md` to generate multiple visual directions, save reproducible artifacts under the active ExecPlan folder, and pause for the user's choice before writing UI code. This makes design direction explicit earlier than the existing post-implementation screenshot review.

## Progress

- [x] (2026-05-06T05:24Z) Read issue #16, repo control documents, existing repo-local skills, and current Stitch SDK capabilities.
- [x] (2026-05-06T05:24Z) Install Stitch integration dependencies and resolve npm audit findings with a safe package override.
- [x] (2026-05-06T05:24Z) Add the Stitch mockup generation script modules with reference sample handling.
- [x] (2026-05-06T05:24Z) Add offline tests for argument parsing, reference handling, style extraction, prompt construction, and missing credentials.
- [x] (2026-05-06T05:29Z) Add the repo-local `ui-mockups` skill and synchronize root control documents.
- [x] (2026-05-06T05:29Z) Run validation, including tests, syntax checks, `git diff --check`, npm audit, skill validation, and final hand-written code-file line-count review.

## Surprises & Discoveries

- Observation: `@google/stitch-sdk@0.1.1` exposes `Project.uploadImage()` even though the README focuses on text prompt generation.
  Evidence: Package type definitions show `uploadImage(filePath, opts?)` accepting PNG, JPG, JPEG, and WEBP files.
- Observation: The first monolithic script draft exceeded the repository's 600-line hand-written code-file preference.
  Evidence: `wc -l scripts/stitch-mockups.mjs` reported 805 lines before the script was split into modules.
- Observation: Installing the Stitch SDK initially surfaced moderate transitive audit findings through `ip-address`.
  Evidence: `npm audit --omit=dev --json` reported three moderate advisories before adding the `ip-address` override and rerunning install.

## Decision Log

- Decision: Use `@google/stitch-sdk@^0.1.1`, `cheerio@^1.2.0`, and `css-tree@^3.2.1`.
  Rationale: Stitch supplies generation, variants, upload, and artifact download; Cheerio and css-tree let the local script extract style signals from supplied Stitch exports without ad hoc string-only parsing.
  Date/Author: 2026-05-06 / Codex
- Decision: Treat supplied samples as style references by default.
  Rationale: The user selected style-only influence, local sample inputs, and copying approved references into the plan folder. This keeps feature layout and workflow driven by the requested change while preserving visual consistency.
  Date/Author: 2026-05-06 / User and Codex
- Decision: Split the script into small modules under `scripts/stitch-mockups/`.
  Rationale: This keeps each hand-written code file below the 600-line preference and gives future contributors narrower files to inspect.
  Date/Author: 2026-05-06 / Codex

## Outcomes & Retrospective

Implemented the Stitch-backed UI mockup workflow. The repository now has `npm run stitch:mockups`, modular script code under `scripts/stitch-mockups/`, offline tests, `.agents/skills/ui-mockups/SKILL.md`, `.env.example`, and synchronized control-document guidance. The workflow supports local image references and local Stitch export bundles, treats samples as style references by default, and saves future mockup artifacts under `plans/<plan-stem>/mockups/`.

Validation passed:

    npm test
    node --check scripts/stitch-mockups.mjs
    find scripts/stitch-mockups -type f -name '*.mjs' -print0 | xargs -0 -n1 node --check
    npm audit --omit=dev
    python3 /home/caleb/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/ui-mockups
    git diff --check
    rg -n "ui-mockups|stitch:mockups|STITCH_API_KEY|reference-style|@google/stitch-sdk" README.md PRODUCT.md ROADMAP.md ARCHITECTURE.md AGENTS.md PLANS.md DESIGN.md .agents/skills/ui-mockups/SKILL.md package.json .env.example .agents/skills/project-bootstrap/SKILL.md

Live Stitch generation was not run because no `STITCH_API_KEY` or OAuth credential pair was configured in the environment.

Final hand-written code-file line-count review found no file over the 600-line preference. The largest checked files were `scripts/stitch-mockups/style.mjs` at 280 lines, `.agents/skills/project-bootstrap/SKILL.md` at 168 lines, and `scripts/stitch-mockups/reference.mjs` at 166 lines.

## Context and Orientation

This template repository has no application runtime yet. The current user-visible product is a set of control documents, repo-local skills, contributor utilities, and Codex defaults that help humans and agents work from durable repository truth. `PLANS.md` defines ExecPlan rules, `DESIGN.md` defines the professional UI/UX review pass after UI implementation, and `.agents/skills/review-ui-screenshots/SKILL.md` defines the post-capture screenshot review. This plan adds a pre-implementation workflow: generate candidate UI mockups first, let the user choose, then implement from the chosen direction.

The new script entrypoint is `scripts/stitch-mockups.mjs`. Its helper modules live in `scripts/stitch-mockups/`. The new skill lives at `.agents/skills/ui-mockups/SKILL.md`. Root control documents must be updated so future contributors know when to use the skill and how it differs from `agent-browser` screenshot capture and `review-ui-screenshots` review.

## Plan of Work

Install the Stitch SDK and the parsing libraries needed for local reference bundles. Add `npm run stitch:mockups` and `npm test` to `package.json`, and document `STITCH_API_KEY`, `STITCH_ACCESS_TOKEN`, and `GOOGLE_CLOUD_PROJECT` in `.env.example`.

Implement the script so it accepts an active plan stem, prompt file, optional local reference, variant count, device type, optional Stitch project id, and optional model. It must support local image references and local Stitch export folders. For folders, copy only supported image, HTML, and CSS files into `plans/<plan-stem>/mockups/reference/`, extract style signals into `reference-style.json` and `reference-style.md`, write `stitch-prompt.md`, generate Stitch options, and save `option-01.png`, `option-01.html`, `option-01-notes.md`, `index.md`, and `decision.md`.

Add the `ui-mockups` skill with clear trigger rules and skip rules. It must require agents to inspect the active ExecPlan and `DESIGN.md`, confirm supplied references are safe to copy, generate options before implementation, present the user with a concise option matrix, stop for selection, and record the chosen direction in the ExecPlan.

Update `README.md`, `PRODUCT.md`, `ROADMAP.md`, `ARCHITECTURE.md`, `AGENTS.md`, `PLANS.md`, and `DESIGN.md` so the new workflow is durable project truth.

## Concrete Steps

From `/home/caleb/agent-forward-project-base`, run:

    npm install @google/stitch-sdk@^0.1.1 cheerio@^1.2.0 css-tree@^3.2.1

Add the script, tests, skill, `.env.example`, and root document updates described above.

Validate with:

    npm test
    node --check scripts/stitch-mockups.mjs
    find scripts/stitch-mockups -type f -name '*.mjs' -print0 | xargs -0 -n1 node --check
    npm audit --omit=dev
    git diff --check
    rg -n "ui-mockups|stitch:mockups|STITCH_API_KEY|reference-style|@google/stitch-sdk" README.md PRODUCT.md ROADMAP.md ARCHITECTURE.md AGENTS.md PLANS.md DESIGN.md .agents/skills/ui-mockups/SKILL.md package.json .env.example
    rg --files scripts tests .agents/skills | grep -E '\.(mjs|js|py|sh|css|html)$|SKILL\.md$' | xargs -r wc -l | sort -n

## Validation and Acceptance

Acceptance requires the offline tests to pass without Stitch credentials, the script modules to pass syntax checks, npm audit to report no known vulnerabilities, root docs to reference the new workflow consistently, and the final line-count review to show no hand-written code file over 600 lines. Live Stitch generation is optional during this implementation because it requires `STITCH_API_KEY`; if credentials are absent, the final result must say that the live check was skipped.

## Visual Evidence

No runnable browser or Electron target exists in this template repository, and this plan does not change rendered UI. Visual screenshot evidence is therefore not applicable. Validation is replaced by script tests, syntax checks, audit checks, documentation consistency checks, and a final line-count review. Future plans that use `ui-mockups` for real UI work will generate mockup images under `plans/<plan-stem>/mockups/` before implementation and still capture before/after screenshots under `plans/<plan-stem>/screenshots/` after implementation.

## Idempotence and Recovery

The script writes deterministic plan-scoped paths and can be rerun for the same plan stem. It overwrites selected generated files but does not delete unrelated plan artifacts. Missing Stitch credentials fail before mockup artifacts are created. If Stitch generation fails after reference copying, rerun the command after fixing credentials or network access.

## Artifacts and Notes

The main generated artifacts for future UI work are:

    plans/<plan-stem>/mockups/reference/
    plans/<plan-stem>/mockups/reference-style.json
    plans/<plan-stem>/mockups/reference-style.md
    plans/<plan-stem>/mockups/stitch-prompt.md
    plans/<plan-stem>/mockups/option-01.png
    plans/<plan-stem>/mockups/option-01.html
    plans/<plan-stem>/mockups/index.md
    plans/<plan-stem>/mockups/decision.md

## Interfaces and Dependencies

`npm run stitch:mockups` is the public contributor command. It runs `node scripts/stitch-mockups.mjs`. The command requires `--plan` and `--prompt-file`; it accepts optional `--reference`, `--variants`, `--device`, `--model`, `--project-id`, `--title`, and `--repo-root`.

The command requires `STITCH_API_KEY`, or `STITCH_ACCESS_TOKEN` with `GOOGLE_CLOUD_PROJECT`, for live generation. It uses `@google/stitch-sdk` for Stitch calls, `cheerio` for HTML inspection, and `css-tree` for CSS parsing.
