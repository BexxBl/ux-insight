# Engineering Standards — UX Insight

These standards apply to all TypeScript and Angular code in `app/`. They complement the workflow rules in `CONTRIBUTING.md` and the design token rules in `docs/design/DESIGN_SYSTEM.md`.

---

## TypeScript

- Strict mode is always on. Fix type errors; do not suppress them with `any` or `// @ts-ignore`.
- Prefer `readonly` on class members, function parameters, and destructured variables wherever the value is not reassigned.
- Prefer type inference over redundant explicit annotations when the type is unambiguous from context.
- No barrel `index.ts` files unless the module genuinely needs a stable public API surface.

---

## Class Member Order

All class members must appear in the following order. Put a blank line between each group.

```
1.  static readonly constants
2.  injected dependencies
3.  inputs / outputs
4.  signals / public state
5.  private state
6.  computed values
7.  constructor (only when required by a framework contract)
8.  lifecycle hooks
9.  public methods
10. protected methods
11. private methods
```

Example:

```ts
@Component({ ... })
export class ScoreCardComponent {
  // 1. static readonly constants
  static readonly MAX_PERCENTAGE = 100;

  // 3. inputs
  readonly label = input.required<string>();
  readonly score = input.required<number>();
  readonly scaleMax = input.required<number>();

  // 6. computed values
  readonly percentage = computed(() =>
    Math.round((this.score() / this.scaleMax()) * this.MAX_PERCENTAGE),
  );

  // 9. public methods
  // (none in this example)

  // 11. private methods
  private formatLabel(): string { ... }
}
```

---

## Visibility Modifiers

**Angular lifecycle hooks** (`ngOnInit`, `ngOnDestroy`, `ngAfterViewInit`, etc.) are written **without** an explicit `public` or `private` modifier. Angular calls them via the interface, not via TypeScript visibility.

```ts
// correct
ngOnInit(): void { ... }
ngOnDestroy(): void { ... }

// incorrect
public ngOnInit(): void { ... }
private ngOnDestroy(): void { ... }
```

**All other methods** use an explicit visibility modifier.

```ts
// correct
public reset(): void { ... }
protected formatValue(n: number): string { ... }
private buildUrl(path: string): string { ... }

// incorrect — missing modifier
formatValue(n: number): string { ... }
```

---

## Angular Components

### Standalone only

Every component is standalone. No NgModules. Each component declares its own `imports` array.

### Size

Keep components focused. When a component class exceeds ~150 lines, or a template exceeds ~100 lines, consider splitting it into smaller components.

### Injection

Use `inject()` at the class field level. Do not use constructor injection.

```ts
// correct
private readonly reportService = inject(ReportService);

// incorrect
constructor(private reportService: ReportService) {}
```

### Signals

Use Angular Signals for all local and derived UI state.

- `signal()` for mutable state owned by the component.
- `input()` and `output()` at component boundaries.
- `computed()` for values derived from other signals.
- RxJS is reserved for HTTP coordination and streams that have no signal-native equivalent.

```ts
// correct — local UI state as a signal
readonly isExpanded = signal(false);

// correct — derived value as a computed
readonly isEmpty = computed(() => this.items().length === 0);
```

---

## Templates

- Use semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<button>` — not `<div>` wrappers for everything.
- Provide descriptive `alt` text for all images. Use `alt=""` only for purely decorative images.
- Add ARIA attributes only when semantic HTML alone does not communicate the role or state.
- Use Angular 17+ control flow syntax: `@if`, `@for`, `@switch`. Do not use `*ngIf` or `*ngFor`.
- The `track` expression in `@for` must be a stable, unique identifier — never `$index`.

---

## SCSS

- All visual decisions reference CSS custom properties: `var(--token-name)`.
- No raw hex values, pixel literals, or Tailwind color utilities in component SCSS files.
- Component styles are scoped by default (Angular encapsulation). Do not use `/deep/` or `::ng-deep`.
- Keep component SCSS files under ~50 lines. If a component needs more, reconsider the structure.

---

## Comments

Write comments only when the **why** is non-obvious: a hidden constraint, a subtle invariant, or a workaround for a specific bug. Do not describe what the code does — well-named identifiers already do that.

Avoid multi-line comment blocks. One short line is enough.
