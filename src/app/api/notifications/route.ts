import { NextRequest, NextResponse } from "next/server";
import { NOTIFICATIONS } from "@/lib/mock/seed";
import { cached, entityTag } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";

const getNotifications = cached(
  "notifications-list",
  15,
  [entityTag("notifications")],
  async (companyId: string) => {
    await delay();
    return NOTIFICATIONS.filter((n) => n.companyId === companyId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  return NextResponse.json(await getNotifications(companyId));
}
