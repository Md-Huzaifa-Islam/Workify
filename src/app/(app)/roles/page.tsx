import { ShieldCheck } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function RolesPage() {
  return (
    <ComingSoon
      icon={<ShieldCheck />}
      title="Roles & Permissions"
      description="Define custom roles and fine-grained permissions across your workspace. Coming in the next update."
    />
  );
}
