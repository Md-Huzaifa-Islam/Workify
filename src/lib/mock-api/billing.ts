import { COMPANIES, INVOICES } from "@/lib/mock/seed";
import { delay, paginate, sortItems } from "@/lib/mock-api/client";
import type { Invoice, PaginatedResult, QueryParams } from "@/types";

const PLAN_DETAILS = {
  starter: { price: 12, seats: 25, label: "Starter" },
  growth: { price: 29, seats: 100, label: "Growth" },
  scale: { price: 59, seats: 500, label: "Scale" },
  enterprise: { price: 129, seats: 2000, label: "Enterprise" },
} as const;

export async function listInvoices(
  companyId: string,
  params: QueryParams = {},
): Promise<PaginatedResult<Invoice>> {
  await delay();
  let items = INVOICES.filter((i) => i.companyId === companyId);
  if (params.filters?.status) {
    items = items.filter((i) => i.status === params.filters?.status);
  }
  items = sortItems(items, params.sortBy ?? "issueDate", params.sortDir ?? "desc");
  return paginate(items, params);
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
  await delay(250);
  const company = COMPANIES.find((c) => c.id === companyId);
  const plan = PLAN_DETAILS[company?.plan ?? "growth"];
  return {
    name: plan.label,
    price: plan.price,
    seats: plan.seats,
    seatsUsed: company?.employeeCount ?? 0,
    renewsAt: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    cardBrand: "Visa",
    cardLast4: "4242",
  };
}

export const PLAN_TIERS = Object.entries(PLAN_DETAILS).map(([id, plan]) => ({ id, ...plan }));
