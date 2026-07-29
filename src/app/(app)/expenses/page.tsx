"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Plus, ReceiptText, X } from "lucide-react";
import { createExpenseRequest, getExpenseSummary, listExpenseRequests, updateExpenseStatus } from "@/lib/mock-api/expenses";
import { getCurrentUser } from "@/lib/mock-api/auth";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
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
import type { ApprovalStatus } from "@/types";

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

const CATEGORIES = ["Travel", "Meals", "Software", "Equipment", "Office Supplies", "Training"];
const EMPTY_EXPENSE = { category: "", description: "", amount: "" };

export default function ExpensesPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_EXPENSE);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["expense-summary", companyId],
    queryFn: () => getExpenseSummary(companyId),
  });
  const { data, isLoading } = useQuery({
    queryKey: ["expense-requests", companyId],
    queryFn: () => listExpenseRequests(companyId, { pageSize: 50 }),
  });

  function invalidateExpenses() {
    queryClient.invalidateQueries({ queryKey: ["expense-requests", companyId] });
    queryClient.invalidateQueries({ queryKey: ["expense-summary", companyId] });
  }

  const decideMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApprovalStatus; description: string }) =>
      updateExpenseStatus(id, status),
    onSuccess: (_result, variables) => {
      invalidateExpenses();
      toast[variables.status === "approved" ? "success" : "error"](
        `${variables.status === "approved" ? "Approved" : "Rejected"} expense: ${variables.description}`,
      );
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const user = await getCurrentUser(companyId);
      return createExpenseRequest(companyId, user.id, {
        category: form.category,
        description: form.description,
        amount: Number(form.amount) || 0,
      });
    },
    onSuccess: (expense) => {
      invalidateExpenses();
      toast.success(`Expense submitted: ${expense.description}`);
      setCreateOpen(false);
      setForm(EMPTY_EXPENSE);
    },
  });

  const canCreate = form.category && form.description.trim() && Number(form.amount) > 0;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Expenses"
        description="Review and approve reimbursement requests from your team."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
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
                                disabled={decideMutation.isPending}
                                onClick={() =>
                                  decideMutation.mutate({ id: req.id, status: "approved", description: req.description })
                                }
                              >
                                <Check className="size-3.5 text-success" />
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="outline"
                                disabled={decideMutation.isPending}
                                onClick={() =>
                                  decideMutation.mutate({ id: req.id, status: "rejected", description: req.description })
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
                    <ReceiptText className="mx-auto mb-2 size-6" />
                    No expense requests yet.
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
            <DialogTitle>New expense</DialogTitle>
            <DialogDescription>Submitted expenses start in pending status.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((prev) => ({ ...prev, category: String(v) }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="expense-description">Description</Label>
              <Textarea
                id="expense-description"
                placeholder="What was this expense for?"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="expense-amount">Amount (USD)</Label>
              <Input
                id="expense-amount"
                type="number"
                placeholder="120"
                value={form.amount}
                onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button disabled={!canCreate || createMutation.isPending} onClick={() => createMutation.mutate()}>
              {createMutation.isPending ? "Submitting..." : "Submit expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
