"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, Clock, UserCheck, UserX } from "lucide-react";
import { getAttendanceSummary, listTodayAttendance } from "@/lib/mock-api/attendance";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  present: { label: "Present", color: "var(--chart-5)" },
  absent: { label: "Absent", color: "var(--chart-1)" },
} satisfies ChartConfig;

export default function AttendancePage() {
  const companyId = useWorkspaceStore((s) => s.companyId);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["attendance-summary", companyId],
    queryFn: () => getAttendanceSummary(companyId),
  });
  const { data, isLoading } = useQuery({
    queryKey: ["attendance-today", companyId],
    queryFn: () => listTodayAttendance(companyId, { pageSize: 50 }),
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Attendance"
        description="Today's check-ins and the week's attendance trend."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label="Present today"
          icon={UserCheck}
          loading={summaryLoading}
          value={String(summary?.present ?? 0)}
          hint={`of ${summary?.total ?? 0} employees`}
        />
        <StatCard
          index={1}
          label="Late arrivals"
          icon={Clock}
          loading={summaryLoading}
          value={String(summary?.late ?? 0)}
          hint="Checked in after 9:00"
        />
        <StatCard
          index={2}
          label="Absent"
          icon={UserX}
          loading={summaryLoading}
          value={String(summary?.absent ?? 0)}
          hint="No check-in recorded"
        />
        <StatCard
          index={3}
          label="On leave"
          icon={CalendarCheck}
          loading={summaryLoading}
          value={String(summary?.leave ?? 0)}
          hint="Approved leave today"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly attendance trend</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryLoading || !summary ? (
            <div className="h-64 animate-pulse rounded-lg bg-muted" />
          ) : (
            <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
              <BarChart data={summary.weeklyTrend}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="present" fill="var(--color-present)" radius={4} />
                <Bar dataKey="absent" fill="var(--color-absent)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Today&apos;s log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Check in</TableHead>
                <TableHead>Check out</TableHead>
                <TableHead>Hours</TableHead>
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
                          <EntityAvatar name={row.employeeName} src={row.employeeAvatar} size="sm" />
                          <div>
                            <p className="font-medium">{row.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{row.employeeRole}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{row.checkIn ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{row.checkOut ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{row.hoursWorked}h</TableCell>
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
