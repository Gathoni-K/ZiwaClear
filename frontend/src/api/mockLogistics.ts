import type { RouteSuggestion, PaymentSummary } from "../types/logistics";

export const MOCK_ROUTE: RouteSuggestion = {
  totalDistanceKm: 85.4,
  optimized: true,
  stops: [
    { label: "Kisumu Central Depot" },
    { label: "Kisumu Lakefront Sector B" },
    { label: "Homa Bay Shoreline A" },
    { label: "End Route at Recycling Hub" },
  ],
};

export const MOCK_PAYMENT_SUMMARY: PaymentSummary = {
  lineItems: [
    { label: "Batch Processing Fee", amountKes: 4200 },
    { label: "Logistics Surcharge", amountKes: 1150 },
    { label: "Platform Insurance", amountKes: 850 },
  ],
  totalKes: 6200,
  mpesaPaybill: "882100",
  mpesaAccount: "ZIWA-992-K5",
};