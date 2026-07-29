import { NextRequest, NextResponse } from "next/server";
import { DEPARTMENTS, EMPLOYEES, TEAMS } from "@/lib/mock/seed";
import { cached, entityTag, revalidate } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";
import type { Team } from "@/types";

const TAG = entityTag("teams");

const getTeamsList = cached("teams-list", 60, [TAG], async (companyId: string) => {
  await delay();
  return TEAMS.filter((t) => t.companyId === companyId).map((t) => {
    const dept = DEPARTMENTS.find((d) => d.id === t.departmentId);
    const lead = EMPLOYEES.find((e) => e.id === t.leadId);
    const members = t.memberIds
      .map((id) => EMPLOYEES.find((e) => e.id === id))
      .filter((e): e is (typeof EMPLOYEES)[number] => Boolean(e))
      .map((e) => ({ id: e.id, name: e.name, avatarUrl: e.avatarUrl }));
    return {
      ...t,
      departmentName: dept?.name ?? "Unknown",
      leadName: lead?.name ?? "Unknown",
      leadAvatar: lead?.avatarUrl ?? "",
      members,
    };
  });
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  return NextResponse.json(await getTeamsList(companyId));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    companyId: string;
    name: string;
    departmentId: string;
    leadId: string;
    description: string;
  };
  await delay(250);
  const team: Team = {
    id: `team_${body.departmentId}_${crypto.randomUUID()}`,
    companyId: body.companyId,
    departmentId: body.departmentId,
    name: body.name,
    leadId: body.leadId,
    memberIds: [body.leadId],
    description: body.description,
  };
  TEAMS.push(team);
  revalidate(entityTag("teams"));
  revalidate(entityTag("departments"));
  return NextResponse.json(team, { status: 201 });
}
