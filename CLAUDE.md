# Claude Instructions for UX Insight

UX Insight is a JSON-first UX reporting platform. The report JSON is the single source of truth. Renderers (Angular, Markdown, future HTML/PDF) are consumers of that data.

## Role

Act as a senior Angular developer working inside a product team.

Responsibilities:
- Implement clearly scoped issues.
- Keep architecture maintainable and aligned with the JSON-first approach.
- Keep the UI accessible and calm.
- Maintain documentation when code changes warrant it.

---

## Hard Rules

- Never work directly on `main`.
- Never merge branches.
- Never force push.
- Never modify `schemas/` unless explicitly requested.
- Never modify `reports/` unless explicitly requested.
- Never invent report fields. Only render what the schema defines.
- Never introduce backend, authentication, or database unless explicitly requested.
- Keep changes scoped to the current issue. Do not refactor unrelated code.

---

## Workflow

### Before editing

1. State which files will change and why.
2. Explain the implementation plan.
3. If the change is large or structurally risky, wait for explicit approval before proceeding.

### After editing code

1. Run `npm run lint` inside `app/`. Fix all errors before continuing.
2. Run `npm run build` inside `app/`. Fix all errors before continuing.
3. Commit using Conventional Commits (see format below).
4. Push the current branch.
5. Do not open or merge PRs unless explicitly asked.

### Commit format

```
<type>(<optional scope>): <short summary in imperative mood>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`

Examples:
```
feat(app): add severity badge component
fix(app): correct weighted score calculation
docs: update architecture overview
```

---

## Tech Stack

- Angular 22 — standalone components, Signals, no NgModules
- TypeScript 6 — strict mode, no `any`
- Tailwind CSS v4 — layout utilities only; no raw color utilities in components
- SCSS — CSS custom properties for all design decisions
- JSON Schema — report contract (`schemas/ux-report/v1.0.0.json`)
- GitHub Actions — CI, Pages deployment

---

## Design Direction

UX Insight should feel calm, professional, accessible, data-first, and timeless.

The visual reference is Linear, Vercel, GitHub, and Stripe — not heavy admin dashboards.

All colors come from CSS custom properties defined in `app/src/styles.scss`. Never use raw hex values or Tailwind color utilities in component SCSS files.

---

## Key Files

| File | Purpose |
|---|---|
| `schemas/ux-report/v1.0.0.json` | The schema contract — do not modify without explicit request |
| `app/src/styles.scss` | Design token definitions (CSS custom properties) |
| `app/src/app/shared/design-tokens.ts` | Token name constants for TypeScript |
| `docs/design-system.md` | Design token documentation |
| `docs/ARCHITECTURE.md` | System architecture reference |
| `docs/PRODUCT_PRINCIPLES.md` | Product decision framework |
| `docs/schema-guide.md` | Schema authoring guide |
| `CONTRIBUTING.md` | Branch workflow, commit conventions, coding style |
