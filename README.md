# Codex Repo Template

This repository is a starting point for agentic-forward software projects: projects that expect coding agents to participate in design, implementation, review, and maintenance from the beginning.

The template is intentionally minimal. It does not lock you into a language, framework, or deployment target. Instead, it gives you a durable operating model:

- stable root documents that define current product truth, future direction, code style, design language, architecture, and execution-planning expectations
- a simple repository layout for code, tests, and assets
- contributor guidance that keeps human and agent work aligned as the project grows

## Start Here After Cloning

After creating a real project from this template, ask Codex to use the repo-local `project-bootstrap` skill before you start hand-editing placeholders or adding product code.

Example prompt:

```text
Use the project-bootstrap skill to customize this newly cloned template for my project.
```

The skill lives at `.agents/skills/project-bootstrap/SKILL.md`. It walks through product intake, suggests simpler or safer alternatives when useful, updates the root control documents, installs approved frameworks or packages for the selected toolchain, and finishes by creating an ordered ExecPlan for initial setup. When that plan can affect frontend presentation, it includes explicit before-and-after screenshot steps and a deliberate screenshot UX review using `.agents/skills/review-ui-screenshots/SKILL.md`. It is intentionally not a product-code implementation skill; use the generated ExecPlan for the first implementation pass.

For substantial UI additions or refactors, use `.agents/skills/ui-mockups/SKILL.md` during planning before implementation begins. That skill uses `npm run stitch:mockups` to generate several Google Stitch-backed mockup options under the active ExecPlan folder, optionally using a local reference image or Stitch export bundle for style. The command writes a browser preview at `plans/<plan-stem>/mockups/index.html` and prints a clickable `file://` link when it finishes. The user should choose or combine a mockup direction before UI code is written.

## What This Template Is For

Use this template when you want a new repository to:

- onboard humans and agents quickly
- keep high-level project context in version control instead of scattered across chat history
- encourage substantial work to start from an executable plan instead of ad hoc implementation
- make architectural and design decisions explicit early
- stay flexible about the eventual tech stack

This repository is a good fit for greenfield projects, internal tools, prototypes expected to grow into production systems, and any codebase where AI-assisted development is part of the normal workflow.

## What Is Included

The current repository is mostly documentation by design. Each root document has a specific job:

- `README.md` explains what the project is, how to get started, and how to validate changes locally.
- `PRODUCT.md` captures the current user-visible product state, workflows, capability boundaries, and important limitations.
- `ROADMAP.md` captures the intended product direction, planned capabilities, strategic priorities, and explicit non-priorities.
- `AGENTS.md` contains repository-specific instructions for coding agents working in this repo.
- `PLANS.md` defines the ExecPlan format and the rules for using ordered execution plans on complex work, including explicit before-and-after screenshot steps for UI-affecting plans and final code-file line-count checks for code-changing plans.
- `CODESTYLE.md` defines source formatting, naming, TypeScript annotation expectations, documentation style, strict commenting standards, and the strong preference to keep hand-written code files below 600 lines.
- `DESIGN.md` is the durable design-language reference for the product, including the professional UI/UX review pass required for UI-affecting ExecPlan work.
- `ARCHITECTURE.md` is the durable architectural map for the system.
- `.codex/config.toml` sets project-scoped Codex defaults. The current template pins trusted Codex sessions to `gpt-5.5`.
- `.agents/skills/project-bootstrap/SKILL.md` is the guided first-run workflow for replacing template placeholders with project-specific truth, installing approved setup tooling, and producing the initial setup ExecPlan.
- `.agents/skills/ask-questions-if-underspecified/SKILL.md` is the clarification workflow for work whose objective, scope, constraints, or safety are not clear enough to implement.
- `.agents/skills/agent-browser/SKILL.md` is the repo-local pointer to browser automation guidance for screenshots, UI review, and web or Electron interaction.
- `.agents/skills/review-ui-screenshots/SKILL.md` is the repo-local workflow for inspecting captured UI evidence section by section so obvious visual regressions are caught before UI-affecting work is called complete.
- `.agents/skills/ui-mockups/SKILL.md` is the repo-local workflow for generating selectable pre-implementation UI mockups with Google Stitch, optional local style references, and a browser preview index.
- `scripts/stitch-mockups.mjs` generates Stitch mockup artifacts under `plans/<plan-stem>/mockups/`, including `index.html` for browser preview.
- `.env.example` documents environment variables used by contributor tooling such as Stitch integration.

The repository also reserves these top-level directories:

- `src/` for runtime code
- `tests/` for tests that mirror the `src/` layout
- `assets/` for static assets when the project needs them
- `plans/` for ordered ExecPlans named with the next `NN-kebab-case-name.md` prefix
- `scripts/` for portable contributor utilities, including `scripts/win-screenshot` for full-desktop screenshots from Windows 11 with WSL

## Local Validation

This template currently includes contributor tooling but no application runtime. Use these checks before opening a PR:

```bash
npm test
npm audit --omit=dev
git diff --check
rg --files --hidden -g '!.git/**'
```

To generate UI mockup options for a future UI-affecting ExecPlan, set `STITCH_API_KEY` or the OAuth variables documented in `.env.example`, then run:

```bash
npm run stitch:mockups -- --plan <plan-stem> --prompt-file <prompt.md> --reference <sample-path> --variants 4 --device DESKTOP
```

When the command succeeds, open the printed `file://` preview link or `plans/<plan-stem>/mockups/index.html` to inspect the generated options in a browser.

## Feedback

Feedback / advice / suggestions are appreciated! Feel free to leave feedback by creating an issue (or a PR if you want to contribute)!
