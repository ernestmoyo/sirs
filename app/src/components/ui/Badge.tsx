import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "critical"
  | "high"
  | "moderate"
  | "low"
  | "success"
  | "info"
  | "warning"
  | "draft"
  | "review"
  | "published"
  | "deployed"
  | "collecting"
  | "completed";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  critical: "bg-red-500/15 text-red-400 border-red-500/30",
  high: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  moderate: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  low: "bg-green-500/15 text-green-400 border-green-500/30",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  info: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  draft: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  review: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  published: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  deployed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  collecting: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
  pulse?: boolean;
}

export default function Badge({
  variant = "default",
  children,
  className,
  dot = false,
  pulse = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "critical" || variant === "high"
              ? "bg-current"
              : "bg-current",
            pulse && "animate-pulse"
          )}
        />
      )}
      {children}
    </span>
  );
}
