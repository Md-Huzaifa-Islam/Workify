import { NextRequest, NextResponse } from "next/server";
import { EMPLOYEES } from "@/lib/mock/seed";
import { cached, entityTag, revalidate } from "@/lib/server/cache";
import { delay, paginate, parseQueryParams, searchItems, sortItems } from "@/lib/server/query-utils";
import type { Employee } from "@/types";

const TAG = entityTag("employees");

const getEmployeesList = cached(
  "employees-list",
  15,
  [TAG],
  async (companyId: string, paramsJson: string) => {
    await delay();
    const params = JSON.parse(paramsJson) as ReturnType<typeof parseQueryParams>;
    let items = EMPLOYEES.filter((e) => e.companyId === companyId);
    if (params.filters?.departmentId) {
      items = items.filter((e) => e.departmentId === params.filters?.departmentId);
    }
    if (params.filters?.status) {
      items = items.filter((e) => e.status === params.filters?.status);
    }
    items = searchItems(items, params.search, ["name", "email", "role", "title"]);
    items = sortItems(items, params.sortBy, params.sortDir);
    return paginate(items, params);
  },
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  const params = parseQueryParams(searchParams);
  const result = await getEmployeesList(companyId, JSON.stringify(params));
  return NextResponse.json(result);
}

interface CreateEmployeeBody {
  companyId: string;
  name: string;
  email: string;
  title: string;
  departmentId: string;
  employmentType: Employee["employmentType"];
  location: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreateEmployeeBody;
  await delay(250);
  const employee: Employee = {
    id: `emp_${body.companyId}_${crypto.randomUUID()}`,
    companyId: body.companyId,
    departmentId: body.departmentId,
    teamIds: [],
    name: body.name,
    email: body.email,
    avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(body.name)}`,
    role: body.title,
    title: body.title,
    status: "pending",
    employmentType: body.employmentType,
    location: body.location,
    joinedAt: new Date().toISOString(),
    managerId: null,
    salary: 0,
    phone: "",
  };
  EMPLOYEES.push(employee);
  revalidate(TAG);
  revalidate(entityTag("departments"));
  return NextResponse.json(employee, { status: 201 });
}
