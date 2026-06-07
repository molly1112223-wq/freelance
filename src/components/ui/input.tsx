import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded border border-[var(--border)] bg-[var(--card)] px-3 text-sm outline-none transition focus:border-[var(--ink)]",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-32 w-full rounded border border-[var(--border)] bg-[var(--card)] px-3 py-3 text-sm outline-none transition focus:border-[var(--ink)]",
        props.className
      )}
    />
  );
}
