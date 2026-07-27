import { CheckSquare } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function TasksPage() {
  return (
    <ComingSoon
      icon={<CheckSquare />}
      title="Tasks"
      description="A drag-and-drop Kanban board, calendar view, and list view for every task in your workspace are coming next."
    />
  );
}
