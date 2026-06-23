export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface SMSData {
    senderPhone: string;
    rawMessage: string;
}

export const api = {
    batches: {
        getAll: async () => {
            const res = await fetch(`${API_BASE_URL}/api/batches`);
            if (!res.ok) throw new Error("Failed to fetch batches");
            return res.json();
        },
        getImpact: async () => {
            const res = await fetch(`${API_BASE_URL}/api/batches/impact`);
            if (!res.ok) throw new Error("Failed to fetch impact metrics");
            return res.json();
        },
        getPrice: async () => {
            const res = await fetch(`${API_BASE_URL}/api/batches/price`);
            if (!res.ok) throw new Error("Failed to fetch pricing information");
            return res.json();
        }
    },
    sms: {
        receive: async (data: SMSData) => {
            const res = await fetch(`${API_BASE_URL}/api/sms/incoming`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error("Failed to process incoming SMS");
            return res.json();
        }
    },
    chat: {
        sendMessage: async (message: string) => {
            const res = await fetch(`${API_BASE_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });
            if (!res.ok) throw new Error("Failed to send message to AI coordinator");
            return res.json();
        }
    }
};