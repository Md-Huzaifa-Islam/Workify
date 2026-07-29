import { apiGet, apiPatch, apiPost } from "@/lib/mock-api/http";
import type { Employee, PaginatedResult, QueryParams, Status } from "@/types";

export async function listEmployees(
  companyId: string,
  params: QueryParams = {},
): Promise<PaginatedResult<Employee>> {
  return apiGet<PaginatedResult<Employee>>("/api/employees", companyId, params);
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  title: string;
  departmentId: string;
  employmentType: Employee["employmentType"];
  location: string;
}

export async function createEmployee(companyId: string, input: CreateEmployeeInput): Promise<Employee> {
  return apiPost<Employee>("/api/employees", { companyId, ...input });
}

export async function updateEmployeeStatus(id: string, status: Status): Promise<Employee> {
  return apiPatch<Employee>(`/api/employees/${id}`, { status });
}
