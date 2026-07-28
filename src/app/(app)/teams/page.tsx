"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, UsersRound } from "lucide-react";
import { listTeams } from "@/lib/mock-api/departments";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamsPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const { data, isLoading } = useQuery({
    queryKey: ["teams", companyId],
    queryFn: () => listTeams(companyId),
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Teams"
        description="Squads, pods, and guilds organized under each department."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" />
            New team
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="space-y-3 p-5">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))
          : data?.map((team) => (
              <Card key={team.id} className="transition-shadow hover:shadow-md">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <UsersRound className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium">{team.name}</p>
                        <Badge variant="outline" className="mt-0.5 font-normal">
                          {team.departmentName}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{team.description}</p>
                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarImage src={team.leadAvatar} alt={team.leadName} />
                        <AvatarFallback>{team.leadName.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs text-muted-foreground">Team lead</p>
                        <p className="text-sm font-medium">{team.leadName}</p>
                      </div>
                    </div>
                    <AvatarGroup>
                      {team.members.slice(0, 4).map((m) => (
                        <Avatar key={m.id} size="sm">
                          <AvatarImage src={m.avatarUrl} alt={m.name} />
                          <AvatarFallback>{m.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                      ))}
                      {team.members.length > 4 ? (
                        <AvatarGroupCount>+{team.members.length - 4}</AvatarGroupCount>
                      ) : null}
                    </AvatarGroup>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
