# Code Style

Use this document as the durable source of truth for code conventions in this template and in future projects derived from it. It covers source formatting, naming, TypeScript annotation expectations, documentation style, strict commenting standards, and code-file size expectations.

Update this file when the project adopts a formatter, linter, language-specific style rule, naming convention, documentation convention, or commenting standard that future contributors must follow.

## Scope

These rules apply to runtime code, tests, scripts, and code-bearing configuration files that support comments. Markdown documents use their heading and opening prose as their file-level explanation instead of comment syntax. For formats that do not support comments, such as strict JSON, do not add invalid comments; document the file's purpose in a nearby README, schema, or root control document.

When an ecosystem has a strong convention that conflicts with this file, prefer the ecosystem convention only when it improves readability or tooling compatibility. Record durable exceptions here so later contributors do not have to rediscover them.

## General Source Style

- Keep functions small enough that their purpose and control flow are easy to review.
- Keep hand-written code files below 600 lines whenever practical. Treat this as a strong maintainability preference, not a hard limit for generated files, lockfiles, vendored dependencies, or framework-required manifests.
- Prefer explicit, descriptive names over abbreviations. A new contributor should understand what a variable, function, file, or module owns without reading every caller first.
- Use 4 spaces for code indentation unless the language ecosystem strongly prefers another width. Use 2 spaces for Markdown, YAML, JSON, TOML, and similar structured files.
- Put runtime code in `src/`, mirror tests in `tests/`, and keep static assets in `assets/` when they are needed.
- Use `snake_case` for Python-style modules and identifiers. Use `kebab-case` for ordinary Markdown filenames outside conventional root control documents.
- Keep root control documents in uppercase names such as `README.md`, `PRODUCT.md`, `ROADMAP.md`, `PLANS.md`, `CODESTYLE.md`, `DESIGN.md`, `ARCHITECTURE.md`, and `AGENTS.md`.
- Name ExecPlans under `plans/` with the ordered `NN-kebab-case-name.md` pattern described in `PLANS.md`.
- In TypeScript files, add explicit type annotations for variables, including locals, constants, and intermediate values, unless the annotation would duplicate generated types verbatim or make the code less clear.
- If you add a formatter or linter, run it before review and document the canonical command in `README.md` and `AGENTS.md`.

## File Size and Modularity

Keep each hand-written code file below 600 lines whenever practical. Long files are harder for humans and agents to review, summarize, and safely change. The right response is not automatic slicing; split only when a real responsibility boundary, test boundary, or reusable abstraction makes the code easier to understand.

Generated files, lockfiles, vendored dependencies, build output, and framework-owned manifests may exceed 600 lines. For hand-written source, tests, scripts, and code-bearing configuration, treat any file above 600 lines as a refactor signal that needs a conscious decision.

At the end of substantial code changes, check line counts for hand-written code files. If a file exceeds 600 lines, or is close enough that the next likely change will push it over the preference, summarize the file path, line count, and likely cause. Suggest one or more concrete options such as splitting by responsibility, moving fixtures or tests, extracting a shared helper, introducing a well-supported library, or accepting a documented exception. Do not perform that extra split, refactor, or library addition unless the user approves it or the accepted ExecPlan already included that work.

## Commenting Standard

Comments are required so reviewers can understand intent without reconstructing logic from scratch. Write comments for a junior developer who may know programming basics but may not know this repository, its domain, or the specific language feature being used.

Comments must explain purpose, reasoning, control flow, assumptions, and side effects. Avoid comments that only restate syntax, such as "increment i" above `i += 1`. Update or remove stale comments in the same change that makes them inaccurate.

### File Header Comments

Every source file that supports comments must start with a top-level header comment. Place it after required syntax that must come first, such as a shebang, encoding declaration, license notice, or language directive.

The file header must explain:

- the purpose of the file
- the key classes, interfaces, functions, or exported values in the file
- how the file fits into the project
- important side effects, external dependencies, or runtime assumptions
- each major component part when the file is complex enough to have distinct sections

For test files, the header should explain the behavior under test and the production module or workflow the tests protect.

### Class and Interface Comments

Every class and interface must have a header comment immediately above its declaration. Apply the same standard to public types, enums, traits, protocols, or similar declarations when the language uses those instead.

The comment must explain:

- what the class or interface represents
- what responsibility it owns
- what collaborators call it or implement it
- important state, lifecycle, or ordering assumptions
- invariants that callers or implementers must preserve

For interfaces, describe what implementers promise and what callers can rely on. For classes, describe the state the class owns and any side effects its methods may perform.

### Function Comments

Every function must have a comment at the top, using the language's normal documentation-comment or docstring style when one exists. Simple functions may use one concise sentence. Complex functions need a short step-by-step outline.

The function comment must explain:

- the function's purpose
- the meaning of important parameters or inputs
- what the function returns or mutates
- side effects such as network calls, filesystem writes, database updates, rendering, logging, or event dispatch
- errors, exceptions, rejected promises, or failure results callers should expect
- the high-level control flow when the function has multiple branches or phases

Prefer comments that help someone understand why the function exists and how to call it safely.

### Inline Comments Inside Functions

Within each non-trivial function, add inline comments before meaningful steps in the control flow. These comments should help a junior developer follow the function without already knowing the language, framework, or domain.

Use inline comments to explain:

- why a branch exists
- what a loop is collecting or transforming
- why a hard-coded constant has that value
- why a guard clause returns early
- why a data conversion is needed
- what an unfamiliar language feature or library call is doing
- which side effect is about to happen

Do not comment completely obvious statements. A single-line getter, constant export, or direct wrapper may only need the required function-level comment if inline comments would add noise. For multi-step functions, comments should mark each meaningful phase: validate input, normalize data, load dependencies, apply the main rule, perform side effects, and return the result.

### Comment Quality Checklist

Before review, check that:

- every source file with comment support has a purpose header
- every class and interface has a declaration-level comment
- every function has a top comment or docstring
- complex functions describe their control flow before or at the top of the body
- inline comments explain non-obvious steps without narrating trivial syntax
- comments match the current behavior after the code change

## Documentation Style

Keep documentation in the file that owns the relevant truth:

- `PRODUCT.md` describes current product capabilities, workflows, constraints, and user-visible limits.
- `ROADMAP.md` describes durable future direction, intended audiences, planned capabilities, priorities, and non-priorities.
- `DESIGN.md` describes stable visual language, interaction language, and reusable component styling.
- `ARCHITECTURE.md` describes stable structure, ownership, boundaries, and invariants.
- `README.md` describes onboarding, commands, repository layout, and user-facing project context.
- `PLANS.md` describes how ExecPlans must be written and maintained.
- `CODESTYLE.md` describes code conventions, commenting standards, and code-file size expectations.
- `AGENTS.md` describes repository-specific instructions for coding agents.

Reserve new root-level `ALLCAPS.md` files for durable guidance or control documents, not scratch notes or one-off design dumps. When a new root control document is introduced, update `AGENTS.md`, `PLANS.md`, and any root document inventory that future contributors rely on.
