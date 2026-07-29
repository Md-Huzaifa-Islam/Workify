"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, ClipboardList, Plus, X } from "lucide-react";
import { createLeaveRequest, getLeaveBalances, listLeaveRequests, updateLeaveStatus } from "@/lib/mock-api/leave";
import { getCurrentUser } from "@/lib/mock-api/auth";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Progress } from "@/components/ui/progress";
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
import type { ApprovalStatus, LeaveRequest } from "@/types";

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${e.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

const EMPTY_LEAVE = {
  type: "vacation" as LeaveRequest["type"],
  startDate: "",
  endDate: "",
  reason: "",
};

export default function LeavePage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_LEAVE);

  const { data: balances, isLoading: balancesLoading } = useQuery({
    queryKey: ["leave-balances", companyId],
    queryFn: () => getLeaveBalances(companyId),
  });
  const { data, isLoading } = useQuery({
    queryKey: ["leave-requests", companyId],
    queryFn: () => listLeaveRequests(companyId, { pageSize: 50 }),
  });

  function invalidateLeave() {
    queryClient.invalidateQueries({ queryKey: ["leave-requests", companyId] });
    queryClient.invalidateQueries({ queryKey: ["leave-balances", companyId] });
  }

  const decideMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApprovalStatus; name: string }) =>
      updateLeaveStatus(id, status),
    onSuccess: (_result, variables) => {
      invalidateLeave();
      toast[variables.status === "approved" ? "success" : "error"](
        `Leave request ${variables.status === "approved" ? "approved" : "rejected"} for ${variables.name}`,
      );
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const user = await getCurrentUser(companyId);
      return createLeaveRequest(companyId, user.id, form);
    },
    onSuccess: () => {
      invalidateLeave();
      toast.success("Leave request submitted");
      setCreateOpen(false);
      setForm(EMPTY_LEAVE);
    },
  });

  const canCreate = form.startDate && form.endDate;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Leave"
        description="Review time-off requests and track team balances."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Request leave
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Leave balances</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {balancesLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            : balances?.map((b) => (
                <div key={b.employeeId} className="flex items-center gap-3">
                  <EntityAvatar name={b.employeeName} src={b.avatarUrl} size="sm" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{b.employeeName}</span>
                      <span className="text-xs text-muted-foreground">
                        {b.used}/{b.allocated}d
                      </span>
                    </div>
                    <Progress value={(b.used / b.allocated) * 100} className="h-1.5" />
                  </div>
                </div>
              ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                : data?.data.map((req) => {
                    const status = req.status;
                    return (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <EntityAvatar name={req.employeeName} src={req.employeeAvatar} size="sm" />
                            <span className="font-medium">{req.employeeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal capitalize">
                            {req.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDateRange(req.startDate, req.endDate)}
                        </TableCell>
                        <TableCell>{req.days}</TableCell>
                        <TableCell>
                          <StatusBadge status={status} />
                        </TableCell>
                        <TableCell className="text-right">
                          {status === "pending" ? (
                            <div className="flex justify-end gap-1.5">
                              <Button
                                size="icon-sm"
                                variant="outline"
                                disabled={decideMutation.isPending}
                                onClick={() =>
                                  decideMutation.mutate({ id: req.id, status: "approved", name: req.employeeName })
                                }
                              >
                                <Check className="size-3.5 text-success" />
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="outline"
                                disabled={decideMutation.isPending}
                                onClick={() =>
                                  decideMutation.mutate({ id: req.id, status: "rejected", name: req.employeeName })
                                }
                              >
                                <X className="size-3.5 text-destructive" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Decided</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              {!isLoading && data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    <ClipboardList className="mx-auto mb-2 size-6" />
                    No leave requests yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Request leave</DialogTitle>
            <DialogDescription>Your manager will be notified for approval.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm((prev) => ({ ...prev, type: v as LeaveRequest["type"] }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="sick">Sick</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="parental">Parental</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="leave-start">Start date</Label>
                <Input
                  id="leave-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="leave-end">End date</Label>
                <Input
                  id="leave-end"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="leave-reason">Reason (optional)</Label>
              <Textarea
                id="leave-reason"
                placeholder="Add context for your manager"
                value={form.reason}
                onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button disabled={!canCreate || createMutation.isPending} onClick={() => createMutation.mutate()}>
              {createMutation.isPending ? "Submitting..." : "Submit request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
