"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard, Download } from "lucide-react";
import { getBillingPlan, listInvoices, PLAN_TIERS } from "@/lib/mock-api/billing";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function BillingPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);

  const { data: plan, isLoading: planLoading } = useQuery({
    queryKey: ["billing-plan", companyId],
    queryFn: () => getBillingPlan(companyId),
  });
  const { data, isLoading } = useQuery({
    queryKey: ["invoices", companyId],
    queryFn: () => listInvoices(companyId, { pageSize: 20 }),
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Billing"
        description="Manage your subscription, seats, and payment method."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Current plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {planLoading || !plan ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">{plan.name} plan</p>
                    <p className="text-sm text-muted-foreground">
                      {money(plan.price)}/mo · billed monthly
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change plan
                  </Button>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Seats used</span>
                    <span className="font-medium">
                      {plan.seatsUsed} / {plan.seats}
                    </span>
                  </div>
                  <Progress value={(plan.seatsUsed / plan.seats) * 100} className="h-1.5" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Renews on{" "}
                  {new Date(plan.renewsAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {planLoading || !plan ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {plan.cardBrand} •••• {plan.cardLast4}
                  </p>
                  <p className="text-xs text-muted-foreground">Expires 12/28</p>
                </div>
              </div>
            )}
            <Button variant="outline" size="sm" className="w-full">
              Update payment method
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compare plans</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PLAN_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "rounded-lg border p-4",
                plan?.name.toLowerCase() === tier.label.toLowerCase() && "border-primary ring-1 ring-primary",
              )}
            >
              <p className="font-medium">{tier.label}</p>
              <p className="mt-1 text-2xl font-semibold">
                {money(tier.price)}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Up to {tier.seats} seats</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Invoices</CardTitle>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="size-3.5" />
            Export all
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
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
                : data?.data.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell className="text-muted-foreground">{invoice.client}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{money(invoice.amount)}</TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status} />
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
