import { Workflow } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function AutomationPage() {
  return (
    <ComingSoon
      icon={<Workflow />}
      title="Automation"
      description="A visual, node-based workflow builder for approval chains and automations. Coming in the next update."
    />
  );
}
