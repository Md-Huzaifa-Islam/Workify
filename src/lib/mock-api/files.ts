import { EMPLOYEES, FILES } from "@/lib/mock/seed";
import { delay, searchItems, sortItems } from "@/lib/mock-api/client";
import type { FileItem, QueryParams } from "@/types";

function guessFileType(name: string): FileItem["type"] {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext && ["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) return "image";
  if (ext && ["doc", "docx"].includes(ext)) return "doc";
  if (ext && ["xls", "xlsx", "csv"].includes(ext)) return "sheet";
  return "other";
}

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

export async function createFile(
  companyId: string,
  ownerId: string,
  input: { name: string; size: number },
): Promise<FileItem> {
  await delay(500);
  const file: FileItem = {
    id: `file_${companyId}_${crypto.randomUUID()}`,
    companyId,
    name: input.name,
    type: guessFileType(input.name),
    size: input.size,
    ownerId,
    updatedAt: new Date().toISOString(),
    parentId: null,
  };
  FILES.push(file);
  return file;
}

export async function deleteFile(id: string): Promise<void> {
  await delay(300);
  const index = FILES.findIndex((f) => f.id === id);
  if (index !== -1) FILES.splice(index, 1);
}
