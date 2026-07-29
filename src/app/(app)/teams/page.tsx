"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, UsersRound } from "lucide-react";
import { createTeam, listDepartments, listTeams } from "@/lib/mock-api/departments";
import { listEmployees } from "@/lib/mock-api/employees";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EMPTY_TEAM = { name: "", departmentId: "", leadId: "", description: "" };

export default function TeamsPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_TEAM);

  const { data, isLoading } = useQuery({
    queryKey: ["teams", companyId],
    queryFn: () => listTeams(companyId),
  });
  const { data: departments } = useQuery({
    queryKey: ["departments", companyId],
    queryFn: () => listDepartments(companyId),
  });
  const { data: employees } = useQuery({
    queryKey: ["employees-for-team-create", companyId],
    queryFn: () => listEmployees(companyId, { pageSize: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createTeam(companyId, {
        name: form.name,
        departmentId: form.departmentId,
        leadId: form.leadId,
        description: form.description,
      }),
    onSuccess: (team) => {
      queryClient.invalidateQueries({ queryKey: ["teams", companyId] });
      queryClient.invalidateQueries({ queryKey: ["departments-detail", companyId] });
      toast.success(`${team.name} created`);
      setCreateOpen(false);
      setForm(EMPTY_TEAM);
    },
  });

  const canCreate = form.name.trim() && form.departmentId && form.leadId;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Teams"
        description="Squads, pods, and guilds organized under each department."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            New team
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
                </CardContent>
              </Card>
            ))
          : data?.map((team) => (
              <Card key={team.id} className="transition-shadow hover:shadow-md">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <UsersRound className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium">{team.name}</p>
                        <Badge variant="outline" className="mt-0.5 font-normal">
                          {team.departmentName}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{team.description}</p>
                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-2">
                      <EntityAvatar name={team.leadName} src={team.leadAvatar} size="sm" />
                      <div>
                        <p className="text-xs text-muted-foreground">Team lead</p>
                        <p className="text-sm font-medium">{team.leadName}</p>
                      </div>
                    </div>
                    <AvatarGroup>
                      {team.members.slice(0, 4).map((m) => (
                        <EntityAvatar key={m.id} name={m.name} src={m.avatarUrl} size="sm" />
                      ))}
                      {team.members.length > 4 ? (
                        <AvatarGroupCount>+{team.members.length - 4}</AvatarGroupCount>
                      ) : null}
                    </AvatarGroup>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New team</DialogTitle>
            <DialogDescription>The lead becomes the first member automatically.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="team-name">Team name</Label>
              <Input
                id="team-name"
                placeholder="Growth Pod"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="team-description">Description</Label>
              <Textarea
                id="team-description"
                placeholder="What does this team own?"
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
                <Label>Team lead</Label>
                <Select
                  value={form.leadId}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, leadId: String(v) }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees?.data.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button disabled={!canCreate || createMutation.isPending} onClick={() => createMutation.mutate()}>
              {createMutation.isPending ? "Creating..." : "Create team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
