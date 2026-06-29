import { createFileRoute } from "@tanstack/react-router";
import { Card, Badge, PageHeader } from "@/components/ui-bits";
import { useBusiness } from "@/lib/twiniq-data";
import { FeatureGate } from "@/components/FeatureGate";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart } from "recharts";

export const Route = createFileRoute("/_dash/inventory")({
  head: () => ({ meta: [{ title: "Inventory Intelligence - TwinIQ" }] }),
  component: () => <FeatureGate feature="inventory" title="Inventory Intelligence"><InvPage /></FeatureGate>,
});

const tip = { background: "oklch(0.22 0.03 250)", border: "1px solid oklch(0.3 0.03 250)", borderRadius: 8, fontSize: 12 };

function statusBadge(s: string) {
  if (s === "urgent") return <Badge tone="alert">🔴 Urgent</Badge>;
  if (s === "soon") return <Badge tone="warn">⚠ Reorder Soon</Badge>;
  if (s === "overstock") return <Badge tone="default">📦 Overstock</Badge>;
  return <Badge tone="ok">✓ Healthy</Badge>;
}

function InvPage() {
  const { data } = useBusiness();
  const { inventory, inventoryTrend, invKpis } = data;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader title="Inventory & Supply Intelligence" subtitle="Demand forecasting · stock optimisation" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Stockout risk (week)</div><div className="text-2xl font-semibold mt-1">{invKpis.atRiskCount} SKUs</div><Badge tone="warn">at risk</Badge></Card>
        <Card><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Overstock alert</div><div className="text-2xl font-semibold mt-1">£{invKpis.overstockValue.toLocaleString()}</div><Badge tone="warn">tied up</Badge></Card>
        <Card><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Top SKUs (3 days)</div>
          <div className="mt-2 flex flex-wrap gap-1">{invKpis.topSkus.map((s) => <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary border border-border">{s}</span>)}</div>
        </Card>
        <Card><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Reorders triggered</div><div className="text-2xl font-semibold mt-1">{invKpis.reorders}</div><Badge tone="primary">this week</Badge></Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2" title={invKpis.tableTitle}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="text-left py-2">SKU</th><th className="text-left">Category</th><th className="text-left">Stock</th><th className="text-left">Days left</th><th className="text-left">Demand</th><th className="text-left">Reorder</th><th className="text-left">Status</th></tr>
              </thead>
              <tbody>
                {inventory.map((r) => (
                  <tr key={r.sku} className="border-t border-border">
                    <td className="py-2.5 font-mono text-xs">{r.sku}</td>
                    <td>{r.cat}</td>
                    <td>{r.stock}</td>
                    <td className={r.days <= 2 ? "text-destructive font-semibold" : r.days <= 5 ? "text-warning" : ""}>{r.days}</td>
                    <td>{r.demand}</td>
                    <td>{r.reorder ? "Yes" : "-"}</td>
                    <td>{statusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="AI Insight" className="border-primary/30">
          <p className="text-sm leading-relaxed">
            Based on forecasts for the week, demand for <strong className="text-primary">{invKpis.categoryPing}</strong> is shifting. {invKpis.insight}
          </p>
          <button className="mt-4 w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            Generate Reorder List
          </button>
        </Card>
      </div>

      <Card className="mt-4" title={invKpis.trendTitle}>
        <div className="h-64">
          <ResponsiveContainer>
            <ComposedChart data={inventoryTrend}>
              <defs>
                <linearGradient id="invg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.74 0.14 180)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.74 0.14 180)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.3 0.03 250)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="oklch(0.7 0.02 240)" fontSize={11} />
              <YAxis stroke="oklch(0.7 0.02 240)" fontSize={11} />
              <Tooltip contentStyle={tip} />
              <Area dataKey="stock" stroke="oklch(0.74 0.14 180)" fill="url(#invg)" strokeWidth={2} />
              <Line dataKey="demand" stroke="oklch(0.78 0.16 70)" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
