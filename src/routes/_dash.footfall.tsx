import { createFileRoute } from "@tanstack/react-router";
import { Card, Badge, PageHeader } from "@/components/ui-bits";
import { useBusiness } from "@/lib/twiniq-data";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis, ComposedChart } from "recharts";
import { useState } from "react";

export const Route = createFileRoute("/_dash/footfall")({
  head: () => ({ meta: [{ title: "Footfall & Demand - TwinIQ" }] }),
  component: FootfallPage,
});

const tooltipStyle = { background: "oklch(0.22 0.03 250)", border: "1px solid oklch(0.3 0.03 250)", borderRadius: 8, fontSize: 12, color: "#ffffff" };
const tooltipLabelStyle = { color: "#ffffff", fontWeight: 600 };
const tooltipItemStyle = { color: "#ffffff" };


function FootfallPage() {
  const { business, data } = useBusiness();
  const { forecast7d, hourlyHeatmap, revenueScatter, forecastInsight } = data;
  const [tab, setTab] = useState<"forecast" | "hour" | "rev">("forecast");

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader title={`${business.trafficVerb} & Demand Intelligence`} subtitle={`${business.location} ${business.vertical}`}
        right={<><Badge tone="ok">Accuracy 94.2%</Badge><Badge tone="primary">{business.model}</Badge></>} />

      <div className="grid lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3">
          <div className="inline-flex rounded-md border border-border p-0.5 text-xs mb-4">
            {([["forecast", "Forecast (7d)"], ["hour", "Demand by Hour"], ["rev", "Revenue Correlation"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`px-3 py-1.5 rounded ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{l}</button>
            ))}
          </div>

          {tab === "forecast" && (
            <>
              <div className="h-72">
                <ResponsiveContainer>
                  <ComposedChart data={forecast7d}>
                    <CartesianGrid stroke="oklch(0.3 0.03 250)" strokeDasharray="3 3" />
                    <XAxis dataKey="day" stroke="oklch(0.7 0.02 240)" fontSize={11} />
                    <YAxis stroke="oklch(0.7 0.02 240)" fontSize={11} />
                    <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
                    <Area dataKey="upper" stroke="none" fill="oklch(0.74 0.14 180)" fillOpacity={0.12} />
                    <Area dataKey="lower" stroke="none" fill="oklch(0.18 0.03 250)" fillOpacity={1} />
                    <Line type="monotone" dataKey="predicted" stroke="oklch(0.74 0.14 180)" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="actual" stroke="oklch(0.95 0.01 240)" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 rounded-md bg-warning/10 border border-warning/30 text-sm">
                <strong className="text-warning">Saturday peak window</strong> · 12–2pm - 340 visitors/hr forecast (+23% vs last Sat)
              </div>
              <div className="h-40 mt-4">
                <ResponsiveContainer>
                  <BarChart data={forecast7d}>
                    <CartesianGrid stroke="oklch(0.3 0.03 250)" strokeDasharray="3 3" />
                    <XAxis dataKey="day" stroke="oklch(0.7 0.02 240)" fontSize={11} />
                    <YAxis stroke="oklch(0.7 0.02 240)" fontSize={11} />
                    <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
                    <Bar dataKey="predicted" fill="oklch(0.74 0.14 180)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {tab === "hour" && (
            <div>
              <div className="text-xs text-muted-foreground mb-3">Footfall density · 8am – 8pm · last 4 weeks avg</div>
              <div className="grid grid-cols-[60px_repeat(12,_1fr)] gap-1 text-[10px]">
                <div />
                {Array.from({ length: 12 }).map((_, i) => <div key={i} className="text-center text-muted-foreground">{i + 8}h</div>)}
                {hourlyHeatmap.map((row) => (
                  <>
                    <div key={row.day} className="text-muted-foreground self-center">{row.day}</div>
                    {row.hours.map((h, i) => {
                      const intensity = Math.min(1, h.value / 250);
                      return (
                        <div key={i} className="aspect-square rounded" title={`${row.day} ${h.hour}h: ${h.value} visitors`}
                          style={{ background: `color-mix(in oklch, oklch(0.74 0.14 180) ${intensity * 100}%, oklch(0.22 0.03 250))` }} />
                      );
                    })}
                  </>
                ))}
              </div>
            </div>
          )}

          {tab === "rev" && (
            <div className="h-80">
              <ResponsiveContainer>
                <ScatterChart>
                  <CartesianGrid stroke="oklch(0.3 0.03 250)" strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="footfall" name="Footfall" stroke="oklch(0.7 0.02 240)" fontSize={11} />
                  <YAxis type="number" dataKey="revenue" name="Revenue" stroke="oklch(0.7 0.02 240)" fontSize={11} />
                  <ZAxis range={[60, 60]} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={revenueScatter} fill="oklch(0.74 0.14 180)" />
                </ScatterChart>
              </ResponsiveContainer>
              <div className="text-xs text-muted-foreground mt-2">R² = 0.84 · strong positive correlation. 2 outliers flagged.</div>
            </div>
          )}
        </Card>

        <Card title="AI Forecast Insight" className="border-primary/30">
          <p className="text-sm leading-relaxed">
            <strong>{forecastInsight.headline}</strong> Predicted: <strong className="text-primary">{forecastInsight.visitors.toLocaleString()} {business.unitLabel}</strong> (+{forecastInsight.deltaPct}% vs last week).
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {forecastInsight.recs.map((r) => (
              <li key={r} className="flex gap-2"><span className="text-primary">→</span> {r}</li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
            Model trained on 847 days of operational data · last retrained 11:00 today
          </div>
        </Card>
      </div>
    </div>
  );
}
