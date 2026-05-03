# Repository Guidelines

## ExecPlans

When writing complex features or significant refactors, use an ExecPlan (as described in `PLANS.md`) from design to implementation.

Create new ExecPlan files under `plans/` with a two-digit ordering prefix and a short kebab-case name, for example `plans/00-add-feature-x.md` or `plans/01-security-overhaul.md`. Use the next unused number after the highest existing prefixed plan so multiple plans remain easy to scan in sequence.

When creating an ExecPlan that can affect frontend presentation, include explicit plan steps for taking baseline screenshots before implementation and matching after screenshots after implementation. Put those steps in the plan's `Progress` checklist and `Concrete Steps` section, and name the `plans/<name-of-plan>/screenshots/` paths the work will produce. If screenshots are not applicable because there is no runnable visual target, the plan should say that directly and name the replacement validation.

## Planning and Change Intake

Treat requested changes as suggested directions until the scope, tradeoffs, and long-term consequences are understood. If you see any problem with a requested change, push back before proceeding: explain the concern plainly, ask clarifying questions, and offer concrete alternatives when a different scope, sequence, or implementation would better protect the codebase.

When creating a plan, even a small one, gather as much relevant information as practical from the user and the repository. Ask as many questions as needed to understand feature scope, expected workflows, future extension points, migration risks, maintainability costs, context growth, and how easy the resulting system will be for future contributors to understand.

Do not treat planning for updates, features, or refactors as a quick or lightweight task. Strongly prefer doing the work correctly over doing it quickly, even when the better path is initially more technically complex or requires more upfront effort. If a shortcut would create technical debt, unclear boundaries, hidden coupling, future maintenance drag, or unnecessary context bloat, say so and recommend a more durable approach before implementation.

## Project Bootstrap Skill

Use the repo-local `project-bootstrap` skill for the first customization pass after a user clones this template for a real project. Load `.agents/skills/project-bootstrap/SKILL.md`, gather the project brief and setup requirements, suggest alternatives when the requested stack or sequence creates avoidable risk, update the root control documents with project-specific truth, install only approved setup frameworks or packages, and finish with an ordered ExecPlan for initial setup.

Do not use `project-bootstrap` to implement product feature code. Its job is to prepare the repository and create the plan that later implementation work will follow.

## Agent Browser and Visual Review

Use the repo-local `agent-browser` skill whenever the task requires browser interaction, browser inspection, screenshots, video recordings, form automation, scraping, exploratory testing, bug reproduction, UI review, or web-app quality checks. Also use it for Electron app automation when the task is about an Electron-based desktop app. Before running browser automation commands, load the current installed guidance from `.agents/skills/agent-browser/SKILL.md`, then use `agent-browser skills get core` or the relevant specialized skill so command usage matches the installed version.

After any UI update, run the app when practical and capture several screenshots with `agent-browser` across materially different viewports, including desktop and mobile. Include tablet or narrow-desktop coverage when layout behavior changes at intermediate widths. For ExecPlan work, save screenshots under `plans/<name-of-plan>/screenshots/` using names such as `before-implementation-1.png`, `before-implementation-2.png`, `after-implementation-1.png`, and `after-implementation-2.png`; use the plan file's stem as `<name-of-plan>`, and make the before and after captures explicit steps in the plan being executed. Inspect the screenshots before finishing the work and look for regressions, text overflow, clipped controls, awkward spacing, broken responsive states, accessibility-visible issues, and obvious quality-of-life improvements. Apply the professional UI/UX review pass defined in `DESIGN.md`: judge the result against product-quality hierarchy, workflow ergonomics, responsive behavior, accessible interaction states, polished spacing and typography, and predictable state feedback. Make the follow-up fixes that are in scope, and call out any remaining issues that need a separate product or design decision.

Apply the same visual-review workflow to backend changes when they can affect frontend layout or presentation, such as API payload shape changes, empty/loading/error states, limits, sorting, labels, image dimensions, feature flags, or data that drives conditional UI. If no runnable browser or Electron target exists, state that visual review was not applicable and explain what validation replaced it. On Windows 11 with WSL, use `scripts/win-screenshot [output.png]` when the evidence needs to show the whole host desktop instead of only a browser page or Electron window.

## Core Documents

Treat the root documentation files as durable project control documents:
- `README.md` explains what the project is, how to run it, and how to validate changes.
- `PRODUCT.md` captures the current user-visible product state, workflows, capability boundaries, and important limitations.
- `ROADMAP.md` captures the intended product direction, planned capabilities, strategic priorities, and explicit non-priorities.
- `PLANS.md` defines how ExecPlans must be written and maintained.
- `CODESTYLE.md` defines source formatting, naming, TypeScript annotation expectations, documentation style, and strict commenting standards.
- `DESIGN.md` captures the semantic design system in descriptive language, backed by concrete values where needed, and defines the professional UI/UX review pass for UI-affecting ExecPlan work.
- `ARCHITECTURE.md` captures the high-level codemap, architectural boundaries, and invariants.

When a change materially affects current user-visible capabilities, workflows, scope boundaries, or important product limitations, update `PRODUCT.md` in the same change. When a change materially affects product vision, intended audience, strategic priorities, planned capabilities, sequencing assumptions, or explicit non-priorities, update `ROADMAP.md` in the same change. When a change materially affects source coding conventions, naming rules, TypeScript annotation expectations, documentation conventions, or commenting standards, update `CODESTYLE.md` in the same change. When a change materially affects product design language, update `DESIGN.md` in the same change. When a change materially affects structure, ownership, or system boundaries, update `ARCHITECTURE.md` in the same change.

If you introduce a new root-level `ALLCAPS.md` file, treat it as a new control document by default. In the same change:
- Define the file's purpose and scope inside the file itself.
- Update this `Core Documents` section so future contributors know the file exists and when it matters.
- Update `PLANS.md` if ExecPlans are expected to read, update, or validate that file.
- State what kinds of code or product changes must keep the new file in sync.


## Code Style and Commenting Requirements

Follow `CODESTYLE.md` for source formatting, naming rules, TypeScript annotation expectations, documentation style, and strict commenting standards. That file is canonical; keep detailed style and commenting rules there instead of duplicating them in this guide.

## Project Structure & Module Organization
This repository is intentionally minimal at the moment. Keep runtime code in `src/`, mirror tests in `tests/`, keep static assets in `assets/`, portable contributor utilities in `scripts/`, and long-lived documentation in the repository root.

When adding application code, keep the layout simple and predictable:
- Keep project-scoped Codex configuration in `.codex/config.toml`. The current default model is `gpt-5.5`.
- Keep repo-local agent workflows in `.agents/skills/`. The `project-bootstrap` skill owns the guided template customization workflow, `ask-questions-if-underspecified` owns high-risk clarification, and `agent-browser` owns browser automation discovery.
- Put runtime code in a top-level `src/` directory.
- Mirror tests under `tests/`.
- Keep static assets in `assets/` if they are needed later.
- Leave repository-level documentation in the root.

## Build, Test, and Development Commands
There is no checked-in application build or test toolchain yet. The existing npm manifest is only for contributor tooling such as `agent-browser`. Until an application toolchain is added, use lightweight repo checks:

- `git status` shows pending changes before commit or review.
- `rg --files --hidden -g '!.git/**'` lists the current file set quickly, including `.codex/config.toml`.
- `git log --oneline` shows the existing commit style.
- `scripts/win-screenshot [output.png]` captures the full Windows desktop from Windows 11 with WSL when host-desktop visual evidence is needed.

If you introduce a language toolchain, add its canonical commands to this section in the same change. Prefer a single documented entry point such as `make test`, `npm test`, or `pytest`.

If you add formatters or linters, run them before opening a PR and document their canonical commands here, in `README.md`, and in `CODESTYLE.md`.

## Testing Guidelines
New behavior should ship with tests. Mirror the source layout inside `tests/` and name tests after the unit under test, for example `tests/test_cli.py`.

Because no framework is configured yet, contributors should add a test runner together with any non-trivial code and document how to execute it locally.

## Commit & Pull Request Guidelines
The current history starts with a short imperative commit message: `Initial commit`. Follow that pattern: concise subject line, imperative mood, no trailing period.

Pull requests should explain:
- What changed
- Why it changed
- How it was validated

Include linked issues when applicable. Add screenshots only when the change affects rendered output or documentation presentation.
