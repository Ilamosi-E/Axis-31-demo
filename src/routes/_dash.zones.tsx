import { createFileRoute } from "@tanstack/react-router";
import { Card, Badge, Dot, PageHeader } from "@/components/ui-bits";
import { useBusiness } from "@/lib/twiniq-data";
import { FeatureGate } from "@/components/FeatureGate";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";

export const Route = createFileRoute("/_dash/zones")({
  head: () => ({ meta: [{ title: "Zone Performance - TwinIQ" }] }),
  component: () => <FeatureGate feature="zones" title="Zone Performance"><ZonesPage /></FeatureGate>,
});

const metrics = ["revenue", "traffic", "dwell", "conversion"] as const;
type M = typeof metrics[number];

function ZonesPage() {
  const { zones } = useBusiness().data;
  const [m, setM] = useState<M>("revenue");
  const [sel, setSel] = useState(zones[1]);
  const data = zones.map((z) => ({
    name: z.id,
    value: m === "revenue" ? z.revenue : m === "traffic" ? z.traffic : m === "dwell" ? z.dwell * 10 : Math.round(z.revenue / z.traffic * 100),
  }));
  const trend = Array.from({ length: 30 }, (_, i) => ({ d: i + 1, v: 40 + Math.round(Math.sin(i / 5) * 15 + Math.random() * 10) }));

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader title="Zone Performance Analytics" subtitle="Per-area revenue and traffic" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {zones.map((z) => (
          <button key={z.id} onClick={() => setSel(z)}
            className={`text-left card-elevated p-4 transition ${sel.id === z.id ? "border-primary glow-teal" : ""}`}>
            <div className="flex items-center gap-2"><Dot tone={z.status} /><span className="font-semibold">{z.name.split("-")[1]}</span></div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <Mini l="Rev (£)" v={`${z.revenue}%`} />
              <Mini l="Traffic" v={`${z.traffic}%`} />
              <Mini l="Dwell" v={`${z.dwell}m`} />
            </div>
            <div className="text-[11px] text-success mt-2">↑ trending</div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2" title="Zone comparison"
          action={
            <div className="inline-flex rounded-md border border-border p-0.5 text-xs">
              {metrics.map((k) => (
                <button key={k} onClick={() => setM(k)} className={`px-2.5 py-1 rounded ${m === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{k}</button>
              ))}
            </div>
          }>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid stroke="oklch(0.3 0.03 250)" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="oklch(0.7 0.02 240)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.02 240)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.03 250)", border: "1px solid oklch(0.3 0.03 250)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="oklch(0.74 0.14 180)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title={sel.name}>
          <div className="text-xs text-muted-foreground">{sel.category}</div>
          <div className="h-40 mt-3">
            <ResponsiveContainer>
              <LineChart data={trend}>
                <Line type="monotone" dataKey="v" stroke="oklch(0.74 0.14 180)" strokeWidth={2} dot={false} />
                <XAxis dataKey="d" hide /><YAxis hide />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-muted-foreground">30-day trend</div>

          <div className="mt-4 p-3 rounded-md bg-primary/10 border border-primary/30 text-xs leading-relaxed">
            <strong className="text-primary">AI note:</strong> Zone C has 23% higher dwell time than industry benchmark. Consider adding a self-checkout point or extending counter space.
          </div>
          <div className="mt-3 p-3 rounded-md bg-warning/10 border border-warning/30 text-xs leading-relaxed">
            <strong className="text-warning">Merchandising:</strong> Products at Zone B entry generate 3.4× more impulse purchases. Current layout underutilises this premium position.
          </div>
        </Card>
      </div>
    </div>
  );
}

function Mini({ l, v }: { l: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
      <div className="text-sm font-semibold">{v}</div>
    </div>
  );
}
