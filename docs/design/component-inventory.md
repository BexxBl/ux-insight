# Component Inventory

Catalog of UI patterns found in the Lovable prototype (`ux-insight-lovable.zip`).
Organized by layer: primitives → layout → page sections → navigation.

For each component: what it does, key visual decisions, and a recommendation for the Angular implementation.

---

## Primitives (`src/components/ux-primitives.tsx`)

### Card

Polymorphic surface container (`div`, `section`, or `article`).

**Visual decisions:**
- `rounded-xl border border-border bg-card shadow-xs`
- No internal padding — padding is set by the consuming context (`p-5` or `p-8`)
- On hover (when used as a link target): `hover:border-primary/30 hover:shadow-md`
- Focus ring: `focus-visible:border-ring focus-visible:shadow-focus`

**Angular:** Implement as a directive or host-binding component. Padding variant (`sm`/`md`/`lg`) can be an input. Current `card` pattern can absorb this.

---

### SeverityBadge

Colored pill with a dot indicator for finding severity.

**Variants:**

| Severity | Background | Text | Border | Dot |
|---|---|---|---|---|
| Critical | `destructive/10` | `destructive` | `destructive/20` | `destructive` |
| High | `warning/15` | `warning-foreground` | `warning/30` | `warning` |
| Medium | `info/10` | `info` | `info/20` | `info` |
| Low | `muted` | `muted-foreground` | `border` | `muted-foreground` |

**Structure:**
```
<span class="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium">
  <span class="h-1.5 w-1.5 rounded-full" />   ← color dot
  Critical
</span>
```

**Angular:** Standalone component, `@Input() severity`. Exists partially; align to this exact color mapping and add the dot.

---

### StatusChip

Status pill without a dot — uses `bg-current opacity-70` for the dot color instead of an explicit class.

**Variants:**

| Status | Background | Text | Border |
|---|---|---|---|
| Draft | `muted` | `muted-foreground` | `border` |
| In review | `accent` | `accent-foreground` | `primary/20` |
| Delivered | `success/10` | `success` | `success/20` |
| Archived | `muted` | `muted-foreground` | `border` |

**Angular:** Standalone component, `@Input() status`. Shares the badge shape with `SeverityBadge`.

---

### ScoreRing

SVG ring chart for a 0–100 score value.

**Behavior:**
- Background ring: `stroke-border/70`
- Foreground arc: toned by value range
  - ≥ 80 → `text-success`
  - ≥ 65 → `text-primary`
  - ≥ 50 → `text-warning`
  - < 50 → `text-destructive`
- Arc uses `stroke-dasharray` + animated `stroke-dashoffset` (`duration-500`)
- `strokeLinecap="round"` gives soft ends
- Center label: large number + small "score" label in `text-label` style

**Sizes used:** 88px (right panel), 96px (default), 140px (report scores section)

**Angular:** Pure SVG component, `@Input() value: number` and `@Input() size: number`. Trigger animation via Angular animations or CSS transition on `stroke-dashoffset`.

---

### Progress

Thin horizontal bar for category scores.

**Structure:**
```
<div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
  <div class="h-full rounded-full transition-[width] duration-500" style="width: X%" />
</div>
```

**Tone inputs:** `primary` | `success` | `warning` | `destructive`

In the report viewer the tone is derived from the score value using the same thresholds as `ScoreRing`.

**Angular:** Simple component or directive. `@Input() value` + `@Input() tone`.

---

### Sparkline

Inline SVG line chart for trend data.

**Behavior:**
- ViewBox `0 0 120 32`
- SVG `<path>` built from normalized data points
- `stroke="currentColor"` — color driven by parent's text color (usually `text-primary`)
- `strokeWidth="1.5"` with rounded caps

**Uses:** Dashboard stat cards (at 96px rendered width), report list cards (at 112px).

**Angular:** Component accepting `@Input() points: number[]`. No third-party chart library needed — pure SVG.

---

## Layout (`src/components/app-shell.tsx`)

### AppShell

Three-column page shell. Inputs:

| Prop | Purpose |
|---|---|
| `children` | Main content |
| `right` | Right panel (optional; shown at xl breakpoint) |
| `title` | Fallback breadcrumb label |
| `breadcrumbs` | Array of `{ label, to? }` |
| `actions` | Header action buttons (optional) |

**Sidebar (240px, sticky, full dvh):**
- Logo mark (7×7 grid, `bg-primary`, `Sparkles` icon) + wordmark + subtitle
- Search bar with `⌘K` keyboard hint
- Nav groups: "Workspace" (Dashboard, Reports, Clients, Library) and "Recent" (client shortcut links)
- Settings link pushed to bottom via `mt-auto`
- User avatar row at bottom (avatar initials + name + role + chevron)

**Header (sticky, h-14):**
- Breadcrumb nav (left)
- Action buttons + notifications + theme toggle (right)
- `bg-background/85 backdrop-blur-md` frosted effect

**Right panel (288px, sticky top-14, xl-only):**
- Consumer-supplied; not a fixed component
- Scrollable, `overflow-y-auto`, `h-[calc(100dvh-3.5rem)]`
- Light background: `bg-surface-muted/40`

**Angular:** Shell component with `<ng-content>` slots for main, right panel, and action buttons. Use `@Input()` for breadcrumbs and title.

---

## Dashboard page (`src/routes/index.tsx`)

### StatCard

KPI tile with value, trend, and sparkline.

**Structure (inside a `Card p-5`):**
```
[label — text-label muted]
[large number — text-3xl font-display tabular-nums]
[trend icon + delta value + period label]
[sparkline — w-24 opacity-70]
```

Used in a `grid grid-cols-2 lg:grid-cols-4` row.

**Angular:** Probably inline on the dashboard view, or a simple dumb component. Not a shared primitive since it's dashboard-specific.

---

### ReportCard

Clickable card linking to a report.

**Structure (inside a `Card h-full p-5`):**
```
[client — text-label muted]         [→ arrow icon]
[project name — text-h-m]

[score number — text-3xl]  [sparkline — w-28]
[score delta with trend icon]

─── border ───
[date — text-xs muted]    [StatusChip]
```

Arrow icon animates on group-hover: `-translate-y-0.5 translate-x-0.5`.

**Angular:** Component in the report list; receives a `Report` model object.

---

### DashboardRightPanel

Right panel on the dashboard view. Three sections:

1. **Portfolio health** — `ScoreRing` (88px) + summary text
2. **Upcoming** — mini calendar list with `day/date` tile + event title/meta
3. **Team activity** — plain text feed

The calendar tile:
```
<div class="grid h-10 w-10 place-items-center rounded-md border bg-surface text-center">
  <span class="text-[10px] uppercase muted">Mon</span>
  <span class="text-sm font-semibold">07</span>
</div>
```

**Angular:** This is app-mode UI (not in the current report-viewer scope). Document the pattern for future reference; do not implement now.

---

## Report viewer page (`src/routes/reports.$reportId.tsx`)

### SectionLabel

Eyebrow + section heading row, with optional trailing element.

**Structure:**
```
[monospace number "01" — text-xs muted]  [section heading — text-h-l]  [trailing? e.g. filter pills]
```

**Angular:** Component with `@Input() eyebrow`, `@Input() title`, and a `<ng-content select="[trailing]">` slot.

---

### SummaryStat

Compact number + label used in the executive summary stat row.

**Structure:**
```
[label — text-label muted]
[large number — text-3xl font-display] [suffix — text-xs muted]
[optional: trend icon + delta]
```

**Angular:** Inline in the executive summary component.

---

### ExecutiveSummaryCard

Full-width card containing the summary prose and a three-column stat row.

**Structure (`Card p-8`):**
```
[summary prose — text-[1.0625rem] leading-relaxed]
─── border-t ───
[SummaryStat: Overall score | Findings | Critical open]
```

**Angular:** Section component. Receives `report.summary`, `report.score`, `report.scoreDelta`, `report.findings`.

---

### ScoreCard (report section)

Card containing the `ScoreRing` + composite score description + category progress bars.

**Structure (`Card p-8`):**
```
[ScoreRing 140px]  [composite description text]
─── border-t ───
[grid 2-col: category bars]
  [label]      [value]
  [Progress bar]
  [note — text-xs muted]
```

**Angular:** Section component. Maps `report.scores[]` array.

---

### MetricsRow

Grid of `MetricCard` tiles (2-col on sm, 4-col on lg).

**MetricCard structure (`Card p-5`):**
```
[label — text-label muted]
[value — text-2xl font-display]
[delta — trend icon + colored value + "vs. Q4"]
```

**Angular:** Grid + dumb card component. Maps `report.metrics[]`.

---

### StrengthsGrid

Three-column grid of strength cards.

**StrengthCard structure (`Card p-5`):**
```
[icon container — h-8 w-8 rounded-md bg-success/10 text-success]
  [Check icon h-4 w-4]
[title — text-h-m, mt-4]
[body — text-sm muted, mt-2]
```

**Angular:** Maps `report.strengths[]`.

---

### QuickWinsList

Single `Card` with a `divide-y` list of quick win entries.

**Entry structure:**
```
[icon container — h-8 w-8 bg-accent text-accent-foreground]
  [Zap icon]
[monospace index "01"] [title]    [effort badge]
[body — text-sm muted]
```

Effort badge: `rounded-md border bg-muted text-muted-foreground capitalize` — same shape as StatusChip.

**Angular:** List component. Maps `report.quickWins[]`.

---

### FindingsTable

The findings section uses a CSS Grid layout, not `<table>`.

**Column grid:** `grid-cols-[minmax(0,1fr)_100px_100px_120px_40px]`

**Columns:** Finding (title + summary) | Severity | Priority | Section | Arrow

**Header row:** `text-label text-muted-foreground border-b px-5 py-2.5`

**Finding row:** Full-row link with `hover:bg-surface-muted`. Severity uses `SeverityBadge`. Priority is monospace text.

**Severity filter:** Pill-tab group above the table — `All | Critical | High | Medium | Low`. Active tab has `bg-muted text-foreground`; inactive is muted with hover.

**Angular:** Component receiving `report.findings[]`. Severity filter as a local signal/state.

---

### RoadmapColumns

Three-column grid (one per time phase).

**Column card structure (`Card p-5`):**
```
[quarter label — text-label muted]
[title — text-h-m]
[items list]:
  [1px dot in bg-primary] [item text — text-sm muted]
```

**Angular:** Maps `report.roadmap[]`.

---

### TableOfContents

Right panel component on the report viewer.

**Structure:**
```
[heading — text-label muted]
[vertical nav list with border-l]:
  [monospace number] [section label]
  — active: border-l-2 border-primary text-foreground
  — inactive: border-transparent text-muted-foreground

[CTA card — rounded-md border bg-surface p-4]:
  "Ready for delivery?" + share button
```

Scrollspy behavior (active item updates on scroll) is not wired up in the prototype but the visual structure is defined.

**Angular:** Component with static section list. Add scrollspy via `IntersectionObserver` in a future iteration.

---

## Finding detail page (`src/routes/reports.$reportId.findings.$findingId.tsx`)

### FindingHeader

```
[SeverityBadge]  [priority — font-mono text-xs]  ·  [section]
[title — text-h-xl]
[summary — text-body muted]
[tag chips]:
  <span class="rounded-md border bg-surface px-2 py-0.5 text-xs muted">#tag</span>
```

**Angular:** Header section of the finding detail component.

---

### EvidencePlaceholder

Aspect-ratio 16:9 card with a mock browser chrome and a highlighted issue annotation.

**Outer:** `aspect-[16/9] bg-[repeating-linear-gradient(45deg,...)]` — hatched pattern background  
**Inner frame:** `rounded-lg border bg-surface shadow-md` inset 24px  
**Chrome bar:** `h-8 border-b` with three muted dots  
**Issue annotation:** `rounded-md border border-destructive/40 bg-destructive/10 text-destructive` absolute-positioned  

**Angular:** This is a placeholder for real screenshot images. Implement as a `<figure>` that shows either a real `<img>` or the placeholder UI when no image is available.

---

### FindingSection

Reusable section block used for Evidence, Recommendation, Impact.

**Structure:**
```
[icon container — h-6 w-6 rounded-md bg-accent text-accent-foreground] (optional)
[eyebrow — text-label muted]
[title — text-h-m]
[content — pl-8]
```

Recommendation content is wrapped in a tinted box: `rounded-lg border border-primary/25 bg-accent/40 p-5`.

**Angular:** Component with `@Input() title`, `@Input() eyebrow`, optional icon slot.

---

### FindingMetaSidebar

Right panel on the finding detail page.

**Three blocks:**

1. **Metadata definition list** — `rounded-lg border bg-surface divide-y`  
   Each row: `flex justify-between px-4 py-2.5` with `dt text-xs muted` + `dd` value.  
   Fields: Severity, Priority, Section, Effort, ID.

2. **Actions** — three buttons stacked:  
   - "Assign to team" — `bg-primary text-primary-foreground`  
   - "Add to roadmap" — `border bg-surface`  
   - "Mark resolved" — `border bg-surface`

3. **Discussion** — single comment bubble with name + timestamp + body.

**Angular:** Right panel for finding detail. Actions and discussion are future app-mode features; the metadata list is immediately useful.

---

### PrevNextNavigation

Two-column nav row at the bottom of a finding.

**Structure:**
```
[← Previous]        [Next →]
[prev finding title] [next finding title]
```

Each cell: `rounded-lg border p-4 hover:border-primary/30 hover:bg-surface-muted`.

**Angular:** Needs access to sibling findings. Implement with `@Input() prev` and `@Input() next` receiving partial finding objects (id + title).

---

## Sidebar components

### LogoMark

7×7 grid container (`grid h-7 w-7 place-items-center rounded-md bg-primary shadow-sm`) holding a `Sparkles` icon in `text-primary-foreground`.

Below it: wordmark ("UX Insight", `text-sm font-semibold`) + subtitle ("Evaluation platform", `text-[11px] muted`).

### SearchBar (sidebar)

```
[Search icon] Search reports…  [⌘K kbd]
```

Container: `rounded-md border bg-surface px-2.5 py-1.5 text-xs muted shadow-xs`.  
Kbd: `rounded border bg-background font-mono text-[10px]`.

### NavItem

```
[icon h-4 w-4 opacity-80] [label]  [badge? — font-mono text-[10px]]
```

Active: `bg-sidebar-accent text-sidebar-accent-foreground rounded-md`.

### RecentItem

```
[dot — h-1.5 w-1.5 rounded-full bg-primary/70] [client name]
```

### UserRow (sidebar footer)

```
[initials avatar — h-8 w-8 rounded-full bg-accent text-accent-foreground text-xs font-semibold]
[name — text-sm font-medium] [role — text-xs muted]
[ChevronDown — h-4 w-4 muted]
```

---

## Recurring micro-patterns

### Monospace numbers
Section eyebrows, finding priorities, quick-win indexes, and ToC numbers all use `font-mono text-xs text-muted-foreground`. This is a deliberate low-contrast numbering convention — present but not competing with content.

### Dot separators
Metadata rows use `·` in `text-muted-foreground` to separate items inline (e.g., status · date · auditor).

### Truncation guard
All flex containers with text that could overflow use `min-w-0` on the flex child and `truncate` on the text element.

### Icon-as-button
All standalone icon buttons use `grid h-8 w-8 place-items-center rounded-md` with `hover:bg-muted hover:text-foreground`. No visible border at rest.

### Effort badge
Reused shape for quick wins and finding rows: `rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] font-medium capitalize text-muted-foreground`. Displays `low effort`, `medium effort`, `high effort`.

### Tag chip
`rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-muted-foreground` — used for finding tags (`#accessibility`, `#contrast`, etc.).
