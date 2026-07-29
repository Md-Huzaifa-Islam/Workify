import { NextRequest, NextResponse } from "next/server";
import { FILES } from "@/lib/mock/seed";
import { entityTag, revalidate } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await delay(200);
  const index = FILES.findIndex((f) => f.id === id);
  if (index !== -1) FILES.splice(index, 1);
  revalidate(entityTag("files"));
  return NextResponse.json({ ok: true });
}
