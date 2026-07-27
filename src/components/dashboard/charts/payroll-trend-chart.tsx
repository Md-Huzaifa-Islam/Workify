"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const config = {
  amount: { label: "Payroll", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function PayrollTrendChart({ data }: { data: { month: string; amount: number }[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-56 w-full">
      <LineChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line
          dataKey="amount"
          type="monotone"
          stroke="var(--color-amount)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "var(--color-amount)" }}
        />
      </LineChart>
    </ChartContainer>
  );
}
