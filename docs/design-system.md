# UX Insight – Design System

A token-first design foundation for the Angular report viewer.
Visual decisions are centralised in CSS custom properties so the entire UI can be re-themed by changing one file.

---

## Token Strategy

Every color, size, and motion value lives in `app/src/styles.scss` as a CSS custom property.
Components reference tokens; they never use raw hex values, pixel literals, or Tailwind color utilities directly.

```scss
/* Do this */
color: var(--color-text);
background: var(--color-surface);

/* Not this */
color: #111827;
background: white;
```

Tailwind utility classes are still available for layout and spacing shortcuts, but any utility that sets a color should use a CSS variable override or be avoided in favour of inline `style` bindings and token constants.

---

## Theming

The default theme is **light**, applied via `:root`.
Dark mode is activated by adding `data-theme="dark"` to the `<html>` element.

```html
<!-- light (default) -->
<html>

<!-- dark -->
<html data-theme="dark">
```

Only color and shadow tokens differ between themes. Spacing, radius, and typography are shared.

Future additions (system preference detection, user toggle) can be wired to a single `ThemeService` that sets this attribute — no component changes required.

---

## Token Reference

### Backgrounds & Surfaces

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-bg` | `#f8f9fb` | `#0f1117` | Page / app background |
| `--color-surface` | `#ffffff` | `#1a1d27` | Cards, panels, list items |
| `--color-surface-raised` | `#ffffff` | `#21252f` | Modals, dropdowns, tooltips |
| `--color-surface-subtle` | `#f2f4f7` | `#161920` | Table row alternates, subtle fills |

### Text

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-text` | `#111827` | `#f0f1f5` | Primary body copy, headings |
| `--color-text-muted` | `#6b7280` | `#9ca3af` | Secondary labels, metadata |
| `--color-text-subtle` | `#9ca3af` | `#6b7280` | Placeholders, disabled states |
| `--color-text-inverse` | `#ffffff` | `#111827` | Text on filled/colored backgrounds |

### Borders

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-border` | `#e5e7eb` | `#2d3140` | Standard dividers, card outlines |
| `--color-border-subtle` | `#f0f1f3` | `#1f2230` | Hairline rules, inner separators |

### Brand & Interactive

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-primary` | `#4f46e5` | `#818cf8` | Buttons, links, active states |
| `--color-primary-hover` | `#4338ca` | `#a5b4fc` | Hover / focus ring colour |
| `--color-primary-subtle` | `#eef2ff` | `#1e1b4b` | Tinted backgrounds near primary actions |
| `--color-accent` | `#0ea5e9` | `#38bdf8` | Secondary highlights, tags |

### Feedback / Status

| Token | Foreground (L/D) | Subtle bg (L/D) | Usage |
|---|---|---|---|
| `--color-success` | `#10b981` / `#34d399` | `#ecfdf5` / `#064e3b` | Pass, resolved, healthy |
| `--color-warning` | `#f59e0b` / `#fbbf24` | `#fffbeb` / `#451a03` | Caution, in-progress |
| `--color-danger` | `#ef4444` / `#f87171` | `#fef2f2` / `#450a0a` | Error, destructive, failed |
| `--color-info` | `#3b82f6` / `#60a5fa` | `#eff6ff` / `#1e3a5f` | Neutral info, tips |

### UX Audit Severity

These tokens map directly to severity values in the report JSON schema.

| Token | Foreground (L/D) | Subtle bg (L/D) | Schema value |
|---|---|---|---|
| `--color-severity-critical` | `#dc2626` / `#f87171` | `#fef2f2` / `#450a0a` | `"critical"` |
| `--color-severity-high` | `#ea580c` / `#fb923c` | `#fff7ed` / `#431407` | `"high"` |
| `--color-severity-medium` | `#d97706` / `#fbbf24` | `#fffbeb` / `#451a03` | `"medium"` |
| `--color-severity-low` | `#16a34a` / `#4ade80` | `#f0fdf4` / `#052e16` | `"low"` |

Use the foreground token for text labels and icons.
Use the subtle token for badge backgrounds and row highlights.

---

## Spacing

4 px base grid. All layout spacing must use these tokens or Tailwind's built-in scale (which matches the same grid).

| Token | Value | px |
|---|---|---|
| `--space-1` | `0.25rem` | 4 |
| `--space-2` | `0.5rem` | 8 |
| `--space-3` | `0.75rem` | 12 |
| `--space-4` | `1rem` | 16 |
| `--space-5` | `1.25rem` | 20 |
| `--space-6` | `1.5rem` | 24 |
| `--space-8` | `2rem` | 32 |
| `--space-10` | `2.5rem` | 40 |
| `--space-12` | `3rem` | 48 |
| `--space-16` | `4rem` | 64 |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `0.25rem` | Chips, tags, small badges |
| `--radius-md` | `0.5rem` | Buttons, inputs |
| `--radius-lg` | `0.75rem` | Cards, panels |
| `--radius-xl` | `1rem` | Modals, large containers |
| `--radius-full` | `9999px` | Pills, avatar circles |

---

## Shadows / Elevation

Three levels following the same shadow colour, scaled by spread:

| Token | Usage |
|---|---|
| `--shadow-sm` | Subtle card lift, default resting state |
| `--shadow-md` | Hovered cards, sticky headers |
| `--shadow-lg` | Modals, dropdowns, floating elements |

Dark theme shadows use higher opacity to compensate for the dark surface.

---

## Typography

### Fonts

```
--font-sans   Inter → system-ui fallbacks
--font-mono   Cascadia Code → Fira Code → monospace fallbacks
```

Inter is not bundled — if it is not installed, system-ui provides a clean native fallback with identical metrics.
To load Inter, add a `<link>` to the HTML head pointing to Google Fonts or a self-hosted woff2.

### Type Scale

| Token | rem | px | Usage |
|---|---|---|---|
| `--text-xs` | 0.75 | 12 | Captions, metadata |
| `--text-sm` | 0.875 | 14 | Secondary labels, table cells |
| `--text-base` | 1 | 16 | Body copy (default) |
| `--text-lg` | 1.125 | 18 | Lead text, card titles |
| `--text-xl` | 1.25 | 20 | Section headings |
| `--text-2xl` | 1.5 | 24 | Page sub-headings |
| `--text-3xl` | 1.875 | 30 | Page headings |

### Font Weights

| Token | Value |
|---|---|
| `--font-regular` | 400 |
| `--font-medium` | 500 |
| `--font-semibold` | 600 |
| `--font-bold` | 700 |

### Line Heights

| Token | Value | Usage |
|---|---|---|
| `--leading-tight` | 1.25 | Headings, single-line labels |
| `--leading-normal` | 1.5 | Body text (default) |
| `--leading-relaxed` | 1.625 | Long-form prose |

---

## Transitions

| Token | Value | Usage |
|---|---|---|
| `--transition-fast` | `100ms ease` | Hover state colour changes, toggles |
| `--transition-normal` | `200ms ease` | Panel expansions, visibility changes |

All motion respects `prefers-reduced-motion: reduce` — the global reset in `styles.scss` collapses durations to `0.01ms` when the user prefers reduced motion.

---

## TypeScript Token Constants

`app/src/app/shared/design-tokens.ts` exports all token names as typed constants:

```typescript
import { ColorTokens, SeverityTokens, severityColorToken } from './shared/design-tokens';

// Reference a token by name
element.style.setProperty(ColorTokens.primary, '#custom');

// Get severity tokens dynamically
const fg = severityColorToken('high');  // '--color-severity-high'
```

This prevents typos in token names and enables IDE autocompletion.
The file contains zero values — it is a directory of names only. All values remain in `styles.scss`.

---

## Usage Rules

1. **Always use tokens.** No raw hex values, `rgb()` literals, or pixel sizes in component SCSS.
2. **Severity colours come from severity tokens.** Never use `--color-danger` for a "high" finding — use `--color-severity-high`.
3. **Feedback tokens are for UI states.** Use success/warning/danger/info for form validation, alerts, and status indicators — not for audit severity.
4. **Do not add `!important`.** If specificity is a problem, fix the selector hierarchy.
5. **No hardcoded dark mode media queries in components.** Theme switching is done via the `data-theme` attribute on `<html>`. Components stay theme-agnostic.
