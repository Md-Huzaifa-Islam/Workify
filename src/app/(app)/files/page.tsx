import { Folders } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function FilesPage() {
  return (
    <ComingSoon
      icon={<Folders />}
      title="Files"
      description="A grid and list file manager with folders, previews, and uploads. Coming in the next update."
    />
  );
}
