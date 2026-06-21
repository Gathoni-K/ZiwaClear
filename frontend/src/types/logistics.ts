export interface RouteStop {
  label: string;
}

export interface RouteSuggestion {
  totalDistanceKm: number;
  optimized: boolean;
  stops: RouteStop[];
}

export interface PaymentLineItem {
  label: string;
  amountKes: number;
}

export interface PaymentSummary {
  lineItems: PaymentLineItem[];
  totalKes: number;
  mpesaPaybill: string;
  mpesaAccount: string;
}