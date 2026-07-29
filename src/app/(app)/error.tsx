"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" strokeWidth={1.75} />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">This page hit a snag</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Something went wrong loading this section. You can retry, or jump back to the dashboard.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-1.5" onClick={() => reset()}>
          <RotateCcw className="size-4" />
          Try again
        </Button>
        <Button render={<Link href="/dashboard" />}>Back to dashboard</Button>
      </div>
    </div>
  );
}
