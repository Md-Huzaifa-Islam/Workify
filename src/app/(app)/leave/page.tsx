import { ClipboardList } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function LeavePage() {
  return (
    <ComingSoon
      icon={<ClipboardList />}
      title="Leave"
      description="Submit and review leave requests, track balances, and manage team calendars. Coming in the next update."
    />
  );
}
