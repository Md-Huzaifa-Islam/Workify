"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Plus, ReceiptText, X } from "lucide-react";
import { getExpenseSummary, listExpenseRequests } from "@/lib/mock-api/expenses";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import type { ApprovalStatus } from "@/types";

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function ExpensesPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const [overrides, setOverrides] = useState<Record<string, ApprovalStatus>>({});

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["expense-summary", companyId],
    queryFn: () => getExpenseSummary(companyId),
  });
  const { data, isLoading } = useQuery({
    queryKey: ["expense-requests", companyId],
    queryFn: () => listExpenseRequests(companyId, { pageSize: 50 }),
  });

  function decide(id: string, status: ApprovalStatus, description: string) {
    setOverrides((prev) => ({ ...prev, [id]: status }));
    toast[status === "approved" ? "success" : "error"](
      `${status === "approved" ? "Approved" : "Rejected"} expense: ${description}`,
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Expenses"
        description="Review and approve reimbursement requests from your team."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" />
            New expense
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          index={0}
          label="Pending"
          icon={Clock3}
          loading={summaryLoading}
          value={money(summary?.totalPending ?? 0)}
          hint="Awaiting review"
        />
        <StatCard
          index={1}
          label="Approved this month"
          icon={CheckCircle2}
          loading={summaryLoading}
          value={money(summary?.totalApproved ?? 0)}
          hint="Reimbursed"
        />
        <StatCard
          index={2}
          label="Rejected"
          icon={XCircle}
          loading={summaryLoading}
          value={money(summary?.totalRejected ?? 0)}
          hint="Declined requests"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
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
                          <Badge variant="outline" className="font-normal">
                            {req.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-56 truncate text-muted-foreground">
                          {req.description}
                        </TableCell>
                        <TableCell className="font-medium">{money(req.amount)}</TableCell>
                        <TableCell>
                          <StatusBadge status={status} />
                        </TableCell>
                        <TableCell className="text-right">
                          {status === "pending" ? (
                            <div className="flex justify-end gap-1.5">
                              <Button
                                size="icon-sm"
                                variant="outline"
                                onClick={() => decide(req.id, "approved", req.description)}
                              >
                                <Check className="size-3.5 text-success" />
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="outline"
                                onClick={() => decide(req.id, "rejected", req.description)}
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
                    <ReceiptText className="mx-auto mb-2 size-6" />
                    No expense requests yet.
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
