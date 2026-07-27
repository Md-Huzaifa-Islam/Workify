import { UsersRound } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function EmployeesPage() {
  return (
    <ComingSoon
      icon={<UsersRound />}
      title="Employees"
      description="A searchable, sortable directory of everyone in your company with detailed profiles. Coming in the next update."
    />
  );
}
