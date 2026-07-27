import { CalendarCheck } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function AttendancePage() {
  return (
    <ComingSoon
      icon={<CalendarCheck />}
      title="Attendance"
      description="Daily check-in/out logs, timesheets, and attendance trends for every employee. Coming in the next update."
    />
  );
}
