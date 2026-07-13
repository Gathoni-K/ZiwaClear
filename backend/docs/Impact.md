# The Ecological Impact Metrics Pipeline — What We Built, and Why

**Scope:** Replacing hardcoded, mock ecological metrics (surface area restored, biogas generated, carbon offset) with a real computation pipeline sourced from actual harvested-kg data in the `batches` table, wired end-to-end from database to controller.

This document has two halves: first, a full account of what was built and why, file by file; second, a breakdown of the software engineering principles this work leaned on, since several of them are worth understanding explicitly rather than absorbing implicitly.

---

## Part 1: What we built

### The starting problem

The frontend had three ecological metrics — Surface Restored, Biogas Generated, Carbon Offset — living as **static mock data** (`MOCK_IMPACT_METRICS`, `MOCK_BIOGAS_TREND`). These numbers weren't derived from anything; they were plausible-looking constants sitting in a frontend file. The task was to replace them with numbers computed from real harvest reports stored in `batches`.

### The core architectural decision, made early and held throughout

Before any code was written, we established one rule that shaped everything downstream: **the LLM/frontend never does ecological arithmetic or classification — only backend code does, using sourced, cited constants.**

This wasn't arbitrary. Two failure modes were being deliberately avoided:
1. Asking an LLM to convert "one truckload" into kilograms, or compute urgency from vague language, produces inconsistent, unauditable results — models don't do arithmetic reliably, and "high urgency" means different things run to run.
2. Hardcoding plausible-sounding constants (the original mock data's problem) means nobody can trace *why* a number is what it is, or update it confidently when the real science changes.

So the shape of every solution in this session followed the same pattern: **structured extraction (LLM or user input) → pure, sourced computation (backend code) → presentation (frontend)**, with a hard wall between each stage.

### File-by-file summary

#### `lib/ecologicalMath.ts` — the sourced constants and pure conversion functions

This file holds nothing but pure functions and constants, with no database access and no framework dependency. It is the single place in the codebase where "1 kg of wet hyacinth becomes X" is defined.

Contents:
- `QUALITY_MODIFIERS` — energy-yield penalty per grade: `PREMIUM: 1.0`, `STANDARD: 0.85`, `MUDDY: 0.60`. Sourced reasoning: mud and dead roots don't ferment in a digester, so lower-grade batches are penalized *only* for chemical yield, not for physical footprint.
- `QUALITY_RATING_TO_GRADE` — maps the database's raw integer rating (`1`/`2`/`3`) to the grade name (`MUDDY`/`STANDARD`/`PREMIUM`), with `DEFAULT_QUALITY_GRADE = "STANDARD"` as the safe fallback for missing or invalid ratings.
- `SURFACE_KG_PER_M2 = 40` — the physical density baseline for a packed hyacinth mat on the Winam Gulf; used to convert raw kg into surface area cleared.
- `BIOGAS_M3_PER_ACTIVE_KG = 0.0224` — derived from published Total Solids/Volatile Solids anaerobic digestion research (wet mass × 7% TS × 80% VS × 400 L biogas/kg VS).
- `CO2E_KG_PER_ACTIVE_KG = 0.42` — derived from methane's GWP of 28 over a 100-year horizon, applied to the methane that would otherwise be released by hyacinth left to rot anaerobically in the lake.
- Pure functions: `rawMassToSurfaceM2`, `getActiveMass`, `activeMassToBiogasM3`, `activeMassToCO2eKg`, `activeMassToCO2eTonnes`, `qualityRatingToGrade`, `qualityRatingToModifier`.

**Why it's structured this way:** every constant here has a cited scientific basis (noted in comments), and every function is a one-line, side-effect-free calculation. This makes the file trivially unit-testable and means "what does 500kg of muddy hyacinth actually produce" is answerable by reading four lines of code, not by archaeology through a service file.

#### `services/impactMetricsService.ts` — querying and aggregating real data

This is where the pure math from `ecologicalMath.ts` gets applied to actual rows in the `batches` table.

Key design decision, corrected mid-session: **surface area uses raw, unmodified kg; biogas and CO2e use quality-adjusted "active mass."** These are not the same number, because they represent different physical realities:
- *Surface area cleared* is a spatial fact — a kilogram of muddy hyacinth occupied the same footprint on the water as a kilogram of pristine hyacinth. The quality grade shouldn't touch this number.
- *Biogas/CO2e yield* is a chemical fact — muddy, root-heavy biomass doesn't ferment as well, so its yield is legitimately lower per kilogram.

This meant the service computes **two separate running sums per query** (`sumRawKg` and `sumActiveMassKg`), rather than a single sum that gets reused for both purposes — a subtle but important correction from an earlier draft that would have under-counted surface area for lower-grade batches.

Other decisions baked in:
- **Status filtering**: only `status IN ('claimed', 'collected')` batches count toward impact. `available` batches haven't been actioned yet; `flagged` batches (disputed/duplicate/spam) are excluded outright so they can't inflate the numbers — a data-integrity safeguard, not just a filter of convenience.
- **The quality-modifier SQL is derived, not duplicated.** The `CASE WHEN...THEN...END` SQL expression is built at runtime by iterating over `QUALITY_RATING_TO_GRADE` and `QUALITY_MODIFIERS` from `ecologicalMath.ts`, rather than being hand-written as a second, parallel literal. This was a direct fix after noticing the first draft had the same mapping expressed twice — once in TypeScript, once in raw SQL — which is exactly the kind of duplication that quietly drifts out of sync when one copy gets updated and the other doesn't.
- **Aggregation happens in the database**, not in application memory — `SUM(...)` runs as part of the SQL query rather than pulling every `batches` row into Node and summing in a loop. This scales correctly as the table grows.
- Two read patterns, matching the two things the frontend needs: `getCumulativeImpactMetrics()` (all-time totals for dashboard cards) and `getBiogasTrend()` (grouped by `DATE_TRUNC('month', claimed_at)`, chronologically ordered, for the trend chart) — both exposing all three metrics (surface, biogas, CO2e) per period, since computing all three costs nothing extra once the two sums exist.

#### `controllers/batchController.ts` — shaping the response, and where it plugs into what already existed

The router already had a `GET /impact` route wired to a `getImpact` handler, previously backed by a different, older function (`batchService.getImpactStats()`). The new `getImpact` handler was swapped to call `impactMetricsService.getCumulativeImpactMetrics()` instead, keeping the same route, same response envelope style (`{success, data}` / `{success, message}` on error), and same try/catch/log pattern as every other handler in the file — no new conventions introduced, it fits the existing shape.

A new `getImpactTrend` handler was added alongside it for the monthly series, following the identical pattern.

Two things were deliberately **not** included in the controller's output, both flagged rather than silently worked around:
- **`icon`** — a `LucideIcon` is a React component reference and cannot be serialized over JSON. The controller cannot supply it; the frontend must keep its own `id → icon` lookup map and merge it in after fetching.
- **`trend` / `badge`** (e.g. "+12% MoM", "Certified") — neither is computable from the current data without a prior-period comparison or a separate certification/audit workflow, neither of which exist yet. Rather than fabricate a number to fill the field, it's omitted; the frontend type marks both as optional, so this is valid, not a workaround.

A pre-existing, **unrelated** hardcoded ecological constant was also spotted in `getById` (`biogasM3 = quantityKg * 0.07`) — a different, uncited factor from the sourced `0.0224` used everywhere else. This was flagged with a code comment rather than silently changed, since changing another endpoint's behavior without being asked risks breaking something depending on the old figure.

#### The frontend contract mismatch (surfaced, not yet resolved)

While reviewing `ImpactHero.tsx`, we found that **two different frontend components expect two different shapes from the same `getImpact()` call** — one wants an array of pre-formatted display cards (`{id, label, value: "12,400 m²"}`), the other wants a flat object of raw numbers (`{totalQuantityKg, methaneAvoided, lakeAreaRestored}`) for CSV export and JSON report viewing. This is a real design conflict, not a bug in the backend — it means one endpoint can't currently serve both consumers correctly, and was intentionally left open rather than guessed at, since resolving it means either restructuring the endpoint (raw numbers only, both components format their own display) or adding a second endpoint — a decision that affects the frontend, which was explicitly out of scope for this session.

---

## Part 2: Software engineering concepts this work leaned on

### 1. Separation of concerns (layered architecture)

Every file in this pipeline does exactly one job:
- `ecologicalMath.ts` — pure calculation, no I/O
- `impactMetricsService.ts` — data access and aggregation, no presentation logic
- `batchController.ts` — request/response shaping, no calculation logic
- (frontend, not yet touched) — display formatting and icon mapping only

This is the same principle applied earlier in the session to the SMS parser (`unitReference.ts` for conversions, `urgencyRules.ts` for thresholds, `smsParser.ts` for orchestration). The benefit isn't aesthetic — it means a change to the biogas yield factor touches exactly one file, a change to which statuses count toward impact touches exactly one other file, and neither change risks breaking the controller's response shape.

### 2. Pure functions vs. side-effecting code

Every function in `ecologicalMath.ts` takes inputs and returns outputs with no side effects — no database calls, no mutation, no dependency on anything outside its own arguments. This makes them trivially unit-testable (`getActiveMass(1000, "MUDDY")` should always equal `600`, forever, with no setup) and safe to reuse anywhere (the same function could back a per-batch preview, a cumulative dashboard, or a future export feature, without risk of inconsistent behavior between them).

Side-effecting code (database queries in the service, HTTP responses in the controller) was deliberately kept out of this pure layer.

### 3. Single source of truth (and actively eliminating duplication)

The clearest example: the quality rating → grade → modifier mapping exists in exactly one place (`QUALITY_RATING_TO_GRADE` and `QUALITY_MODIFIERS` in `ecologicalMath.ts`). When the service needs this same mapping expressed as SQL, it **derives** the SQL from those same constants at runtime rather than hand-writing a second copy of the mapping in a different language. This was an active correction mid-session — the first draft had the mapping duplicated once in TypeScript and once as a literal SQL `CASE` statement, and that duplication was identified and removed specifically because two copies of the same fact will eventually disagree with each other after one gets edited and the other doesn't.

### 4. Domain modeling before implementation (getting the physics right, not just the code)

A significant correction in this session wasn't a coding bug — it was a **conceptual** one. The first draft applied the quality modifier to *both* surface area and biogas/CO2e calculations. The correction (surface area uses raw mass; biogas/CO2e use quality-adjusted mass) came from recognizing that "how much area did this occupy" and "how much of this will ferment" are two different physical questions, and conflating them would have produced a subtly wrong number that looked plausible. This is a reminder that software correctness in domain-heavy systems depends on getting the underlying model right first — no amount of clean code fixes a formula that's answering the wrong question.

### 5. Schema-enforced contracts and typed boundaries

Every stage of the pipeline has an explicit, validated shape it's allowed to produce — this mirrors the SMS parser's `llmExtractionSchema` vs. `smsParserSchema` split from earlier in this project. Here, `CumulativeImpactMetrics` and `BiogasTrendPoint` are explicit TypeScript interfaces the service guarantees to return, and the controller reshapes them into exactly what the route contract promises — rather than passing loosely-typed `any` data through the pipeline and hoping the shapes line up by convention.

### 6. Fail-safe defaults over silent failure

`qualityRatingToGrade` falls back to `STANDARD` for any missing or invalid rating, rather than throwing, returning `null`, or (worse) defaulting to `0` and silently zeroing out that batch's contribution to the dashboard. A missing data point degrades to a *reasonable, documented* default rather than corrupting the aggregate or crashing the request — this is a deliberate choice about how the system should behave under incomplete real-world data, not an accident of the fallback logic.

### 7. Data integrity as a first-class concern, not an afterthought

The decision to exclude `flagged` batches from every aggregate isn't a performance optimization or code cleanliness choice — it's a direct data-integrity requirement, made explicit in the code (and callable out to reviewers/judges) precisely because disputed or spam data silently inflating an environmental impact number is a serious credibility risk for the kind of dashboard this feeds.

### 8. Not guessing at unknowns — pausing for real data instead of plausible data

Multiple points in this session (the unit-to-kg conversion table, the biogas/CO2e factors, the quality rating mapping, the status-inclusion rules) were explicitly *not* invented, even though plausible-sounding numbers could have been produced quickly. Each one was paused on and sourced from you before being written into code. This mirrors the core problem this whole task started from — the original mock data being "hardcoded ecological math" nobody could trace back to a source — and it was treated as a standard to hold the *replacement* code to as well, not just a complaint about the old code.

### 9. Surfacing contradictions instead of silently resolving them

When `ImpactHero.tsx` turned out to expect a different response shape than the one just built, the honest move was to name the conflict explicitly (two components, two incompatible shapes, one endpoint) rather than quietly picking one interpretation, shipping it, and letting a runtime bug surface later when the other component broke. Recognizing a genuine design conflict and pausing on it is itself a software engineering skill — most production bugs come from exactly this kind of ambiguity being silently guessed at instead of raised.

### 10. Backward-compatible integration into existing conventions

The new controller methods were written to match the existing file's established patterns exactly — same `{success, data}` / `{success, message}` envelope, same try/catch/console.error shape, same route-per-method structure — rather than introducing a new, "better" convention alongside the old one. Consistency within an existing codebase is usually worth more than a marginally cleaner pattern that now has to coexist with ten other handlers that don't follow it.