# Lovable Prototype Review

Design reference extracted from `ux-insight-lovable.zip` (React/Vite prototype).
This document records design intent only — no React/TSX code belongs in this repo.

---

## What the prototype covers

Three views are implemented:

| Route | View |
|---|---|
| `/` | Dashboard — stat cards, report grid, right panel |
| `/reports/:id` | Report viewer — long-form document with table of contents |
| `/reports/:id/findings/:id` | Finding detail — evidence, recommendation, metadata |

The prototype uses mock data only (`src/lib/mock-data.ts`). It proves out the visual language and information architecture without a real API.

---

## Design mood

Calm, professional, data-first. The reference points in the prototype match this project's PRODUCT_PRINCIPLES:

- **Linear** — tight spacing, monospace accents, low-noise navigation
- **Vercel / GitHub** — muted sidebar, clean typography hierarchy, subtle borders
- **Stripe** — OKLCH color space, precise token naming, semantic tones for states

Heavy admin UI traits (high-density tables, accordion sidebars, status bars) are deliberately absent.

---

## Color strategy

### Color space
All colors use **OKLCH**, which gives perceptually uniform lightness across hues. This is the right approach and should be mirrored in `styles.scss`.

### Palette structure

| Role | Light value | Dark value | Notes |
|---|---|---|---|
| `background` | `oklch(0.995 0.002 90)` — warm near-white | `oklch(0.16 0.012 265)` — dark graphite | Warm bias on light, cool/neutral on dark |
| `foreground` | `oklch(0.22 0.02 265)` | `oklch(0.94 0.008 90)` | |
| `surface` | `oklch(1 0 0)` — pure white | `oklch(0.19 0.014 265)` | Raised surfaces (cards) |
| `surface-muted` | `oklch(0.975 0.004 90)` | `oklch(0.22 0.014 265)` | Hover states, inset areas |
| `primary` | `oklch(0.52 0.20 278)` — indigo/violet | `oklch(0.68 0.18 278)` | Brand accent; lightened on dark |
| `accent` | `oklch(0.955 0.012 278)` — very light indigo tint | `oklch(0.28 0.04 278)` | Subtle highlight bg |
| `muted` | `oklch(0.965 0.005 90)` | `oklch(0.24 0.014 265)` | Neutral fill |
| `muted-foreground` | `oklch(0.52 0.015 265)` | `oklch(0.68 0.015 265)` | Secondary text |
| `border` | `oklch(0.92 0.006 90)` | `oklch(0.28 0.014 265)` | Very subtle |

### Semantic tones

| Token | Light | Purpose |
|---|---|---|
| `success` | `oklch(0.60 0.14 155)` — green | Positive deltas, delivered status, strengths |
| `warning` | `oklch(0.75 0.16 75)` — amber | High severity findings |
| `info` | `oklch(0.62 0.14 240)` — blue | Medium severity findings |
| `destructive` | `oklch(0.58 0.22 27)` — red-orange | Critical severity, negative deltas |

### Sidebar tokens
The sidebar has its own token namespace (`sidebar`, `sidebar-foreground`, `sidebar-primary`, etc.). On light mode the sidebar is near-white (`oklch(0.985 0.004 90)`), slightly more muted than the main background.

### Chart colors
Five chart colors aligned with the semantic tones: primary, info, success, warning, destructive — in that order.

---

## Typography

### Fonts
- **Sans**: Inter (with OpenType features cv11, ss01, ss03)
- **Mono**: JetBrains Mono — used sparingly for IDs, keyboard shortcuts, section eyebrows
- Both fall back to system fonts

### Scale

| Class | Size | Weight | Tracking | Use |
|---|---|---|---|---|
| `text-display` | 2.75rem / 44px | 600 | −0.03em | Report title (h1 on document pages) |
| `text-h-xl` | 2rem / 32px | 600 | −0.025em | Dashboard h1 |
| `text-h-l` | 1.5rem / 24px | 600 | −0.02em | Section headings (h2) |
| `text-h-m` | 1.125rem / 18px | 600 | −0.01em | Card titles (h3) |
| `text-body` | 0.9375rem / 15px | 400 | — | Long-form prose, line-height 1.55 |
| `text-small` | 0.8125rem / 13px | 400 | — | Supporting text |
| `text-label` | 0.6875rem / 11px | 600 | +0.06em, uppercase | Eyebrows, metadata labels, nav group headings |

### Key observations
- Headings use tight negative letter-spacing for a modern, compressed feel.
- `text-label` (uppercase, tracked, 11px) is the workhorse for metadata — used everywhere a key/label needs to recede.
- Numeric display values use `tabular-nums` and the `font-display` alias for consistent width.
- Report section eyebrows use monospace (`font-mono text-xs`) for the numbering (`01`, `02`, …).

---

## Spacing and sizing

### Border radius
Base radius is `0.75rem` (12px). All variants derive from it:

| Token | Value |
|---|---|
| `radius-sm` | 8px |
| `radius-md` | 10px |
| `radius-lg` | 12px (base) |
| `radius-xl` | 16px |
| `radius-2xl` | 20px |
| `radius-3xl` | 24px |

Cards use `rounded-xl` (16px). Badges and chips use `rounded-md` (10px). Icon containers use `rounded-md`.

### Shadows
Four levels, all OKLCH-based and very subtle:

| Level | Use |
|---|---|
| `shadow-xs` | Cards at rest, input fields |
| `shadow-sm` | Slightly raised surfaces |
| `shadow-md` | Cards on hover |
| `shadow-lg` | Floating panels, dropdowns |
| `shadow-focus` | Focus ring (4px spread, primary at 15% opacity) |

The focus ring is implemented as a CSS box-shadow, not an outline, which gives it the soft appearance.

### Spacing rhythm
- Card padding: `p-5` (20px) for standard cards, `p-8` (32px) for content-heavy report sections
- Section gaps: `gap-14` (56px) between report sections
- Grid gaps: `gap-4` (16px) standard
- Navigation item padding: `px-2 py-1.5`
- Icon-to-text gap: `gap-2.5` (10px)

---

## Layout architecture

### Three-column shell

```
┌─────────────────────────────────────────────────────────┐
│ max-w-[1600px] centered                                  │
│ ┌──────────┬──────────────────────────┬───────────────┐ │
│ │ sidebar  │ main column              │ right panel   │ │
│ │ 240px    │ flex-1                   │ 288px         │ │
│ │ sticky   │                          │ xl: visible   │ │
│ │ dvh      │ ┌──────────────────────┐ │ sticky top-14 │ │
│ │          │ │ header (h-14 sticky) │ │               │ │
│ │          │ └──────────────────────┘ │               │ │
│ │          │ <main> px-4..px-10 py-8  │               │ │
│ └──────────┴──────────────────────────┴───────────────┘ │
└─────────────────────────────────────────────────────────┘
```

- The right panel is `hidden` by default, shown at `xl` breakpoint only.
- The sidebar is `hidden` on mobile (`lg:flex`).
- The header uses `bg-background/85 backdrop-blur-md` for the frosted-glass effect.

### Content width constraints
- Dashboard content: `max-w-[1200px]`
- Report viewer: `max-w-[1000px]`
- Finding detail: `max-w-[900px]`
- All are centered within the main column via `mx-auto`.

### Sidebar structure

```
[Logo mark + wordmark]
[Search bar with ⌘K shortcut]
[nav group "Workspace"] Dashboard / Reports / Clients / Library
[nav group "Recent"] list of recent client reports (dot + name)
[Settings — pushed to bottom]
[User avatar row with name/role]
```

---

## Navigation and active states

### Sidebar nav item
At rest: `text-sidebar-foreground/85`, no background.
Active: `bg-sidebar-accent text-sidebar-accent-foreground`.
Hover: same as active.

### Tab strip (above report list)
Active tab has no background change — only a 2px bottom border in `bg-primary`, flush with the separator line below.

```css
/* active tab indicator */
position: absolute; bottom: -1px; left: 12px; right: 12px;
height: 2px; border-radius: 9999px; background: primary;
```

### Table of contents (right panel)
Vertical list with `border-l border-border`. Active item: `border-l-2 border-primary text-foreground`. Inactive: `border-transparent text-muted-foreground`.

---

## Breadcrumb pattern

Header always shows a breadcrumb, never a standalone page title. Format:

```
Workspace / Dashboard
Reports / Nordbank AG / Retail Banking App — Q2 Audit
Reports / Nordbank AG / Retail Banking App / Finding F-01
```

Separator is `/` in `text-border` color (very muted). Each crumb except the last is a link with hover state `bg-muted text-foreground`.

---

## Interaction patterns

| Pattern | Implementation |
|---|---|
| Card hover | `hover:border-primary/30 hover:shadow-md` |
| Card focus | `focus-visible:border-ring focus-visible:shadow-focus` |
| Arrow icon on hover | `group-hover:-translate-y-0.5 group-hover:translate-x-0.5` |
| Finding row hover | `hover:bg-surface-muted` |
| Score ring animation | `transition-[stroke-dashoffset] duration-500` |
| Progress bar animation | `transition-[width] duration-500` |
| Text selection | `oklch(0.55 0.19 278 / 0.25)` — primary at 25% |
| Dark mode toggle | localStorage + `.dark` class on `<html>` + `color-scheme` CSS prop |

All transitions use default `ease` with duration matched to distance/importance.

---

## Dark mode

Full dark mode is defined. Key decisions:

- Dark background is a **cool graphite** (`oklch(0.16 0.012 265)`) — not pure black.
- Cards are slightly lighter than background (`oklch(0.195 0.014 265)`), creating visible but not harsh elevation.
- `surface-muted` (for hover states) is another step lighter.
- Primary lightens from `oklch(0.52 0.20 278)` to `oklch(0.68 0.18 278)` to maintain contrast on dark backgrounds.
- All semantic tones (success, warning, info, destructive) lighten on dark mode.

---

## What to carry forward into Angular

These patterns are directly translatable to the Angular project:

1. **OKLCH color palette** — expand `styles.scss` tokens to match this precision; the existing tokens are a subset
2. **Typography scale** — the seven-level scale matches the project's intent; adopt the exact sizes and tracking values
3. **Three-column shell layout** — the Angular app already has a viewer; the full shell adds sidebar + right panel
4. **`text-label` as a utility** — uppercase tracked labels are used consistently for all metadata keys
5. **Section eyebrow pattern** — monospace number + `text-h-l` heading is a strong visual motif for report sections
6. **ScoreRing** — SVG ring with OKLCH-toned stroke; directly implementable as an Angular component
7. **SeverityBadge** — dot + label in semantic color; already partially exists, worth aligning to this style
8. **Finding table** — CSS Grid layout with fixed column widths is cleaner than a generic table element
9. **Prev/Next finding navigation** — useful for sequential review UX
10. **Evidence placeholder pattern** — mock browser chrome as a placeholder for screenshots

### Leave behind
- shadcn/ui primitives (React-specific)
- TanStack Router patterns
- Any component that doesn't map to a schema field (sidebar search, comments, team activity feed — these are app-mode features, not report-viewer features)
