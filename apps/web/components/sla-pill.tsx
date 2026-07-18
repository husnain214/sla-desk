const PRIORITY_COLOR: Record<string, string> = {
  urgent: "bg-urgent/15 text-urgent border-urgent/30",
  high: "bg-high/15 text-high border-high/30",
  medium: "bg-medium/15 text-medium border-medium/30",
  low: "bg-low/15 text-low border-low/30",
} as const;

interface SlaPillTypes {
  priority: "urgent" | "high" | "medium" | "low";
  timeRemaining: String;
}

export function SlaPill({ priority, timeRemaining }: SlaPillTypes) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs ${PRIORITY_COLOR[priority]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {timeRemaining}
    </span>
  );
}
