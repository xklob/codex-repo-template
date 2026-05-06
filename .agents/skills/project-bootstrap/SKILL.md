---
name: project-bootstrap
description: Use when a newly cloned agent-forward project template needs to be customized for a specific product, use case, tech stack, roadmap, and initial setup plan. Guides intake, suggests alternatives, updates project control documents, installs selected frameworks or packages, and creates an ExecPlan without implementing product feature code.
---

# Project Bootstrap

Use this skill to turn a fresh clone of the agent-forward project template into a project-specific repository. This is an intake, repository-customization, dependency setup, and planning workflow. It is not a product implementation workflow.

## Boundaries

In scope:

- Gather enough information to make the template specific to the user's product, team, constraints, and future plans.
- Suggest better alternatives when the user's preferred stack, scope, architecture, or sequencing would create avoidable maintenance cost.
- Update root control documents so they describe the actual project instead of the generic template.
- Install required frameworks, packages, lockfiles, and toolchain configuration that the user approves for the initial project direction.
- Create directories, configuration files, and placeholder files only when they are needed to make the chosen toolchain coherent.
- Finish with a self-contained ExecPlan for initial setup or the first implementation slice.

Out of scope:

- Do not implement product feature code, business logic, UI screens, API handlers, database schemas, workflows, or domain-specific tests.
- Do not silently choose a framework, persistence layer, deployment target, or visual direction when those choices materially affect the project.
- Do not leave placeholder text in root control documents unless the user explicitly defers that decision and the document names the open question.

## Workflow

### 1. Inspect the clone

Read the repository before asking project-specific questions:

- `README.md`
- `PRODUCT.md`
- `ROADMAP.md`
- `PLANS.md`
- `CODESTYLE.md`
- `DESIGN.md`
- `ARCHITECTURE.md`
- `AGENTS.md`
- `.codex/config.toml`, if present
- `package.json`, lockfiles, language manifests, and existing `src/`, `tests/`, `assets/`, `scripts/`, and `plans/` contents

Also run:

```bash
rg --files --hidden -g '!.git/**'
git status --short
```

If the repository is not a clean or recognizable clone of this template, pause and explain what differs before proceeding.

### 2. Gather the project brief

Ask enough questions to remove ambiguity before changing the repository. Keep the first question set scannable, but do not skip important categories. Offer recommended defaults where reasonable and let the user answer with short labels.

Gather:

- Project name, short description, target audience, and the problem the product solves.
- The first useful workflow the project should support and what "working" means for that workflow.
- Current stage: exploration, prototype, internal tool, beta, production replacement, library, infrastructure, or another state.
- Main user types, their jobs to be done, and current non-goals.
- Near-term roadmap, later opportunities, explicit non-priorities, and the first implementation slice.
- Product constraints: offline needs, privacy, data sensitivity, performance, accessibility, deployment environment, supported platforms, budget, licensing, and maintainability expectations.
- Application type: web app, API, CLI, library, desktop app, mobile app, game, data pipeline, automation, infrastructure, or mixed system.
- Preferred language, runtime, package manager, framework, testing tools, formatter, linter, build command, and deployment target.
- Required integrations: databases, queues, auth providers, payment providers, AI services, email, storage, analytics, observability, or external APIs.
- Design direction: visual tone, density, brand constraints, primary devices, accessibility expectations, key screens, and whether browser or Electron visual review will be required.
- UI mockup expectations: whether substantial UI work should generate multiple pre-implementation mockups, whether the user has a local reference image or Stitch export bundle to use as a style sample, and whether Google Stitch credentials will be available for `npm run stitch:mockups`.
- Repository operations: license, remote name, default branch, CI expectations, release process, environment variable strategy, secrets handling, and whether `.codex/config.toml` should keep the template default.
- How much toolchain setup to do now versus record in the final ExecPlan.

When the user proposes a choice that looks risky, say so before acting. Give concrete alternatives with tradeoffs. Examples:

- Recommend a simpler server-rendered stack over a multi-service architecture for an internal CRUD tool unless the user has scaling or team-boundary needs.
- Recommend a standard test runner and formatter for the chosen ecosystem instead of custom scripts.
- Recommend delaying authentication, payments, or multi-tenant storage when they are not needed for the first usable workflow.
- Recommend keeping `.codex/config.toml` narrow unless the team has a clear reason to alter trusted-project defaults.

### 3. Confirm the bootstrap scope

Before editing, restate the intended result in plain language:

- What the project is.
- Which control documents will be rewritten or adjusted.
- Which frameworks or packages will be installed now.
- Which commands will become canonical for build, test, lint, format, development server, or validation.
- Which decisions remain open and where they will be recorded.
- What will be left for the final ExecPlan instead of implemented now.

Get confirmation if the scope includes installing packages, running framework generators, changing the default model, choosing a deployment target, or creating generated starter files.

### 4. Customize repository documents

Update the root control documents together so they agree:

- `README.md`: project identity, purpose, setup commands, validation commands, repository layout, and how contributors should start work after bootstrap.
- `PRODUCT.md`: current user-visible truth, current workflows, current limits, and non-goals.
- `ROADMAP.md`: intended future state, strategic principles, near-term priorities, later opportunities, and explicit non-priorities.
- `CODESTYLE.md`: language-specific conventions, formatter/linter expectations, TypeScript annotation rules if relevant, documentation style, commenting standards, and code-file size expectations.
- `DESIGN.md`: project-specific visual and interaction language if the product has or will have a UI.
- `ARCHITECTURE.md`: intended code layout, boundaries, dependencies, configuration ownership, and extension points.
- `AGENTS.md`: repository-specific agent instructions, validation commands, visual-review requirements, and any project-specific skill guidance.
- `PLANS.md`: only update if the project changes how ExecPlans should be authored, validated, or synchronized with control documents.

Replace generic template placeholders such as `[Project Name]` with project-specific content. If the user intentionally defers a section, record a specific open question instead of leaving generic instructions as though they were project truth.

### 5. Install approved tooling

Install only the frameworks, packages, and tools that are required for the confirmed bootstrap scope. Use the package manager and ecosystem conventions selected by the user. When installation commands or framework generators are version-sensitive, verify the current official command or package-manager guidance before running them.

Allowed setup changes include:

- package manifests and lockfiles
- formatter, linter, test runner, build tool, and dev-server configuration
- framework configuration needed before product code exists
- `.gitignore` updates for generated artifacts
- empty or placeholder `src/`, `tests/`, and `assets/` directories when the ecosystem can track them
- environment example files that list required variable names without secrets

Keep generated starter code to the minimum required by the selected framework. Remove demo behavior, example routes, sample branding, and toy product logic unless the framework cannot run without them. Do not write the user's actual product feature code.

After installing tooling, update `README.md`, `CODESTYLE.md`, `ARCHITECTURE.md`, and `AGENTS.md` with the canonical commands and file ownership implied by the toolchain.

### 6. Create the initial setup ExecPlan

Finish by creating or updating one ordered ExecPlan under `plans/` using the next `NN-kebab-case-name.md` prefix from `PLANS.md`. Good names include:

- `00-initial-project-setup.md`
- `01-first-usable-workflow.md`
- `02-auth-and-data-model-setup.md`

The ExecPlan must be self-contained and must not assume the reader remembers the intake conversation. It should include:

- the project brief and confirmed constraints
- what bootstrap customization was already completed
- the first implementation outcome that should exist after the plan is executed
- exact files and directories to edit
- package/tooling commands already installed and commands still to run
- validation and acceptance criteria
- required control-document updates
- visual evidence requirements when the planned work can affect browser, Electron, rendered documentation, or frontend presentation, including explicit `Progress` and `Concrete Steps` entries for baseline screenshots before implementation, matching screenshots after implementation, and screenshot UX review using `.agents/skills/review-ui-screenshots/SKILL.md`
- pre-implementation UI mockup requirements when the planned work is a substantial UI addition, UI refactor, major responsive/layout change, or design-direction choice, including use of `.agents/skills/ui-mockups/SKILL.md`, `plans/<plan-stem>/mockups/` artifacts, optional local reference samples, and a user-selected direction before UI code is implemented
- a final code-file line-count review when the planned work adds or changes code, applying the 600-line preference from `CODESTYLE.md` and requiring user approval before any unplanned split, refactor, or library addition
- open questions and deferred decisions

Do not execute the implementation steps in that ExecPlan unless the user explicitly asks in a later request.

### 7. Validate and hand off

Run the lightweight validation that fits the customized repository:

```bash
rg --files --hidden -g '!.git/**'
git diff --check
git status --short
```

Also run any build, test, lint, format, or framework health command introduced during bootstrap. If a browser or Electron target now exists and the bootstrap changed rendered output, use the repo-local `agent-browser` skill for screenshot evidence, then use `.agents/skills/review-ui-screenshots/SKILL.md` to inspect the captured evidence as part of the visual review pass in `DESIGN.md`.

End with:

- changed files
- installed packages or generated config
- commands run and their results
- the final ExecPlan path
- decisions still open
- confirmation that no product feature code was implemented
