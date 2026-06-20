import { eq, and, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { sms, beaches } from "../db/schema";
import { smsParser } from "./sms";
import { CreateSMSRecord, SMSFilters } from "../types/sms";
import { batchService } from "./batchService";

export class SMSService {
    public async processIncomingSMS(rawMessage: string, senderPhone: string) {
        const recentDuplicate = await db.select().from(sms).where(and(
            eq(sms.senderPhone, senderPhone),
            eq(sms.rawMessage, rawMessage),
            gte(sms.receivedAt, new Date(Date.now() - 60000))
        ));

        if (recentDuplicate.length > 0) {
            throw new Error("Duplicate message detected within 60 seconds");
        }

        const [smsRecord] = await db.insert(sms).values({
            rawMessage,
            senderPhone,
        }).returning();

        this.parseAndStore(smsRecord).catch(err => console.error("Async parsing failed:", err));

        return smsRecord;
    }

    public async parseAndStore(smsRecord: any) {
        try {
            const parsedData = await smsParser.parseSMS(smsRecord.rawMessage);
            
            let beachId = null;
            if (parsedData.beach_name) {
                const [beach] = await db.select().from(beaches).where(
                    sql`lower(name) = lower(${parsedData.beach_name})`
                );
                if (beach) beachId = beach.id;
            }

            await db.update(sms).set({
                parsedData,
                parsedSuccessfully: true,
                parseAttempts: smsRecord.parseAttempts + 1,
                confidenceScore: parsedData.confidence_score?.toString() || "0",
                beachId,
                parseError: null
            }).where(eq(sms.id, smsRecord.id));

            if (beachId) {
                await batchService.autoBatchSMS();
            }

        } catch (error: any) {
            await db.update(sms).set({
                parsedSuccessfully: false,
                parseAttempts: smsRecord.parseAttempts + 1,
                parseError: error.message
            }).where(eq(sms.id, smsRecord.id));
        }
    }

    public async getById(id: string) {
        const [record] = await db.select().from(sms).where(eq(sms.id, id));
        return record;
    }

    public async listSMS(filters: SMSFilters) {
        let conditions = [];
        if (filters.beachId) conditions.push(eq(sms.beachId, filters.beachId));
        if (filters.batchId) conditions.push(eq(sms.batchId, filters.batchId));
        if (filters.parsedSuccessfully !== undefined) conditions.push(eq(sms.parsedSuccessfully, filters.parsedSuccessfully));
        if (filters.processed !== undefined) conditions.push(eq(sms.processed, filters.processed));
        if (filters.startDate) conditions.push(gte(sms.receivedAt, new Date(filters.startDate)));
        if (filters.endDate) conditions.push(lte(sms.receivedAt, new Date(filters.endDate)));

        const query = db.select().from(sms);
        if (conditions.length > 0) query.where(and(...conditions));
        if (filters.limit) query.limit(filters.limit);
        if (filters.offset) query.offset(filters.offset);

        return await query;
    }

    public async getUnprocessed() {
        return await db.select().from(sms).where(and(
            eq(sms.parsedSuccessfully, true),
            eq(sms.processed, false)
        ));
    }

    public async markAsProcessed(id: string) {
        await db.update(sms).set({ processed: true }).where(eq(sms.id, id));
    }

    public async reprocess(id: string) {
        const record = await this.getById(id);
        if (!record) throw new Error("SMS not found");
        if (record.parsedSuccessfully && parseFloat(record.confidenceScore?.toString() || "1") > 0.8) {
            throw new Error("SMS already parsed successfully with high confidence");
        }
        await this.parseAndStore(record);
        return await this.getById(id);
    }

    public async getStats() {
        const result = await db.execute(sql`
            SELECT 
                COUNT(*) as total_sms,
                SUM(CASE WHEN parsed_successfully THEN 1 ELSE 0 END) as parsed_successfully,
                AVG(confidence_score) as avg_confidence,
                beach_id
            FROM sms
            GROUP BY beach_id
        `);
        return result;
    }

    public async deleteOlderThan(days: number) {
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        await db.delete(sms).where(lte(sms.createdAt, cutoff));
    }
}

export const smsService = new SMSService();
