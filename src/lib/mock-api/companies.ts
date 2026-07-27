import { COMPANIES } from "@/lib/mock/seed";
import { delay } from "@/lib/mock-api/client";
import type { Company } from "@/types";

export async function getCompanies(): Promise<Company[]> {
  await delay(200);
  return COMPANIES;
}

export async function getCompany(id: string): Promise<Company | null> {
  await delay(150);
  return COMPANIES.find((c) => c.id === id) ?? null;
}

export const DEFAULT_COMPANY_ID = COMPANIES[0].id;
