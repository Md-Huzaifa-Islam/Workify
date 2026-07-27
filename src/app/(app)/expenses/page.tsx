import { ReceiptText } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function ExpensesPage() {
  return (
    <ComingSoon
      icon={<ReceiptText />}
      title="Expenses"
      description="Submit, review, and approve expense requests with receipt attachments. Coming in the next update."
    />
  );
}
