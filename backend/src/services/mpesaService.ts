export interface MockPayoutResult {
    success: boolean;
    receiptNumber: string;
}

export async function initiateMockB2CPayout(phone: string, amount: number): Promise<MockPayoutResult> {
    await new Promise<void>((resolve) => setTimeout(resolve, 2000));
    return {
        success: true,
        receiptNumber: "ZWC92XKLM",
    };
}
