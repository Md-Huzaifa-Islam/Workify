import { NextRequest, NextResponse } from "next/server";
import { INVOICES } from "@/lib/mock/seed";
import { cached, entityTag } from "@/lib/server/cache";
import { delay, paginate, parseQueryParams, sortItems } from "@/lib/server/query-utils";

const getInvoices = cached(
  "billing-invoices",
  60,
  [entityTag("billing")],
  async (companyId: string, paramsJson: string) => {
    await delay();
    const params = JSON.parse(paramsJson) as ReturnType<typeof parseQueryParams>;
    let items = INVOICES.filter((i) => i.companyId === companyId);
    if (params.filters?.status) {
      items = items.filter((i) => i.status === params.filters?.status);
    }
    items = sortItems(items, params.sortBy ?? "issueDate", params.sortDir ?? "desc");
    return paginate(items, params);
  },
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  const params = parseQueryParams(searchParams);
  return NextResponse.json(await getInvoices(companyId, JSON.stringify(params)));
}
