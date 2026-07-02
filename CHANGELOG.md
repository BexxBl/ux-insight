# Changelog

All notable changes to UX Insight are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- Design system foundation: CSS custom property token layer in `app/src/styles.scss` with light and dark themes
- `app/src/app/shared/design-tokens.ts` — TypeScript constants for all token names
- `docs/design/DESIGN_SYSTEM.md` — full design token reference and usage rules
- `docs/ARCHITECTURE.md` — JSON-first architecture documentation
- `docs/PRODUCT_PRINCIPLES.md` — product decision framework
- `VISION.md` — project vision, long-term goals, and non-goals
- `CONTRIBUTING.md` — branch workflow, commit conventions, and coding style guide
- `CHANGELOG.md` — this file

---

## [0.1.0] — 2026-07-01

### Added
- Versioned JSON Schema for UX audit reports (`schemas/ux-report/v1.0.0.json`)
- First complete schema-compliant report: `reports/rebeccablischke-de/v1/report.json`
- Schema validation script: `scripts/validate.py`
- Markdown generation script: `scripts/generate_markdown.py`
- Report template skeleton: `reports/_template/`
- CI workflow for schema validation on every push (`.github/workflows/validate.yml`)
- CI workflow for Angular build and lint (`.github/workflows/ci.yml`)
- GitHub Pages deployment workflow (`.github/workflows/pages.yml`)
- Angular 22 application scaffold with standalone components and Signals (`app/`)
- Signal-based report loading service (`app/src/app/services/report.service.ts`)
- TypeScript types for the report model (`app/src/app/models/report.model.ts`)
- Tailwind CSS v4 integration
- ESLint + angular-eslint + Prettier code quality tooling
- Husky pre-commit hooks with lint-staged
- Commitlint with Conventional Commits configuration
- `docs/schema-guide.md` — field-by-field authoring guide
- `ROADMAP.md` — milestone plan from v0.1 to v1.0

---

[Unreleased]: https://github.com/BexxBl/ux-insight/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/BexxBl/ux-insight/releases/tag/v0.1.0
