import { apiGet } from "@/lib/mock-api/http";
import type { Company } from "@/types";

export async function getCompanies(): Promise<Company[]> {
  return apiGet<Company[]>("/api/companies");
}

export async function getCompany(id: string): Promise<Company | null> {
  return apiGet<Company | null>(`/api/companies/${id}`);
}

/** Matches the first seeded company's deterministic id (seed.ts assigns company_1..company_5). */
export const DEFAULT_COMPANY_ID = "company_1";
