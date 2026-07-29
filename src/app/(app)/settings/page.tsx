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
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Company } from "@/types";

function CompanyProfileForm({ company }: { company: Company }) {
  const [name, setName] = useState(company.name);
  const [industry, setIndustry] = useState(company.industry);
  const [saving, setSaving] = useState(false);

  function save() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Company profile updated");
    }, 500);
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <EntityAvatar name={company.name} src={company.logoUrl} size="lg" />
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
      <Button size="sm" disabled={saving} onClick={save}>
        {saving ? "Saving..." : "Save changes"}
      </Button>
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
                <AlertDialog>
                  <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>Transfer</AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Transfer ownership?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You&apos;ll lose owner-level access to billing and workspace deletion. The new owner will be
                        notified immediately.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => toast.success("Ownership transfer request sent")}>
                        Transfer ownership
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-3">
                <div>
                  <p className="text-sm font-medium">Delete workspace</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete this company and all of its data.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>Delete</AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this workspace?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This permanently deletes all employees, projects, payroll history, and files for this
                        company. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-white hover:bg-destructive/90"
                        onClick={() => toast.error("This is a UI prototype — workspace deletion is not wired up yet.")}
                      >
                        Delete workspace
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
