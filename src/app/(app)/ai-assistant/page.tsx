import { Bot } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function AiAssistantPage() {
  return (
    <ComingSoon
      icon={<Bot />}
      title="AI Assistant"
      description="A streaming AI chat with suggested prompts, markdown, and workspace-aware answers. Coming in the next update."
    />
  );
}
