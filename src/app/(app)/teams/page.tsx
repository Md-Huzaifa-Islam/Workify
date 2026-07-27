import { UsersRound } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function TeamsPage() {
  return (
    <ComingSoon
      icon={<UsersRound />}
      title="Teams"
      description="Organize employees into teams, assign leads, and see team workload at a glance. Coming in the next update."
    />
  );
}
