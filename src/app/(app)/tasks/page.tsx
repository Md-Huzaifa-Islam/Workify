"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageSquare, Paperclip, Plus } from "lucide-react";
import { createTask, listProjects, listTaskBoard, type TaskRow } from "@/lib/mock-api/projects";
import { listEmployees } from "@/lib/mock-api/employees";
import { getCurrentUser } from "@/lib/mock-api/auth";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { PriorityBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Priority, TaskStatus } from "@/types";

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
            <EntityAvatar name={task.assigneeName} src={task.assigneeAvatar} size="sm" />
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

const EMPTY_TASK = {
  title: "",
  projectId: "",
  assigneeId: "unassigned",
  priority: "medium" as Priority,
  dueDate: "",
};

export default function TasksPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_TASK);

  const { data, isLoading } = useQuery({
    queryKey: ["task-board", companyId],
    queryFn: () => listTaskBoard(companyId),
  });
  const { data: projects } = useQuery({
    queryKey: ["projects-for-task-create", companyId],
    queryFn: () => listProjects(companyId, { pageSize: 100 }),
  });
  const { data: employees } = useQuery({
    queryKey: ["employees-for-task-create", companyId],
    queryFn: () => listEmployees(companyId, { pageSize: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const user = await getCurrentUser(companyId);
      return createTask(companyId, user.id, {
        title: form.title,
        projectId: form.projectId,
        assigneeId: form.assigneeId === "unassigned" ? null : form.assigneeId,
        priority: form.priority,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      });
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["task-board", companyId] });
      toast.success(`"${task.title}" added to the board`);
      setCreateOpen(false);
      setForm(EMPTY_TASK);
    },
  });

  const canCreate = form.title.trim() && form.projectId;

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
          <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
            <DialogDescription>New tasks start in the To do column.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                placeholder="Design the onboarding flow"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Select
                value={form.projectId}
                onValueChange={(v) => setForm((prev) => ({ ...prev, projectId: String(v) }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.data.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Assignee</Label>
                <Select
                  value={form.assigneeId}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, assigneeId: String(v) }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {employees?.data.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, priority: v as Priority }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-due">Due date (optional)</Label>
              <Input
                id="task-due"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button disabled={!canCreate || createMutation.isPending} onClick={() => createMutation.mutate()}>
              {createMutation.isPending ? "Creating..." : "Create task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
