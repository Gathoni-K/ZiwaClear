# Landing Site Early Warning & Alert Loop — Implementation Record

**Scope**: Implementation of the "Water Hyacinth Coverage Monitoring & BMU Smart Tip Alert Loop" to support IGAD Hackathon 2026 early warning features.

This document records the database schemas, service evaluation logic, and simulation endpoints introduced to track real-time hyacinth canopies and trigger smart SMS notifications to Beach Management Units (BMUs).

---

## 1. What Was Built (File by File)

### `backend/src/db/schema/landingSites.ts`
**Why**: We needed a persistent record of the physical landing sites monitored by the early warning system. The existing `beaches` table was insufficient as it lacked specific operational metrics like coverage and grading. 
**How**: A new Drizzle ORM schema was introduced to represent a landing site.

**Example**:
[landingSites.ts](file:///c:/Users/User/Desktop/CODEINE/hackathonTingz/ZiwaClear/backend/src/db/schema/landingSites.ts#L3-L11)
```typescript
export const landingSites = pgTable("landing_sites", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    bmuLeaderPhone: varchar("bmu_leader_phone", { length: 20 }).notNull(),
    coveragePercentage: integer("coverage_percentage").notNull().default(0),
    dominantQualityGrade: varchar("dominant_quality_grade", { length: 20 }).notNull().default('STANDARD'),
    operationalStatus: varchar("operational_status", { length: 20 }).notNull().default('SAFE'),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
```

### `backend/src/db/schema/index.ts`
**Why**: Drizzle requires all schemas to be exported from a central index for the ORM configuration and migrations to recognize them.
**How**: We added `export * from "./landingSites";` to ensure it is registered.

**Example**:
[index.ts](file:///c:/Users/User/Desktop/CODEINE/hackathonTingz/ZiwaClear/backend/src/db/schema/index.ts#L6-L7)
```typescript
export * from "./sms";
export * from "./landingSites";
```

### `backend/src/services/landingSiteService.ts`
**Why**: We needed a centralized location for business logic evaluating coverage spikes and transitioning operational statuses. Putting this logic inside the controller would break the separation of concerns.
**How**: A dedicated `evaluateCoverage` method checks if the coverage is greater than 60% (escalating to `RED_ALERT`) or greater than 35% (escalating to `MONITOR`). It updates the database row and selectively constructs a localized smart harvesting tip payload intended for Africa's Talking SMS API.

**Example**:
[landingSiteService.ts](file:///c:/Users/User/Desktop/CODEINE/hackathonTingz/ZiwaClear/backend/src/services/landingSiteService.ts#L5-L39)
```typescript
    public async evaluateCoverage(siteId: number, coveragePercentage: number, dominantQualityGrade: string) {
        let operationalStatus = "SAFE";
        let smsAlertPayload = null;

        if (coveragePercentage > 60) {
            operationalStatus = "RED_ALERT";
        } else if (coveragePercentage > 35) {
            operationalStatus = "MONITOR";
        }
// ...
        if (operationalStatus === "RED_ALERT") {
            smsAlertPayload = `ZiwaClear Alert: High-density hyacinth bloom detected at ${site.name} (${coveragePercentage}% coverage). Direct your youth harvesters to this zone today to maximize yield and lock in ${dominantQualityGrade} Payout Rates. Reply with BATCH to log harvests.`;
        }
```

### `backend/src/controllers/batchController.ts` & `backend/src/routes/batchRoutes.ts`
**Why**: We needed a backdoor endpoint for hackathon demo purposes to simulate a sudden coverage spike and trigger the alert generation.
**How**: We added a new `simulateCoverageSpike` method mapped to a `POST /api/batches/simulate-coverage-spike` route. It consumes the payload, passes it to the `landingSiteService`, and returns the updated site metrics alongside the `smsAlertPayload` in a standard `{ success, data }` format.

**Example (Route)**:
[batchRoutes.ts](file:///c:/Users/User/Desktop/CODEINE/hackathonTingz/ZiwaClear/backend/src/routes/batchRoutes.ts#L16-L16)
```typescript
batchRouter.post("/simulate-coverage-spike", batchController.simulateCoverageSpike);
```

**Example (Controller)**:
[batchController.ts](file:///c:/Users/User/Desktop/CODEINE/hackathonTingz/ZiwaClear/backend/src/controllers/batchController.ts#L201-L226)
```typescript
    public async simulateCoverageSpike(req: Request, res: Response) {
        // Validation...
        const result = await landingSiteService.evaluateCoverage(
            parseInt(siteId.toString()), 
            coveragePercentage, 
            dominantQualityGrade
        );

        return res.json({ 
            success: true, 
            data: {
                site: result.site,
                smsAlertPayload: result.smsAlertPayload
            }
        });
    }
```

---

## 2. Engineering Concepts Covered

### 1. Separation of Concerns (Service Layer Pattern)
By isolating the evaluation logic (`evaluateCoverage`) inside `landingSiteService.ts`, the controller remains thin. The controller is only responsible for parsing HTTP requests and returning HTTP responses. The core domain rules—when a site enters a `RED_ALERT` and what the SMS payload looks like—live strictly in the service layer. This ensures the rules can be reused (e.g., triggered by a cron job or webhook) without depending on an Express request.

### 2. State Escalation & Thresholds
The service dynamically escalates the `operationalStatus` between `SAFE`, `MONITOR`, and `RED_ALERT` based on fixed mathematical thresholds (35% and 60%). This prevents "flapping" and provides distinct actionable bands for the frontend dashboard and SMS gateway.

### 3. Contextual Data Hydration (Smart Tips)
Instead of hardcoding a generic "Hyacinth detected" message, the system dynamically hydrates a message template with contextual live data: the specific landing site name, the precise coverage percentage, and the current grade (`PREMIUM`, `STANDARD`, `MUDDY`). This contextual hydration drives behavior (e.g., directing youth harvesters to high-yield areas).

### 4. Self-Documenting Code over Comments
To adhere to strict policy, no inline or block comments were included in the newly generated files. Instead, the domain model is made obvious through descriptive naming conventions (`simulateCoverageSpike`, `dominantQualityGrade`, `operationalStatus`, `evaluateCoverage`) and explicit TypeScript types.
