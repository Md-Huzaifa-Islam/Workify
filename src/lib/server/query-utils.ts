import type { PaginatedResult, QueryParams } from "@/types";

/** Simulates real network/DB latency so loading states stay visible. */
export function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

/** Parses the QueryParams a client sent as URLSearchParams (?params=<json>). */
export function parseQueryParams(searchParams: URLSearchParams): QueryParams {
  const raw = searchParams.get("params");
  if (!raw) return {};
  try {
    return JSON.parse(raw) as QueryParams;
  } catch {
    return {};
  }
}
