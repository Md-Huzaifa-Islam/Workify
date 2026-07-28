"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, ClipboardList, Plus, X } from "lucide-react";
import { getLeaveBalances, listLeaveRequests } from "@/lib/mock-api/leave";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { ApprovalStatus } from "@/types";

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${e.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export default function LeavePage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const [overrides, setOverrides] = useState<Record<string, ApprovalStatus>>({});

  const { data: balances, isLoading: balancesLoading } = useQuery({
    queryKey: ["leave-balances", companyId],
    queryFn: () => getLeaveBalances(companyId),
  });
  const { data, isLoading } = useQuery({
    queryKey: ["leave-requests", companyId],
    queryFn: () => listLeaveRequests(companyId, { pageSize: 50 }),
  });

  function decide(id: string, status: ApprovalStatus, name: string) {
    setOverrides((prev) => ({ ...prev, [id]: status }));
    toast[status === "approved" ? "success" : "error"](
      `Leave request ${status === "approved" ? "approved" : "rejected"} for ${name}`,
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Leave"
        description="Review time-off requests and track team balances."
        actions={
          <Button size="sm" className="gap-1.5">
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
                  <Avatar size="sm">
                    <AvatarImage src={b.avatarUrl} alt={b.employeeName} />
                    <AvatarFallback>{b.employeeName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
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
                    const status = overrides[req.id] ?? req.status;
                    return (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar size="sm">
                              <AvatarImage src={req.employeeAvatar} alt={req.employeeName} />
                              <AvatarFallback>{req.employeeName.slice(0, 2)}</AvatarFallback>
                            </Avatar>
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
                                onClick={() => decide(req.id, "approved", req.employeeName)}
                              >
                                <Check className="size-3.5 text-success" />
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="outline"
                                onClick={() => decide(req.id, "rejected", req.employeeName)}
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
    </div>
  );
}
