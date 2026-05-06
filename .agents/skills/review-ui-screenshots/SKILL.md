---
name: review-ui-screenshots
description: Use after capturing browser, Electron, rendered documentation, game, canvas, or app screenshots for UI-affecting work. Performs a deliberate screenshot-by-screenshot UX inspection so visible regressions such as overlapping labels, clipped buttons, broken responsive layouts, unreadable text, weak hierarchy, and inaccessible interaction states are caught before the work is called complete.
---

# Review UI Screenshots

Use this skill after UI-affecting work has screenshots, recordings, or other
visual evidence to inspect. Capture evidence with the repo-local
`agent-browser` guidance first when a browser or Electron target exists. This
skill is for the review pass: it makes the inspection slow, sectional, and
explicit enough to catch issues that a quick glance can miss.

## Workflow

1. Gather the evidence paths before reviewing.
   - Include every before and after screenshot for the plan.
   - Include recordings when the UI changes through interaction, animation, or
     multiple states.
   - Include all relevant viewports: desktop, mobile, and any tablet or narrow
     desktop size where layout behavior changes.

2. Inspect each screenshot one section at a time.
   - Start at the top-left and move across the image before moving down.
   - Review headers, navigation, sidebars, panels, cards, forms, modals,
     dropdowns, overlays, canvas HUDs, dense control groups, tables, footers,
     and empty space.
   - Zoom mentally into each dense area instead of judging the whole screenshot
     at once. The goal is to catch local problems inside panels and controls.

3. Check interaction states and data-driven states.
   - Exercise controls that can change labels, selected options, button groups,
     dropdown contents, tabs, segmented controls, filters, sorting, form
     validation, hover states, focus states, disabled states, and error states.
   - For games or canvas apps, inspect built HUD panels, selected-object panels,
     action menus, status banners, and any text drawn inside the canvas.
   - If the state is realistic but easy to miss, capture another screenshot
     rather than relying on memory.

4. Look for concrete UX defects.
   - Text overlapping other text, buttons, icons, canvas content, or panel
     borders.
   - Text clipped, truncated without a tooltip or expansion path, wrapped
     awkwardly, or too small to read.
   - Buttons, inputs, or selectable controls whose labels do not fit.
   - Crowded spacing, inconsistent alignment, unclear grouping, or weak visual
     hierarchy.
   - Missing labels, duplicated labels, stale labels, unclear selected states,
     or controls with no visible feedback.
   - Poor contrast, tiny touch targets, missing focus visibility, keyboard-hostile
     flows, or disabled/error states that are hard to distinguish.
   - Responsive breakage: stacked controls colliding, side panels covering core
     content, content disappearing, or horizontal overflow.

5. Compare before and after evidence directly.
   - Identify intended improvements.
   - Identify regressions, even if they are outside the exact code touched.
   - Fix in-scope issues immediately.
   - Record any issue that needs a separate product, design, or technical
     decision before it can be fixed.

6. Leave a concise review note.
   - Name the screenshots and recordings inspected.
   - Name the viewports and interaction states covered.
   - List defects found and whether they were fixed or deferred.
   - If no defects were found, say that the review inspected each screenshot
     section-by-section and found no visible regressions.

## Review Note Template

Use a short note like this in the final response or in the ExecPlan outcomes:

```text
Screenshot UX Review:
- Evidence reviewed: plans/<plan>/screenshots/after-implementation-1.png, ...
- Viewports/states: desktop selected-item panel, mobile navigation drawer, ...
- Findings: ...
- Fixes made: ...
- Deferred: ...
```

## Stop Conditions

Do not call UI-affecting work complete while any screenshot has an unexplained
overlap, clipped control, unreadable label, broken responsive layout, or hidden
primary workflow control. Either fix the problem or record why it needs a
separate decision.
