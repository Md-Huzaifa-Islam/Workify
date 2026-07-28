"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Paperclip, Plus } from "lucide-react";
import { listTaskBoard, type TaskRow } from "@/lib/mock-api/projects";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { PriorityBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { TaskStatus } from "@/types";

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "To do" },
  { status: "in_progress", label: "In progress" },
  { status: "review", label: "In review" },
  { status: "done", label: "Done" },
];

function TaskCard({ task }: { task: TaskRow }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="space-y-3 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <span
            className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
            style={{ backgroundColor: `${task.projectColor}1a`, color: task.projectColor }}
          >
            {task.projectName}
          </span>
          <PriorityBadge priority={task.priority} />
        </div>
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        {task.labels.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {task.labels.map((label) => (
              <Badge key={label} variant="secondary" className="font-normal">
                {label}
              </Badge>
            ))}
          </div>
        ) : null}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            {task.commentCount > 0 ? (
              <span className="flex items-center gap-1">
                <MessageSquare className="size-3.5" />
                {task.commentCount}
              </span>
            ) : null}
            {task.attachmentCount > 0 ? (
              <span className="flex items-center gap-1">
                <Paperclip className="size-3.5" />
                {task.attachmentCount}
              </span>
            ) : null}
          </div>
          {task.assigneeName ? (
            <Avatar size="sm">
              <AvatarImage src={task.assigneeAvatar ?? undefined} alt={task.assigneeName} />
              <AvatarFallback>{task.assigneeName.slice(0, 2)}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex size-6 items-center justify-center rounded-full border border-dashed text-[10px] text-muted-foreground">
              —
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TasksPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const { data, isLoading } = useQuery({
    queryKey: ["task-board", companyId],
    queryFn: () => listTaskBoard(companyId),
  });

  const grouped = useMemo(() => {
    const map = new Map<TaskStatus, TaskRow[]>();
    for (const col of COLUMNS) map.set(col.status, []);
    for (const task of data ?? []) {
      map.get(task.status)?.push(task);
    }
    return map;
  }, [data]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Tasks"
        description="A Kanban view of every task across your active projects."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" />
            New task
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => (
          <div key={col.status} className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-medium">{col.label}</h2>
              <Badge variant="secondary" className="font-normal">
                {isLoading ? "—" : grouped.get(col.status)?.length ?? 0}
              </Badge>
            </div>
            <div className="flex flex-col gap-3">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)
                : grouped.get(col.status)?.map((task) => <TaskCard key={task.id} task={task} />)}
              {!isLoading && grouped.get(col.status)?.length === 0 ? (
                <p className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">
                  No tasks
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
