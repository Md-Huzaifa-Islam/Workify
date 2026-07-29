import { Zap } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <div className="flex size-10 animate-pulse items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Zap className="size-5" strokeWidth={2.5} />
      </div>
      <p className="text-sm text-muted-foreground">Loading Workify...</p>
    </div>
  );
}
