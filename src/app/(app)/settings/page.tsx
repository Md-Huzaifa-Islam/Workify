"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { getCompany } from "@/lib/mock-api/companies";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Company } from "@/types";

function CompanyProfileForm({ company }: { company: Company }) {
  const [name, setName] = useState(company.name);
  const [industry, setIndustry] = useState(company.industry);

  return (
    <>
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          <AvatarImage src={company.logoUrl} alt={company.name} />
          <AvatarFallback>{company.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm">
          Change logo
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="company-name">Company name</Label>
          <Input id="company-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company-industry">Industry</Label>
          <Input id="company-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
        </div>
      </div>
    </>
  );
}

export default function SettingsPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const { data: company, isLoading } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getCompany(companyId),
  });

  const [notifications, setNotifications] = useState({
    taskAssigned: true,
    approvalRequests: true,
    weeklyDigest: false,
    productUpdates: true,
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader title="Company Settings" description="Profile, notifications, and workspace preferences." />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="danger">Danger zone</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company profile</CardTitle>
              <CardDescription>This information appears across invoices and reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading || !company ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <CompanyProfileForm key={company.id} company={company} />
              )}
              <Button size="sm" onClick={() => toast.success("Company profile updated")}>
                Save changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification preferences</CardTitle>
              <CardDescription>Choose what your workspace notifies you about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "taskAssigned" as const, label: "Task assigned to me", description: "Get notified when a task is assigned to you." },
                { key: "approvalRequests" as const, label: "Approval requests", description: "Get notified about pending leave and expense approvals." },
                { key: "weeklyDigest" as const, label: "Weekly digest", description: "A weekly summary of activity across your workspace." },
                { key: "productUpdates" as const, label: "Product updates", description: "News about new Workify features and improvements." },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, [item.key]: !!checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="mt-4">
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-destructive">
                <AlertTriangle className="size-4" />
                Danger zone
              </CardTitle>
              <CardDescription>These actions are irreversible — proceed with caution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Transfer ownership</p>
                  <p className="text-xs text-muted-foreground">Move workspace ownership to another admin.</p>
                </div>
                <Button variant="outline" size="sm">
                  Transfer
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-3">
                <div>
                  <p className="text-sm font-medium">Delete workspace</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete this company and all of its data.
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
