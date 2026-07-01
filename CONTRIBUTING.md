# Contributing to UX Insight

Thank you for contributing. This document covers the workflow, conventions, and quality gates for all contributions.

---

## Branch Workflow

All work happens on feature branches. Direct commits to `main` are not allowed.

```
main          ← stable, always deployable
  └── feat/report-viewer-header
  └── fix/score-calculation
  └── chore/update-dependencies
  └── docs/architecture-overview
```

Branch naming follows the Conventional Commits prefix that the branch contains:

```
feat/<short-description>
fix/<short-description>
chore/<short-description>
docs/<short-description>
refactor/<short-description>
ci/<short-description>
```

Use hyphens, no underscores or slashes within the description segment.

Branches are never merged directly — always via a pull request after CI passes.

---

## Conventional Commits

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This is enforced by `commitlint` in the pre-commit hook.

### Format

```
<type>(<optional scope>): <short summary in imperative mood>

[optional body]

[optional footer(s)]
```

### Types

| Type | Use for |
|---|---|
| `feat` | A new feature or visible behaviour change |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace — no logic change |
| `refactor` | Code restructuring without behaviour change |
| `test` | Adding or updating tests |
| `chore` | Tooling, dependencies, config |
| `ci` | CI/CD workflow changes |

### Scopes (optional)

Use a scope when the change is confined to one area:

| Scope | Area |
|---|---|
| `app` | Angular application |
| `schema` | JSON Schema files |
| `scripts` | Python utility scripts |
| `docs` | Documentation |
| `ci` | GitHub Actions workflows |

### Examples

```
feat(app): add severity badge component
fix(app): correct weighted score calculation
docs: add architecture overview
chore(app): update Angular to v22.1
ci: add lint step to PR checks
```

Breaking changes must include `BREAKING CHANGE:` in the footer and use `!` after the type:

```
feat(schema)!: rename finding.impact to finding.businessImpact

BREAKING CHANGE: The field `impact` on findings has been renamed to `businessImpact`.
Existing reports must be migrated; the schema major version is bumped to v2.
```

---

## Pull Request Process

1. **Open one PR per logical change.** Mixing unrelated changes makes review harder and reversion riskier.
2. **Write a clear PR description.** Explain _why_ the change is needed, not just what it does.
3. **CI must pass** before requesting review. Fix lint errors, build failures, and schema validation failures first.
4. **Keep the diff focused.** Do not include unrelated formatting changes, refactors, or dependency bumps in a feature PR.
5. **Do not merge your own PR** unless you are the sole maintainer and the branch has been open for review for a reasonable time.
6. **Delete the branch** after it is merged.

---

## Build and Lint Requirements

Before pushing any branch, the Angular application must build and lint cleanly.

```bash
cd app
npm run lint    # must produce zero errors
npm run build   # must complete without errors
```

Schema validation runs in CI via `scripts/validate.py`. To run it locally:

```bash
python3 scripts/validate.py reports/<target>/<version>/report.json
```

Pre-commit hooks (Husky + lint-staged) run Prettier automatically on staged files. If a hook fails, fix the underlying issue — do not bypass hooks with `--no-verify`.

---

## Coding Style

### TypeScript / Angular

- Angular standalone components only. No NgModules.
- Use Angular Signals for all local and shared state.
- Inject dependencies with `inject()`, not constructor injection.
- Keep components small. If a template or class grows beyond ~150 lines, split it.
- No `any`. Enable strict TypeScript; fix type errors rather than suppressing them.
- No hardcoded colors, sizes, or pixel values in component SCSS — use CSS custom properties from the design token layer.

### SCSS

- Reference design tokens via `var(--token-name)`. Never use raw hex values or pixel literals.
- Component styles are scoped (Angular default). Do not reach outside the component with deep selectors.
- Keep component SCSS files short. If a component needs more than ~50 lines of styles, reconsider the structure.

### Schema and reports

- Never modify `schemas/` files that have already been published (i.e., committed to `main`). Additive changes → new minor version; breaking changes → new major version.
- Never hand-edit generated `report.md` files. Re-run `scripts/generate_markdown.py` instead.
- Every new finding must have all four rating axes set: `severity`, `businessImpact`, `effort`, `confidence`.

### Documentation

- Write documentation in the present tense, in clear English.
- Do not create placeholder sections. If a section is not ready to be written, omit it entirely.
- Keep `CHANGELOG.md` updated with every merged PR.

---

## Setting Up Locally

```bash
# Clone
git clone https://github.com/<owner>/ux-insight.git
cd ux-insight

# Install app dependencies
cd app
npm install

# Start the dev server
npm start

# Validate a report
cd ..
python3 scripts/validate.py reports/rebeccablischke-de/v1/report.json
```

Requirements: Node 22+, npm 11+, Python 3.10+, `jsonschema` (`pip install jsonschema`).
