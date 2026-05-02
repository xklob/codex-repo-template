# Architecture: [Project Name]

Keep this document short, stable, and practical. Its job is to help a new contributor answer two questions quickly:

1. Where does the thing that does X live?
2. What architectural boundaries or invariants must I not break while changing it?

Prefer durable structure over transient details. Name important directories, modules, entry points, and types, but do not turn this file into low-level implementation notes.

## System Overview

Describe the problem the project solves from a user's perspective.

Cover:
- What the system does.
- The main kinds of users or operators.
- The most important user-visible workflows.
- The one-sentence explanation of how the codebase is organized to support those workflows.

Example starter:

"[Project Name] lets [user] do [core job]. The codebase is organized around [major layers or subsystems], with [boundary] separating [concern A] from [concern B]."

## Codemap

List the main code areas and what each one owns. Keep it at the level of directories, packages, services, major modules, or top-level entry points.

Suggested shape:
- `src/[entrypoint]` - Starts the application, wires dependencies, and owns process startup.
- `src/[feature_or_domain]` - Contains the core business rules for ...
- `src/[api_or_transport]` - Accepts external requests and translates them into domain operations.
- `src/[storage_or_infra]` - Talks to databases, queues, filesystems, or external APIs.
- `.codex/config.toml` - Owns project-scoped Codex defaults, including the default model used by trusted Codex sessions.
- `plans/` - Stores ExecPlans for substantial work. Plan filenames use two-digit prefixes, such as `00-add-feature-x.md`, so multiple plans sort in the order they were created.
- `tests/` - Mirrors `src/` and verifies ...
- `assets/` - Stores static assets used by ...

Add more sections only when the project genuinely needs them.

## Main Flows

Describe the few core request or data flows that matter most.

Use prose or a short numbered list. For each flow, state:
- Where it starts.
- Which layers it passes through.
- Where side effects happen.
- Where validation, authorization, persistence, or rendering decisions are made.

Template:
1. A [request/event/user action] enters through `[path or module]`.
2. `[module]` validates and normalizes the input.
3. `[module]` applies the core business rules.
4. `[module]` performs side effects such as persistence, network calls, or rendering.
5. `[module]` returns a result to `[caller or UI]`.

## Architectural Invariants

State the rules that should stay true even as the code changes.

Examples:
- Domain logic does not import UI code.
- Transport handlers do not contain business rules.
- Persistence code is the only layer allowed to know table or collection layout.
- Feature modules may depend on shared utilities, but shared utilities may not depend on feature modules.
- Tests should verify behavior through public entry points before relying on internals.

Write the invariants that matter for this repository, not generic ones.

## Boundaries & External Dependencies

Call out important system boundaries and what crosses them.

Examples:
- Browser to server boundary.
- API layer to domain layer boundary.
- Domain layer to persistence boundary.
- Application to third-party service boundary.
- Build-time generation to runtime execution boundary.

For each boundary, note:
- Which module owns it.
- What type of data crosses it.
- What must be validated or translated there.

## Cross-Cutting Concerns

Document the concerns that affect multiple areas of the codebase.

Possible topics:
- Authentication and authorization.
- Logging and observability.
- Error handling.
- Configuration and secrets.
- Performance constraints.
- Background jobs or asynchronous work.
- Caching.
- Accessibility.
- Multi-tenancy.

Only include the concerns that materially shape the project.

### Configuration

Codex-specific defaults live in `.codex/config.toml`. Keep this file limited to project-scoped agent configuration; do not use it as an application configuration file once runtime code exists.

## How To Extend The System Safely

Give a new contributor a short playbook for common changes.

Template prompts:
- To add a new feature, start in ...
- To add a new external integration, extend ...
- To add a new page or screen, wire it through ...
- To change shared data shapes, update ... and then validate ...
- To change the default Codex model, update `.codex/config.toml` and the control documents that describe the agent workflow.

If there are common mistakes, name them explicitly.

## Open Questions

Track unresolved architectural questions that should stay visible.

- [Question]
- [Question]
