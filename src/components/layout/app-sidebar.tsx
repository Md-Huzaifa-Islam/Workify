"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CompanySwitcher } from "@/components/layout/company-switcher";
import { NAV_GROUPS } from "@/lib/nav-config";
import { UserMenu } from "@/components/layout/user-menu";
import { getBillingPlan } from "@/lib/mock-api/billing";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

function PlanUsageCard() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const { data: plan } = useQuery({
    queryKey: ["billing-plan", companyId],
    queryFn: () => getBillingPlan(companyId),
  });

  if (!plan) return null;

  const pct = Math.min(100, Math.round((plan.seatsUsed / plan.seats) * 100));

  return (
    <div className="mx-2 mb-1 rounded-xl border bg-sidebar-accent/40 p-3 group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">{plan.name} plan</span>
        <span className="text-[11px] text-muted-foreground">
          {plan.seatsUsed}/{plan.seats} seats
        </span>
      </div>
      <Progress value={pct} className="mt-2 h-1.5" />
      <Button
        size="sm"
        variant="outline"
        className="mt-3 w-full gap-1.5 bg-background"
        render={<Link href="/billing" />}
      >
        <Sparkles className="size-3.5 text-primary" />
        Upgrade plan
      </Button>
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <CompanySwitcher />
      </SidebarHeader>
      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={isActive}
                        tooltip={item.title}
                        className="rounded-lg data-active:bg-primary/10 data-active:font-medium data-active:text-primary [&_svg]:data-active:text-primary"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.badge && (
                        <SidebarMenuBadge className="bg-primary/10 text-primary">
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-2">
        <PlanUsageCard />
        <SidebarSeparator className="mx-0 group-data-[collapsible=icon]:hidden" />
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
