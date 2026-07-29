import { NextRequest, NextResponse } from "next/server";
import { EMPLOYEES } from "@/lib/mock/seed";
import { entityTag, revalidate } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";
import type { Status } from "@/types";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as { status: Status };
  await delay(200);
  const employee = EMPLOYEES.find((e) => e.id === id);
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }
  employee.status = body.status;
  revalidate(entityTag("employees"));
  return NextResponse.json(employee);
}
