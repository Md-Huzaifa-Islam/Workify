"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, ListChecks, Plus, Search } from "lucide-react";
import { createProject, listProjects } from "@/lib/mock-api/projects";
import { listDepartments } from "@/lib/mock-api/departments";
import { getCurrentUser } from "@/lib/mock-api/auth";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { PriorityBadge, StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Priority } from "@/types";

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

const STATUS_OPTIONS = ["all", "planning", "active", "on_hold", "completed", "cancelled"];

const EMPTY_PROJECT = {
  name: "",
  description: "",
  departmentId: "",
  priority: "medium" as Priority,
  dueDate: "",
  budget: "",
};

export default function ProjectsPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_PROJECT);

  const { data, isLoading } = useQuery({
    queryKey: ["projects", companyId, status, search],
    queryFn: () =>
      listProjects(companyId, {
        pageSize: 30,
        search,
        filters: { status: status === "all" ? undefined : status },
      }),
  });

  const { data: departments } = useQuery({
    queryKey: ["departments", companyId],
    queryFn: () => listDepartments(companyId),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const user = await getCurrentUser(companyId);
      return createProject(companyId, user.id, {
        name: form.name,
        description: form.description,
        departmentId: form.departmentId,
        priority: form.priority,
        dueDate: new Date(form.dueDate).toISOString(),
        budget: Number(form.budget) || 0,
      });
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects", companyId] });
      toast.success(`${project.name} created`);
      setCreateOpen(false);
      setForm(EMPTY_PROJECT);
    },
  });

  const canCreate = form.name.trim() && form.departmentId && form.dueDate;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Projects"
        description="Timelines, budgets, and progress across every initiative."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            New project
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="max-w-xs">
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <Select value={status} onValueChange={(v) => setStatus(String(v))}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All statuses" : s.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="space-y-3 p-5">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </CardContent>
              </Card>
            ))
          : data?.data.map((project) => (
              <Card key={project.id} className="transition-shadow hover:shadow-md">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">{project.departmentName}</p>
                      </div>
                    </div>
                    <PriorityBadge priority={project.priority} />
                  </div>

                  <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      Due {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <ListChecks className="size-3.5" />
                      {project.taskCount} tasks
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    <StatusBadge status={project.status} />
                    <AvatarGroup>
                      {project.members.slice(0, 3).map((m) => (
                        <EntityAvatar key={m.id} name={m.name} src={m.avatarUrl} size="sm" />
                      ))}
                      {project.members.length > 3 ? (
                        <AvatarGroupCount>+{project.members.length - 3}</AvatarGroupCount>
                      ) : null}
                    </AvatarGroup>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Budget {money(project.budget)}</span>
                    <span className={project.spent > project.budget ? "text-destructive" : ""}>
                      Spent {money(project.spent)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>Set the basics — you can add members and tasks after.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                placeholder="Atlas Rollout"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                placeholder="What is this project about?"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select
                  value={form.departmentId}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, departmentId: String(v) }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments?.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="project-due">Due date</Label>
                <Input
                  id="project-due"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="project-budget">Budget (USD)</Label>
                <Input
                  id="project-budget"
                  type="number"
                  placeholder="50000"
                  value={form.budget}
                  onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button disabled={!canCreate || createMutation.isPending} onClick={() => createMutation.mutate()}>
              {createMutation.isPending ? "Creating..." : "Create project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
