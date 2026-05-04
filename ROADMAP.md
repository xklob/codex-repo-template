# Product Roadmap: [Project Name]

Use this document as the durable source of truth for where the product is intended to go. Its purpose is to answer, at any given moment, "what future state are we aiming toward, and which product directions matter most?"

This file is for durable product direction. Update it when the repository's long-lived product vision, intended audience, strategic priorities, planned capabilities, sequencing assumptions, or explicit non-priorities change in a meaningful way.

This file is not a ticket backlog, sprint board, or implementation spec. Keep it focused on medium- and long-lived direction rather than day-to-day execution. Concrete implementation work should still be described in ExecPlans and code changes.

## 1. Product Vision

Describe the intended future of the product in a few paragraphs.

Cover:
- who the product is ultimately for
- what core job it should help them do
- what makes the product worth choosing
- what kind of product it is trying to become over time

Example starter:

"[Project Name] is intended to become [type of product] for [user]. In its mature form, it helps them [core job] with emphasis on [key differentiators]."

## 2. Intended Users and End State

Describe the users or operators the product is meant to serve as it matures.

For each one, explain:
- who they are
- what their larger objective is
- what success would look like for them in the intended end state

It is acceptable for this section to be broader than `PRODUCT.md`, because this file is about where the product is going rather than what it supports today.

## 3. Strategic Principles

State the durable product principles that should guide prioritization and tradeoffs.

Examples:
- prefer fast individual workflows over deep customization
- optimize for internal operators before self-serve external users
- make collaboration a later concern, not an initial one
- keep the product understandable by first-time users within minutes

These should be stable enough that they meaningfully guide future plans.

Template-derived projects should treat UI quality as a product standard, not a
cosmetic afterthought. When an ExecPlan affects UI or frontend presentation,
the final review should apply the professional UI/UX pass in `DESIGN.md` so
new surfaces are usable, responsive, accessible in visible interaction states,
and polished enough for a product-quality handoff.

## 4. Current Phase

Describe the current phase of the roadmap in plain language.

Examples:
- proving the core workflow
- hardening an internal tool
- expanding from single-user to team workflows
- preparing for external beta

This section should explain what the present phase is trying to achieve, not merely list tasks.

## 5. Near-Term Priorities

Describe the major capabilities or product improvements that should happen next.

For each priority, state:
- what outcome it is meant to unlock
- why it matters now
- what kinds of work are likely to follow from it

Keep this at roadmap level. Do not turn it into a checklist of implementation tickets.

## 6. Later Opportunities

Describe important opportunities that are plausible or desirable, but not immediate priorities.

This section helps contributors distinguish "important later" from "important now."

## 7. Explicit Non-Priorities

State which ideas, user segments, or capabilities are intentionally not being prioritized in the current roadmap window.

This section exists to prevent accidental scope drift. If a proposal would change one of these non-priorities, that should be treated as a roadmap change, not a routine implementation detail.

## 8. Relationship To Other Control Documents

Use this file together with the other root documents:

- `README.md` explains what the repository is, how to run it, and how to contribute.
- `PRODUCT.md` explains what the product currently does today.
- `CODESTYLE.md` explains source formatting, naming, TypeScript annotation expectations, documentation style, strict commenting standards, and code-file size expectations.
- `DESIGN.md` explains how the product should look and feel.
- `ARCHITECTURE.md` explains how the system is structured internally.
- `PLANS.md` explains how substantial changes should be planned and executed.
- `AGENTS.md` explains repository-specific instructions for coding agents.

`ROADMAP.md` may intentionally describe capabilities that do not yet exist. `PRODUCT.md` should only describe capabilities that exist now. When these files differ, treat `ROADMAP.md` as future intent and `PRODUCT.md` as current reality.

## 9. Open Questions

Track durable product-direction questions that are important enough to stay visible but are not yet settled.

- [Question]
- [Question]
