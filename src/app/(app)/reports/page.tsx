import { ScrollText } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function ReportsPage() {
  return (
    <ComingSoon
      icon={<ScrollText />}
      title="Reports"
      description="Downloadable, filterable dashboards across headcount, finance, and productivity. Coming in the next update."
    />
  );
}
