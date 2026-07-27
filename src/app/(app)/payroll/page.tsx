import { Wallet } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function PayrollPage() {
  return (
    <ComingSoon
      icon={<Wallet />}
      title="Payroll"
      description="Run payroll, review pay stubs, and track deductions across every employee. Coming in the next update."
    />
  );
}
