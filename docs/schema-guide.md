# Schema Guide — `ux-report` v1.0.0

This guide explains how to author a valid, high-quality `report.json` and the reasoning behind the model. The schema file itself (`schemas/ux-report/v1.0.0.json`) is the authoritative contract; this document is the human-friendly companion.

## Design principles

1. **Semantic, not presentational.** Fields describe *meaning* (`severity`, `businessImpact`), never layout (`color`, `columnWidth`). Renderers decide presentation.
2. **Self-contained findings.** Each finding holds everything needed to display and act on it. No cross-lookups required to render one.
3. **Additive evolution.** New optional fields and new enum values are minor versions. Removing/renaming fields or tightening required-sets are major versions.
4. **Honest by construction.** `confidence` per finding and `meta.methodology.limitations` make the report defensible. Don't claim what you didn't verify.
5. **Denormalize for convenience, keep one source of truth.** Some fields are duplicated for renderer ease (e.g. `finding.categoryLabel`), but the canonical link is always the key (`finding.categoryKey` → `scoring.categories[].key`).

## Top-level anatomy

| Block | Purpose |
|---|---|
| `schemaVersion` | Which contract this document follows. Renderers branch on the major. |
| `reportId` / `reportType` / `status` / `locale` | Identity and lifecycle. `reportType` reserves future families (accessibility, CRO, …). |
| `client` vs `target` | **Client** = who it's for; **target** = what was audited. Separated for multi-client, multi-target scale. |
| `branding` / `theme` / `i18n` | Presentation hints and localization overlay. All optional; renderers fall back to defaults. |
| `meta` | Provenance + methodology. `previousReportId` enables history; `limitations` set the honesty bar. |
| `summary` | Executive narrative. `aiGenerated` flag keeps AI output auditable. |
| `scoring` | Weighted, named categories + configurable bands. Overall is reproducible from weights. |
| `strengths` / `quickWins` / `recommendationsRoadmap` | Positive findings, curated low-effort actions, strategic horizons. |
| `findings` | The core. Evidence-backed, rated on four independent axes. |
| `attachments` / `tags` | Report-level media and free-form labels. |

## The four rating axes (keep them independent)

A finding is rated on four axes that must not be conflated:

- **`severity`** — how badly it hurts the *user* (`critical`/`high`/`medium`/`low`).
- **`businessImpact`** — what it costs the *business* (`high`/`medium`/`low`).
- **`effort`** — how expensive the fix is (`low`/`medium`/`high`).
- **`confidence`** — how sure we are it's real, given the methodology (`high`/`medium`/`low`).

A typo in a headline can be low severity but high business impact. A suspected performance issue can be high severity but low confidence until measured. Keeping them separate is what lets a renderer build an effort/impact matrix or a confidence filter.

### Confidence calibration

| Level | Use when |
|---|---|
| `high` | Verified directly in source code or by a test you ran. |
| `medium` | Strongly inferable from visible structure, but not executed/measured. |
| `low` | Plausible, but needs runtime data, analytics, or user testing to confirm. State this in the finding. |

## Scoring mechanics

`scoring.overall` SHOULD equal the weighted mean of category scores:

```
overall = round( Σ(score_i × weight_i) / Σ(weight_i) )
```

Store it explicitly anyway, so PDF/HTML renderers don't recompute (and so a deliberate manual override is possible and visible). `scale.bands` map score ranges to a label + color token; renderers resolve a band rather than hardcoding thresholds. `categories[].previousScore` (from the linked previous report) powers trend arrows.

## Findings: evidence is mandatory in spirit

The schema only *requires* `problem` and `recommendation`, but a premium report always fills `evidence`:

- **`evidence.locations`** — point at the exact `file` + `lines` (or `selector`). This is what lets a future UI deep-link to the offending code.
- **`evidence.measurements`** — quantified facts with `threshold` + `passes`. Structured so charts can read them (e.g. contrast ratios).

## Media & screenshots

`media` items are URL-based so the storage backend is swappable. Set `placeholder: true` to author a finding before the screenshot exists — renderers show a labelled slot. Always provide `alt` for captured images.

## Opportunities, not just defects

Set `finding.isOpportunity: true` for proactive enhancements (delight/clarity/trust) that aren't defects. This lets the UI present a separate "Opportunities" lane, signalling that the audit looks forward, not only at what's broken.

## Authoring checklist

- [ ] `schemaVersion` matches the schema file you validated against
- [ ] Every `finding.categoryKey` exists in `scoring.categories`
- [ ] `scoring.overall` equals the weighted mean (or the override is intentional)
- [ ] Every `quickWins.findingId` / `recommendationsRoadmap.relatedFindingIds` resolves to a real finding
- [ ] Each finding has all four axes set and non-empty `evidence`
- [ ] `meta.methodology.limitations` honestly lists what wasn't verified
- [ ] AI-written `summary` has `aiGenerated: true` + `aiModel`
- [ ] `validate.py` passes
