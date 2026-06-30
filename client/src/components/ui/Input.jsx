import { cn } from "@/lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-faint focus-visible:ring-2 focus-visible:ring-violet/40",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, children, ...props }) {
  return (
    <label className={cn("mb-1.5 block text-xs font-medium text-ink-soft", className)} {...props}>
      {children}
    </label>
  );
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink focus-visible:ring-2 focus-visible:ring-violet/40",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
