# Agent-Forward Project Template

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

The skill lives at `.agents/skills/project-bootstrap/SKILL.md`. It walks through product intake, suggests simpler or safer alternatives when useful, updates the root control documents, installs approved frameworks or packages for the selected toolchain, and finishes by creating an ordered ExecPlan for initial setup. When that plan can affect frontend presentation, it includes explicit before-and-after screenshot steps. It is intentionally not a product-code implementation skill; use the generated ExecPlan for the first implementation pass.

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

The repository also reserves these top-level directories:

- `src/` for runtime code
- `tests/` for tests that mirror the `src/` layout
- `assets/` for static assets when the project needs them
- `plans/` for ordered ExecPlans named with the next `NN-kebab-case-name.md` prefix
- `scripts/` for portable contributor utilities, including `scripts/win-screenshot` for full-desktop screenshots from Windows 11 with WSL

## Core Idea: Durable Context First

Agentic-forward projects work better when important context is stored in the repository itself instead of being recreated in every conversation.

This template treats the root documentation as project control documents:

- `README.md` keeps onboarding and commands current.
- `PRODUCT.md` keeps the current product truth explicit, especially for small and medium user-visible changes that may not get their own ExecPlan.
- `ROADMAP.md` keeps intended future direction explicit so contributors can distinguish current behavior from planned behavior.
- `PLANS.md` ensures larger changes are driven by self-contained execution plans.
- `CODESTYLE.md` keeps source conventions, commenting standards, and code-file size expectations explicit.
- `DESIGN.md` captures stable product and interface language.
- `ARCHITECTURE.md` captures stable system boundaries and invariants.
- `AGENTS.md` tells coding agents how to behave in this specific repository.

As the project evolves, these documents should be updated alongside the code they govern.

## How To Use This Template

Start by turning the template into the real project you want to build.

1. Create a new repository from this template, or clone it and rename it for your project.
2. Ask Codex to use the `project-bootstrap` skill from `.agents/skills/project-bootstrap/SKILL.md`.
3. Answer the project intake so the repository can be customized around the real product, users, workflows, toolchain, constraints, and roadmap.
4. Let the skill update `README.md`, `PRODUCT.md`, `ROADMAP.md`, `DESIGN.md`, `ARCHITECTURE.md`, `CODESTYLE.md`, `AGENTS.md`, and any selected setup files so they describe the actual project instead of the generic template.
5. Let the skill install only the approved frameworks or packages needed for the initial toolchain; do not use it to implement product feature code.
6. Continue from the ordered ExecPlan that the skill creates under `plans/`, then add runtime code under `src/` and mirror tests under `tests/`.
7. Document the canonical development and test commands in `README.md` as soon as you introduce them.
8. Use ExecPlans for complex features, significant refactors, or work with meaningful ambiguity. Save each new plan under `plans/` with the next two-digit prefix, such as `00-add-feature-x.md`, so plans sort in creation order. When a plan can affect frontend presentation, include separate before-screenshot and after-screenshot steps in the plan itself. When a plan adds or changes code, end it with a hand-written code-file line-count check and ask for approval before doing any extra split, refactor, or library addition that the check suggests.

In practice, the first pass through the template usually looks like this:

- name the product and describe the user problem in `README.md`
- describe the product's current workflows and capabilities in `PRODUCT.md`
- describe the intended future direction and planned capabilities in `ROADMAP.md`
- adjust code conventions, commenting standards, and code-file size expectations in `CODESTYLE.md`
- describe the visual and interaction direction in `DESIGN.md`
- describe the codebase shape and boundaries in `ARCHITECTURE.md`
- add the initial toolchain and document its commands
- create an initial setup ExecPlan for the first thin slice of real functionality
- confirm `.codex/config.toml` still matches the default Codex model you want contributors to use

## Recommended Bootstrap Workflow

If you are starting a new project from scratch, this sequence works well:

1. Run the guided project bootstrap skill.
   Ask Codex to use `.agents/skills/project-bootstrap/SKILL.md`. The skill will inspect the clone, ask for the product brief, recommend simpler alternatives when appropriate, and confirm the scope before editing.

2. Establish the durable docs.
   Use the skill to update `README.md`, `PRODUCT.md`, `ROADMAP.md`, `CODESTYLE.md`, `DESIGN.md`, `ARCHITECTURE.md`, and `AGENTS.md` so a new contributor can understand the project without external context.

3. Add the toolchain.
   Choose your language, framework, package manager, and development commands. The skill may install approved frameworks or packages for that setup, then must document the canonical commands in this README. Prefer a single obvious entry point such as `make test`, `npm test`, or `pytest`.

4. Plan the first implementation increment.
   The skill finishes by creating an ordered ExecPlan under `plans/`. That plan should describe the first setup or implementation slice in enough detail for a future contributor to execute without remembering the intake conversation. If the planned work can affect frontend presentation, the plan should include explicit steps to capture baseline screenshots before implementation and matching screenshots after implementation.

5. Build with small, testable increments.
   Put runtime code in `src/`, keep tests in `tests/`, and keep the layout simple until the project clearly needs more structure.

6. Use ExecPlans for substantial work.
   When the task is complex or likely to touch multiple areas, write a plan in `plans/` and keep it current as the work proceeds. Name new plan files with the next ordered prefix, for example `00-add-feature-x.md` followed by `01-security-overhaul.md`.

## Working With Coding Agents

This template is designed so agents can contribute without relying on undocumented context.

To keep that working:

- keep root docs accurate
- update `PRODUCT.md` when user-visible capabilities, workflows, or scope boundaries change
- update `ROADMAP.md` when long-lived product direction, priorities, or intended future capabilities change
- document new commands when you add a toolchain
- update `CODESTYLE.md` when source conventions, naming rules, TypeScript annotation expectations, documentation conventions, or commenting standards change
- keep hand-written code files below 600 lines whenever practical, and treat larger files as a reason to recommend a user-approved split, refactor, library addition, or documented exception
- update `DESIGN.md` when stable design language changes
- update `ARCHITECTURE.md` when structure, ownership, or invariants change
- keep implementation work observable through tests, commands, or clear acceptance criteria
- keep `.codex/config.toml` narrow and intentional; model-default changes should be reflected in the relevant control documents
- use the repo-local `project-bootstrap` skill for the first customization pass after cloning; it should update docs and setup tooling, then hand off implementation through an ExecPlan
- use the repo-local `agent-browser` skill for browser interaction, screenshots, video recordings, form automation, exploratory QA, UI bug reproduction, and web-app quality review; load `.agents/skills/agent-browser/SKILL.md` first, then the installed core guidance with `agent-browser skills get core`
- after UI changes, or backend changes that can alter frontend layout or presentation, capture and inspect screenshots across desktop and mobile viewports, then apply the professional UI/UX review pass in `DESIGN.md` before calling the work complete
- when authoring UI-affecting ExecPlans, make baseline screenshot capture and after-implementation screenshot capture separate execution steps in `Progress` and `Concrete Steps`, not only validation notes
- use `scripts/win-screenshot [output.png]` when a contributor on Windows 11 with WSL needs a full-desktop screenshot outside a browser or Electron automation context

For larger changes, point agents at the relevant control documents and have them work from an ExecPlan rather than a vague prompt alone.

## Repository Layout

Use this layout unless the project has a strong reason to evolve beyond it:

```text
.
├── .agents/
│   └── skills/
│       ├── agent-browser/
│       ├── ask-questions-if-underspecified/
│       └── project-bootstrap/
├── .codex/
│   └── config.toml
├── AGENTS.md
├── ARCHITECTURE.md
├── CODESTYLE.md
├── DESIGN.md
├── PLANS.md
├── PRODUCT.md
├── ROADMAP.md
├── README.md
├── assets/
├── plans/
├── scripts/
├── src/
└── tests/
```

Not every directory needs to exist on day one. Add them when the project needs them, but keep the structure predictable.

## Build, Test, and Development Commands

No application build or test toolchain is checked in yet. The existing npm manifest is only for contributor tooling such as `agent-browser`. Until you add an application toolchain, the lightweight repository checks are:

- `git status` to inspect pending changes
- `rg --files --hidden -g '!.git/**'` to list the current file set, including project-scoped Codex configuration
- `git log --oneline` to inspect commit-message style
- `scripts/win-screenshot [output.png]` to capture the full Windows desktop from a Windows 11 + WSL environment when visual evidence must include the host desktop rather than only a browser page

Once you introduce a real toolchain, replace this section with the canonical commands contributors should run.

## Conventions To Keep

- Keep runtime code in `src/`.
- Mirror tests under `tests/`.
- Follow `CODESTYLE.md` for source formatting, naming, TypeScript annotation expectations, strict commenting standards, and code-file size expectations.
- Keep hand-written code files below 600 lines whenever practical; recommend user-approved refactors, code splits, library additions, or documented exceptions when files exceed that preference.
- Keep static assets in `assets/` when needed.
- Use `.agents/skills/project-bootstrap/SKILL.md` for the first project-specific customization pass after cloning.
- Keep `PRODUCT.md` in sync with current user-visible behavior and scope.
- Keep `ROADMAP.md` in sync with durable product direction and priorities.
- Treat root-level `ALLCAPS.md` files as durable project guidance, not scratch notes.
- Use ordered ExecPlan filenames for complex features and significant refactors, following the `plans/NN-kebab-case-name.md` convention in `PLANS.md`; UI-affecting plans should also include explicit before-and-after screenshot steps, and code-changing plans should end with a code-file line-count review.
- Keep the repository easy for a new human or agent to understand without hidden context.
- Keep the project-scoped Codex model default in `.codex/config.toml` unless a deliberate model migration updates the relevant docs at the same time.

## First Customizations Checklist

Before calling a project based on this template "ready," make sure you have done the following:

- run the `project-bootstrap` skill or completed an equivalent project-specific intake and documented the decisions it would have captured
- replaced placeholder project names in `PRODUCT.md`, `ROADMAP.md`, `DESIGN.md`, and `ARCHITECTURE.md`
- described the actual product and intended users in this README
- described the current capabilities and workflows in `PRODUCT.md`
- described the intended direction and near-term priorities in `ROADMAP.md`
- confirmed that `CODESTYLE.md` matches the code conventions, commenting standards, and code-file size expectations you want contributors to follow
- documented the initial toolchain and test command
- installed only the frameworks and packages that are needed for the confirmed initial setup
- created an ordered initial setup ExecPlan under `plans/`
- created the first `src/` and `tests/` modules
- confirmed that `AGENTS.md` matches how you want coding agents to work in the repo
- confirmed that `.codex/config.toml` pins the intended default Codex model

## Validation

At template stage, validation is mostly structural:

- `rg --files --hidden -g '!.git/**'` should show the expected control documents, project directories, and `.codex/config.toml`
- `git status` should clearly reflect documentation and code changes
- once a toolchain is added, the documented test command should become the default proof that the repository is healthy

For projects with a browser or Electron UI, validation should also include visual evidence:

- use `agent-browser` to take screenshots at several resolutions, including desktop and mobile, and include tablet or narrow-desktop coverage when responsive layout is involved
- record important user flows when the change affects interaction, navigation, animation, or a visual state that is hard to judge from still images
- inspect the captured evidence for UI regressions, responsive breakage, text overflow, broken states, and practical quality-of-life improvements before finishing the change
- apply the professional UI/UX review pass in `DESIGN.md`, correcting in-scope issues with hierarchy, spacing, typography, accessibility-visible states, responsive behavior, workflow friction, and interaction feedback
- keep before-and-after evidence for ExecPlan work when the plan affects frontend presentation, so reviewers can compare what visibly changed; the ExecPlan should list the before and after screenshot captures as execution steps and save screenshots under `plans/<name-of-plan>/screenshots/` with names such as `before-implementation-1.png` and `after-implementation-1.png`

## Philosophy

This template favors explicit context over implied context.

A new contributor should be able to clone the repository, read the root documents, and understand:

- what the project is for
- what the product currently does
- what the product is intended to become
- how to work in it
- where code should go
- which code style and commenting standards apply
- when to write a plan
- which documents must be updated when the project changes

That is the point of the template: less re-explaining, less guesswork, and a cleaner handoff between humans and agents.
