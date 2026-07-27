import { DEPARTMENTS, EMPLOYEES } from "@/lib/mock/seed";
import { delay, paginate, searchItems, sortItems } from "@/lib/mock-api/client";
import type { Employee, PaginatedResult, QueryParams } from "@/types";

export async function listEmployees(
  companyId: string,
  params: QueryParams = {},
): Promise<PaginatedResult<Employee>> {
  await delay();
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
}

export async function getEmployee(id: string): Promise<Employee | null> {
  await delay(200);
  return EMPLOYEES.find((e) => e.id === id) ?? null;
}

export function getEmployeeDepartmentName(departmentId: string): string {
  return DEPARTMENTS.find((d) => d.id === departmentId)?.name ?? "Unknown";
}
