"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Plus, Workflow, Zap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  runs: number;
  enabled: boolean;
}

const INITIAL_RULES: AutomationRule[] = [
  {
    id: "rule-1",
    name: "Auto-approve small expenses",
    description: "Expenses under $50 in the Office Supplies category skip manual review.",
    trigger: "Expense submitted",
    action: "Auto-approve",
    runs: 128,
    enabled: true,
  },
  {
    id: "rule-2",
    name: "Escalate stale approvals",
    description: "Notify department heads when a request is pending for more than 5 days.",
    trigger: "Approval pending 5+ days",
    action: "Notify manager",
    runs: 42,
    enabled: true,
  },
  {
    id: "rule-3",
    name: "Onboarding checklist",
    description: "New hires automatically get IT, HR, and workspace access tasks.",
    trigger: "Employee created",
    action: "Create tasks",
    runs: 19,
    enabled: true,
  },
  {
    id: "rule-4",
    name: "Leave balance reminder",
    description: "Remind employees with 10+ unused leave days at the end of each quarter.",
    trigger: "Quarterly schedule",
    action: "Send email",
    runs: 6,
    enabled: false,
  },
  {
    id: "rule-5",
    name: "Overdue invoice follow-up",
    description: "Automatically send a payment reminder 3 days after an invoice becomes overdue.",
    trigger: "Invoice overdue",
    action: "Send reminder",
    runs: 11,
    enabled: false,
  },
];

export default function AutomationPage() {
  const [rules, setRules] = useState(INITIAL_RULES);

  function toggle(id: string) {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const enabled = !r.enabled;
        toast.success(`${r.name} ${enabled ? "enabled" : "disabled"}`);
        return { ...r, enabled };
      }),
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Automation"
        description="Rule-based workflows that keep approvals, onboarding, and reminders running on autopilot."
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" />
            New automation
          </Button>
        }
      />

      <div className="flex flex-col gap-3">
        {rules.map((rule) => (
          <Card key={rule.id} className={cn("transition-opacity", !rule.enabled && "opacity-60")}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    rule.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Workflow className="size-4.5" />
                </div>
                <div>
                  <p className="font-medium">{rule.name}</p>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <Badge variant="outline" className="font-normal">
                      {rule.trigger}
                    </Badge>
                    <ArrowRight className="size-3" />
                    <Badge variant="outline" className="font-normal">
                      {rule.action}
                    </Badge>
                    <span className="ml-2 flex items-center gap-1">
                      <Zap className="size-3" />
                      {rule.runs} runs this month
                    </span>
                  </div>
                </div>
              </div>
              <Switch checked={rule.enabled} onCheckedChange={() => toggle(rule.id)} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
