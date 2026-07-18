import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface StatusPanelProps {
  icon: LucideIcon;
  title: string;
  message: string;
  tone?: "muted" | "error";
  children?: ReactNode;
}

/** Centered message block for empty and error states. */
export function StatusPanel({
  icon: Icon,
  title,
  message,
  tone = "muted",
  children,
}: StatusPanelProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
      <div
        className={
          tone === "error"
            ? "rounded-full bg-destructive/10 p-3 text-destructive"
            : "rounded-full bg-muted p-3 text-muted-foreground"
        }
      >
        <Icon className="size-6" aria-hidden />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
