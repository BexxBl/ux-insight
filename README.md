# UX Insight

**A JSON-first UX reporting platform.** UX Insight turns structured audit data into professional, multi-format UX reports. The report *is* data — a single versioned JSON document — and any renderer (HTML, Angular, PDF) consumes that same document without transformation.

> Status: **v0.1 — schema & data foundation.** No frontend or backend yet. This phase deliberately invests in a clean, extensible data model.

---

## Why JSON-first?

Most UX reports are write-once artifacts (a PDF, a slide deck) that can't be searched, compared, re-themed, or re-rendered. UX Insight separates **content** (the findings) from **presentation** (how they're shown). The benefits compound:

- **One source, many outputs.** The same `report.json` becomes Markdown today and an interactive dashboard or branded PDF tomorrow.
- **Comparable over time.** Reports for the same target link to their predecessor, enabling trend lines and remediation tracking.
- **Reproducible scores.** Category weights ship inside the report, so the overall score is explainable, not magic.
- **Honest by design.** Every finding carries a `confidence` level and the report declares its `methodology.limitations` — what could *not* be verified.

---

## Repository structure

```
ux-insight/
├── schemas/
│   └── ux-report/
│       └── v1.0.0.json          # Versioned, frontend-agnostic JSON Schema (the contract)
├── reports/
│   ├── _template/               # Starter report skeleton (copy to begin a new audit)
│   └── <target>/
│       └── v<n>/
│           ├── report.json      # Schema-compliant report data (source of truth)
│           └── report.md        # Generated, client-ready Markdown (build artifact)
├── scripts/
│   ├── validate.py              # Validate any report.json against its schema version
│   └── generate_markdown.py     # Render report.json → Markdown (proves frontend-agnosticism)
├── docs/
│   └── schema-guide.md          # Field-by-field guide and authoring conventions
└── .github/
    ├── ISSUE_TEMPLATE/
    └── workflows/validate.yml    # CI: every report must validate against the schema
```

### Conventions

- **`schemas/` is the contract.** Schema files are immutable once published. Additive changes → new minor (`v1.1.0`); breaking changes → new major (`v2.0.0`). Renderers branch on the major version.
- **`reports/<target>/v<n>/`** keeps every revision of a report side by side, which is what powers history/diffing later.
- **`report.json` is the source of truth; `report.md` is generated.** Never hand-edit the Markdown — re-run the generator.

---

## Quick start (current phase)

```bash
# Validate a report against the schema
python3 scripts/validate.py reports/rebeccablischke-de/v1/report.json

# Regenerate the Markdown report from data
python3 scripts/generate_markdown.py reports/rebeccablischke-de/v1/report.json > reports/rebeccablischke-de/v1/report.md
```

Requirements: Python 3.10+ and `jsonschema` (`pip install jsonschema`).

---

## The data model in one minute

A report has four conceptual layers:

1. **Identity & context** — `client`, `target`, `meta` (who, what, when, how). `client` and `target` are separate so one client can own many targets and many reports over time.
2. **Narrative** — `summary` (with an `aiGenerated` flag so AI summaries are auditable).
3. **Quantitative** — `scoring` with weighted, named `categories` and configurable `scale.bands` that drive badge colors without renderer hardcoding.
4. **Actionable** — `findings` (self-contained, evidence-backed), plus curated `strengths`, `quickWins` and a `recommendationsRoadmap`.

Every finding records **severity**, **businessImpact**, **effort** and **confidence** independently, carries structured `evidence` (code locations + measurements), optional `media` (screenshots, with `placeholder` support before images exist), and WCAG references where applicable.

See [`docs/schema-guide.md`](docs/schema-guide.md) for the full field reference.

---

## Planned tech stack (future phases)

The schema is intentionally independent of all of this:

- **Frontend:** Angular 20 · standalone components · signals · TypeScript · SCSS
- **Charts:** Apache ECharts
- **Icons:** Phosphor Icons
- **Styling:** CSS variables · light/dark theme · responsive · glassmorphism where appropriate
- **Data:** static JSON first

---

## License

TBD (intended to become open source).
