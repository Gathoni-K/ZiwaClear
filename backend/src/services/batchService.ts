import { eq, and, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { batches, sms } from "../db/schema";
import { BatchFilters, BatchAggregation, FishSpeciesAggregation } from "../types/batch";

export class BatchService {
    public async createBatch(beachId: number, timeWindowStart: string, timeWindowEnd: string, createdBy: string) {
        const [batch] = await db.insert(batches).values({
            batchName: `Batch-${beachId}-${Date.now()}`,
            batchDate: new Date().toISOString().split("T")[0],
            beachId,
            timeWindowStart: new Date(timeWindowStart),
            timeWindowEnd: new Date(timeWindowEnd),
            createdBy,
            status: "collecting"
        }).returning();
        return batch;
    }

    public async addSMSBatch(batchId: string, smsId: string) {
        const batch = await this.getBatchById(batchId);
        if (batch?.status !== "collecting") {
            throw new Error("Batch is not collecting");
        }
        await db.update(sms).set({ batchId }).where(eq(sms.id, smsId));
        await this.regenerateAggregation(batchId);
    }

    public async closeBatch(batchId: string) {
        await db.update(batches).set({ status: "completed" }).where(eq(batches.id, batchId));
        await this.regenerateAggregation(batchId);
    }

    public async getBatchById(id: string) {
        const [batch] = await db.select().from(batches).where(eq(batches.id, id));
        if (!batch) return null;
        const smsRecords = await db.select().from(sms).where(eq(sms.batchId, id));
        return { ...batch, smsRecords };
    }

    public async listBatches(filters: BatchFilters) {
        let conditions = [];
        if (filters.beachId) conditions.push(eq(batches.beachId, filters.beachId));
        if (filters.status) conditions.push(eq(batches.status, filters.status));
        if (filters.startDate) conditions.push(gte(batches.batchDate, filters.startDate));
        if (filters.endDate) conditions.push(lte(batches.batchDate, filters.endDate));

        const query = db.select().from(batches);
        if (conditions.length > 0) {
            query.where(and(...conditions));
        }
        if (filters.limit) query.limit(filters.limit);
        if (filters.offset) query.offset(filters.offset);

        return await query;
    }

    public async getBatchAggregation(id: string) {
        const batch = await this.getBatchById(id);
        return batch?.aggregatedData as BatchAggregation | null;
    }

    public async regenerateAggregation(id: string) {
        const batch = await this.getBatchById(id);
        if (!batch) return;

        let totalCatch = 0;
        let totalPrice = 0;
        let messageCountWithPrice = 0;
        let totalBoats = 0;
        const speciesMap = new Map<string, { total_kg: number, prices: number[], count: number }>();

        for (const record of batch.smsRecords) {
            if (record.parsedData && record.parsedSuccessfully) {
                const data = record.parsedData as any;
                if (data.catch_total_kg) totalCatch += data.catch_total_kg;
                if (data.price_per_kg_ksh) {
                    totalPrice += data.price_per_kg_ksh;
                    messageCountWithPrice++;
                }
                if (data.boat_count) totalBoats += data.boat_count;

                if (data.fish_species && Array.isArray(data.fish_species)) {
                    for (const species of data.fish_species) {
                        const existing = speciesMap.get(species) || { total_kg: 0, prices: [], count: 0 };
                        if (data.catch_total_kg) existing.total_kg += data.catch_total_kg;
                        if (data.price_per_kg_ksh) existing.prices.push(data.price_per_kg_ksh);
                        existing.count++;
                        speciesMap.set(species, existing);
                    }
                }
            }
        }

        const speciesBreakdown: FishSpeciesAggregation[] = Array.from(speciesMap.entries()).map(([species, data]) => ({
            species,
            total_kg: data.total_kg,
            avg_price: data.prices.length > 0 ? data.prices.reduce((a, b) => a + b, 0) / data.prices.length : 0
        }));

        const aggregation: BatchAggregation = {
            total_catch_kg: totalCatch,
            average_price_ksh: messageCountWithPrice > 0 ? totalPrice / messageCountWithPrice : 0,
            fish_species_breakdown: speciesBreakdown,
            beach_name: batch.smsRecords[0]?.parsedData?.beach_name || "Unknown",
            total_boats: totalBoats,
            weather_summary: batch.smsRecords[0]?.parsedData?.weather_condition || "Unknown",
            message_count: batch.smsRecords.length
        };

        const smsCount = batch.smsRecords.length;
        const processedCount = batch.smsRecords.filter(r => r.parsedSuccessfully).length;
        const failedCount = smsCount - processedCount;

        await db.update(batches).set({ 
            aggregatedData: aggregation,
            smsCount,
            processedCount,
            failedCount
        }).where(eq(batches.id, id));
    }

    public async autoBatchSMS() {
        const unbatchedSMS = await db.select().from(sms).where(sql`batch_id IS NULL AND parsed_successfully = true`);
        const groupedByBeachAndDate = new Map<string, any[]>();

        for (const record of unbatchedSMS) {
            if (!record.beachId) continue;
            const date = new Date(record.receivedAt).toISOString().split("T")[0];
            const key = `${record.beachId}-${date}`;
            if (!groupedByBeachAndDate.has(key)) groupedByBeachAndDate.set(key, []);
            groupedByBeachAndDate.get(key)!.push(record);
        }

        for (const [key, records] of groupedByBeachAndDate.entries()) {
            if (records.length >= 5) {
                const [beachIdStr, dateStr] = key.split("-");
                const beachId = parseInt(beachIdStr);
                const batch = await this.getDailyBatch(beachId, dateStr);
                for (const record of records) {
                    await this.addSMSBatch(batch.id, record.id);
                }
            }
        }
    }

    public async getDailyBatch(beachId: number, date: string) {
        const [existingBatch] = await db.select().from(batches).where(and(
            eq(batches.beachId, beachId),
            eq(batches.batchDate, date)
        ));
        
        if (existingBatch) return existingBatch;

        const start = new Date(date);
        const end = new Date(date);
        end.setDate(end.getDate() + 1);

        return await this.createBatch(beachId, start.toISOString(), end.toISOString(), "system_auto");
    }

    public async deleteBatch(id: string) {
        await db.update(sms).set({ batchId: null }).where(eq(sms.batchId, id));
        await db.delete(batches).where(eq(batches.id, id));
    }
}

export const batchService = new BatchService();
