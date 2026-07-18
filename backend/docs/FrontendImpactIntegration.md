# Frontend Impact Integration — Full Technical Record

**Scope:** Connecting the backend ecological impact calculation pipeline (`ecologicalMath.ts` → `impactMetricsService.ts` → `batchController.ts`) to the frontend dashboard components (`ImpactHero.tsx`, `Impact.tsx`, `MethaneTrendCard.tsx`, `BiogasCard.tsx`).

This document covers every change made, the reasoning behind each decision, the engineering mechanics of how it was implemented, and the software engineering concepts the work demonstrates.

---

## Part 1: Starting Condition — What Was Wrong

Before any changes were made, the frontend and backend existed in a state of total contract mismatch. The backend had been fully rebuilt with a sourced ecological math pipeline, but the frontend had not been updated to match it. Several distinct categories of failure existed simultaneously:

### 1.1 The Route Ordering Bug (Backend)

`batchRoutes.ts` declared its routes in this order:

```
GET /impact       → getImpact
GET /price        → getPrice
GET /:id          → getById       ← dynamic parameter, registered BEFORE the next line
GET /impact/trend → getImpactTrend ← NEVER REACHED
```

Express.js resolves routes in declaration order. The dynamic segment `/:id` is a catch-all for any single path segment. When a request arrives for `/impact/trend`, Express sees the `/:id` registration first, matches it with `id = "impact"`, and calls `getById("impact")` — which returns `404: Batch not found`. `getImpactTrend` was effectively dead code from the moment the router was constructed.

This is a classic mistake: literal paths and dynamic parameter segments cannot coexist safely unless literal paths are registered first.

### 1.2 The ESG Exporter Field Name Mismatch (Frontend)

`ImpactHero.tsx` contained a `handleDownloadESG` function that called `api.batches.getImpact()` and then read fields off the response that did not exist on the real API contract:

```typescript
impact.data?.totalBatches      // ← field does not exist
impact.data?.totalQuantityKg   // ← field does not exist
impact.data?.methaneAvoided    // ← field does not exist
impact.data?.lakeAreaRestored  // ← field does not exist
impact.data?.greenJobs         // ← field does not exist
```

The real `GET /api/batches/impact` response is an **array of formatted display cards**, not a flat object of raw numbers. Every one of these field accesses was silently resolving to `undefined`, meaning the exported CSV would contain `N/A` for every metric — an entirely non-functional exporter that appeared to work because no error was thrown.

### 1.3 Wrong Field Name on Both Chart Components

`MethaneTrendCard.tsx` and `BiogasCard.tsx` both imported `BiogasTrendPoint` from `../api/mockImpact.ts`, which defined the trend point shape as `{ month: string; m3: number }`.

The real backend trend endpoint returns `{ month: string; surfaceRestoredM2: number; biogasGeneratedM3: number; co2eAvoidedKg: number }`.

Both chart components accessed `d.m3` and used `dataKey="m3"`. Against live data, `m3` would be `undefined` on every point, rendering blank charts.

### 1.4 Dead Field Accesses on the Impact Page

`Impact.tsx` had an inline `useQuery` that called `api.batches.getImpact()` and then built `liveMetrics` by reading:

```typescript
impact.lakeAreaClearedM2    // ← does not exist on the card array
impact.co2eAvoidedTonnes    // ← does not exist on the card array
impact.totalTonnes          // ← does not exist on the card array
impact.greenJobs            // ← does not exist on the card array
```

The response is an array. Accessing named properties on an array in JavaScript yields `undefined`. All three metric cards would render `"0 m²"`, `"0 tCO₂e"`, `"0 tonnes"` — appearing loaded but carrying no real data.

### 1.5 Scattered Fetching and No Typed Contract

The same `GET /impact` endpoint was being fetched in two separate places: once in `ImpactHero.tsx` (for the exporter) and once in `Impact.tsx` (for the metric cards). There was no shared typed interface representing the actual backend response shape. Each consumer made its own ad-hoc assumptions about the payload, and both assumptions were wrong.

---

## Part 2: What Was Built — File by File

### 2.1 Backend: Route Ordering Fix — `batchRoutes.ts`

**The change:**

```diff
- batchRouter.get("/impact", batchController.getImpact);
- batchRouter.get("/price", batchController.getPrice);
- batchRouter.get("/:id", batchController.getById);
- batchRouter.get("/impact/trend", batchController.getImpactTrend);

+ batchRouter.get("/impact", batchController.getImpact);
+ batchRouter.get("/impact/trend", batchController.getImpactTrend);
+ batchRouter.get("/price", batchController.getPrice);
+ batchRouter.get("/:id", batchController.getById);
```

**Why:** Express matches routes top-to-bottom. All literal paths (`/impact`, `/impact/trend`, `/price`) must be registered before any dynamic parameter path (`/:id`). Moving `/impact/trend` above `/:id` ensures the router never mistakes it for a batch ID lookup.

**Impact:** `GET /api/batches/impact/trend` now correctly calls `getImpactTrend`, which calls `impactMetricsService.getBiogasTrend()` and returns the monthly time-series array the chart components need.

---

### 2.2 Frontend: Extended Type Definitions — `types/impact.ts`

**What was added:**

```typescript
export interface ImpactCard {
  id: "surface-restored" | "biogas-generated" | "carbon-offset";
  label: string;
  value: string;
  description: string;
}

export interface BackendTrendPoint {
  month: string;
  surfaceRestoredM2: number;
  biogasGeneratedM3: number;
  co2eAvoidedKg: number;
}

export interface RawCumulativeValues {
  surfaceRestoredM2: number;
  biogasGeneratedM3: number;
  co2eAvoidedKg: number;
  co2eAvoidedTonnes: number;
}
```

**Why:** These three interfaces are the typed schema of the backend's actual JSON responses. Having them in the canonical `types/` directory means every consumer imports from one place — the shape is defined once, and TypeScript will surface a compile error the moment any consumer tries to access a field that doesn't exist. This is the frontend equivalent of the backend's `CumulativeImpactMetrics` and `BiogasTrendPoint` interfaces in `impactMetricsServices.ts`.

`ImpactCard.id` is typed as a union of the three literal strings the controller actually produces (`"surface-restored"`, `"biogas-generated"`, `"carbon-offset"`). This matters because the icon map on the page uses `ImpactCard["id"]` as its key type — the compiler will warn if any case is unhandled.

`RawCumulativeValues` exists specifically for the ESG exporter: it holds the same metrics as `CumulativeImpactMetrics` on the backend, but derived on the frontend after receiving the formatted cards. It gives the exporter named, numeric fields to work with rather than string-parsing inline.

---

### 2.3 Frontend: Central Data Layer — `hooks/useImpactMetrics.ts`

This is the most architecturally significant file introduced in this integration.

**What it does:**

```
useImpactMetrics()
  ├── fetchImpactCards()      → GET /api/batches/impact      → ImpactCard[]
  ├── fetchImpactTrend()      → GET /api/batches/impact/trend → BackendTrendPoint[]
  ├── deriveRawCumulative()   → parses ImpactCard[] → RawCumulativeValues
  └── returns { cards, rawCumulative, trend, isLoading, error }
```

**The fetching layer:**

Both fetch functions validate the `{ success, data }` response envelope and throw a typed `Error` if `success` is `false`. This means React Query's error state captures server-side failures (database errors, service exceptions) as well as network failures, and the consuming component receives a consistent `error: Error | null` regardless of which layer failed.

**The `deriveRawCumulative` function:**

```typescript
function parseNumericPrefix(formatted: string): number {
  const cleaned = formatted.replace(/,/g, "").match(/[\d.]+/);
  return cleaned ? parseFloat(cleaned[0]) : 0;
}
```

The backend's `GET /impact` already returns formatted strings (`"12,400 m²"`, `"85,000 m³"`, `"5.2 tonnes CO2e"`). The ESG CSV exporter needs raw numbers. Rather than adding a second backend endpoint or doing any ecological arithmetic on the frontend, `deriveRawCumulative` strips the number back out of the string the server already computed. No formula is applied — the backend did all the math, and the frontend simply un-formats the presentation layer to recover the scalar value for export.

This is a deliberate architecture boundary: the frontend never performs `kg * 0.0224` or `kg / 40`. It only does string parsing of already-computed results.

**Why a custom hook and not inline `useQuery`:**

Before this change, `Impact.tsx` and `ImpactHero.tsx` each made their own fetch calls to the same endpoint. Two components, one endpoint, two independent network requests, two independent loading states, two completely separate error surfaces. With `useImpactMetrics`, React Query's cache deduplication means both components share the same in-flight request and the same cached result — only one network round-trip happens regardless of how many components call the hook.

The hook is also the single place where the `queryKey` and `refetchInterval` are defined. If the polling interval needs to change from 30 seconds to 60 seconds, it changes in one line.

---

### 2.4 Frontend: ImpactHero Refactor — `components/ImpactHero.tsx`

**What changed:**

```diff
- import { api } from "../api/config";
+ import { useImpactMetrics } from "../hooks/useImpactMetrics";

  export function ImpactHero() {
-   // had its own fetch calls inside handleViewReport and handleDownloadESG
+   const { rawCumulative, isLoading } = useImpactMetrics();
```

The two action handlers were fundamentally restructured:

`handleViewReport` went from:
```typescript
// fetched the API, then opened a JSON dump of the formatted card array
const res = await api.batches.getImpact();
w.document.write(JSON.stringify(res, null, 2));
```
to:
```typescript
// opens the raw numeric object that the hook already has in cache
w.document.write(JSON.stringify(rawCumulative, null, 2));
```

This is more useful: the report now shows actual scalars (`{ surfaceRestoredM2: 12400, biogasGeneratedM3: 85000 }`) rather than an array of formatted display strings.

`handleDownloadESG` went from reading five non-existent fields (all producing `N/A`) to reading from `rawCumulative`:
```typescript
`Surface Restored,${rawCumulative.surfaceRestoredM2},m²`,
`Biogas Generated,${rawCumulative.biogasGeneratedM3},m³`,
`CO2e Avoided,${rawCumulative.co2eAvoidedKg},kg`,
`CO2e Avoided,${rawCumulative.co2eAvoidedTonnes},tonnes`,
```

Both buttons gain a `disabled={isLoading}` attribute, preventing clicks before the data has arrived from the server.

---

### 2.5 Frontend: Impact Page Refactor — `pages/Impact.tsx`

**Icon assignment — the CARD_ICON_MAP pattern:**

The backend deliberately omits icons from its response. A `LucideIcon` is a React component reference — a function. It is not JSON-serializable. The controller doc explicitly notes: *"The frontend maps `id` → icon locally."*

The solution is a module-level constant that maps each known card ID to its icon:

```typescript
const CARD_ICON_MAP: Record<ImpactCard["id"], LucideIcon> = {
  "surface-restored": Droplet,
  "biogas-generated": Zap,
  "carbon-offset":    Cloud,
};
```

TypeScript enforces exhaustiveness here: because `ImpactCard["id"]` is the union `"surface-restored" | "biogas-generated" | "carbon-offset"`, the `Record` type requires all three keys to be present. Adding a new card ID to the backend without updating this map is a compile error, not a silent runtime bug.

The `toImpactMetric` function then merges the backend data with the local icon:
```typescript
function toImpactMetric(card: ImpactCard): ImpactMetric {
  return {
    id: card.id,
    icon: CARD_ICON_MAP[card.id],
    label: card.label,
    value: card.value,
    description: card.description,
  };
}
```

**Trend data:**

```diff
- data={MOCK_BIOGAS_TREND}
+ data={trend}
```

The `trend` array from `useImpactMetrics` is `BackendTrendPoint[]`. If the database has no eligible batches, the service returns an empty array — `MethaneTrendCard` receives `[]`, renders an empty chart, and does not crash. The total value label falls back to the biogas card's formatted string value from the cumulative endpoint, which is always present (even if it reads `"0 m³"`).

**Dead import removal:**

```diff
- import { useQuery } from "@tanstack/react-query";
- import { Waves, TreePine, Fish } from "lucide-react";
- import { api } from "../api/config";
- import { MOCK_BIOGAS_TREND, ... } from "../api/mockImpact";
+ import { useImpactMetrics } from "../hooks/useImpactMetrics";
```

`MOCK_BIOGAS_TREND` is no longer imported because `MethaneTrendCard` now receives live data. `Waves`, `TreePine`, `Fish` are replaced by `Droplet`, `Zap`, `Cloud` — the icons now chosen to semantically match the actual card IDs from the backend rather than the prior hand-written metric list. The direct `api` import is removed because the hook owns all fetching.

`MOCK_SOCIAL_IMPACT_METRIC`, `MOCK_MILESTONES`, and `MOCK_AUDIT_PROGRESS_PERCENT` remain imported — these have no backend endpoint and are intentionally kept as static data until that scope is built.

---

### 2.6 Frontend: Chart Component Contract Fix — `MethaneTrendCard.tsx` and `BiogasCard.tsx`

Both files had two problems: wrong import source and wrong field name.

**Import fix (both files):**
```diff
- import type { BiogasTrendPoint } from "../api/mockImpact";
+ import type { BackendTrendPoint as BiogasTrendPoint } from "../types/impact";
```

The `as BiogasTrendPoint` alias preserves the local name so no other references in the file need to change — a purely additive change.

**Field name fix in `MethaneTrendCard.tsx`:**
```diff
- data: data.map((d) => d.m3),
+ data: data.map((d) => d.biogasGeneratedM3),

- {(d.m3 / 1000).toFixed(1)}k
+ {(d.biogasGeneratedM3 / 1000).toFixed(1)}k
```

**Field name fix in `BiogasCard.tsx`:**
```diff
- dataKey="m3"
+ dataKey="biogasGeneratedM3"
```

The Recharts `dataKey` prop is a string — the library uses it to look up the value on each data object at render time. With `"m3"` against `BackendTrendPoint` objects, every lookup returned `undefined`, producing a flat line (or no line) in the chart. With `"biogasGeneratedM3"`, the chart reads the correct field.

---

## Part 3: The Data Flow — End to End

```
Database (batches table)
    │
    │  WHERE status IN ('claimed', 'collected')
    │  SUM(quantityKg)                    → sumRawKg
    │  SUM(quantityKg * qualityModifier)  → sumActiveMassKg
    │
    ▼
impactMetricsService.getCumulativeImpactMetrics()
    │
    │  surfaceRestoredM2  = sumRawKg / 40
    │  biogasGeneratedM3  = sumActiveMassKg * 0.0224
    │  co2eAvoidedTonnes  = sumActiveMassKg * 0.42 / 1000
    │
    ▼
batchController.getImpact()
    │
    │  Shapes into ImpactCard[]
    │  value = toLocaleString() formatted string
    │  icon intentionally omitted
    │
    ▼
GET /api/batches/impact  →  { success: true, data: ImpactCard[] }


GET /api/batches/impact/trend  →  { success: true, data: BackendTrendPoint[] }
    │  (same math, grouped by month via DATE_TRUNC)
    │
    ▼

useImpactMetrics() hook (frontend)
    ├── cardsQuery  → ImpactCard[]
    ├── trendQuery  → BackendTrendPoint[]
    └── deriveRawCumulative() → RawCumulativeValues (parse formatted strings back to numbers)
              │
    ┌─────────┼──────────────────────────────────────┐
    │         │                                      │
    ▼         ▼                                      ▼
ImpactHero  Impact.tsx                    MethaneTrendCard / BiogasCard
(ESG export (MetricCard grid via          (live BackendTrendPoint[] data)
 uses raw   toImpactMetric + CARD_ICON_MAP)
 cumulative)
```

---

## Part 4: Engineering Concepts Practiced

### 1. Express Route Precedence

Express.js evaluates route handlers in registration order. Dynamic path parameters (`:param`) match any single path segment, making them greedy. Literal routes must always precede dynamic ones, or the dynamic segment silently wins. This is not a bug in Express — it is the documented, intentional behavior — but it is a frequent source of "why is my endpoint returning the wrong thing?" confusion.

### 2. Contract-First API Design

Every consumer of the API works against a typed interface (`ImpactCard`, `BackendTrendPoint`) rather than making assumptions about the payload shape. The interface is defined once, in one place (`types/impact.ts`), and imported by all consumers. When the backend contract changes, TypeScript surfaces every affected callsite as a compile error rather than a runtime bug discovered in production.

### 3. Separation of Concerns — Strict Layer Boundaries

This integration enforces a hard wall between three responsibilities:
- **Backend:** all ecological arithmetic (the only place `0.0224`, `0.42`, `40` appear)
- **Hook:** all network logic (fetch, cache, error propagation)
- **Components:** all UI concerns (layout, icons, loading states)

No component touches `fetch`. No hook does arithmetic. No backend handler knows what a `LucideIcon` is. Each layer is independently changeable without breaking the others.

### 4. The Serialization Boundary Problem

JSON can represent numbers, strings, booleans, arrays, and plain objects. It cannot represent functions — and a React component is a function. `LucideIcon` is a non-serializable type. The backend correctly omits it; the frontend correctly adds it locally via a lookup map. This is the pattern whenever an API must serve a client whose UI abstractions (icons, color tokens, component references) have no representation in a serialization format.

### 5. React Query Deduplication and Cache Sharing

When multiple components call the same hook that uses the same `queryKey`, React Query serves all of them from a single in-flight request and a single cached result. Before this refactor, `ImpactHero` and `Impact` each issued their own fetch — two network requests, two loading states, two error surfaces, with the possibility of them resolving with slightly different data if a mutation occurred between them. After the refactor, one request, one cache entry, all consumers synchronized.

### 6. TypeScript Exhaustive Record for Icon Mapping

```typescript
const CARD_ICON_MAP: Record<ImpactCard["id"], LucideIcon> = { ... }
```

Using `Record<ImpactCard["id"], LucideIcon>` instead of `Record<string, LucideIcon>` means TypeScript requires every member of the union to have a corresponding entry. If a new card ID is added to the backend and `ImpactCard["id"]` union is extended, this map becomes a compile error until it is updated. The compiler enforces completeness — a new feature cannot be silently ignored.

### 7. Back-Parsing vs. Duplicate Computation

The ESG exporter needed raw numbers. Two approaches were available:
- Add a new backend endpoint that returns raw numbers (adds surface area, a new route, new controller method)
- Parse the number back out of the formatted string the backend already returned

The second approach was correct here because the data was already computed and present in the response — just formatted for display. `parseNumericPrefix("12,400 m²")` recovers `12400` without any formula knowledge. This is distinct from re-computing: the frontend is not applying any ecological math, it is undoing a locale formatting step to get the number back. The single source of truth for the underlying value remains the backend.

### 8. Fail-Safe Empty States

Throughout the integration, every data-absent state produces a safe, non-crashing fallback:
- `cards.length === 0` → `rawCumulative = EMPTY_RAW` (all zeros)
- `trend = []` → `MethaneTrendCard` receives an empty array and renders an empty chart
- `biogasCard` not found → `biogasTotalValue = "—"` (typographic placeholder)

No check throws, no check returns `null` into a component that doesn't expect it, no check silently produces `NaN`. Each fallback is explicitly defined and documents what "no data yet" looks like.

### 9. Named Constants Over Inline Literals

The `EMPTY_RAW` constant and `CARD_ICON_MAP` constant are module-level named values rather than inline object literals created inside the hook or component body. Module-level constants are constructed once, not on every render. For objects this simple the performance difference is negligible, but the practice matters for objects that are used in dependency arrays or memoization — an inline object literal has a new identity on every render, which breaks `useMemo`, `useEffect`, and `useCallback` dependencies.

### 10. Import Aliasing for Backwards Compatibility

```typescript
import type { BackendTrendPoint as BiogasTrendPoint } from "../types/impact";
```

The re-export alias (`as BiogasTrendPoint`) allows the import source to change without touching every internal reference in the file. The component's internal code still reads `BiogasTrendPoint`; only the import line changed. This is a minimal-diff technique — the fewer lines that change in a refactor, the smaller the review surface and the lower the risk of an accidental side-effect.

### 11. Disabling UI During Async Operations

Both action buttons in `ImpactHero` gain `disabled={isLoading}`. This prevents a user from clicking "Download ESG Data" before the hook has received its first successful response, which would produce a CSV of all zeros from `EMPTY_RAW`. Disabling the control until data is ready is a UX correctness requirement, not a cosmetic choice — it prevents the component from generating misleading output.

---

## Part 5: What Was Deliberately Not Changed

| Item | Reason |
|------|--------|
| `MOCK_SOCIAL_IMPACT_METRIC` | No backend endpoint for green jobs; mock retained intentionally |
| `MOCK_MILESTONES` | No backend endpoint for milestones; mock retained intentionally |
| `MOCK_AUDIT_PROGRESS_PERCENT` | No backend endpoint for audit state; mock retained intentionally |
| `getById` biogas factor (`0.07`) | A pre-existing inconsistency flagged in the controller but not silently changed without being asked |
| `mockImpact.ts` file itself | Not deleted — still exports the three retained mock values above |
| Chart styling and layout | No visual changes; only data wiring changed |

---

## Part 6: Files Modified at a Glance

| File | Type | Change |
|------|------|--------|
| `backend/src/routes/batchRoutes.ts` | Backend | Route order fix: `/impact/trend` moved above `/:id` |
| `frontend/src/types/impact.ts` | Types | Added `ImpactCard`, `BackendTrendPoint`, `RawCumulativeValues` |
| `frontend/src/hooks/useImpactMetrics.ts` | Hook (new file) | Central fetch layer for both impact endpoints |
| `frontend/src/components/ImpactHero.tsx` | Component | Removed inline fetches; consumes hook; ESG CSV fixed |
| `frontend/src/pages/Impact.tsx` | Page | Replaced inline `useQuery`; `CARD_ICON_MAP`; live trend data |
| `frontend/src/components/MethaneTrendCard.tsx` | Component | Type import fixed; `d.m3` → `d.biogasGeneratedM3` |
| `frontend/src/components/BiogasCard.tsx` | Component | Type import fixed; `dataKey="m3"` → `dataKey="biogasGeneratedM3"` |
