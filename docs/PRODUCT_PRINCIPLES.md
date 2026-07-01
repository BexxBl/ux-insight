# Product Principles — UX Insight

These principles guide every decision about what to build, what to defer, and how to present information. When facing a tradeoff, return to these.

---

## 1. Data First

The report JSON is the single source of truth. No information is invented by the renderer, and no information lives only in the UI layer.

In practice:
- Every rendered value maps to a schema field. If a field does not exist in the schema, do not display it.
- All score calculations are reproducible from the report data alone.
- Adding a new UI section requires the schema to already support the underlying data — not the other way around.

---

## 2. Accessibility by Default

An audit of a product's UX must itself be accessible. Accessibility is not a phase or a checklist item; it is a baseline requirement for every component.

In practice:
- Every interactive element has a meaningful label and a visible focus state.
- Color is never the sole carrier of information — severity, for example, uses both color and a text label.
- The design system targets WCAG 2.1 AA contrast ratios at minimum.
- Motion respects `prefers-reduced-motion`.
- Screen reader compatibility is verified for core flows, not assumed.

---

## 3. Calm Interfaces

Reports carry dense, sometimes difficult information. The UI must not add to the cognitive load.

In practice:
- Use whitespace, clear hierarchy, and restrained color to let the content breathe.
- Avoid decorative animation. Motion exists to orient the user (transitions between states), not to impress.
- No marketing language, modal interruptions, or notification badges in the viewer.
- The visual style is closer to Linear, GitHub, and Stripe than to BI dashboards.

---

## 4. Explainable Scores

A score that cannot be explained is not trusted. Every number displayed in the UI must be traceable back to the data that produced it.

In practice:
- The overall score is always the weighted mean of category scores, displayed with those weights visible.
- Score bands (colors, labels) come from the `scale.bands` block in the report — never from renderer constants.
- Finding severity, effort, impact, and confidence are displayed as independent dimensions, not collapsed into a single magic number.

---

## 5. Progressive Disclosure

Show the most important information first. Reveal detail on demand.

In practice:
- The report overview shows executive summary, overall score, and category breakdown — not every finding.
- Finding cards show title, severity, and recommendation. Full evidence, code locations, and media are behind an expand action or a detail route.
- Filtering and sorting are available but hidden until needed — they do not occupy primary visual space by default.

---

## 6. Extensibility

The schema and the renderer are independent contracts. New output formats, new report types, and new schema fields should not require rebuilding existing code.

In practice:
- Renderers branch on the schema major version, not on specific field names.
- New optional schema fields are additive — existing reports remain valid, existing renderers continue to work.
- The Angular app is one renderer. Static HTML and PDF renderers will share the same JSON input without Angular as a dependency.
- The `reportType` discriminator allows the same infrastructure to serve UX, Accessibility, CRO, and other audit families.

---

## 7. Simplicity over Features

A smaller, correct, well-documented feature set is worth more than a large, complex one that is partially implemented.

In practice:
- Every proposed feature must justify itself against the Data First principle. If it cannot be grounded in the schema, it is deferred.
- No feature flags, A/B experiments, or analytics in the core viewer.
- Dependencies are chosen deliberately. Each new package must earn its place.
- The build output is a static bundle. No server-side rendering, no edge functions, no runtime infrastructure.
