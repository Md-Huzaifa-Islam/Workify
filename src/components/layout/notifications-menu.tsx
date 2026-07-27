"use client";

import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Bell, Megaphone, MessageSquare, ReceiptText, ShieldCheck, Sparkles } from "lucide-react";
import { listNotifications } from "@/lib/mock-api/notifications";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NotificationItem } from "@/types";

const ICON_BY_TYPE: Record<NotificationItem["type"], typeof Bell> = {
  task: ShieldCheck,
  approval: ReceiptText,
  mention: MessageSquare,
  system: Megaphone,
  billing: Sparkles,
};

export function NotificationsMenu() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const { data: notifications } = useQuery({
    queryKey: ["notifications", companyId],
    queryFn: () => listNotifications(companyId),
  });

  const unread = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="ghost" size="icon" className="relative size-9" aria-label="Notifications" />}
      >
        <Bell className="size-4" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-sm font-semibold">Notifications</span>
          {unread > 0 && <Badge variant="secondary">{unread} unread</Badge>}
        </div>
        <ScrollArea className="h-96">
          <div className="divide-y">
            {notifications?.length ? (
              notifications.slice(0, 15).map((n) => {
                const Icon = ICON_BY_TYPE[n.type];
                return (
                  <div
                    key={n.id}
                    className="flex gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
                  >
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-sm font-medium leading-snug">{n.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{n.body}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                You&apos;re all caught up.
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
