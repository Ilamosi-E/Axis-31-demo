import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, Badge, Dot, PageHeader } from "@/components/ui-bits";
import { useBusiness } from "@/lib/twiniq-data";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp, Lightbulb, Activity, AlertTriangle, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_dash/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard - TwinIQ" }] }),
  component: Dashboard,
});

function useCountUp(target: number, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function Dashboard() {
  const { business, data } = useBusiness();
  const { kpis, weeklyPerformance, liveFeed, zones, topRec } = data;
  const f = useCountUp(kpis.footfall.value);
  const r = useCountUp(kpis.revenue.value);
  const e = useCountUp(kpis.efficiency.value);
  const [view, setView] = useState<"footfall" | "revenue" | "staffCost">("footfall");

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Operations Overview"
        subtitle={`${business.name} · ${business.location} · live data stream`}
        right={<Badge tone="ok"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live</Badge>}
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<TrendingUp className="h-4 w-4" />} label={kpis.footfall.title} value={f.toLocaleString()} sub={kpis.footfall.sub} tone="primary" />
        <KpiCard icon={<Activity className="h-4 w-4" />} label={kpis.revenue.title} value={`£${r.toLocaleString()}`} sub={kpis.revenue.status} tone="ok" />
        <KpiGauge label="Staff Efficiency" value={e} delta={`↑ ${kpis.efficiency.delta}pts this week`} />
        <KpiCard icon={<AlertTriangle className="h-4 w-4" />} label="Active Alerts" value={String(kpis.alerts.value)} sub={kpis.alerts.sub} tone="warn" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="Live Operational Feed" action={<Badge tone="ok">Auto-refresh</Badge>}>
            <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {liveFeed.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm p-2 rounded-md hover:bg-accent/50">
                  <Dot tone={f.level === "ok" ? "good" : f.level === "warn" ? "warn" : "alert"} />
                  <div className="flex-1">
                    <span className="text-muted-foreground text-xs mr-2">{f.time}</span>
                    {f.text}
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card
            title="Weekly Performance"
            action={
              <div className="inline-flex rounded-md border border-border p-0.5 text-xs">
                {(["footfall", "revenue", "staffCost"] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)} className={`px-2.5 py-1 rounded ${view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    {v === "staffCost" ? "Efficiency" : v[0].toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            }
          >
            <div className="h-64">
              <ResponsiveContainer>
                <AreaChart data={weeklyPerformance}>
                  <defs>
                    <linearGradient id="ar" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.74 0.14 180)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.74 0.14 180)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.3 0.03 250)" strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="oklch(0.7 0.02 240)" fontSize={11} />
                  <YAxis stroke="oklch(0.7 0.02 240)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "oklch(0.22 0.03 250)", border: "1px solid oklch(0.3 0.03 250)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey={view} stroke="oklch(0.74 0.14 180)" strokeWidth={2} fill="url(#ar)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right col */}
        <div className="space-y-4">
          <Card className="border-primary/40 glow-teal">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-md bg-primary/15 grid place-items-center text-primary">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-primary">Top recommendation</div>
                <h3 className="font-semibold tracking-tight mt-1">{topRec.title}</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              {topRec.body}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <Badge tone="primary">{topRec.impact}</Badge>
              <button className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">Apply <ArrowRight className="h-3 w-3" /></button>
            </div>
          </Card>

          <Card title="Zone Performance">
            <div className="grid grid-cols-2 gap-2">
              {zones.map((z) => (
                <Link key={z.id} to="/zones" className="p-3 rounded-md border border-border hover:bg-accent/40 transition">
                  <div className="flex items-center gap-2 text-xs">
                    <Dot tone={z.status} /> <span className="font-medium">{z.id}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1 truncate">{z.category}</div>
                  <div className="text-sm font-semibold mt-1">{z.revenue}%</div>
                  <div className="text-[10px] text-muted-foreground">revenue</div>
                </Link>
              ))}
            </div>
          </Card>

          <Card title="Data Source Status">
            <div className="space-y-2 text-xs">
              {[
                ["Square POS", "Connected"],
                ["Cisco Meraki WiFi", "Live"],
                ["CCTV Metadata", "Processing"],
              ].map(([n, s]) => (
                <div key={n} className="flex items-center justify-between p-2 rounded bg-secondary/40">
                  <span>{n}</span>
                  <Badge tone="ok">✓ {s}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, sub, tone }: { icon: React.ReactNode; label: string; value: string; sub: string; tone: "primary" | "ok" | "warn" }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="text-3xl font-semibold tracking-tight mt-2">{value}</div>
      <div className="mt-2"><Badge tone={tone}>{sub}</Badge></div>
    </Card>
  );
}

function KpiGauge({ label, value, delta }: { label: string; value: number; delta: string }) {
  const circ = 2 * Math.PI * 28;
  const off = circ - (value / 100) * circ;
  return (
    <Card>
      <div className="flex items-center gap-4">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="28" fill="none" stroke="oklch(0.3 0.03 250)" strokeWidth="6" />
          <circle cx="36" cy="36" r="28" fill="none" stroke="oklch(0.74 0.14 180)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={off} transform="rotate(-90 36 36)" />
          <text x="36" y="40" textAnchor="middle" fill="oklch(0.95 0.01 240)" fontSize="16" fontWeight="600">{value}%</text>
        </svg>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2"><Badge tone="primary">{delta}</Badge></div>
        </div>
      </div>
    </Card>
  );
}
