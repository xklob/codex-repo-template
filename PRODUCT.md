# Product State: [Project Name]

Use this document as the durable source of truth for the product's current state. Its purpose is to answer, at any given moment, "what does this system do for users right now?"

This file is for current, user-visible reality. Update it when the repository gains, removes, or materially changes a feature, workflow, product constraint, or scope boundary that affects how a user experiences the system.

This file is not a temporary status report, sprint tracker, or implementation notebook. Keep it focused on stable product truth rather than day-by-day progress.

## 1. Product Summary

Describe the product in a few paragraphs from the user's perspective.

Cover:
- who the product is for
- what core job it helps them do
- what a successful outcome looks like for the user
- the current stage of the product, such as early prototype, internal tool, beta, or production system

Example starter:

"[Project Name] helps [user] do [job]. Today, the product supports [current core workflow] and is intended for [audience]. The current version is best understood as [stage], with emphasis on [current strengths or focus]."

## 2. Users and Jobs To Be Done

List the main user types or operators and the concrete jobs they need the product to perform.

For each one, describe:
- who they are
- what they are trying to accomplish
- what matters most to them in the current version

Keep this grounded in present reality, not aspirational personas that the product does not yet serve.

## 3. Current Capabilities

Describe the product's current capabilities in terms of user-visible behavior.

Use short subsections or bullets, but make each capability concrete. For every capability, state:
- what the user can do
- where that capability appears in the product
- any important limits or preconditions
- the maturity of the capability if that matters

Suggested maturity labels:
- `Core` for relied-on behavior the product depends on
- `Experimental` for user-visible behavior that exists but may change substantially
- `Deprecated` for behavior that still exists but should be retired

If a small or medium feature lands without an ExecPlan, this section should usually still be updated if the change affects what a user can do.

### Agent Runtime Defaults

`Core`: The template includes a project-scoped Codex configuration file at `.codex/config.toml`. When a contributor uses Codex in a trusted checkout, Codex should use `gpt-5.5` as the default model for work in this repository.

### Ordered ExecPlan Guidance

`Core`: The template instructs contributors to save substantial-work plans under `plans/` with two-digit ordered filename prefixes, such as `00-add-feature-x.md` and `01-security-overhaul.md`. The ordering rule keeps multiple active or historical ExecPlans easy to scan without relying on chat history or issue context.

## 4. Core Workflows

Describe the end-to-end workflows that currently define the product.

For each workflow, explain:
- how it starts
- what the user does
- what result they get
- where the workflow currently ends

Focus on the workflows that are actually available now. If a workflow is partial, say so clearly.

### Agent-Assisted Repository Work

A human or agent opens the repository, reads the root control documents, and uses the checked-in `.codex/config.toml` default for Codex-assisted work. For complex work, they create or continue an ExecPlan in `plans/` using the next ordered filename prefix before implementing from that plan. The workflow ends with repository changes that preserve the control-document contract and can be validated with the lightweight checks in `README.md` until a real toolchain exists.

## 5. Product Constraints and Known Limits

Document the important current limits that shape user expectations or contributor decisions.

Examples:
- only supports internal users
- only works on desktop
- requires a specific third-party service
- does not yet support collaboration, offline use, or mobile layouts
- assumes a small dataset or low request volume

These are not implementation details for their own sake; include them only when they materially define the current product behavior or scope.

Current Codex model defaults apply only to Codex environments that load trusted project-scoped `.codex/config.toml` files. They do not create an application runtime, API integration, model router, or test harness.

## 6. Non-Goals

State what this product is intentionally not trying to do right now.

This section helps contributors avoid quietly expanding scope. Non-goals can be temporary, but they should be stated clearly enough that a new contributor can tell when a proposed change would alter the product definition.

## 7. Relationship To Other Control Documents

Use this file together with the other root documents:

- `README.md` explains what the repository is, how to run it, and how to contribute.
- `ROADMAP.md` explains the intended future direction, planned capabilities, and strategic priorities.
- `DESIGN.md` explains how the product should look and feel.
- `ARCHITECTURE.md` explains how the system is structured internally.
- `PLANS.md` explains how substantial changes should be planned and executed.
- `AGENTS.md` explains repository-specific instructions for coding agents.

`PRODUCT.md` should describe current reality. `ROADMAP.md` may intentionally describe future intent that does not exist yet. When another document disagrees with this file about present-day product behavior, resolve the mismatch in the same change.

## 8. Open Questions

Track durable product questions that are important enough to stay visible but are not yet settled.

- [Question]
- [Question]
