export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const api = {
  batches: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/api/batches/all`);
      if (!res.ok) throw new Error("Failed to fetch batches");
      return res.json();
    },
    getAvailable: async () => {
      const res = await fetch(`${API_BASE_URL}/api/batches`);
      if (!res.ok) throw new Error("Failed to fetch available batches");
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/api/batches/${id}`);
      if (!res.ok) throw new Error("Failed to fetch batch");
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
    },
    claim: async (id: string, buyerId: string) => {
  const res = await fetch(`${API_BASE_URL}/api/batches/${id}/claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ buyerId }),
  });
  if (!res.ok) throw new Error("Failed to claim batch");
  return res.json();

    },
    collect: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/api/batches/${id}/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to confirm collection");
      return res.json();
    },
  },
    landingSites: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/api/landing-sites`);
      if (!res.ok) throw new Error("Failed to fetch landing sites");
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/api/landing-sites/${id}`);
      if (!res.ok) throw new Error("Failed to fetch landing site");
      return res.json();
    },
  },
  chat: {
    sendMessage: async (message: string) => {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("Failed to send message to AI coordinator");
      return res.json();
    },
  },
};