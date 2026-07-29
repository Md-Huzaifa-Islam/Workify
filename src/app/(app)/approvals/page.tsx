"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Banknote, Check, ClipboardList, ReceiptText, X } from "lucide-react";
import { listLeaveRequests, updateLeaveStatus } from "@/lib/mock-api/leave";
import { listExpenseRequests, updateExpenseStatus } from "@/lib/mock-api/expenses";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApprovalStatus } from "@/types";

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

interface ApprovalItem {
  id: string;
  kind: "leave" | "expense";
  name: string;
  avatar: string;
  title: string;
  meta: string;
  requestedAt: string;
  status: ApprovalStatus;
}

export default function ApprovalsPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const queryClient = useQueryClient();

  const { data: leave, isLoading: leaveLoading } = useQuery({
    queryKey: ["leave-requests", companyId],
    queryFn: () => listLeaveRequests(companyId, { pageSize: 50, filters: { status: "pending" } }),
  });
  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ["expense-requests", companyId],
    queryFn: () => listExpenseRequests(companyId, { pageSize: 50, filters: { status: "pending" } }),
  });

  const items = useMemo<ApprovalItem[]>(() => {
    const leaveItems: ApprovalItem[] =
      leave?.data.map((l) => ({
        id: l.id,
        kind: "leave",
        name: l.employeeName,
        avatar: l.employeeAvatar,
        title: `${l.type.charAt(0).toUpperCase() + l.type.slice(1)} leave · ${l.days} day${l.days > 1 ? "s" : ""}`,
        meta: `${new Date(l.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(l.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        requestedAt: l.requestedAt,
        status: l.status,
      })) ?? [];
    const expenseItems: ApprovalItem[] =
      expenses?.data.map((e) => ({
        id: e.id,
        kind: "expense",
        name: e.employeeName,
        avatar: e.employeeAvatar,
        title: `${e.category} · ${money(e.amount)}`,
        meta: e.description,
        requestedAt: e.submittedAt,
        status: e.status,
      })) ?? [];
    return [...leaveItems, ...expenseItems].sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
    );
  }, [leave, expenses]);

  const pending = items.filter((i) => i.status === "pending");
  const isLoading = leaveLoading || expensesLoading;

  const decideMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      kind,
    }: {
      id: string;
      status: ApprovalStatus;
      name: string;
      kind: "leave" | "expense";
    }) => {
      if (kind === "leave") await updateLeaveStatus(id, status);
      else await updateExpenseStatus(id, status);
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests", companyId] });
      queryClient.invalidateQueries({ queryKey: ["expense-requests", companyId] });
      queryClient.invalidateQueries({ queryKey: ["leave-balances", companyId] });
      queryClient.invalidateQueries({ queryKey: ["expense-summary", companyId] });
      toast[variables.status === "approved" ? "success" : "error"](
        `${variables.status === "approved" ? "Approved" : "Rejected"} request from ${variables.name}`,
      );
    },
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Approvals"
        description="A unified inbox for expense and leave requests awaiting your decision."
        actions={
          <Badge variant="secondary" className="font-normal">
            {pending.length} pending
          </Badge>
        }
      />

      <div className="flex flex-col gap-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
          : pending.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <EntityAvatar name={item.name} src={item.avatar} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.name}</p>
                        <Badge variant="outline" className="gap-1 font-normal">
                          {item.kind === "leave" ? (
                            <ClipboardList className="size-3" />
                          ) : (
                            <ReceiptText className="size-3" />
                          )}
                          {item.kind === "leave" ? "Leave" : "Expense"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.meta}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      disabled={decideMutation.isPending}
                      onClick={() =>
                        decideMutation.mutate({ id: item.id, status: "approved", name: item.name, kind: item.kind })
                      }
                    >
                      <Check className="size-3.5 text-success" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      disabled={decideMutation.isPending}
                      onClick={() =>
                        decideMutation.mutate({ id: item.id, status: "rejected", name: item.name, kind: item.kind })
                      }
                    >
                      <X className="size-3.5 text-destructive" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        {!isLoading && pending.length === 0 ? (
          <Card>
            <EmptyState
              icon={Banknote}
              title="You're all caught up"
              description="No pending leave or expense approvals right now."
            />
          </Card>
        ) : null}
      </div>
    </div>
  );
}
