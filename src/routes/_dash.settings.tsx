import { createFileRoute } from "@tanstack/react-router";
import { Card, Badge, PageHeader } from "@/components/ui-bits";
import { useBusiness } from "@/lib/twiniq-data";

export const Route = createFileRoute("/_dash/settings")({
  head: () => ({ meta: [{ title: "Settings - TwinIQ" }] }),
  component: SettingsPage,
});

const PLANS = [
  { name: "Foundation", price: "£45" },
  { name: "Growth", price: "£85" },
  { name: "Enterprise+", price: "Custom" },
] as const;

function SettingsPage() {
  const { business } = useBusiness();
  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <PageHeader title="Settings" subtitle="Account, billing, notifications" />

      <div className="space-y-4">
        <Card title="Account">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <Field label="Business name" value={business.name} />
            <Field label="Owner" value={business.account.owner} />
            <Field label="Email" value={business.account.email} />
            <Field label="Site" value={business.location} />
          </div>
        </Card>

        <Card title="Billing">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Current plan</div>
              <div className="text-xl font-semibold mt-1">{business.plan} - {business.planPrice}</div>
            </div>
            <Badge tone="primary">Active</Badge>
            <button className="ml-auto text-xs px-3 py-1.5 rounded-md border border-border hover:bg-accent">Change plan</button>
          </div>
          <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs">
            {PLANS.map((p) => {
              const current = p.name === business.plan;
              return (
                <div
                  key={p.name}
                  className={`p-3 rounded-md border ${current ? "border-primary bg-primary/10 text-foreground" : "border-border"}`}
                >
                  {p.name} {p.price} {current ? "✓" : ""}
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Notifications">
          {["Daily AI digest email", "Critical anomaly alerts", "Weekly performance summary", "Stockout warnings"].map((n) => (
            <label key={n} className="flex items-center justify-between py-2 text-sm border-b border-border last:border-0">
              <span>{n}</span>
              <input type="checkbox" defaultChecked className="accent-[oklch(0.74_0.14_180)] h-4 w-4" />
            </label>
          ))}
        </Card>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <input key={value} defaultValue={value} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm" />
    </div>
  );
}
