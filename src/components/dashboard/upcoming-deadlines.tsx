"use client";

import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { UpcomingDeadline } from "@/lib/mock-api/dashboard";
import { cn } from "@/lib/utils";

const PRIORITY_VARIANT: Record<string, string> = {
  urgent: "bg-destructive/10 text-destructive",
  high: "bg-warning/15 text-warning",
  medium: "bg-info/15 text-info",
  low: "bg-muted text-muted-foreground",
};

export function UpcomingDeadlines({ items, loading }: { items?: UpcomingDeadline[]; loading?: boolean }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Upcoming deadlines</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-1.5 w-full" />
              </div>
            ))
          : items?.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{item.name}</span>
                  <Badge className={cn("shrink-0 border-none font-normal capitalize", PRIORITY_VARIANT[item.priority])}>
                    {item.priority}
                  </Badge>
                </div>
                <Progress value={item.progress} className="h-1.5" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.progress}% complete</span>
                  <span>Due {format(new Date(item.dueDate), "MMM d")}</span>
                </div>
              </div>
            ))}
        {!loading && items?.length === 0 && (
          <p className="text-sm text-muted-foreground">No active project deadlines.</p>
        )}
      </CardContent>
    </Card>
  );
}
