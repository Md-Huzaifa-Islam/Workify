import { EMPLOYEES, FILES } from "@/lib/mock/seed";
import { delay, searchItems, sortItems } from "@/lib/mock-api/client";
import type { FileItem, QueryParams } from "@/types";

export interface FileRow extends FileItem {
  ownerName: string;
  ownerAvatar: string;
}

export async function listFiles(companyId: string, params: QueryParams = {}): Promise<FileRow[]> {
  await delay();
  let items: FileRow[] = FILES.filter((f) => f.companyId === companyId).map((f) => {
    const owner = EMPLOYEES.find((e) => e.id === f.ownerId);
    return { ...f, ownerName: owner?.name ?? "Unknown", ownerAvatar: owner?.avatarUrl ?? "" };
  });
  if (params.filters?.type) {
    items = items.filter((f) => f.type === params.filters?.type);
  }
  items = searchItems(items, params.search, ["name"]);
  items = sortItems(items, params.sortBy ?? "updatedAt", params.sortDir ?? "desc");
  return items;
}
