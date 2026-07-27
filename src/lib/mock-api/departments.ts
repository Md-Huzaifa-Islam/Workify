import { DEPARTMENTS, TEAMS } from "@/lib/mock/seed";
import { delay } from "@/lib/mock-api/client";
import type { Department, Team } from "@/types";

export async function listDepartments(companyId: string): Promise<Department[]> {
  await delay(200);
  return DEPARTMENTS.filter((d) => d.companyId === companyId);
}

export async function listTeams(companyId: string): Promise<Team[]> {
  await delay(200);
  return TEAMS.filter((t) => t.companyId === companyId);
}
