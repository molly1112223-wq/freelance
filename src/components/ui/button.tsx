import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary:
    "border border-[var(--button-bg)] bg-[var(--button-bg)] text-[var(--button-text)] shadow-none hover:border-[var(--button-bg-hover)] hover:bg-[var(--button-bg-hover)]",
  secondary:
    "border border-[var(--border)] bg-transparent text-[var(--ink)] shadow-none hover:border-[var(--muted)] hover:bg-[var(--accent-3)]",
  ghost: "border border-transparent text-[var(--ink-2)] hover:border-[var(--border)] hover:bg-[var(--accent-3)] hover:text-[var(--ink)]"
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded px-5 text-sm font-normal transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: React.ComponentProps<typeof Link> & { variant?: ButtonProps["variant"] }) {
  return (
    <Link
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded px-5 text-sm font-normal transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98]",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
