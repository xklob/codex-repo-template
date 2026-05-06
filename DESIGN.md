# Design System: [Project Name]

Use this file as the visual source of truth for the project. Describe the design in natural language first, then back up that language with exact values where precision matters. Prefer semantic descriptions such as "deep muted teal for primary actions" over raw token dumps such as "blue-700".

If the product evolves, update this document when the visual language changes in a durable way. Do not try to catalog every one-off screen detail.

## 1. Visual Theme & Atmosphere

Summarize the product's visual personality in a few paragraphs.

Cover the following:
- The overall mood and tone.
- Whether the interface should feel dense, airy, editorial, playful, utilitarian, luxurious, technical, calm, etc.
- What should stand out first when a user lands on the product.
- What the interface should never feel like.

Prompting questions:
- What should a first-time user feel within five seconds?
- Is the product image-first, data-first, form-first, or workflow-first?
- Does the design rely on restraint, bold contrast, ornament, or motion?

## 2. Color Palette & Roles

List colors by descriptive name, exact value, and functional role.

### Foundation
- **[Color name]** (`#HEX`) - Primary page background. Use for ...
- **[Color name]** (`#HEX`) - Secondary surface. Use for ...

### Accent & Interactive
- **[Color name]** (`#HEX`) - Primary action color. Use for ...
- **[Color name]** (`#HEX`) - Secondary action or selected state. Use for ...

### Typography & Structure
- **[Color name]** (`#HEX`) - Primary text color. Use for ...
- **[Color name]** (`#HEX`) - Secondary text color. Use for ...
- **[Color name]** (`#HEX`) - Borders, dividers, and subtle structure. Use for ...

### Functional States
- **[Color name]** (`#HEX`) - Success states.
- **[Color name]** (`#HEX`) - Warning states.
- **[Color name]** (`#HEX`) - Error states.
- **[Color name]** (`#HEX`) - Informational states.

Guidance:
- Name colors by character and job, not only hue.
- Explain where each color belongs and where it should not be used.
- If gradients are part of the system, describe their direction, intensity, and purpose.

## 3. Typography Rules

Document the typography system in terms a designer or prompting agent can reuse.

Include:
- Primary font family and any secondary or monospace families.
- Tone of the typeface choices.
- Weight and size rules for display text, headings, body text, labels, captions, and buttons.
- Letter-spacing, line-height, and casing conventions.
- Any constraints, such as "never use all caps for body copy" or "numbers should align cleanly in tables".

Template:
- **Primary font family:** [Name]
- **Secondary font family:** [Name or "None"]
- **Display text:** [Weight, size range, spacing, intended use]
- **Headings:** [Weight, size range, spacing, intended use]
- **Body text:** [Weight, size, line-height, intended use]
- **Labels / metadata:** [Weight, size, casing, intended use]
- **Monospace / data text:** [If applicable]

## 4. Component Stylings

Describe recurring component patterns in human-readable, reusable terms.

### Buttons
- Shape:
- Primary style:
- Secondary style:
- Hover and pressed behavior:
- Focus treatment:
- Disabled treatment:

### Cards / Containers
- Corner treatment:
- Background treatment:
- Border and shadow strategy:
- Internal padding:
- When cards should feel flat vs. elevated:

### Inputs / Forms
- Input field background and border style:
- Label and helper text treatment:
- Validation state treatment:
- Touch target and spacing expectations:

### Navigation
- Top-level navigation pattern:
- Active state treatment:
- Mobile navigation behavior:

### Data Display or Domain-Specific Components

Add project-specific sections for the components that actually matter in this product, for example:
- Tables
- Charts
- Editors
- Sidebars
- Media galleries
- Search results
- Pricing cards
- Timelines

For each one, describe:
- Its job in the interface.
- Its visual hierarchy.
- Its default and interactive states.
- Any rules that should stay stable across screens.

## 5. Layout Principles

Explain the layout system at a high level.

Cover:
- Maximum content widths.
- Grid strategy.
- Spacing scale or base unit.
- Section-to-section rhythm.
- Mobile, tablet, and desktop behavior.
- How the design handles empty space.
- How visual emphasis should be distributed across a screen.

Template prompts:
- What is the default page frame and padding?
- How many columns does the layout typically use?
- What collapses or stacks first on smaller screens?
- Should pages feel centered, edge-to-edge, dashboard-like, editorial, or app-like?

## 6. Motion & Interaction Notes

Document only the motion and feedback patterns that are part of the design language.

Include:
- Transition style and duration ranges.
- Whether motion should feel crisp, soft, playful, or restrained.
- Loading, skeleton, and empty-state behavior.
- Rules for hover, focus, drag, selection, expansion, and page transitions.

If motion is intentionally minimal, say that explicitly.

## 7. Professional UI/UX Review Pass

Any ExecPlan that creates, changes, or can indirectly affect a browser UI,
Electron UI, rendered documentation surface, empty/loading/error state, layout,
copy, navigation, or frontend data presentation must include a final UI/UX
review pass before the work is called complete. This pass is not a casual visual
check. Judge the result against UX-professional-grade standards: the interface
should look intentional, support the user's real workflow, communicate hierarchy
clearly, behave predictably across states, and avoid rough edges that a product
designer or frontend lead would send back for revision.

The review must inspect screenshots or recordings captured after
implementation, and it should compare them to before evidence when the ExecPlan
changed an existing surface. The ExecPlan should make visual evidence capture
explicit by listing baseline screenshot capture before implementation,
matching after-implementation screenshot capture, and a screenshot UX review
using `.agents/skills/review-ui-screenshots/SKILL.md` before final acceptance
as separate execution steps. Cover desktop and mobile viewports, plus tablet or
narrow-desktop widths when layout behavior changes at intermediate sizes.
Inspect each screenshot section by section rather than judging the whole image
at a glance: headers, navigation, sidebars, dense panels, forms, buttons,
modals, tables, cards, canvas HUDs, selected-object menus, and footer regions
all need local attention. Look for interaction and presentation issues
including:

- unclear primary actions or weak visual hierarchy
- cramped, drifting, or inconsistent spacing
- text overflow, clipped controls, awkward wrapping, or illegible type
- inaccessible contrast, missing focus states, undersized touch targets, or
  keyboard-hostile flows
- confusing empty, loading, disabled, validation, and error states
- inconsistent component styling, icon use, copy tone, or affordances
- layout breakage at responsive boundaries
- unnecessary friction in the main workflow, including extra clicks, unclear
  recovery paths, or state changes that surprise the user

Make in-scope corrections immediately. If a remaining issue needs a product,
design, or technical decision outside the current ExecPlan, document it in the
ExecPlan's `Outcomes & Retrospective` section with the evidence path and the
reason it was deferred. The final review note should name the evidence paths,
viewports, interaction states, findings, fixes, and deferred concerns. If no
runnable visual target exists, state that the professional UI/UX pass is not
applicable and explain what validation replaced it.

## 8. Pre-Implementation UI Mockups

For substantial UI additions, UI refactors, major responsive/layout changes, or
new design directions, use `.agents/skills/ui-mockups/SKILL.md` during planning
before implementation begins. This workflow creates several Google
Stitch-backed mockup options under `plans/<plan-stem>/mockups/` so the user can
choose a direction before UI code is written.

When a supplied sample is available, treat it as a style reference by default.
The sample may be a local image or a local Google Stitch export bundle with PNG
and HTML/CSS artifacts. Copy approved samples into
`plans/<plan-stem>/mockups/reference/` only after confirming they contain no
secrets or restricted third-party material. Use the sample to preserve design
language: palette, typography, spacing rhythm, density, corner radius, shadows,
icon feel, and component treatment. Do not copy the sample's layout or content
unless the user explicitly requests that.

The selected mockup direction should be recorded in the ExecPlan before
implementation starts. This does not replace the professional UI/UX review pass
above. After implementation, still capture before/after screenshots and review
the rendered result with `.agents/skills/review-ui-screenshots/SKILL.md` when a
runnable visual target exists.

## 9. Prompting Notes

Capture short phrases that future contributors can reuse when asking an AI tool to extend the interface.

### Reusable Descriptions
- "[Short phrase that captures the atmosphere]"
- "[Short phrase that captures the button style]"
- "[Short phrase that captures the spacing approach]"

### Good Prompt Patterns
- "Create a [screen/component] that matches the existing [atmosphere] and uses [primary color name] for primary actions."
- "Keep the layout [descriptor] with [spacing descriptor] and [component descriptor]."

### Anti-Patterns
- Avoid:
- Avoid:
- Avoid:

## 10. Open Questions

Track unresolved design decisions that are stable enough to deserve visibility but not yet settled.

- [Question]
- [Question]
