"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, FolderKanban, Plus, UsersRound } from "lucide-react";
import { createDepartment, listDepartments } from "@/lib/mock-api/departments";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

const EMPTY_DEPARTMENT = { name: "", budget: "" };

export default function DepartmentsPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_DEPARTMENT);

  const { data, isLoading } = useQuery({
    queryKey: ["departments-detail", companyId],
    queryFn: () => listDepartments(companyId),
  });

  const createMutation = useMutation({
    mutationFn: () => createDepartment(companyId, { name: form.name, budget: Number(form.budget) || 0 }),
    onSuccess: (department) => {
      queryClient.invalidateQueries({ queryKey: ["departments-detail", companyId] });
      queryClient.invalidateQueries({ queryKey: ["departments", companyId] });
      toast.success(`${department.name} department created`);
      setCreateOpen(false);
      setForm(EMPTY_DEPARTMENT);
    },
  });

  const canCreate = form.name.trim();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Departments"
        description="Structure, budgets, and leadership across your organization."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            New department
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="space-y-3 p-5">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          : data?.map((dept) => (
              <Card key={dept.id} className="transition-shadow hover:shadow-md">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex size-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${dept.color}1a`, color: dept.color }}
                    >
                      <Building2 className="size-5" />
                    </div>
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">{dept.employeeCount} employees</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border p-2.5">
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="font-medium">{money(dept.budget)}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border p-2.5">
                      <FolderKanban className="size-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Projects</p>
                        <p className="font-medium">{dept.projectCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    {dept.headName ? (
                      <div className="flex items-center gap-2">
                        <EntityAvatar name={dept.headName} src={dept.headAvatar} size="sm" />
                        <div>
                          <p className="text-xs text-muted-foreground">Head of department</p>
                          <p className="text-sm font-medium">{dept.headName}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No head assigned</p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <UsersRound className="size-3.5" />
                      {dept.teamCount} teams
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New department</DialogTitle>
            <DialogDescription>You can assign a head and budget details later.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="dept-name">Department name</Label>
              <Input
                id="dept-name"
                placeholder="Customer Success"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dept-budget">Annual budget (USD)</Label>
              <Input
                id="dept-budget"
                type="number"
                placeholder="250000"
                value={form.budget}
                onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button disabled={!canCreate || createMutation.isPending} onClick={() => createMutation.mutate()}>
              {createMutation.isPending ? "Creating..." : "Create department"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
