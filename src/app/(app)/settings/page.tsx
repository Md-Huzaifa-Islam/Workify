import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function SettingsPage() {
  return (
    <ComingSoon
      icon={<Settings />}
      title="Company Settings"
      description="Profile, company branding, security, AI providers, and notification preferences. Coming in the next update."
    />
  );
}
