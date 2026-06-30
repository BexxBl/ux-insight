# Roadmap

UX Insight grows from a data contract outward. Each milestone is usable on its own; nothing later breaks the schema, because the schema already reserves space for it.

Legend: ✅ done · 🔄 doing · ⬜ planned

---

## v0.1 — Foundation (current)

The contract and the first real report. No UI.

- ✅ Versioned, frontend-agnostic JSON Schema (`schemas/ux-report/v1.0.0.json`)
- ✅ First complete report: `rebeccablischke.de` as schema-compliant `report.json`
- ✅ Schema-driven Markdown generator (`scripts/generate_markdown.py`)
- ✅ Validation script + CI workflow
- ✅ README, ROADMAP, schema guide, issue templates
- ⬜ Report template skeleton (`reports/_template/`)
- ⬜ Two more reports (verein, touristenlager) against the same schema

**Exit criteria:** any new `report.json` validates in CI and renders to Markdown with zero code changes.

---

## v0.2 — Authoring ergonomics

Make it pleasant to produce correct reports.

- ⬜ `scripts/new_report.py` — scaffold a new report from `_template` with ids pre-filled
- ⬜ Linter beyond JSON Schema: cross-field rules (every `finding.categoryKey` resolves; `overall` equals the weighted mean; `quickWins.findingId` exists)
- ⬜ TypeScript types generated from the schema (`json-schema-to-typescript`) for future Angular consumption
- ⬜ Severity/effort/impact enums exported as a shared constants module

---

## v0.3 — Static HTML renderer

First visual output, still no backend.

- ⬜ Standalone HTML renderer that fetches a `report.json` and renders the dashboard
- ⬜ Score cards, severity distribution, category radar (ECharts)
- ⬜ Light/dark theme via CSS variables; respects `theme` and `branding` fields
- ⬜ Print stylesheet as the bridge to PDF

---

## v0.4 — Angular application

The product UI.

- ⬜ Angular 20 standalone-component app, signals-based state
- ⬜ Router: report list → report detail → finding detail (deep-linkable)
- ⬜ ECharts components: radar, severity bars, effort/impact matrix
- ⬜ Phosphor icon set, glassmorphism surfaces where appropriate
- ⬜ Filter/sort findings by severity, category, effort, confidence, status

---

## v0.5 — Export & branding

- ⬜ PDF export (server-side or headless-browser) consuming the same JSON
- ⬜ White-label theming driven entirely by the `branding` block
- ⬜ Shareable read-only report links

---

## v0.6 — Localization

- ⬜ Activate the `i18n` overlay: render any report in multiple languages from one document
- ⬜ Locale switcher in the UI; fall back to `locale` when a translation is missing

---

## v0.7 — History & trends

- ⬜ Use `meta.previousReportId` + `categories[].previousScore` for trend arrows
- ⬜ Report-over-report diff view (new/resolved/changed findings via stable `finding.id`)
- ⬜ Remediation tracking via `finding.status`

---

## v0.8 — AI summaries

- ⬜ Generate `summary` from findings; persist `aiGenerated`, `aiModel`, `generatedAt`
- ⬜ "Explain this finding" and "draft a fix ticket" assists
- ⬜ Human-in-the-loop edit flow that flips `aiGenerated` to false on edit

---

## v1.0 — Platform

- ⬜ Multi-client workspace (the `client` block already supports it)
- ⬜ New report types using the `reportType` discriminator: Accessibility Audit, CRO Audit, Design System Review, Mobile Review
- ⬜ Reusable report templates per type
- ⬜ Component-based renderer that switches sections by `reportType`

---

## Non-goals (for now)

- Authentication / user management
- A hosted backend or database
- Real-time collaboration

These are deferred deliberately; the static-JSON-first approach keeps the foundation simple and portable until the data model has proven itself.
