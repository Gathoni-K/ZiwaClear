import { eq, and, gte, sql } from "drizzle-orm";
import { db } from "../db";
import { sms, beaches } from "../db/schema";
import { smsParser } from "./sms/smsParser";
import { batchService } from "./batchService";
import { ParsedSMSData } from "./sms/parser/parserSchema";

export class SMSService {
    public async processIncomingSMS(rawMessage: string, senderPhone: string) {
        const recentDuplicate = await db.select().from(sms).where(and(
            eq(sms.senderPhone, senderPhone),
            eq(sms.rawMessage, rawMessage),
            gte(sms.receivedAt, new Date(Date.now() - 60000))
        ));

        if (recentDuplicate.length > 0) {
            throw new Error("Duplicate message detected");
        }

        const [smsRecord] = await db.insert(sms).values({
            rawMessage,
            senderPhone,
        }).returning();

        if (!smsRecord) {
            throw new Error("Failed to create SMS database record.");
        }

        try {
            const parsedData: ParsedSMSData = await smsParser.parseSMS(rawMessage);

            const locationName: string | null = parsedData.location ?? null;
            const quantityKg: number | null = parsedData.quantity_kg ?? null;
            const urgencyLevel = parsedData.urgency_level ?? null;

            let beachId: number | null = null;
            if (locationName) {
                const [beach] = await db.select().from(beaches).where(
                    sql`lower(${beaches.name}) = lower(${locationName})`
                );
                if (beach) beachId = beach.id;
            }

            await db.update(sms).set({
                parsedData: parsedData as any,
                parsedSuccessfully: true,
                beachId,
                parseError: null
            }).where(eq(sms.id, smsRecord.id));

            // TODO: wire to real beach status engine once storage/broadcast
            // mechanism (websocket, DB column + polling, queue job, etc.) is confirmed.
            // if (beachId && urgencyLevel) {
            //     await beachStateEngine.updateBeachStatus(beachId, urgencyLevel, parsedData.impact_tags);
            //     if (urgencyLevel === "high") {
            //         await beachStateEngine.notifyEarlyActionNetworks(parsedData, beachId);
            //     }
            // }

            if (quantityKg && locationName) {
                const batch = await batchService.createBatchFromSMS({
                    quantityKg,
                    locationName,
                    harvesterPhone: senderPhone,
                    beachId
                });

                if (!batch) {
                    throw new Error("Failed to create batch associated with the processed SMS record.");
                }

                await db.update(sms).set({ batchId: batch.id }).where(eq(sms.id, smsRecord.id));

                return { smsRecord, batch, success: true };
            }

            return { smsRecord, batch: null, success: true };

        } catch (error: any) {
            await db.update(sms).set({
                parsedSuccessfully: false,
                parseError: error.message
            }).where(eq(sms.id, smsRecord.id));

            return { smsRecord, batch: null, success: false, error: error.message };
        }
    }

    public async getById(id: string) {
        const [record] = await db.select().from(sms).where(eq(sms.id, id));
        return record || null;
    }

    public async listSMS(filters: {
        beachId?: number;
        batchId?: string;
        parsedSuccessfully?: boolean;
        startDate?: string;
        endDate?: string;
        limit?: number;
        offset?: number;
    }) {
        const conditions: any[] = [];
        if (filters.beachId) conditions.push(eq(sms.beachId, filters.beachId));
        if (filters.batchId) conditions.push(eq(sms.batchId, filters.batchId));
        if (filters.parsedSuccessfully !== undefined) conditions.push(eq(sms.parsedSuccessfully, filters.parsedSuccessfully));
        if (filters.startDate) conditions.push(gte(sms.receivedAt, new Date(filters.startDate)));
        if (filters.endDate) conditions.push(gte(sms.receivedAt, new Date(filters.endDate)));

        let query = db.select().from(sms).$dynamic();
        if (conditions.length > 0) query = query.where(and(...conditions));
        if (filters.limit) query = query.limit(filters.limit);
        if (filters.offset) query = query.offset(filters.offset);

        return await query;
    }
}

export const smsService = new SMSService();