import { NextRequest, NextResponse } from "next/server";
import { LEAVE_REQUESTS } from "@/lib/mock/seed";
import { entityTag, revalidate } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";
import type { ApprovalStatus } from "@/types";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as { status: ApprovalStatus };
  await delay(200);
  const leave = LEAVE_REQUESTS.find((l) => l.id === id);
  if (!leave) {
    return NextResponse.json({ error: "Leave request not found" }, { status: 404 });
  }
  leave.status = body.status;
  revalidate(entityTag("leave"));
  return NextResponse.json(leave);
}
