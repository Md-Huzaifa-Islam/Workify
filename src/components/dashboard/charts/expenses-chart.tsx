"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const config = {
  amount: { label: "Expenses", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function ExpensesChart({ data }: { data: { month: string; amount: number }[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-56 w-full">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Area
          dataKey="amount"
          type="monotone"
          fill="url(#fillExpenses)"
          stroke="var(--color-amount)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
