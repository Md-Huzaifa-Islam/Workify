import { DEPARTMENTS, EMPLOYEES } from "@/lib/mock/seed";
import { delay, paginate, searchItems, sortItems } from "@/lib/mock-api/client";
import type { Employee, PaginatedResult, QueryParams, Status } from "@/types";

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

export interface CreateEmployeeInput {
  name: string;
  email: string;
  title: string;
  departmentId: string;
  employmentType: Employee["employmentType"];
  location: string;
}

export async function createEmployee(
  companyId: string,
  input: CreateEmployeeInput,
): Promise<Employee> {
  await delay(400);
  const employee: Employee = {
    id: `emp_${companyId}_${crypto.randomUUID()}`,
    companyId,
    departmentId: input.departmentId,
    teamIds: [],
    name: input.name,
    email: input.email,
    avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(input.name)}`,
    role: input.title,
    title: input.title,
    status: "pending",
    employmentType: input.employmentType,
    location: input.location,
    joinedAt: new Date().toISOString(),
    managerId: null,
    salary: 0,
    phone: "",
  };
  EMPLOYEES.push(employee);
  return employee;
}

export async function updateEmployeeStatus(id: string, status: Status): Promise<Employee> {
  await delay(300);
  const employee = EMPLOYEES.find((e) => e.id === id);
  if (!employee) throw new Error("Employee not found");
  employee.status = status;
  return employee;
}
