import { createFileRoute } from "@tanstack/react-router";
import { Card, Badge, Dot, PageHeader } from "@/components/ui-bits";
import { useBusiness } from "@/lib/twiniq-data";
import { useState } from "react";

export const Route = createFileRoute("/_dash/alerts")({
  head: () => ({ meta: [{ title: "Alerts & Anomalies - TwinIQ" }] }),
  component: AlertsPage,
});

const tabs = ["All", "Critical", "Warning", "Info", "Resolved"] as const;

function AlertsPage() {
  const { alerts } = useBusiness().data;
  const [tab, setTab] = useState<typeof tabs[number]>("All");
  const filtered = alerts.filter((a) => {
    if (tab === "All") return true;
    if (tab === "Resolved") return a.status === "Resolved";
    if (tab === "Critical") return a.sev === "alert";
    if (tab === "Warning") return a.sev === "warn";
    return a.sev === "ok";
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader title="Live Alerts & Anomaly Detection" subtitle="Real-time anomaly flag log" />

      <div className="inline-flex rounded-md border border-border p-0.5 text-xs mb-4">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((a, i) => (
          <Card key={i} className={a.sev === "alert" ? "border-destructive/30" : a.sev === "warn" ? "border-warning/30" : ""}>
            <div className="flex flex-wrap items-start gap-3">
              <div className={`h-9 w-9 rounded-md grid place-items-center text-sm font-semibold ${a.sev === "alert" ? "bg-destructive/15 text-destructive glow-red" : a.sev === "warn" ? "bg-warning/15 text-warning glow-amber" : "bg-success/15 text-success"}`}>
                {a.sev === "alert" ? "!" : a.sev === "warn" ? "⚠" : "✓"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{a.time}</span>
                  <Badge tone={a.status === "Resolved" ? "ok" : a.status === "Investigating" ? "warn" : "alert"}>{a.status}</Badge>
                </div>
                <h3 className="font-semibold tracking-tight mt-1">{a.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{a.body}</p>
                <div className="mt-2 text-xs"><span className="text-muted-foreground">Suggested action:</span> <span className="text-primary">{a.action}</span></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
