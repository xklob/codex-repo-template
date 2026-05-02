# Repository Guidelines

## ExecPlans

When writing complex features or significant refactors, use an ExecPlan (as described in `PLANS.md`) from design to implementation.

Create new ExecPlan files under `plans/` with a two-digit ordering prefix and a short kebab-case name, for example `plans/00-add-feature-x.md` or `plans/01-security-overhaul.md`. Use the next unused number after the highest existing prefixed plan so multiple plans remain easy to scan in sequence.

## Core Documents

Treat the root documentation files as durable project control documents:
- `README.md` explains what the project is, how to run it, and how to validate changes.
- `PRODUCT.md` captures the current user-visible product state, workflows, capability boundaries, and important limitations.
- `ROADMAP.md` captures the intended product direction, planned capabilities, strategic priorities, and explicit non-priorities.
- `PLANS.md` defines how ExecPlans must be written and maintained.
- `DESIGN.md` captures the semantic design system in descriptive language, backed by concrete values where needed.
- `ARCHITECTURE.md` captures the high-level codemap, architectural boundaries, and invariants.

When a change materially affects current user-visible capabilities, workflows, scope boundaries, or important product limitations, update `PRODUCT.md` in the same change. When a change materially affects product vision, intended audience, strategic priorities, planned capabilities, sequencing assumptions, or explicit non-priorities, update `ROADMAP.md` in the same change. When a change materially affects product design language, update `DESIGN.md` in the same change. When a change materially affects structure, ownership, or system boundaries, update `ARCHITECTURE.md` in the same change.

If you introduce a new root-level `ALLCAPS.md` file, treat it as a new control document by default. In the same change:
- Define the file's purpose and scope inside the file itself.
- Update this `Core Documents` section so future contributors know the file exists and when it matters.
- Update `PLANS.md` if ExecPlans are expected to read, update, or validate that file.
- State what kinds of code or product changes must keep the new file in sync.


## Code Commenting Requirements
When editing or adding source code, comments are required so reviewers can understand intent without reconstructing logic from scratch.

- Add a file-header comment at the top of every source file summarizing the file purpose, key classes/functions, and how the file fits into the project.
- Add a short comment above every non-trivial function describing what it does; for complex functions, include a brief step-by-step outline of the control flow.
- Add inline comments for unclear variable names, non-obvious assumptions, and hard-coded constants so future contributors understand why values exist.
- Avoid redundant comments that only restate syntax; comments should explain intent and reasoning.

## Project Structure & Module Organization
This repository is intentionally minimal at the moment. Keep runtime code in `src/`, mirror tests in `tests/`, keep static assets in `assets/`, and leave long-lived documentation in the repository root.

When adding application code, keep the layout simple and predictable:
- Keep project-scoped Codex configuration in `.codex/config.toml`. The current default model is `gpt-5.5`.
- Put runtime code in a top-level `src/` directory.
- Mirror tests under `tests/`.
- Keep static assets in `assets/` if they are needed later.
- Leave repository-level documentation in the root.

## Build, Test, and Development Commands
There is no checked-in build or test toolchain yet. Until one is added, use lightweight repo checks:

- `git status` shows pending changes before commit or review.
- `rg --files --hidden -g '!.git/**'` lists the current file set quickly, including `.codex/config.toml`.
- `git log --oneline` shows the existing commit style.

If you introduce a language toolchain, add its canonical commands to this section in the same change. Prefer a single documented entry point such as `make test`, `npm test`, or `pytest`.

## Coding Style & Naming Conventions
Use consistent, readable defaults:
- Indent with 2 spaces for YAML/JSON/Markdown and 4 spaces for code unless the language ecosystem strongly prefers otherwise.
- Use descriptive file and module names such as `src/session_store.py` or `tests/test_session_store.py`.
- Keep functions small and names explicit; prefer `snake_case` for Python-style code and `kebab-case` for Markdown filenames outside conventional root docs such as `README.md`, `AGENTS.md`, `PLANS.md`, `PRODUCT.md`, `ROADMAP.md`, `DESIGN.md`, and `ARCHITECTURE.md`. ExecPlans in `plans/` are the exception: they should use the ordered `NN-kebab-case-name.md` pattern described in `PLANS.md`.

Documentation should also follow clear naming and ownership rules:
- Keep `PRODUCT.md` focused on current product truth and capability scope, not implementation notes or temporary project status.
- Keep `ROADMAP.md` focused on durable product direction and priorities, not ticket backlogs or sprint-by-sprint planning.
- Keep `DESIGN.md` focused on stable visual language, not per-screen implementation notes.
- Keep `ARCHITECTURE.md` focused on stable structure and boundaries, not low-level algorithm details.
- Keep `README.md` focused on onboarding, commands, and user-facing project context.
- Reserve new root-level `ALLCAPS.md` files for durable guidance or control documents, not scratch notes or one-off design dumps.

If you add formatters or linters, run them before opening a PR and document them here.

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
