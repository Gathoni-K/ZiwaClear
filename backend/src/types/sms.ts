import { ParsedSMSData } from "../services/sms";

export interface CreateSMSRecord {
    rawMessage: string;
    senderPhone: string;
}

export interface SMSFilters {
    startDate?: string;
    endDate?: string;
    beachId?: number;
    batchId?: string;
    parsedSuccessfully?: boolean;
    processed?: boolean;
    limit?: number;
    offset?: number;
}
