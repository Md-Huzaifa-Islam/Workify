import { NextRequest, NextResponse } from "next/server";
import { EMPLOYEES, FILES } from "@/lib/mock/seed";
import { cached, entityTag, revalidate } from "@/lib/server/cache";
import { delay, parseQueryParams, searchItems, sortItems } from "@/lib/server/query-utils";
import type { FileItem } from "@/types";

const TAG = entityTag("files");

function guessFileType(name: string): FileItem["type"] {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext && ["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) return "image";
  if (ext && ["doc", "docx"].includes(ext)) return "doc";
  if (ext && ["xls", "xlsx", "csv"].includes(ext)) return "sheet";
  return "other";
}

const getFilesList = cached(
  "files-list",
  15,
  [TAG],
  async (companyId: string, paramsJson: string) => {
    await delay();
    const params = JSON.parse(paramsJson) as ReturnType<typeof parseQueryParams>;
    let items = FILES.filter((f) => f.companyId === companyId).map((f) => {
      const owner = EMPLOYEES.find((e) => e.id === f.ownerId);
      return { ...f, ownerName: owner?.name ?? "Unknown", ownerAvatar: owner?.avatarUrl ?? "" };
    });
    if (params.filters?.type) {
      items = items.filter((f) => f.type === params.filters?.type);
    }
    items = searchItems(items, params.search, ["name"]);
    items = sortItems(items, params.sortBy ?? "updatedAt", params.sortDir ?? "desc");
    return items;
  },
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  const params = parseQueryParams(searchParams);
  return NextResponse.json(await getFilesList(companyId, JSON.stringify(params)));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { companyId: string; ownerId: string; name: string; size: number };
  await delay(400);
  const file: FileItem = {
    id: `file_${body.companyId}_${crypto.randomUUID()}`,
    companyId: body.companyId,
    name: body.name,
    type: guessFileType(body.name),
    size: body.size,
    ownerId: body.ownerId,
    updatedAt: new Date().toISOString(),
    parentId: null,
  };
  FILES.push(file);
  revalidate(TAG);
  return NextResponse.json(file, { status: 201 });
}
