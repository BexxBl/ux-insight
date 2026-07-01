# Architecture — UX Insight

## Overview

UX Insight is built on a single architectural rule: **the report is data, not a document**.

A `report.json` file is the complete, self-contained representation of a UX audit. Renderers are consumers of that data. No renderer owns the data model, and no data model depends on a renderer.

```
report.json  ──→  Angular viewer  (this repo, primary renderer)
             ──→  Markdown        (scripts/generate_markdown.py)
             ──→  Static HTML     (planned, v0.3)
             ──→  PDF             (planned, v0.5)
```

---

## JSON-First Architecture

### The contract

`schemas/ux-report/v1.0.0.json` is the authoritative JSON Schema for all reports. It defines every field, type, enum, and required constraint. The schema is versioned independently of any renderer.

Schema evolution rules:
- **Additive changes** (new optional fields, new enum values) → minor version bump (`v1.0.0` → `v1.1.0`).
- **Breaking changes** (removed fields, renamed keys, tightened required sets) → major version bump (`v1.0.0` → `v2.0.0`).
- Renderers branch on the **major** version only. A renderer that supports `v1.x.x` does not need updating for `v1.1.0`.
- Published schema versions are **immutable**. A fix that would require a breaking change produces a new major version.

### The report document

`reports/<target>/v<n>/report.json` is the source of truth for one audit revision. The directory structure supports multiple reports per target and multiple revisions per report, side by side — this is the mechanism for history and diffing.

`report.md` (where present) is a generated artifact. It is never hand-edited.

### CI validation

`.github/workflows/validate.yml` runs `scripts/validate.py` on every push. A commit that introduces an invalid `report.json` fails CI.

---

## Report Schema Structure

A report has four conceptual layers:

| Layer | Fields | Purpose |
|---|---|---|
| Identity | `schemaVersion`, `reportId`, `reportType`, `status`, `locale` | What this document is and its lifecycle state |
| Context | `client`, `target`, `meta`, `branding`, `i18n` | Who commissioned it, what was audited, when and how |
| Narrative | `summary`, `strengths`, `quickWins`, `recommendationsRoadmap` | Human-readable conclusions and strategic guidance |
| Evidence | `scoring`, `findings`, `attachments`, `tags` | Quantified data, per-finding detail, and report-level media |

### Scoring mechanics

```
overall = round( Σ(score_i × weight_i) / Σ(weight_i) )
```

`scale.bands` in the report map score ranges to display labels and color tokens. Renderers resolve a band from the score; they do not hardcode thresholds.

### Findings

Each finding is self-contained. The minimum viable finding requires only `problem` and `recommendation`, but a complete finding also provides:

- Four independent rating axes: `severity`, `businessImpact`, `effort`, `confidence`
- Structured `evidence`: code locations (`file`, `lines`, `selector`) and measurements (`value`, `threshold`, `passes`)
- Optional `media`: screenshot URLs with `alt` text and `placeholder` support
- WCAG references and remediation hints where applicable
- `isOpportunity: true` for proactive enhancements that are not defects

---

## Angular Renderer

### Stack

| Concern | Technology |
|---|---|
| Framework | Angular 22, standalone components |
| State | Angular Signals |
| Styling | SCSS + CSS custom properties (design tokens) |
| Utilities | Tailwind CSS v4 (layout utilities only) |
| Icons | Phosphor Icons |
| Language | TypeScript 6, strict mode |
| Linting | ESLint + angular-eslint + typescript-eslint |
| Formatting | Prettier |
| Testing | Vitest |
| Bundler | Angular CLI / esbuild |

### Key architectural decisions

**Signals over RxJS for local state.** `ReportService` exposes `report`, `isLoading`, and `error` as Angular signals. Derived values (filtered findings, active category) will be computed signals. RxJS is reserved for HTTP and async coordination.

**Standalone components only.** No NgModules. Every component declares its own imports.

**CSS custom properties as the design contract.** No raw color values appear in component SCSS. All visual decisions reference tokens defined in `src/styles.scss`. This makes light/dark theming a single attribute change on `<html>`.

**Static JSON loading.** Reports are fetched as static assets via `HttpClient`. No API server, no database.

### Application structure

```
app/src/
├── main.ts                   # Bootstrap
├── styles.scss               # Global design tokens (CSS custom properties)
├── index.html
└── app/
    ├── app.ts                # Root component
    ├── app.routes.ts         # Router configuration
    ├── app.config.ts         # Application providers
    ├── models/
    │   └── report.model.ts   # TypeScript types mirroring the JSON schema
    ├── services/
    │   └── report.service.ts # Signal-based report loading
    └── shared/
        └── design-tokens.ts  # CSS token name constants for TypeScript
```

---

## Design System

The design system is token-based. All values are defined as CSS custom properties in `src/styles.scss` and documented in `docs/design-system.md`.

### Theme switching

The light theme is the default (`:root`). Dark mode activates via `[data-theme="dark"]` on the `<html>` element. Only color and shadow tokens change between themes; spacing, radius, and typography are shared.

### Token categories

- **Color:** background layers, text hierarchy, borders, brand, feedback states, severity levels
- **Severity:** `critical`, `high`, `medium`, `low` — each with a foreground and a subtle background token, mapping 1:1 to `finding.severity` enum values in the schema
- **Spacing:** 4 px base grid, `--space-1` through `--space-16`
- **Radius:** `sm` / `md` / `lg` / `xl` / `full`
- **Shadow:** three elevation levels
- **Typography:** font families, type scale, weights, line heights
- **Motion:** `--transition-fast` and `--transition-normal`, both nulled under `prefers-reduced-motion`

---

## Future Renderers

### Static HTML renderer (v0.3)

A self-contained HTML file that fetches a `report.json` from the same directory and renders the report with vanilla JavaScript and the same CSS token layer. No build step required. Serves as the print/PDF bridge.

### PDF renderer (v0.5)

A headless-browser export of the static HTML renderer, consuming the same token layer with a print-optimised stylesheet. White-label branding comes from the `branding` block already present in every report.

### Shared principles for future renderers

- Every renderer reads the same `report.json`. No ETL, no transformation step.
- Every renderer branches on the schema **major** version.
- Design tokens are defined in the source closest to the renderer (CSS for HTML/Angular, design token JSON for other targets). Values must be consistent across renderers.

---

## Repository Structure

```
ux-insight/
├── schemas/
│   └── ux-report/
│       └── v1.0.0.json           # JSON Schema (the contract — immutable once published)
├── reports/
│   ├── _template/                # Skeleton for new audits
│   └── <target>/
│       └── v<n>/
│           ├── report.json       # Source of truth
│           └── report.md         # Generated artifact
├── scripts/
│   ├── validate.py               # Validate report.json against its schema version
│   └── generate_markdown.py      # Render report.json → Markdown
├── app/                          # Angular renderer
│   └── src/
│       ├── styles.scss           # Global design tokens
│       └── app/
│           ├── models/           # TypeScript types
│           ├── services/         # Data loading
│           └── shared/           # Reusable utilities and token constants
├── docs/
│   ├── schema-guide.md           # Field-by-field authoring guide
│   ├── design-system.md          # Design token reference
│   ├── ARCHITECTURE.md           # This file
│   └── PRODUCT_PRINCIPLES.md     # Product decision framework
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── workflows/
│       ├── validate.yml          # Schema validation CI
│       ├── ci.yml                # Build and lint CI
│       └── pages.yml             # GitHub Pages deployment
├── VISION.md
├── ROADMAP.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── CLAUDE.md
└── VERSION
```
