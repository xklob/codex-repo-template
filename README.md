# Agent-Forward Project Template

This repository is a starting point for agentic-forward software projects: projects that expect coding agents to participate in design, implementation, review, and maintenance from the beginning.

The template is intentionally minimal. It does not lock you into a language, framework, or deployment target. Instead, it gives you a durable operating model:

- stable root documents that define current product truth, future direction, code style, design language, architecture, and execution-planning expectations
- a simple repository layout for code, tests, and assets
- contributor guidance that keeps human and agent work aligned as the project grows

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
- `PLANS.md` defines the ExecPlan format and the rules for using ordered execution plans on complex work.
- `CODESTYLE.md` defines source formatting, naming, TypeScript annotation expectations, documentation style, and strict commenting standards.
- `DESIGN.md` is the durable design-language reference for the product.
- `ARCHITECTURE.md` is the durable architectural map for the system.
- `.codex/config.toml` sets project-scoped Codex defaults. The current template pins trusted Codex sessions to `gpt-5.5`.

The repository also reserves these top-level directories:

- `src/` for runtime code
- `tests/` for tests that mirror the `src/` layout
- `assets/` for static assets when the project needs them
- `plans/` for ordered ExecPlans named with the next `NN-kebab-case-name.md` prefix

## Core Idea: Durable Context First

Agentic-forward projects work better when important context is stored in the repository itself instead of being recreated in every conversation.

This template treats the root documentation as project control documents:

- `README.md` keeps onboarding and commands current.
- `PRODUCT.md` keeps the current product truth explicit, especially for small and medium user-visible changes that may not get their own ExecPlan.
- `ROADMAP.md` keeps intended future direction explicit so contributors can distinguish current behavior from planned behavior.
- `PLANS.md` ensures larger changes are driven by self-contained execution plans.
- `CODESTYLE.md` keeps source conventions and commenting standards explicit.
- `DESIGN.md` captures stable product and interface language.
- `ARCHITECTURE.md` captures stable system boundaries and invariants.
- `AGENTS.md` tells coding agents how to behave in this specific repository.

As the project evolves, these documents should be updated alongside the code they govern.

## How To Use This Template

Start by turning the template into the real project you want to build.

1. Create a new repository from this template, or clone it and rename it for your project.
2. Replace placeholder text in `README.md`, `PRODUCT.md`, `ROADMAP.md`, `DESIGN.md`, and `ARCHITECTURE.md`, and adapt `CODESTYLE.md` if the project needs different code conventions.
3. Decide on your initial language, framework, and toolchain.
4. Add your first runtime code under `src/` and mirror tests under `tests/`.
5. Document the canonical development and test commands in `README.md` as soon as you introduce them.
6. Use ExecPlans for complex features, significant refactors, or work with meaningful ambiguity. Save each new plan under `plans/` with the next two-digit prefix, such as `00-add-feature-x.md`, so plans sort in creation order.

In practice, the first pass through the template usually looks like this:

- name the product and describe the user problem in `README.md`
- describe the product's current workflows and capabilities in `PRODUCT.md`
- describe the intended future direction and planned capabilities in `ROADMAP.md`
- adjust code conventions and commenting standards in `CODESTYLE.md`
- describe the visual and interaction direction in `DESIGN.md`
- describe the codebase shape and boundaries in `ARCHITECTURE.md`
- add the initial toolchain and document its commands
- implement the first thin slice of real functionality
- confirm `.codex/config.toml` still matches the default Codex model you want contributors to use

## Recommended Bootstrap Workflow

If you are starting a new project from scratch, this sequence works well:

1. Define the product briefly.
   Write a short description of who the user is, what problem the project solves, and what the first usable workflow should be.

2. Establish the durable docs.
   Update `README.md`, `PRODUCT.md`, `ROADMAP.md`, `CODESTYLE.md`, `DESIGN.md`, and `ARCHITECTURE.md` so a new contributor can understand the project without external context.

3. Add the toolchain.
   Choose your language and development commands. When you do, document the canonical commands in this README. Prefer a single obvious entry point such as `make test`, `npm test`, or `pytest`.

4. Build with small, testable increments.
   Put runtime code in `src/`, keep tests in `tests/`, and keep the layout simple until the project clearly needs more structure.

5. Use ExecPlans for substantial work.
   When the task is complex or likely to touch multiple areas, write a plan in `plans/` and keep it current as the work proceeds. Name new plan files with the next ordered prefix, for example `00-add-feature-x.md` followed by `01-security-overhaul.md`.

## Working With Coding Agents

This template is designed so agents can contribute without relying on undocumented context.

To keep that working:

- keep root docs accurate
- update `PRODUCT.md` when user-visible capabilities, workflows, or scope boundaries change
- update `ROADMAP.md` when long-lived product direction, priorities, or intended future capabilities change
- document new commands when you add a toolchain
- update `CODESTYLE.md` when source conventions, naming rules, TypeScript annotation expectations, documentation conventions, or commenting standards change
- update `DESIGN.md` when stable design language changes
- update `ARCHITECTURE.md` when structure, ownership, or invariants change
- keep implementation work observable through tests, commands, or clear acceptance criteria
- keep `.codex/config.toml` narrow and intentional; model-default changes should be reflected in the relevant control documents
- use the repo-local `agent-browser` skill for browser interaction, screenshots, video recordings, form automation, exploratory QA, UI bug reproduction, and web-app quality review; load `.agents/skills/agent-browser/SKILL.md` first, then the installed core guidance with `agent-browser skills get core`
- after UI changes, or backend changes that can alter frontend layout or presentation, capture and inspect screenshots across desktop and mobile viewports before calling the work complete

For larger changes, point agents at the relevant control documents and have them work from an ExecPlan rather than a vague prompt alone.

## Repository Layout

Use this layout unless the project has a strong reason to evolve beyond it:

```text
.
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
├── src/
└── tests/
```

Not every directory needs to exist on day one. Add them when the project needs them, but keep the structure predictable.

## Build, Test, and Development Commands

No language-specific toolchain is checked in yet. Until you add one, the lightweight repository checks are:

- `git status` to inspect pending changes
- `rg --files --hidden -g '!.git/**'` to list the current file set, including project-scoped Codex configuration
- `git log --oneline` to inspect commit-message style

Once you introduce a real toolchain, replace this section with the canonical commands contributors should run.

## Conventions To Keep

- Keep runtime code in `src/`.
- Mirror tests under `tests/`.
- Follow `CODESTYLE.md` for source formatting, naming, TypeScript annotation expectations, and strict commenting standards.
- Keep static assets in `assets/` when needed.
- Keep `PRODUCT.md` in sync with current user-visible behavior and scope.
- Keep `ROADMAP.md` in sync with durable product direction and priorities.
- Treat root-level `ALLCAPS.md` files as durable project guidance, not scratch notes.
- Use ordered ExecPlan filenames for complex features and significant refactors, following the `plans/NN-kebab-case-name.md` convention in `PLANS.md`.
- Keep the repository easy for a new human or agent to understand without hidden context.
- Keep the project-scoped Codex model default in `.codex/config.toml` unless a deliberate model migration updates the relevant docs at the same time.

## First Customizations Checklist

Before calling a project based on this template "ready," make sure you have done the following:

- replaced placeholder project names in `PRODUCT.md`, `ROADMAP.md`, `DESIGN.md`, and `ARCHITECTURE.md`
- described the actual product and intended users in this README
- described the current capabilities and workflows in `PRODUCT.md`
- described the intended direction and near-term priorities in `ROADMAP.md`
- confirmed that `CODESTYLE.md` matches the code conventions and commenting standards you want contributors to follow
- documented the initial toolchain and test command
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
- keep before-and-after evidence for ExecPlan work when the plan affects frontend presentation, so reviewers can compare what visibly changed; save screenshots under `plans/<name-of-plan>/screenshots/` with names such as `before-implementation-1.png` and `after-implementation-1.png`

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
