import { CreditCard } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function BillingPage() {
  return (
    <ComingSoon
      icon={<CreditCard />}
      title="Billing"
      description="Manage your subscription, view invoices, and update payment methods. Coming in the next update."
    />
  );
}
