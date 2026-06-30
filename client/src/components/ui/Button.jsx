import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-ink text-white hover:bg-ink/90",
  volt: "bg-volt text-volt-ink hover:brightness-95",
  violet: "bg-violet text-white hover:bg-violet/90",
  outline: "border border-line bg-surface text-ink hover:bg-bg",
  ghost: "text-ink-soft hover:bg-bg hover:text-ink",
  danger: "bg-danger-soft text-danger hover:bg-danger hover:text-white",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
  icon: "h-9 w-9",
};

export function Button({ className, variant = "primary", size = "md", children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
