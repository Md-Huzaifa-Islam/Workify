"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Banknote, Check, ClipboardList, ReceiptText, X } from "lucide-react";
import { listLeaveRequests } from "@/lib/mock-api/leave";
import { listExpenseRequests } from "@/lib/mock-api/expenses";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const [overrides, setOverrides] = useState<Record<string, ApprovalStatus>>({});

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

  const pending = items.filter((i) => (overrides[i.id] ?? i.status) === "pending");
  const isLoading = leaveLoading || expensesLoading;

  function decide(id: string, status: ApprovalStatus, name: string) {
    setOverrides((prev) => ({ ...prev, [id]: status }));
    toast[status === "approved" ? "success" : "error"](
      `${status === "approved" ? "Approved" : "Rejected"} request from ${name}`,
    );
  }

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
                    <Avatar>
                      <AvatarImage src={item.avatar} alt={item.name} />
                      <AvatarFallback>{item.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
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
                      onClick={() => decide(item.id, "approved", item.name)}
                    >
                      <Check className="size-3.5 text-success" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => decide(item.id, "rejected", item.name)}
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
            <CardContent className="flex flex-col items-center gap-2 p-10 text-center text-muted-foreground">
              <Banknote className="size-6" />
              You&apos;re all caught up — no pending approvals.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
