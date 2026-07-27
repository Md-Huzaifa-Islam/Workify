import { NOTIFICATIONS } from "@/lib/mock/seed";
import { delay } from "@/lib/mock-api/client";
import type { NotificationItem } from "@/types";

export async function listNotifications(companyId: string): Promise<NotificationItem[]> {
  await delay(200);
  return NOTIFICATIONS.filter((n) => n.companyId === companyId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function unreadNotificationCount(companyId: string): Promise<number> {
  const items = await listNotifications(companyId);
  return items.filter((n) => !n.read).length;
}
