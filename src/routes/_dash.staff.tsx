import { createFileRoute } from "@tanstack/react-router";
import { Card, Badge, Dot, PageHeader } from "@/components/ui-bits";
import { useBusiness } from "@/lib/twiniq-data";
import { FeatureGate } from "@/components/FeatureGate";
import { Download } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_dash/staff")({
  head: () => ({ meta: [{ title: "Staff Optimisation - TwinIQ" }] }),
  component: () => <FeatureGate feature="staff" title="Staff Optimisation"><StaffPage /></FeatureGate>,
});

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function StaffPage() {
  const { business, data } = useBusiness();
  const { staffSchedule, staffRecs, staffCost, staffRoster } = data;
  const [sel, setSel] = useState<{ shift: string; day: string; cur: number; rec: number } | null>(null);

  // Total scheduled (recommended) headcount per operational day
  const dayTotals = days.map((d) => ({
    day: d,
    scheduled: staffSchedule.reduce((sum, row) => sum + row[d][0], 0),
    recommended: staffSchedule.reduce((sum, row) => sum + row[d][1], 0),
    overtime: staffRoster?.reduce((sum, p) => sum + (p.days[d]?.overtime ?? 0), 0) ?? 0,
  }));

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader title="Staff Optimisation" subtitle={`Scheduling intelligence · ${business.name}`} />

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <Card><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Current weekly labour cost</div><div className="text-2xl font-semibold mt-1">£{staffCost.current.toLocaleString()}</div></Card>
        <Card className="border-primary/30">
          <div className="text-[11px] uppercase tracking-wider text-primary">Optimised target</div>
          <div className="text-2xl font-semibold mt-1">£{staffCost.optimised.toLocaleString()}</div>
          <Badge tone="primary">Save ~£{staffCost.savings} this week</Badge>
        </Card>
        <Card><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Efficiency score</div><div className="text-2xl font-semibold mt-1">{staffCost.effFrom}% -&gt; <span className="text-primary">{staffCost.effTo}%</span></div></Card>
      </div>

      {staffRoster && (
        <Card className="mb-4" title="Daily Rota Totals">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="text-left py-2 pr-3">Operational day</th>{days.map((d) => <th key={d} className="text-center px-2">{d}</th>)}<th className="text-center px-2">Week</th></tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="py-2 pr-3 text-xs text-muted-foreground">Total staff scheduled</td>
                  {dayTotals.map((d) => <td key={d.day} className="text-center font-semibold">{d.scheduled}</td>)}
                  <td className="text-center font-semibold text-primary">{dayTotals.reduce((s, d) => s + d.scheduled, 0)}</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="py-2 pr-3 text-xs text-muted-foreground">AI recommended</td>
                  {dayTotals.map((d) => <td key={d.day} className="text-center">{d.recommended}</td>)}
                  <td className="text-center text-primary">{dayTotals.reduce((s, d) => s + d.recommended, 0)}</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="py-2 pr-3 text-xs text-muted-foreground">Overtime hours</td>
                  {dayTotals.map((d) => <td key={d.day} className={`text-center ${d.overtime > 1.5 ? "text-warning font-semibold" : ""}`}>{d.overtime.toFixed(1)}</td>)}
                  <td className="text-center text-warning font-semibold">{dayTotals.reduce((s, d) => s + d.overtime, 0).toFixed(1)}h</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2" title="Weekly Schedule Grid"
          action={<button className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground"><Download className="h-3.5 w-3.5" />Export Rota</button>}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="text-left py-2 pr-3">Shift</th>{days.map((d) => <th key={d} className="text-center px-1">{d}</th>)}</tr>
              </thead>
              <tbody>
                {staffSchedule.map((row) => (
                  <tr key={row.shift} className="border-t border-border">
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{row.shift}</td>
                    {days.map((d) => {
                      const [cur, rec] = row[d];
                      const mismatch = cur !== rec;
                      return (
                        <td key={d} className="px-1 py-1">
                          <button onClick={() => setSel({ shift: row.shift, day: d, cur, rec })}
                            className={`w-full rounded-md py-2 text-xs font-medium ${mismatch ? "bg-warning/15 border border-warning/40 text-warning" : "bg-secondary/40 text-foreground/70"}`}>
                            {cur} -&gt; {rec}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sel && (
            <div className="mt-4 p-3 rounded-md border border-primary/30 bg-primary/10 text-sm">
              <strong>{sel.day} · {sel.shift}</strong> - Currently {sel.cur} staff. AI recommends {sel.rec}.
              {sel.cur < sel.rec ? <> Predicted footfall above baseline. Revenue at risk: <span className="text-primary font-semibold">£280</span>.</> :
                sel.cur > sel.rec ? <> Historically low-traffic window. Reducing saves ~£60.</> : <> Optimal staffing - no action.</>}
            </div>
          )}
        </Card>

        <Card title="Recommendations">
          <ol className="space-y-3">
            {staffRecs.map((r, i) => (
              <li key={i} className="flex gap-3 p-3 rounded-md bg-secondary/40">
                <span className="text-xs font-semibold text-muted-foreground w-4">{i + 1}.</span>
                <div>
                  <div className="flex items-center gap-2"><Dot tone={r.sev === "ok" ? "good" : r.sev === "warn" ? "warn" : "alert"} /><span className="text-sm font-medium">{r.title}</span></div>
                  <p className="text-xs text-muted-foreground mt-1">{r.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {staffRoster && (
        <Card className="mt-4" title="Individual Staff Schedule (start - end · overtime)">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left py-2 pr-3">Staff</th>
                  <th className="text-left pr-3">Role</th>
                  {days.map((d) => <th key={d} className="text-center px-2 min-w-[96px]">{d}</th>)}
                  <th className="text-center px-2">OT (h)</th>
                </tr>
              </thead>
              <tbody>
                {staffRoster.map((p) => {
                  const ot = days.reduce((s, d) => s + (p.days[d]?.overtime ?? 0), 0);
                  return (
                    <tr key={p.name} className="border-t border-border">
                      <td className="py-2 pr-3 font-medium">{p.name}</td>
                      <td className="pr-3 text-xs text-muted-foreground">{p.role}</td>
                      {days.map((d) => {
                        const s = p.days[d];
                        if (!s) return <td key={d} className="text-center text-xs text-muted-foreground/60">Off</td>;
                        return (
                          <td key={d} className="text-center text-xs">
                            <div className="tabular-nums">{s.start}-{s.end}</div>
                            {s.overtime > 0 && <div className="text-[10px] text-warning">+{s.overtime}h OT</div>}
                          </td>
                        );
                      })}
                      <td className={`text-center font-semibold ${ot > 3 ? "text-warning" : ""}`}>{ot.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

