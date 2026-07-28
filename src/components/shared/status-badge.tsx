import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
} as const;

type Tone = keyof typeof TONE_CLASSES;

const STATUS_TONES: Record<string, Tone> = {
  active: "success",
  present: "success",
  approved: "success",
  paid: "success",
  completed: "success",
  done: "success",
  planning: "primary",
  todo: "neutral",
  draft: "neutral",
  inactive: "neutral",
  archived: "neutral",
  pending: "warning",
  processing: "warning",
  late: "warning",
  review: "warning",
  in_progress: "primary",
  on_hold: "warning",
  sent: "primary",
  overdue: "destructive",
  rejected: "destructive",
  failed: "destructive",
  cancelled: "destructive",
  absent: "destructive",
  leave: "neutral",
  holiday: "primary",
};

const PRIORITY_TONES: Record<string, Tone> = {
  low: "neutral",
  medium: "primary",
  high: "warning",
  urgent: "destructive",
};

function formatLabel(value: string) {
  return value
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = STATUS_TONES[status] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center rounded-full px-2 text-xs font-medium whitespace-nowrap",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {formatLabel(status)}
    </span>
  );
}

export function PriorityBadge({ priority, className }: { priority: string; className?: string }) {
  const tone = PRIORITY_TONES[priority] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center rounded-full px-2 text-xs font-medium whitespace-nowrap",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {formatLabel(priority)}
    </span>
  );
}
