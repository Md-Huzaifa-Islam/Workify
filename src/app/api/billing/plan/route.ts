import { NextRequest, NextResponse } from "next/server";
import { COMPANIES } from "@/lib/mock/seed";
import { cached, entityTag } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";

const PLAN_DETAILS = {
  starter: { price: 12, seats: 25, label: "Starter" },
  growth: { price: 29, seats: 100, label: "Growth" },
  scale: { price: 59, seats: 500, label: "Scale" },
  enterprise: { price: 129, seats: 2000, label: "Enterprise" },
} as const;

const getPlan = cached("billing-plan", 60, [entityTag("billing")], async (companyId: string) => {
  await delay();
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
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  return NextResponse.json(await getPlan(companyId));
}
