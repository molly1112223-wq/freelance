import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--accent-3)] px-2.5 py-1 text-xs font-normal text-[var(--ink-2)]",
        className
      )}
      {...props}
    />
  );
}
