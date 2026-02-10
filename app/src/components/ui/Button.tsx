import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white border-blue-500/50 hover:bg-blue-500 shadow-lg shadow-blue-500/10",
  secondary:
    "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-600",
  ghost:
    "bg-transparent text-slate-400 border-transparent hover:bg-slate-800/80 hover:text-slate-200",
  danger:
    "bg-red-600/10 text-red-400 border-red-500/30 hover:bg-red-600/20 hover:text-red-300",
  success:
    "bg-emerald-600/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/20 hover:text-emerald-300",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-sm gap-2",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function Button({
  variant = "secondary",
  size = "md",
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-200",
        variantStyles[variant],
        sizeStyles[size],
        props.disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
