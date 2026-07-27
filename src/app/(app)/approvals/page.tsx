import { Banknote } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function ApprovalsPage() {
  return (
    <ComingSoon
      icon={<Banknote />}
      title="Approvals"
      description="A unified inbox for expense, leave, and payroll approvals awaiting your decision. Coming in the next update."
    />
  );
}
