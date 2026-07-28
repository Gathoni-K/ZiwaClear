# ZiwaClear Backend — Audit Compliance Report
> Audited: 2026-07-20 | Auditor: Antigravity AI (Principal Backend / QA Role)

---

## 1. Compliance Matrix Table

| # | Component | Expected File | Actual File Found | Status | Line Numbers / Notes |
| :---: | :--- | :--- | :--- | :---: | :--- |
| A1 | Surface area formula (`1 m² = 40 kg`) | `lib/ecologicalMath.ts` | `src/utils/ecologicalMath.ts` | ✅ **PASSED** | L35: `SURFACE_KG_PER_M2 = 40`. Correctly applied in `rawMassToSurfaceM2()` (L44–46). |
| A2 | Quality modifier constants (`PREMIUM: 1.0`, `STANDARD: 0.85`, `MUDDY: 0.60`) | `lib/ecologicalMath.ts` | `src/utils/ecologicalMath.ts` | ✅ **PASSED** | L5–9: `QUALITY_MODIFIERS` object. All three values exactly match spec. |
| A3 | Yield conversion: `1 kg active → 0.0224 m³ Biogas` | `lib/ecologicalMath.ts` | `src/utils/ecologicalMath.ts` | ✅ **PASSED** | L36: `BIOGAS_M3_PER_ACTIVE_KG = 0.0224`. Used in `activeMassToBiogasM3()` (L56–58). |
| A4 | Yield conversion: `1 kg active → 0.42 kg CO₂e` | `lib/ecologicalMath.ts` | `src/utils/ecologicalMath.ts` | ✅ **PASSED** | L37: `CO2E_KG_PER_ACTIVE_KG = 0.42`. Used in `activeMassToCO2eKg()` (L60–62). |
| B1 | `batches` table — status, quality, quantity, location coords | `db/schema/batches.ts` | `src/db/schema/batches.ts` | ✅ **PASSED** | L7 `quantityKg`, L10–11 `latitude`/`longitude`, L12 `status` enum, L16 `qualityRating`. All present. |
| B2 | `landing_site_monitoring` table — `site_id`, `coverage_percentage`, `dominant_quality_grade`, timestamps | `db/schema/landingSiteMonitoring.ts` | `src/db/schema/landingSiteMonitoring.ts` | ✅ **PASSED** | L5 `siteId`, L6 `coveragePercentage`, L7 `dominantQualityGrade`, L8 `recordedAt`. Exact match. |
| B3 | Seeder — Dunga Beach (78%), Homa Bay (42%), Mbita Point (12%), Kendu Bay (65%) | `db/seedMonitoring.ts` | `src/db/seedMonitoring.ts` | ✅ **PASSED** | L10–33: All four baseline records present with correct `coveragePercentage` values. |
| C1 | Alert engine thresholds: `>60% → RED_ALERT`, `35–60% → MONITOR`, `<35% → SAFE` | `services/` | `src/services/landingSiteService.ts` | ⚠️ **PARTIAL** | L10: `>60` → RED_ALERT ✅. L12: `>35` → MONITOR ✅. Default `SAFE` ✅. **Bug:** MONITOR lower bound is exclusive (`>35`), so exactly 35% falls to `SAFE` instead of `MONITOR`. Spec says `35%–60%` should be MONITOR. |
| C2 | Dynamic SMS string for `RED_ALERT` with BMU leader customization | `services/` | `src/services/landingSiteService.ts` | ⚠️ **PARTIAL** | L33: Message built with `site.name`, `coveragePercentage`, `dominantQualityGrade`. Template present. **Gap:** No actual SMS dispatch to the BMU leader's phone (`site.bmuLeaderPhone`). The string is compiled and returned as `smsAlertPayload` but never sent (no call to Africa's Talking). The `evaluateCoverage()` method returns the payload but the caller (`simulateCoverageSpike` controller) also only returns it in JSON — never dispatches. |
| D1 | `GET /api/batches/impact` with null/zero guards | `routes/batchRoutes.ts` + `controllers/batchController.ts` | Both files confirmed | ✅ **PASSED** | Route: `batchRoutes.ts` L11. Controller: `batchController.ts` L123–153. Service-level null guard: `impactMetricsServices.ts` L75–76 uses `COALESCE(…, 0)` — DB-level zero fallback. Controller L81–82 applies `?? 0` guard. |
| D2 | `GET /api/batches/impact/trend` returning monthly array | `routes/batchRoutes.ts` | `src/routes/batchRoutes.ts` | ✅ **PASSED** | Route: L12. Controller: `batchController.ts` L161–169. Service: `impactMetricsServices.ts` L98–128 — groups by month, returns typed `BiogasTrendPoint[]`. |
| D3 | `GET /api/batches/:id` with quality-adjusted metrics | `routes/batchRoutes.ts` | `src/routes/batchRoutes.ts` | ✅ **PASSED** | Route: L14. Controller: `batchController.ts` L36–72. Applies `qualityRatingToGrade()` → `getActiveMass()` → biogas + CO₂e + surfaceArea → `yieldPredictions` object in response. |
| D4 | `POST /api/batches/simulate-coverage-spike` | `routes/batchRoutes.ts` | `src/routes/batchRoutes.ts` | ⚠️ **PARTIAL** | Route: `batchRoutes.ts` L16. Controller: `batchController.ts` L203–227. **Routing Hazard:** Route is registered as `POST /simulate-coverage-spike` but **below** the parameterized `GET /:id` line. In Express, `GET /:id` captures GET requests but `POST /simulate-coverage-spike` is a separate method and separate registration — technically safe. However, `GET /simulate-coverage-spike` (if hit accidentally) would hit the `getById` handler with id=`"simulate-coverage-spike"`. Should register POST before `/:id` as a safety measure (not a runtime bug, but a maintenance hazard). **Functional gap:** `coveragePercentage === 35` returns `SAFE` due to strict `>35` bound (see C1). |
| D5 | `POST /api/sms/incoming` webhook route | `routes/smsRoutes.ts` | `src/routes/smsRoutes.ts` | ✅ **PASSED** | L10: `smsRouter.post("/incoming", rateLimitSMS, validateRequest(incomingSMSValidator), smsController.receiveSMS)`. Correctly protected with rate limiting and validation. |
| E1 | CORS middleware in `server.ts` / `index.ts` | `server.ts` or `index.ts` | `src/index.ts` | ⚠️ **PARTIAL** | L2 import, L18 `app.use(cors())` — middleware is present. **Gap:** `cors()` is called with **no options object** — this enables CORS for ALL origins (`*`). Acceptable for a hackathon but production requires explicit `origin` whitelisting, `credentials` flag, and allowed methods. |

---

## 2. Gaps & Discrepancies Found

### 🔴 Gap 1 — Alert Threshold Off-By-One (C1, D4)
**File:** [`src/services/landingSiteService.ts`](file:///c:/Users/User/Desktop/CODEINE/hackathonTingz/ZiwaClear/backend/src/services/landingSiteService.ts#L10-L14)

```typescript
// CURRENT (BUG)
if (coveragePercentage > 60) {         // strictly >60
    operationalStatus = "RED_ALERT";
} else if (coveragePercentage > 35) {  // strictly >35 — 35% incorrectly falls to SAFE
    operationalStatus = "MONITOR";
}
```

The spec states `35%–60%` triggers `MONITOR`. At exactly `35%`, the condition `> 35` is `false`, so `SAFE` is returned instead. Boundary should be `>= 35`.

---

### 🟡 Gap 2 — RED_ALERT SMS Never Dispatched to BMU Leader (C2)
**File:** [`src/services/landingSiteService.ts`](file:///c:/Users/User/Desktop/CODEINE/hackathonTingz/ZiwaClear/backend/src/services/landingSiteService.ts#L32-L34)

The `smsAlertPayload` string is correctly compiled and returned, but:
1. The `landingSiteService.evaluateCoverage()` method does **not** call `smsClient.send()`.
2. The `batchController.simulateCoverageSpike()` handler returns `smsAlertPayload` in the JSON response but also does **not** dispatch it.
3. The `landingSites` schema has `bmuLeaderPhone` (verified in `landingSites.ts` L6), so the phone number is stored — it just isn't used in the alert pipeline.

---

### 🟡 Gap 3 — CORS Wildcard (E1)
**File:** [`src/index.ts`](file:///c:/Users/User/Desktop/CODEINE/hackathonTingz/ZiwaClear/backend/src/index.ts#L18)

```typescript
app.use(cors()); // No options — allows all origins
```

No explicit `origin`, `methods`, or `credentials` restriction. Fine for local dev/hackathon; needs hardening before production.

---

### 🟡 Gap 4 — Route Registration Order Hazard (D4)
**File:** [`src/routes/batchRoutes.ts`](file:///c:/Users/User/Desktop/CODEINE/hackathonTingz/ZiwaClear/backend/src/routes/batchRoutes.ts)

```typescript
batchRouter.get("/:id", batchController.getById);           // Line 14
batchRouter.post("/simulate-coverage-spike", ...);          // Line 16
```

The `POST /simulate-coverage-spike` is correctly isolated from `GET /:id` because HTTP methods differ. However, any future developer adding a `GET /simulate-coverage-spike` route after line 14 will hit the `getById` handler silently. Best practice is to put all static named routes before the wildcard `/:id`.

---

### 🟡 Gap 5 — `impactMetricsServices.ts` — `COALESCE` Present in Code but Not Verified at SQL Level
**File:** [`src/services/impactMetricsServices.ts`](file:///c:/Users/User/Desktop/CODEINE/hackathonTingz/ZiwaClear/backend/src/services/impactMetricsServices.ts#L73-L91)

The raw SQL uses `COALESCE(SUM(...), 0)` at L75–76. This is the correct approach. No issue found here — documenting for completeness to confirm the null/zero guard is at the **aggregate** level (DB returns 0, not `null`, when the table is empty), and the additional JS-level `?? 0` at L81–82 provides a second defensive layer. **PASSED** with note.

---

### ✅ No Issues Found On
- All three ecological constants (surface area, biogas, CO₂e)
- `batches` table — all required columns present (`status`, `qualityRating`, `quantityKg`, `latitude`, `longitude`)
- `landing_site_monitoring` schema — all four required fields present
- `seedMonitoring.ts` — all four required baseline records with correct percentages
- `GET /api/batches/impact` — route registered, controller functional, null guards at DB and JS level
- `GET /api/batches/impact/trend` — monthly grouping, correct return type
- `GET /api/batches/:id` — quality modifier pipeline fully wired (`qualityRatingToGrade → getActiveMass → biogasM3 / co2eKg / surfaceAreaM2`)
- `POST /api/sms/incoming` — route exists, rate limited, validated, controller dispatches to `smsService`
- Schema barrel (`db/schema/index.ts`) — all tables correctly exported

---

## 3. Immediate Remediation Plan

### Fix 1 — Alert Threshold Boundary (CRITICAL, 1 line)
**File:** `src/services/landingSiteService.ts` — Line 12

```diff
-        } else if (coveragePercentage > 35) {
+        } else if (coveragePercentage >= 35) {
```

This makes `35%` inclusive in the `MONITOR` band, matching the spec exactly.

---

### Fix 2 — Dispatch RED_ALERT SMS to BMU Leader Phone (HIGH)
**File:** `src/services/landingSiteService.ts`

Add the `smsClient` import and dispatch inside the `RED_ALERT` block. The `bmuLeaderPhone` field is already on the `site` record returned from the DB update.

```typescript
// Add import at the top of landingSiteService.ts
import { smsClient } from "../utils/africasTalking";

// Inside evaluateCoverage(), replace the smsAlertPayload block:
if (operationalStatus === "RED_ALERT") {
    smsAlertPayload = `ZiwaClear Alert: High-density hyacinth bloom detected at ${site.name} (${coveragePercentage}% coverage). Direct your youth harvesters to this zone today to maximize yield and lock in ${dominantQualityGrade} Payout Rates. Reply with BATCH to log harvests.`;

    // NEW: Actually dispatch the alert
    if (site.bmuLeaderPhone) {
        try {
            await smsClient.send({
                to: [site.bmuLeaderPhone],
                message: smsAlertPayload,
                from: process.env.AT_SHORTCODE || "5862",
            });
        } catch (smsError) {
            console.error("[LandingSiteService] Failed to send RED_ALERT SMS:", smsError);
            // Non-fatal: coverage update succeeded; SMS failure logged but not thrown
        }
    }
}
```

---

### Fix 3 — Harden CORS (MEDIUM, pre-production)
**File:** `src/index.ts` — Line 18

```diff
-app.use(cors());
+app.use(cors({
+    origin: process.env.ALLOWED_ORIGINS?.split(",") ?? ["http://localhost:5173"],
+    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
+    allowedHeaders: ["Content-Type", "Authorization"],
+    credentials: true,
+}));
```

Add `ALLOWED_ORIGINS=https://yourapp.example.com` to `.env.example`.

---

### Fix 4 — Route Registration Order (LOW, defensive)
**File:** `src/routes/batchRoutes.ts`

Move the `simulate-coverage-spike` POST above the parameterized `/:id` GET to make the intent unambiguous:

```typescript
batchRouter.get("/", batchController.listAvailable);
batchRouter.get("/all", batchController.list);
batchRouter.get("/impact", batchController.getImpact);
batchRouter.get("/impact/trend", batchController.getImpactTrend);
batchRouter.get("/price", batchController.getPrice);
// ── Named POST routes BEFORE the /:id wildcard ──
batchRouter.post("/simulate-coverage-spike", batchController.simulateCoverageSpike);
// ── Parameterized routes last ──
batchRouter.get("/:id", batchController.getById);
batchRouter.post("/:id/claim", validateRequest(claimBatchValidator), batchController.claim);
batchRouter.post("/:id/collect", validateRequest(collectBatchValidator), batchController.collect);
batchRouter.delete("/:id", batchController.delete);
```

---

## Summary

| Severity | Count | Items |
| :--- | :---: | :--- |
| 🔴 Bug (incorrect behavior) | 1 | Alert threshold off-by-one at 35% boundary |
| 🟡 Gap (feature incomplete) | 2 | RED_ALERT SMS never sent; CORS wildcard |
| 🟢 Maintenance (no runtime impact) | 1 | Route registration order |
| ✅ Fully Compliant | 12 | All other checklist items |

**Overall Compliance Score: 12/16 items fully passing. 3 items PARTIAL. 0 items MISSING.**
