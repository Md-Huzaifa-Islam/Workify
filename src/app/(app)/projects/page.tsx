"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ListChecks, Plus, Search } from "lucide-react";
import { listProjects } from "@/lib/mock-api/projects";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { PriorityBadge, StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

const STATUS_OPTIONS = ["all", "planning", "active", "on_hold", "completed", "cancelled"];

export default function ProjectsPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["projects", companyId, status, search],
    queryFn: () =>
      listProjects(companyId, {
        pageSize: 30,
        search,
        filters: { status: status === "all" ? undefined : status },
      }),
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Projects"
        description="Timelines, budgets, and progress across every initiative."
        actions={
          <Button size="sm" className="gap-1.5">
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
                        <Avatar key={m.id} size="sm">
                          <AvatarImage src={m.avatarUrl} alt={m.name} />
                          <AvatarFallback>{m.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
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
    </div>
  );
}
