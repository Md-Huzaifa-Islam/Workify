import { apiGet } from "@/lib/mock-api/http";
import type { Invoice, PaginatedResult, QueryParams } from "@/types";

export async function listInvoices(
  companyId: string,
  params: QueryParams = {},
): Promise<PaginatedResult<Invoice>> {
  return apiGet<PaginatedResult<Invoice>>("/api/billing/invoices", companyId, params);
}

export interface BillingPlan {
  name: string;
  price: number;
  seats: number;
  seatsUsed: number;
  renewsAt: string;
  cardBrand: string;
  cardLast4: string;
}

export async function getBillingPlan(companyId: string): Promise<BillingPlan> {
  return apiGet<BillingPlan>("/api/billing/plan", companyId);
}

const PLAN_DETAILS = {
  starter: { price: 12, seats: 25, label: "Starter" },
  growth: { price: 29, seats: 100, label: "Growth" },
  scale: { price: 59, seats: 500, label: "Scale" },
  enterprise: { price: 129, seats: 2000, label: "Enterprise" },
} as const;

export const PLAN_TIERS = Object.entries(PLAN_DETAILS).map(([id, plan]) => ({ id, ...plan }));
