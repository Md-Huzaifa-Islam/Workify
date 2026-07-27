import { Building2 } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function DepartmentsPage() {
  return (
    <ComingSoon
      icon={<Building2 />}
      title="Departments"
      description="Manage department structure, budgets, and headcount across your organization. Coming in the next update."
    />
  );
}
