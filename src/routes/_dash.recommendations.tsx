import { createFileRoute } from "@tanstack/react-router";
import { Card, Badge, PageHeader } from "@/components/ui-bits";
import { useBusiness } from "@/lib/twiniq-data";
import { FeatureGate } from "@/components/FeatureGate";
import { useMemo, useState } from "react";
import { Check, X, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_dash/recommendations")({
  head: () => ({ meta: [{ title: "AI Recommendations - TwinIQ" }] }),
  component: () => <FeatureGate feature="recommendations" title="AI Recommendations"><RecsPage /></FeatureGate>,
});

const cats = ["All", "Staffing", "Layout", "Inventory", "Scheduling", "Revenue", "Urgent"] as const;

function RecsPage() {
  const { recommendations, recsStats } = useBusiness().data;
  const [cat, setCat] = useState<typeof cats[number]>("All");
  const list = useMemo(() => recommendations.filter((r) => cat === "All" ? true : cat === "Urgent" ? r.sev === "high" : r.cat === cat), [cat, recommendations]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader title="Actionable Insight Recommendations" subtitle="Prescriptive AI · powered by TwinIQ" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Recommendations this week</div><div className="text-2xl font-semibold mt-1">{recsStats.week}</div></Card>
        <Card><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Applied</div><div className="text-2xl font-semibold mt-1">{recsStats.applied}</div></Card>
        <Card className="border-primary/30"><div className="text-[11px] uppercase tracking-wider text-primary">Revenue impact tracked</div><div className="text-2xl font-semibold mt-1">+£{recsStats.revenue.toLocaleString()}</div></Card>
        <Card><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Avg confidence</div><div className="text-2xl font-semibold mt-1">{recsStats.confidence}%</div></Card>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`text-xs px-3 py-1.5 rounded-full border ${cat === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>{c}</button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((r, i) => (
          <Card key={i} className={`animate-in slide-in-from-right-2 ${r.sev === "high" ? "border-destructive/30" : r.sev === "med" ? "border-warning/30" : ""}`}>
            <div className="flex flex-wrap items-start gap-3">
              <Badge tone={r.sev === "high" ? "alert" : r.sev === "med" ? "warn" : "ok"}>
                {r.sev === "high" ? "🔴 High Impact" : r.sev === "med" ? "🟡 Medium" : "🟢 Informational"}
              </Badge>
              <Badge tone="primary">{r.cat}</Badge>
              <span className="text-xs text-muted-foreground ml-auto">Generated {r.ago}</span>
            </div>
            <h3 className="text-lg font-semibold tracking-tight mt-3">{r.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.body}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge tone="primary">{r.impact}</Badge>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Confidence</span>
                <div className="h-1.5 w-24 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${r.confidence}%` }} />
                </div>
                <span className="font-semibold">{r.confidence}%</span>
              </div>
              <div className="ml-auto flex gap-1.5">
                <button onClick={() => toast.success("Recommendation marked as applied ✓")} className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5" />Mark Applied</button>
                <button onClick={() => toast("Dismissed")} className="text-xs px-3 py-1.5 rounded-md border border-border inline-flex items-center gap-1.5 hover:bg-accent"><X className="h-3.5 w-3.5" />Dismiss</button>
                <button className="text-xs px-3 py-1.5 rounded-md border border-border inline-flex items-center gap-1.5 hover:bg-accent"><HelpCircle className="h-3.5 w-3.5" />Explain</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
