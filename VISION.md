# Vision — UX Insight

## What it is

UX Insight is a JSON-first UX reporting platform. A UX audit lives as a single, versioned JSON document — the _report_ — and any renderer (Angular app, static HTML, PDF, Markdown) consumes that same document without transformation.

The separation of **content** (the findings, scores, and evidence) from **presentation** (how they are rendered) is the foundational design decision that everything else follows from.

## Why it exists

Most UX audit reports are write-once artifacts: a PDF, a slide deck, or a Notion page. They cannot be searched, compared across time, re-themed for different clients, or consumed by tools. When a finding is fixed, there is no structured way to mark it resolved. When a second audit is run on the same product, there is no reliable way to detect regressions or improvements.

UX Insight treats the audit as _data first_. This unlocks things that document-based reporting cannot do:

- **One source, many outputs.** The same `report.json` renders as Markdown today and an interactive dashboard or a branded PDF tomorrow.
- **Comparable over time.** Every report links to its predecessor via `meta.previousReportId`, enabling score trend lines and remediation tracking without rebuilding anything.
- **Reproducible scores.** Category weights are embedded in the report, so the overall score is re-derivable from the data. It is never a black box.
- **Honest by construction.** Every finding carries a `confidence` level. The report declares what could not be verified in `meta.methodology.limitations`.

## Long-term vision

UX Insight aims to become the standard open data format for UX audits — a format that:

- Any auditor can author with a text editor or a structured form.
- Any renderer can consume without a proprietary API or vendor lock-in.
- Accumulates history across audit rounds, making quality trends as readable as code coverage over time.
- Integrates with AI assistance (summary generation, finding explanation, ticket drafting) while keeping the human auditor in full control.
- Supports multiple report types (UX, Accessibility, CRO, Design System Review, Mobile) from a shared schema family.

The Angular application is the first renderer, not the last.

## Core values

**Honesty.** Scores must be explainable from the underlying data. Confidence levels are mandatory, not optional. AI-generated content is always labelled.

**Portability.** The schema is the only dependency. A report is valid JSON — no proprietary runtime, no cloud account required to read it.

**Accessibility.** Findings about accessibility must be presented accessibly. The renderer meets WCAG AA as a baseline.

**Calm clarity.** Reports present hard information without visual noise. Readability takes priority over decoration.

**Extensibility over rigidity.** The schema evolves additively. Renderers are independent of each other. New output formats require no schema changes.

## What UX Insight is not

- **Not a research or testing tool.** It records findings; it does not run usability tests, heatmaps, or surveys.
- **Not a project management system.** Finding statuses exist for audit tracking, not as a substitute for a proper issue tracker.
- **Not a hosted service.** The architecture is deliberately static-first. There is no backend, no database, no authentication layer planned in the core.
- **Not a design tool.** It documents and scores existing interfaces; it does not create or prototype them.
- **Not a report generator that writes findings for you.** AI assistance is a layer on top of a human audit, not a replacement for one.
