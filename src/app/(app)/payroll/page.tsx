"use client";

import { useQuery } from "@tanstack/react-query";
import { Banknote, Download, TrendingDown, Users, Wallet } from "lucide-react";
import { getPayrollSummary, listPayrollRuns } from "@/lib/mock-api/payroll";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function PayrollPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["payroll-summary", companyId],
    queryFn: () => getPayrollSummary(companyId),
  });
  const { data, isLoading } = useQuery({
    queryKey: ["payroll-runs", companyId, summary?.currentPeriod],
    queryFn: () =>
      listPayrollRuns(companyId, {
        pageSize: 50,
        filters: { period: summary?.currentPeriod },
      }),
    enabled: !!summary,
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Payroll"
        description={summary ? `Current cycle: ${summary.currentPeriod}` : "Loading current cycle..."}
        actions={
          <Button size="sm" className="gap-1.5">
            <Banknote className="size-4" />
            Run payroll
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label="Gross payroll"
          icon={Wallet}
          loading={summaryLoading}
          value={money(summary?.totalGross ?? 0)}
          hint="This cycle"
        />
        <StatCard
          index={1}
          label="Net payroll"
          icon={Banknote}
          loading={summaryLoading}
          value={money(summary?.totalNet ?? 0)}
          hint="After deductions"
        />
        <StatCard
          index={2}
          label="Deductions"
          icon={TrendingDown}
          loading={summaryLoading}
          value={money(summary?.totalDeductions ?? 0)}
          hint="Tax & benefits"
        />
        <StatCard
          index={3}
          label="Employees paid"
          icon={Users}
          loading={summaryLoading}
          value={String(summary?.employeeCount ?? 0)}
          hint="In this cycle"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Pay runs — {summary?.currentPeriod}</CardTitle>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="size-3.5" />
            Export
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Gross pay</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net pay</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : data?.data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar size="sm">
                            <AvatarImage src={row.employeeAvatar} alt={row.employeeName} />
                            <AvatarFallback>{row.employeeName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{row.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{row.employeeRole}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{money(row.grossPay)}</TableCell>
                      <TableCell className="text-muted-foreground">{money(row.deductions)}</TableCell>
                      <TableCell className="font-medium">{money(row.netPay)}</TableCell>
                      <TableCell>
                        <StatusBadge status={row.status} />
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
