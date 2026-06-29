import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
    </div>
  );
}

export function Card({ children, className = "", title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return (
    <div className={`card-elevated p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center mb-4">
          {title && <h3 className="text-sm font-semibold tracking-tight">{title}</h3>}
          {action && <div className="ml-auto">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "ok" | "warn" | "alert" | "primary" }) {
  const map = {
    default: "bg-secondary text-secondary-foreground",
    ok: "bg-success/15 text-success border border-success/30",
    warn: "bg-warning/15 text-warning border border-warning/30",
    alert: "bg-destructive/15 text-destructive border border-destructive/30",
    primary: "bg-primary/15 text-primary border border-primary/30",
  } as const;
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${map[tone]}`}>{children}</span>;
}

export function Dot({ tone }: { tone: "good" | "warn" | "alert" }) {
  const c = tone === "good" ? "bg-success" : tone === "warn" ? "bg-warning" : "bg-destructive";
  return <span className={`inline-block h-2 w-2 rounded-full ${c}`} />;
}
