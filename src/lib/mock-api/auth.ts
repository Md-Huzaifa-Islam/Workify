import { apiGet } from "@/lib/mock-api/http";
import type { Employee } from "@/types";

/** In this prototype the signed-in user is always the first employee of the active company. */
export async function getCurrentUser(companyId: string): Promise<Employee> {
  return apiGet<Employee>("/api/auth/me", companyId);
}
