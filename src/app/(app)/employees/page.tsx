"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Mail, MapPin, Phone, Plus, Search, UsersRound } from "lucide-react";
import { createEmployee, listEmployees } from "@/lib/mock-api/employees";
import { listDepartments } from "@/lib/mock-api/departments";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Employee } from "@/types";

const PAGE_SIZE = 10;

const EMPTY_INVITE = {
  name: "",
  email: "",
  title: "",
  departmentId: "",
  employmentType: "full_time" as Employee["employmentType"],
  location: "",
};

export default function EmployeesPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState(EMPTY_INVITE);

  const { data: departments } = useQuery({
    queryKey: ["departments", companyId],
    queryFn: () => listDepartments(companyId),
  });

  const inviteMutation = useMutation({
    mutationFn: () => createEmployee(companyId, invite),
    onSuccess: (employee) => {
      queryClient.invalidateQueries({ queryKey: ["employees", companyId] });
      queryClient.invalidateQueries({ queryKey: ["departments", companyId] });
      toast.success(`Invitation sent to ${employee.email}`);
      setInviteOpen(false);
      setInvite(EMPTY_INVITE);
    },
  });

  const canInvite = invite.name.trim() && invite.email.trim() && invite.departmentId;

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["employees", companyId, search, departmentId, status, page],
    queryFn: () =>
      listEmployees(companyId, {
        search,
        page,
        pageSize: PAGE_SIZE,
        filters: {
          departmentId: departmentId === "all" ? undefined : departmentId,
          status: status === "all" ? undefined : status,
        },
      }),
    placeholderData: (prev) => prev,
  });

  const departmentName = useMemo(() => {
    const map = new Map(departments?.map((d) => [d.id, d.name]));
    return (id: string) => map.get(id) ?? "—";
  }, [departments]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Employees"
        description="A searchable directory of everyone at your company."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setInviteOpen(true)}>
            <Plus className="size-4" />
            Invite employee
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="max-w-xs">
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search by name, email, role..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </InputGroup>
        <Select
          value={departmentId}
          onValueChange={(v) => {
            setDepartmentId(String(v));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {departments?.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(String(v));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : data?.data.map((emp) => (
                    <TableRow
                      key={emp.id}
                      className="cursor-pointer"
                      onClick={() => setSelected(emp)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <EntityAvatar name={emp.name} src={emp.avatarUrl} size="sm" />
                          <div>
                            <p className="font-medium">{emp.name}</p>
                            <p className="text-xs text-muted-foreground">{emp.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {departmentName(emp.departmentId)}
                      </TableCell>
                      <TableCell>{emp.title}</TableCell>
                      <TableCell className="text-muted-foreground">{emp.location}</TableCell>
                      <TableCell>
                        <StatusBadge status={emp.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(emp.joinedAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
              {!isLoading && data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    <UsersRound className="mx-auto mb-2 size-6" />
                    No employees match your filters.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {data ? (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {(data.page - 1) * data.pageSize + 1}-
            {Math.min(data.page * data.pageSize, data.total)} of {data.total}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="px-1 tabular-nums">
              {data.page} / {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page >= data.totalPages || isPlaceholderData}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          {selected ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <EntityAvatar name={selected.name} src={selected.avatarUrl} size="lg" />
                  <div>
                    <DialogTitle>{selected.name}</DialogTitle>
                    <DialogDescription>{selected.title}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-3.5" />
                  {selected.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="size-3.5" />
                  {selected.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {selected.location}
                </div>
                <div className="grid grid-cols-2 gap-3 rounded-lg border p-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="font-medium">{departmentName(selected.departmentId)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Employment</p>
                    <p className="font-medium capitalize">
                      {selected.employmentType.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <StatusBadge status={selected.status} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="font-medium">
                      {new Date(selected.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite employee</DialogTitle>
            <DialogDescription>
              They&apos;ll show up in your directory right away with a pending status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="invite-name">Full name</Label>
              <Input
                id="invite-name"
                placeholder="Jordan Lee"
                value={invite.name}
                onChange={(e) => setInvite((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="jordan@company.com"
                value={invite.email}
                onChange={(e) => setInvite((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="invite-title">Title</Label>
                <Input
                  id="invite-title"
                  placeholder="Product Designer"
                  value={invite.title}
                  onChange={(e) => setInvite((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Employment type</Label>
                <Select
                  value={invite.employmentType}
                  onValueChange={(v) =>
                    setInvite((prev) => ({
                      ...prev,
                      employmentType: v as Employee["employmentType"],
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full-time</SelectItem>
                    <SelectItem value="part_time">Part-time</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select
                  value={invite.departmentId}
                  onValueChange={(v) => setInvite((prev) => ({ ...prev, departmentId: String(v) }))}
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
                <Label htmlFor="invite-location">Location</Label>
                <Input
                  id="invite-location"
                  placeholder="Remote"
                  value={invite.location}
                  onChange={(e) => setInvite((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button
              disabled={!canInvite || inviteMutation.isPending}
              onClick={() => inviteMutation.mutate()}
            >
              {inviteMutation.isPending ? "Sending invite..." : "Send invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
