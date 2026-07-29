import { NextResponse } from "next/server";
import { COMPANIES } from "@/lib/mock/seed";
import { cached } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";

const getCompaniesList = cached("companies-list", 300, ["entity:companies"], async () => {
  await delay(150);
  return COMPANIES;
});

export async function GET() {
  return NextResponse.json(await getCompaniesList());
}
