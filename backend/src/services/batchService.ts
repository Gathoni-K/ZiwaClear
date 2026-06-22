import { eq, and, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { batches, sms, beaches } from "../db/schema";

export class BatchService {
    public async createBatchFromSMS(data: {
        quantityKg: number;
        locationName: string;
        harvesterPhone: string;
        beachId?: number | null; // Keep as number | null to match integer("beach_id")
    }) {
        let latitude: number | null = null;
        let longitude: number | null = null;

        if (data.beachId) {
            // FIX: Query beaches using beaches.id (integer), not batches table!
            const [beach] = await db.select().from(beaches).where(eq(beaches.id, data.beachId));
            if (beach) {
                latitude = beach.latitude ? parseFloat(beach.latitude) : null;
                longitude = beach.longitude ? parseFloat(beach.longitude) : null;
            }
        }

        const locationCoords: Record<string, { lat: number; lng: number }> = {
            "dunga": { lat: -0.1481, lng: 34.7336 },
            "usenge": { lat: -0.0631, lng: 34.0322 },
            "kendu bay": { lat: -0.3667, lng: 34.6500 },
            "homa bay": { lat: -0.5167, lng: 34.4500 },
            "muhuru bay": { lat: -0.7000, lng: 34.0667 },
        };

        const normalizedLocation = data.locationName.toLowerCase().trim();
        const coords = locationCoords[normalizedLocation];

        const [batch] = await db.insert(batches).values({
            quantityKg: data.quantityKg,
            locationName: data.locationName,
            beachId: data.beachId || null,
            latitude: latitude || coords?.lat || null,
            longitude: longitude || coords?.lng || null,
            harvesterPhone: data.harvesterPhone,
            status: "available",
        }).returning();

        return batch;
    }

    // FIX: Changed parameter type from number to string to match uuid("id")
    public async getBatchById(id: string) {
        const [batch] = await db.select().from(batches).where(eq(batches.id, id));
        return batch || null;
    }

    public async listBatches(filters: {
        beachId?: number; // Keep as number to match integer("beach_id")
        status?: "available" | "claimed" | "collected" | "flagged";
        startDate?: string;
        endDate?: string;
        limit?: number;
        offset?: number;
    }) {
        let conditions = [];
        if (filters.beachId) conditions.push(eq(batches.beachId, filters.beachId));
        if (filters.status) conditions.push(eq(batches.status, filters.status));
        if (filters.startDate) conditions.push(gte(batches.createdAt, new Date(filters.startDate)));
        if (filters.endDate) conditions.push(lte(batches.createdAt, new Date(filters.endDate)));

        const query = db.select().from(batches);
        if (conditions.length > 0) {
            query.where(and(...conditions));
        }
        if (filters.limit) query.limit(filters.limit);
        if (filters.offset) query.offset(filters.offset);

        return await query;
    }

    public async getAvailableBatches() {
        return await db.select().from(batches).where(eq(batches.status, "available")).orderBy(batches.createdAt);
    }

    // FIX: Changed batchId type from number to string to match uuid("id")
    public async claimBatch(batchId: string, buyerId: string) {
        const batch = await this.getBatchById(batchId);
        if (!batch) throw new Error("Batch not found");
        if (batch.status !== "available") throw new Error("Batch is not available");

        const [updated] = await db.update(batches).set({
            status: "claimed",
            buyerId,
            claimedAt: new Date(),
        }).where(eq(batches.id, batchId)).returning();

        return updated;
    }

    // FIX: Changed batchId type from number to string to match uuid("id")
    public async collectBatch(batchId: string, qualityRating?: number, notes?: string) {
        const batch = await this.getBatchById(batchId);
        if (!batch) throw new Error("Batch not found");
        if (batch.status !== "claimed") throw new Error("Batch must be claimed before collection");

        const [updated] = await db.update(batches).set({
            status: "collected",
            collectedAt: new Date(),
            qualityRating: qualityRating || null,
            notes: notes || null,
        }).where(eq(batches.id, batchId)).returning();

        return updated;
    }

    public async getImpactStats() {
        const [result] = await db
            .select({
                totalKg: sql<string>`coalesce(sum(${batches.quantityKg}), 0)`
            })
            .from(batches)
            .where(eq(batches.status, "collected"));

        const totalKg = parseFloat(result?.totalKg || "0");
        const totalTonnes = totalKg / 1000;

        return {
            totalTonnes: Math.round(totalTonnes * 100) / 100,
            totalKg: Math.round(totalKg),
            lakeAreaClearedM2: Math.round(totalTonnes * 10),
            co2eAvoidedTonnes: Math.round(totalTonnes * 0.5 * 100) / 100,
        };
    }

    // FIX: Changed id type from number to string to match uuid("id")
    public async deleteBatch(id: string) {
        await db.update(sms).set({ batchId: null }).where(eq(sms.batchId, id));
        await db.delete(batches).where(eq(batches.id, id));
    }
}

export const batchService = new BatchService();