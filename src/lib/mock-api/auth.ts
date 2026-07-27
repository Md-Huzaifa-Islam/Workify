import { EMPLOYEES } from "@/lib/mock/seed";
import { delay } from "@/lib/mock-api/client";
import type { Employee } from "@/types";

/** In this prototype the signed-in user is always the first employee of the active company. */
export async function getCurrentUser(companyId: string): Promise<Employee> {
  await delay(150);
  const user = EMPLOYEES.find((e) => e.companyId === companyId);
  if (!user) throw new Error(`No employees found for company ${companyId}`);
  return user;
}
