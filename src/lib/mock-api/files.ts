import { apiDelete, apiGet, apiPost } from "@/lib/mock-api/http";
import type { FileItem, QueryParams } from "@/types";

export interface FileRow extends FileItem {
  ownerName: string;
  ownerAvatar: string;
}

export async function listFiles(companyId: string, params: QueryParams = {}): Promise<FileRow[]> {
  return apiGet<FileRow[]>("/api/files", companyId, params);
}

export async function createFile(
  companyId: string,
  ownerId: string,
  input: { name: string; size: number },
): Promise<FileItem> {
  return apiPost<FileItem>("/api/files", { companyId, ownerId, ...input });
}

export async function deleteFile(id: string): Promise<void> {
  await apiDelete(`/api/files/${id}`);
}
