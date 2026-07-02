# Testing Strategy — UX Insight

---

## Test Runner

UX Insight uses **Vitest** via Angular's `@angular/build:unit-test` builder. The test API follows Jasmine-compatible syntax (`describe`, `it`, `expect`, `beforeEach`) and Angular's own `TestBed` utilities.

```bash
cd app
npm test
```

---

## What to Test

### Reusable components

Every component in `app/shared/` should have a companion `.spec.ts` file covering:

- The component creates without error.
- Required inputs produce the expected rendered output.
- Computed signals return the correct derived values.
- Edge cases for inputs that affect conditional rendering (empty state, boundary values).

### Services

Every service in `app/services/` should have unit tests for:

- **Success state** — after a successful load, the data signal is populated and `isLoading` resets to `false`.
- **Error state** — after a failed load, the error signal is set and `isLoading` resets to `false`.

Use `HttpTestingController` from `@angular/common/http/testing` to mock HTTP responses without hitting the network.

### Page components

Page-level components (`app/pages/`) do not need exhaustive tests. A basic smoke test (component creates, renders a top-level element) is sufficient. Detail testing belongs to the reusable components they compose.

---

## What Not to Test

- Private method implementations — test the public behavior those methods produce.
- Angular internals — do not test change detection cycles, zone behavior, or framework lifecycle timing.
- Pure template structure that does not encode logic — checking that a `<div>` exists adds no value.
- Snapshot tests — they couple tests to markup details and produce noisy diffs.

---

## Test Style

### Behavior, not implementation

Name tests in terms of observable behavior, not internal structure.

```ts
// correct
it('should display the score as a percentage of the maximum', () => { ... });
it('should show an error message when the report fails to load', () => { ... });

// incorrect — describes implementation, not behavior
it('should call formatLabel()', () => { ... });
it('should set isLoading to false', () => { ... });
```

### Setup

Use `TestBed.configureTestingModule` in `beforeEach` for component and service tests. Prefer `compileComponents()` for components with external templates.

```ts
describe('ScoreCardComponent', () => {
  let fixture: ComponentFixture<ScoreCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreCardComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

### Assertions

Use Angular's `fixture.nativeElement` or the `DebugElement` API for DOM assertions. Prefer querying by ARIA role or semantic element over querying by CSS class.

```ts
// preferred
const heading = fixture.nativeElement.querySelector('h2');
expect(heading?.textContent).toContain('Accessibility');

// avoid — couples the test to styling decisions
const card = fixture.nativeElement.querySelector('.score-card--large');
```

### Keep tests short

Each `it` block should have one clear assertion. If a test needs more than ~10 lines, consider whether it is testing too many things at once.

---

## File Conventions

- Test files live next to the file they test: `score-card.ts` → `score-card.spec.ts`.
- `describe` labels match the class or function name: `describe('ScoreCardComponent', ...)`.
- Do not create test helper files unless a pattern is reused across three or more spec files.
