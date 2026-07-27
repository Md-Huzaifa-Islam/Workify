import type { PaginatedResult, QueryParams } from "@/types";

export function delay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
    this.name = "MockApiError";
  }
}

/** ~2% of calls reject, so pages can exercise real error states. */
export function maybeFail(rate = 0.02) {
  if (Math.random() < rate) {
    throw new MockApiError("Something went wrong while fetching data.");
  }
}

export function paginate<T>(items: T[], params: QueryParams = {}): PaginatedResult<T> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return { data, page, pageSize, total, totalPages };
}

export function sortItems<T>(items: T[], sortBy?: string, sortDir: "asc" | "desc" = "asc"): T[] {
  if (!sortBy) return items;
  const sorted = [...items].sort((a, b) => {
    const av = (a as Record<string, unknown>)[sortBy];
    const bv = (b as Record<string, unknown>)[sortBy];
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av ?? "").localeCompare(String(bv ?? ""));
  });
  return sortDir === "desc" ? sorted.reverse() : sorted;
}

export function searchItems<T>(items: T[], search: string | undefined, fields: (keyof T)[]): T[] {
  if (!search) return items;
  const q = search.toLowerCase();
  return items.filter((item) =>
    fields.some((field) => String(item[field] ?? "").toLowerCase().includes(q)),
  );
}
