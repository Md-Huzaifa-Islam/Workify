"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Role {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  color: string;
}

const ROLES: Role[] = [
  { id: "owner", name: "Owner", description: "Full access to billing, roles, and workspace settings.", memberCount: 1, color: "#6366f1" },
  { id: "admin", name: "Admin", description: "Manage employees, projects, and approvals.", memberCount: 4, color: "#0ea5e9" },
  { id: "manager", name: "Manager", description: "Manage their team's tasks, leave, and expenses.", memberCount: 12, color: "#d946ef" },
  { id: "member", name: "Member", description: "Standard access to assigned projects and tasks.", memberCount: 86, color: "#10b981" },
  { id: "contractor", name: "Contractor", description: "Limited access scoped to specific projects.", memberCount: 9, color: "#f59e0b" },
];

const PERMISSIONS = [
  "View dashboard",
  "Manage employees",
  "Manage payroll",
  "Approve expenses",
  "Approve leave",
  "Manage projects",
  "Manage billing",
  "Manage roles",
];

const DEFAULT_MATRIX: Record<string, Set<string>> = {
  owner: new Set(PERMISSIONS),
  admin: new Set(PERMISSIONS.filter((p) => p !== "Manage billing" && p !== "Manage roles")),
  manager: new Set(["View dashboard", "Approve expenses", "Approve leave", "Manage projects"]),
  member: new Set(["View dashboard"]),
  contractor: new Set(["View dashboard"]),
};

export default function RolesPage() {
  const [matrix, setMatrix] = useState(DEFAULT_MATRIX);

  function toggle(roleId: string, permission: string) {
    setMatrix((prev) => {
      const next = { ...prev, [roleId]: new Set(prev[roleId]) };
      if (next[roleId].has(permission)) {
        next[roleId].delete(permission);
      } else {
        next[roleId].add(permission);
      }
      return next;
    });
    toast.success(`Updated permissions for ${ROLES.find((r) => r.id === roleId)?.name}`);
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Roles & Permissions"
        description="Define what each role can see and do across your workspace."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" />
            New role
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {ROLES.map((role) => (
          <Card key={role.id}>
            <CardContent className="space-y-2 p-4">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: role.color }} />
                <p className="font-medium">{role.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">{role.description}</p>
              <Badge variant="secondary" className="gap-1 font-normal">
                <Users className="size-3" />
                {role.memberCount} members
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-56">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5" />
                    Permission
                  </div>
                </TableHead>
                {ROLES.map((role) => (
                  <TableHead key={role.id} className="text-center">
                    {role.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERMISSIONS.map((permission) => (
                <TableRow key={permission}>
                  <TableCell className="font-medium">{permission}</TableCell>
                  {ROLES.map((role) => (
                    <TableCell key={role.id} className="text-center">
                      <Checkbox
                        checked={matrix[role.id]?.has(permission)}
                        disabled={role.id === "owner"}
                        onCheckedChange={() => toggle(role.id, permission)}
                        className="mx-auto"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
