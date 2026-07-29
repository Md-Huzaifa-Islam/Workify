import { apiGet } from "@/lib/mock-api/http";
import type { NotificationItem } from "@/types";

export async function listNotifications(companyId: string): Promise<NotificationItem[]> {
  return apiGet<NotificationItem[]>("/api/notifications", companyId);
}
