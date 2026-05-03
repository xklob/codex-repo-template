# Codex Execution Plans (ExecPlans):

This document describes the requirements for an execution plan ("ExecPlan"), a design document that a coding agent can follow to deliver a working feature or system change. Treat the reader as a complete beginner to this repository: they have only the current working tree and the single ExecPlan file you provide. There is no memory of prior plans and no external context.

## How to use ExecPlans and PLANS.md

When authoring an executable specification (ExecPlan), follow PLANS.md _to the letter_. If it is not in your context, refresh your memory by reading the entire PLANS.md file. Be thorough in reading (and re-reading) source material to produce an accurate specification. When creating a spec, start from the skeleton and flesh it out as you do your research.

Write new ExecPlans to `plans/NN-short-descriptive-name.md` under the repository root. Create the `plans/` directory if it does not already exist. The `NN` prefix is a two-digit order number, starting with `00` when there are no existing plans and otherwise using the next unused number after the highest existing numeric prefix. The descriptive part after the prefix must use kebab-case and should name the work plainly, for example `00-add-feature-x.md` or `01-security-overhaul.md`. Do not renumber existing plans unless the change is explicitly a plan-order cleanup; if a new plan supersedes an older one, give it the next number and explain the relationship inside the plan.

When bootstrapping a newly cloned template repository, use the repo-local `project-bootstrap` skill at `.agents/skills/project-bootstrap/SKILL.md` before implementing product code. That skill gathers the product brief, updates project control documents, installs approved setup tooling, and finishes by creating an ordered ExecPlan for initial setup or the first implementation slice. The generated ExecPlan must still follow this file exactly, including filename ordering, self-containment, explicit visual-evidence steps when applicable, validation, and living-document sections.

If the repository contains root-level durable context documents such as `PRODUCT.md`, `ROADMAP.md`, `CODESTYLE.md`, `DESIGN.md`, `ARCHITECTURE.md`, or another `ALLCAPS.md` file with project-wide rules, read them before writing or implementing the ExecPlan whenever they are relevant to the change. Treat those files as inputs to the plan, not substitutes for it: copy the relevant constraints, terminology, and invariants into the ExecPlan in your own words so the plan remains self-contained.

If a change introduces a new root-level `ALLCAPS.md` file, that same change must classify it. Either it is a durable control document that future ExecPlans may need to consult, or it should be renamed to something less authoritative. When it is a durable control document, update `AGENTS.md` and this file in the same change if the new document changes how plans should be authored, implemented, or validated.

When implementing an executable specification (ExecPlan), do not prompt the user for "next steps"; simply proceed to the next milestone. Keep all sections up to date, add or split entries in the list at every stopping point to affirmatively state the progress made and next steps. Resolve ambiguities autonomously, and commit frequently.

When an ExecPlan affects a browser UI, Electron UI, rendered documentation, visual design, or backend behavior that can change frontend layout or presentation, capture visual evidence before implementation begins and again after the implementation is complete. The ExecPlan must make those captures visible as execution work, not only as acceptance criteria: add an explicit baseline screenshot step to `Progress` and `Concrete Steps` before code or presentation edits begin, and add an explicit matching after-implementation screenshot step after implementation and before final acceptance. Use the repo-local `agent-browser` skill for browser interaction, screenshots, and video recordings. Load `.agents/skills/agent-browser/SKILL.md` first, then use `agent-browser skills get core` or the relevant specialized skill so the commands match the installed version. Capture screenshots at materially different viewports, including desktop and mobile, and include tablet or narrow-desktop coverage when responsive behavior is in scope. Save screenshots under `plans/<name-of-plan>/screenshots/`, where `<name-of-plan>` is the ExecPlan filename without `.md`, using names such as `before-implementation-1.png`, `before-implementation-2.png`, `after-implementation-1.png`, and `after-implementation-2.png`. Record videos of important flows before and after when interaction, navigation, animation, or multi-step UI state is part of the work, and save them under `plans/<name-of-plan>/recordings/` with matching before/after names. After implementation, compare the before-and-after screenshots and recordings, identify regressions, fixes, and quality-of-life improvements, and either make the in-scope corrections or record the remaining follow-up clearly in the ExecPlan. The final review must include the professional UI/UX pass defined in `DESIGN.md`: judge the result against product-quality usability, hierarchy, responsive layout, accessibility-visible, interaction-state, copy, and workflow standards, then fix in-scope issues before calling the plan complete.

When discussing an executable specification (ExecPlan), record decisions in a log in the spec for posterity; it should be unambiguously clear why any change to the specification was made. ExecPlans are living documents, and it should always be possible to restart from _only_ the ExecPlan and no other work.

When researching a design with challenging requirements or significant unknowns, use milestones to implement proof of concepts, "toy implementations", etc., that allow validating whether the user's proposal is feasible. Read the source code of libraries by finding or acquiring them, research deeply, and include prototypes to guide a fuller implementation.

## Requirements

NON-NEGOTIABLE REQUIREMENTS:

* Every ExecPlan must be fully self-contained. Self-contained means that in its current form it contains all knowledge and instructions needed for a novice to succeed.
* Every ExecPlan is a living document. Contributors are required to revise it as progress is made, as discoveries occur, and as design decisions are finalized. Each revision must remain fully self-contained.
* Every ExecPlan must enable a complete novice to implement the feature end-to-end without prior knowledge of this repo.
* Every ExecPlan must produce a demonstrably working behavior, not merely code changes to "meet a definition".
* Every ExecPlan must define every term of art in plain language or do not use it.
* Every ExecPlan that can affect frontend presentation must define the before-and-after screenshot and video evidence it will capture, include explicit before-implementation and after-implementation screenshot steps in `Progress` and `Concrete Steps`, name the viewports or devices it will cover, name the `plans/<name-of-plan>/screenshots/` and `plans/<name-of-plan>/recordings/` artifact paths it will use, and explain how the final comparison will be reviewed for regressions, quality-of-life fixes, and the professional UI/UX pass required by `DESIGN.md`.

Purpose and intent come first. Begin by explaining, in a few sentences, why the work matters from a user's perspective: what someone can do after this change that they could not do before, and how to see it working. Then guide the reader through the exact steps to achieve that outcome, including what to edit, what to run, and what they should observe.

The agent executing your plan can list files, read files, search, run the project, and run tests. It does not know any prior context and cannot infer what you meant from earlier milestones. Repeat any assumption you rely on. Do not point to external blogs or docs; if knowledge is required, embed it in the plan itself in your own words. If an ExecPlan builds upon a prior ExecPlan and that file is checked in, incorporate it by reference. If it is not, you must include all relevant context from that plan.

If `PRODUCT.md` exists and the work affects current user-visible capabilities, workflows, scope boundaries, or important product limitations, the ExecPlan must say how `PRODUCT.md` will be updated and validated. If `ROADMAP.md` exists and the work affects product vision, intended audience, strategic priorities, planned capabilities, sequencing assumptions, or explicit non-priorities, the ExecPlan must say how `ROADMAP.md` will be updated and validated. If `CODESTYLE.md` exists and the work affects source conventions, naming rules, TypeScript annotation expectations, documentation conventions, or commenting standards, the ExecPlan must say how `CODESTYLE.md` will be updated and validated. If `DESIGN.md` exists and the work affects stable visual language, interaction language, layout principles, or reusable component styling, the ExecPlan must say how `DESIGN.md` will be updated and validated. If `ARCHITECTURE.md` exists and the work affects durable module boundaries, ownership, extension points, or architectural invariants, the ExecPlan must say how `ARCHITECTURE.md` will be updated and validated. Apply the same rule to any other root-level `ALLCAPS.md` file that defines durable project-wide constraints.

## Formatting

Format and envelope are simple and strict. Each ExecPlan must be one single fenced code block labeled as `md` that begins and ends with triple backticks. Do not nest additional triple-backtick code fences inside; when you need to show commands, transcripts, diffs, or code, present them as indented blocks within that single fence. Use indentation for clarity rather than code fences inside an ExecPlan to avoid prematurely closing the ExecPlan's code fence. Use two newlines after every heading, use # and ## and so on, and correct syntax for ordered and unordered lists.

When writing an ExecPlan to a Markdown (.md) file where the content of the file *is only* the single ExecPlan, you should omit the triple backticks. The default on-disk location for such files is `plans/NN-short-descriptive-name.md`, using the next available two-digit prefix to preserve plan order.

Write in plain prose. Prefer sentences over lists. Avoid checklists, tables, and long enumerations unless brevity would obscure meaning. Checklists are permitted only in the `Progress` section, where they are mandatory. Narrative sections must remain prose-first.

## Guidelines

Self-containment and plain language are paramount. If you introduce a phrase that is not ordinary English ("daemon", "middleware", "RPC gateway", "filter graph"), define it immediately and remind the reader how it manifests in this repository (for example, by naming the files or commands where it appears). Do not say "as defined previously" or "according to the architecture doc." Include the needed explanation here, even if you repeat yourself. You may use `PRODUCT.md`, `ROADMAP.md`, `CODESTYLE.md`, `DESIGN.md`, `ARCHITECTURE.md`, and other relevant root-level `ALLCAPS.md` files as source material, but the ExecPlan must restate the relevant facts rather than making the reader switch documents.

Avoid common failure modes. Do not rely on undefined jargon. Do not describe "the letter of a feature" so narrowly that the resulting code compiles but does nothing meaningful. Do not outsource key decisions to the reader. When ambiguity exists, resolve it in the plan itself and explain why you chose that path. Err on the side of over-explaining user-visible effects and under-specifying incidental implementation details.

Anchor the plan with observable outcomes. State what the user can do after implementation, the commands to run, and the outputs they should see. Acceptance should be phrased as behavior a human can verify ("after starting the server, navigating to [http://localhost:8080/health](http://localhost:8080/health) returns HTTP 200 with body OK") rather than internal attributes ("added a HealthCheck struct"). If a change is internal, explain how its impact can still be demonstrated (for example, by running tests that fail before and pass after, and by showing a scenario that uses the new behavior).

Specify repository context explicitly. Name files with full repository-relative paths, name functions and modules precisely, and describe where new files should be created. If touching multiple areas, include a short orientation paragraph that explains how those parts fit together so a novice can navigate confidently. If `PRODUCT.md`, `ROADMAP.md`, `CODESTYLE.md`, `DESIGN.md`, `ARCHITECTURE.md`, or another root-level `ALLCAPS.md` file is relevant, name those files explicitly and summarize the parts of them that constrain the work. When running commands, show the working directory and exact command line. When outcomes depend on environment, state the assumptions and provide alternatives when reasonable.

Be idempotent and safe. Write the steps so they can be run multiple times without causing damage or drift. If a step can fail halfway, include how to retry or adapt. If a migration or destructive operation is necessary, spell out backups or safe fallbacks. Prefer additive, testable changes that can be validated as you go.

Validation is not optional. Include instructions to run tests, to start the system if applicable, and to observe it doing something useful. Describe comprehensive testing for any new features or capabilities. Include expected outputs and error messages so a novice can tell success from failure. Where possible, show how to prove that the change is effective beyond compilation (for example, through a small end-to-end scenario, a CLI invocation, or an HTTP request/response transcript). State the exact test commands appropriate to the project’s toolchain and how to interpret their results.

For any ExecPlan that affects frontend presentation, validation must include visual review. Start the app, use `agent-browser` to capture baseline screenshots and videos before making UI-affecting changes, then capture matching after screenshots and videos once the plan is implemented. These captures must appear as concrete execution steps in the plan: the before step comes before implementation edits, and the after step comes after implementation but before final acceptance. Cover multiple resolutions, including desktop and mobile, and name the exact viewport sizes or device presets in the plan. Save screenshots under `plans/<name-of-plan>/screenshots/` as `before-implementation-1.<extension>`, `before-implementation-2.<extension>`, `after-implementation-1.<extension>`, and so on; use the same numbering to pair comparable before and after views. Compare the before-and-after evidence directly. Then run the professional UI/UX review pass required by `DESIGN.md`, checking the result for clear hierarchy, responsive behavior, accessible interaction states, polished spacing and typography, practical workflow ergonomics, and broken or confusing states. The plan must say what regressions were found, what fixes or quality-of-life improvements were made as a result, what professional UX concerns remain out of scope, and why those concerns were deferred. If no runnable visual target exists, the plan must state why screenshots or videos cannot be captured and what alternative proof is sufficient.

Documentation changes that are part of the feature are also subject to validation. If the ExecPlan includes updates to `PRODUCT.md`, `ROADMAP.md`, `CODESTYLE.md`, `DESIGN.md`, `ARCHITECTURE.md`, or another in-scope root-level `ALLCAPS.md` file, specify what a reviewer should check to confirm those files match the implemented behavior and remain consistent with the code layout and user-visible result.

Capture evidence. When your steps produce terminal output, short diffs, logs, screenshots, or recordings, include the artifact paths and concise interpretation inside the single fenced block as indented examples. Keep them focused on what proves success. If you need to include a patch, prefer file-scoped diffs or small excerpts that a reader can recreate by following your instructions rather than pasting large blobs.

## Milestones

Milestones are narrative, not bureaucracy. If you break the work into milestones, introduce each with a brief paragraph that describes the scope, what will exist at the end of the milestone that did not exist before, the commands to run, and the acceptance you expect to observe. Keep it readable as a story: goal, work, result, proof. Progress and milestones are distinct: milestones tell the story, progress tracks granular work. Both must exist. Never abbreviate a milestone merely for the sake of brevity, do not leave out details that could be crucial to a future implementation.

Each milestone must be independently verifiable and incrementally implement the overall goal of the execution plan.

## Living plans and design decisions

* ExecPlans are living documents. As you make key design decisions, update the plan to record both the decision and the thinking behind it. Record all decisions in the `Decision Log` section.
* ExecPlans must contain and maintain a `Progress` section, a `Surprises & Discoveries` section, a `Decision Log`, and an `Outcomes & Retrospective` section. These are not optional.
* When you discover optimizer behavior, performance tradeoffs, unexpected bugs, or inverse/unapply semantics that shaped your approach, capture those observations in the `Surprises & Discoveries` section with short evidence snippets (test output is ideal).
* If you change course mid-implementation, document why in the `Decision Log` and reflect the implications in `Progress`. Plans are guides for the next contributor as much as checklists for you.
* At completion of a major task or the full plan, write an `Outcomes & Retrospective` entry summarizing what was achieved, what remains, and lessons learned.

# Prototyping milestones and parallel implementations

It is acceptable—-and often encouraged—-to include explicit prototyping milestones when they de-risk a larger change. Examples: adding a low-level operator to a dependency to validate feasibility, or exploring two composition orders while measuring optimizer effects. Keep prototypes additive and testable. Clearly label the scope as “prototyping”; describe how to run and observe results; and state the criteria for promoting or discarding the prototype.

Prefer additive code changes followed by subtractions that keep tests passing. Parallel implementations (e.g., keeping an adapter alongside an older path during migration) are fine when they reduce risk or enable tests to continue passing during a large migration. Describe how to validate both paths and how to retire one safely with tests. When working with multiple new libraries or feature areas, consider creating spikes that evaluate the feasibility of these features _independently_ of one another, proving that the external library performs as expected and implements the features we need in isolation.

## Skeleton of a Good ExecPlan

    # <Short, action-oriented description>

    This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

    If PLANS.md file is checked into the repo, reference the path to that file here from the repository root and note that this document must be maintained in accordance with PLANS.md.

    Save this file at `plans/NN-short-descriptive-name.md` in the repository root. Use the next available two-digit prefix so the filename preserves the order in which plans were created, and use a short kebab-case description after the prefix.

    ## Purpose / Big Picture

    Explain in a few sentences what someone gains after this change and how they can see it working. State the user-visible behavior you will enable.

    ## Progress

    Use a list with checkboxes to summarize granular steps. Every stopping point must be documented here, even if it requires splitting a partially completed task into two (“done” vs. “remaining”). This section must always reflect the actual current state of the work.

    - [x] (2025-10-01 13:00Z) Example completed step.
    - [ ] Example incomplete step.
    - [ ] Example partially completed step (completed: X; remaining: Y).

    When visual evidence applies, include explicit entries for capturing the before screenshots before implementation, capturing the matching after screenshots after implementation, and comparing them during the UI/UX review.

    Use timestamps to measure rates of progress.

    ## Surprises & Discoveries

    Document unexpected behaviors, bugs, optimizations, or insights discovered during implementation. Provide concise evidence.

    - Observation: …
      Evidence: …

    ## Decision Log

    Record every decision made while working on the plan in the format:

    - Decision: …
      Rationale: …
      Date/Author: …

    ## Outcomes & Retrospective

    Summarize outcomes, gaps, and lessons learned at major milestones or at completion. Compare the result against the original purpose.

    ## Context and Orientation

    Describe the current state relevant to this task as if the reader knows nothing. Name the key files and modules by full path. Define any non-obvious term you will use. Do not refer to prior plans. If `PRODUCT.md`, `ROADMAP.md`, `CODESTYLE.md`, `DESIGN.md`, `ARCHITECTURE.md`, or another root-level `ALLCAPS.md` file constrains this work, summarize the relevant guidance here and cite their repository-relative paths.

    ## Plan of Work

    Describe, in prose, the sequence of edits and additions. For each edit, name the file and location (function, module) and what to insert or change. Keep it concrete and minimal. If the work changes current product behavior, future product direction, source conventions, stable design language, durable architecture, or any other documented root-level project constraint, include the edits to the corresponding `ALLCAPS.md` files as first-class steps, not optional follow-up notes.

    ## Concrete Steps

    State the exact commands to run and where to run them (working directory). When a command generates output, show a short expected transcript so the reader can compare. This section must be updated as work proceeds. For any plan that can affect frontend presentation, include the before screenshot commands before implementation edits and the after screenshot commands after implementation but before final acceptance.

    ## Validation and Acceptance

    Describe how to start or exercise the system and what to observe. Phrase acceptance as behavior, with specific inputs and outputs. If tests are involved, say "run <project’s test command> and expect <N> passed; the new test <name> fails before the change and passes after>". If `PRODUCT.md`, `ROADMAP.md`, `CODESTYLE.md`, `DESIGN.md`, `ARCHITECTURE.md`, or another root-level `ALLCAPS.md` file is in scope, include acceptance criteria for those files as well.

    ## Visual Evidence

    If this plan can affect frontend presentation, describe the exact before-and-after screenshot and video recording workflow and make sure the same captures also appear as explicit steps in `Progress` and `Concrete Steps`. State the app URL or file to open, the `agent-browser` commands or device presets to use, the desktop and mobile viewport sizes to cover, and how the final evidence will be compared for regressions, fixes, quality-of-life improvements, and the professional UI/UX review pass defined in `DESIGN.md`. Save screenshots under `plans/<name-of-plan>/screenshots/` using names such as `before-implementation-1.png` and `after-implementation-1.png`, where `<name-of-plan>` is this ExecPlan file's name without `.md`. Save videos under `plans/<name-of-plan>/recordings/` with comparable before/after names. If visual evidence is not applicable, explain why.

    ## Idempotence and Recovery

    If steps can be repeated safely, say so. If a step is risky, provide a safe retry or rollback path. Keep the environment clean after completion.

    ## Artifacts and Notes

    Include the most important transcripts, diffs, or snippets as indented examples. Keep them concise and focused on what proves success.

    ## Interfaces and Dependencies

    Be prescriptive. Name the libraries, modules, and services to use and why. Specify the types, traits/interfaces, and function signatures that must exist at the end of the milestone. Prefer stable names and paths such as `crate::module::function` or `package.submodule.Interface`. E.g.:

    In crates/foo/planner.rs, define:

        pub trait Planner {
            fn plan(&self, observed: &Observed) -> Vec<Action>;
        }

If you follow the guidance above, a single, stateless agent -- or a human novice -- can read your ExecPlan from top to bottom and produce a working, observable result. That is the bar: SELF-CONTAINED, SELF-SUFFICIENT, NOVICE-GUIDING, OUTCOME-FOCUSED.

When you revise a plan, you must ensure your changes are comprehensively reflected across all sections, including the living document sections, and you must write a note at the bottom of the plan describing the change and the reason why. ExecPlans must describe not just the what but the why for almost everything.
