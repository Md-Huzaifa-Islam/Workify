import { NextRequest, NextResponse } from "next/server";
import { COMPANIES } from "@/lib/mock/seed";
import { cached } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";

const getCompanyById = cached("company-by-id", 300, ["entity:companies"], async (id: string) => {
  await delay(120);
  return COMPANIES.find((c) => c.id === id) ?? null;
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json(await getCompanyById(id));
}
