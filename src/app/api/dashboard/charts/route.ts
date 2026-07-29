import { NextRequest, NextResponse } from "next/server";
import { DEPARTMENTS, TASKS } from "@/lib/mock/seed";
import { cached } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";

const getCharts = cached("dashboard-charts", 20, ["entity:dashboard"], async (companyId: string) => {
  await delay(150);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyProductivity = days.map((day, i) => ({
    day,
    completed: 12 + ((i * 7) % 18),
    created: 8 + ((i * 5) % 14),
  }));

  const depts = DEPARTMENTS.filter((d) => d.companyId === companyId);
  const departmentPerformance = depts.map((d) => ({
    department: d.name,
    score: 60 + ((d.employeeCount * 7) % 38),
  }));

  const companyTasks = TASKS.filter((t) => t.companyId === companyId);
  const statusCounts = {
    todo: companyTasks.filter((t) => t.status === "todo").length,
    in_progress: companyTasks.filter((t) => t.status === "in_progress").length,
    review: companyTasks.filter((t) => t.status === "review").length,
    done: companyTasks.filter((t) => t.status === "done").length,
  };
  const taskCompletion = [
    { name: "Todo", value: statusCounts.todo },
    { name: "In Progress", value: statusCounts.in_progress },
    { name: "Review", value: statusCounts.review },
    { name: "Done", value: statusCounts.done },
  ];

  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const monthlyExpenses = months.map((month, i) => ({
    month,
    amount: 42_000 + ((i * 3700) % 21_000),
  }));
  const payrollTrend = months.map((month, i) => ({
    month,
    amount: 180_000 + ((i * 9200) % 40_000),
  }));

  return { weeklyProductivity, departmentPerformance, taskCompletion, monthlyExpenses, payrollTrend };
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  return NextResponse.json(await getCharts(companyId));
}
