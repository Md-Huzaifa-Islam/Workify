import type { QueryParams } from "@/types";

function buildQuery(companyId?: string, params?: QueryParams) {
  const search = new URLSearchParams();
  if (companyId) search.set("companyId", companyId);
  if (params) search.set("params", JSON.stringify(params));
  return search.toString();
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function apiGet<T>(path: string, companyId?: string, params?: QueryParams): Promise<T> {
  const qs = buildQuery(companyId, params);
  const res = await fetch(qs ? `${path}?${qs}` : path);
  return handle<T>(res);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handle<T>(res);
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handle<T>(res);
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(path, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed with status ${res.status}`);
  }
}
