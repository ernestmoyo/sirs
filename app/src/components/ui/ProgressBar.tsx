import { cn } from "@/lib/utils";

type ProgressVariant = "default" | "success" | "warning" | "danger" | "info";

const trackColors: Record<ProgressVariant, string> = {
  default: "bg-slate-700/50",
  success: "bg-emerald-900/30",
  warning: "bg-amber-900/30",
  danger: "bg-red-900/30",
  info: "bg-blue-900/30",
};

const barColors: Record<ProgressVariant, string> = {
  default: "bg-slate-400",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
};

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const getAutoVariant = (): ProgressVariant => {
    if (variant !== "default") return variant;
    if (percentage >= 90) return "success";
    if (percentage >= 60) return "info";
    if (percentage >= 30) return "warning";
    return "danger";
  };

  const autoVariant = getAutoVariant();
  const sizeMap = { sm: "h-1.5", md: "h-2.5", lg: "h-3.5" };

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-slate-400">{label}</span>
          <span className="font-medium text-slate-300">{percentage}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full",
          trackColors[autoVariant],
          sizeMap[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            barColors[autoVariant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
