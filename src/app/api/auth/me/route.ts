import { NextRequest, NextResponse } from "next/server";
import { EMPLOYEES } from "@/lib/mock/seed";
import { delay } from "@/lib/server/query-utils";

/** In this prototype the signed-in user is always the first employee of the active company. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  await delay(120);
  const user = EMPLOYEES.find((e) => e.companyId === companyId);
  if (!user) {
    return NextResponse.json({ error: `No employees found for company ${companyId}` }, { status: 404 });
  }
  return NextResponse.json(user);
}
