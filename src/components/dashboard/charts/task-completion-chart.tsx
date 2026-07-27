"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const config = {
  value: { label: "Tasks" },
  Todo: { label: "Todo", color: "var(--chart-4)" },
  "In Progress": { label: "In Progress", color: "var(--chart-1)" },
  Review: { label: "Review", color: "var(--chart-3)" },
  Done: { label: "Done", color: "var(--chart-5)" },
} satisfies ChartConfig;

const COLORS: Record<string, string> = {
  Todo: "var(--chart-4)",
  "In Progress": "var(--chart-1)",
  Review: "var(--chart-3)",
  Done: "var(--chart-5)",
};

export function TaskCompletionChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
      </PieChart>
    </ChartContainer>
  );
}
