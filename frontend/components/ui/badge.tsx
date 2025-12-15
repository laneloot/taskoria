import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "outline";
}

const badgeStyles: Record<Required<BadgeProps>["variant"], string> = {
  default: "bg-zinc-900 text-white",
  success: "bg-emerald-500/15 text-emerald-600",
  warning: "bg-amber-500/15 text-amber-600",
  outline: "border border-zinc-200 text-zinc-600",
};

export const Badge = ({ className, variant = "default", ...props }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
      badgeStyles[variant],
      className
    )}
    {...props}
  />
);
