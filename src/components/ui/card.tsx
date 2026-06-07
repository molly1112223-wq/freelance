import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-none transition-[border-color,background-color,transform] duration-200 hover:border-[var(--muted)]",
        className
      )}
      {...props}
    />
  );
}
