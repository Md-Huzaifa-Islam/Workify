import { FolderKanban } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function ProjectsPage() {
  return (
    <ComingSoon
      icon={<FolderKanban />}
      title="Projects"
      description="Track project timelines, budgets, and progress across every team. Full project boards ship in the next update."
    />
  );
}
