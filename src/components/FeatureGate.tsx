import { Link } from "@tanstack/react-router";
import { Lock, Sparkles } from "lucide-react";
import { useBusiness, hasFeature, type FeatureKey } from "@/lib/twiniq-data";

export function FeatureGate({
  feature,
  title,
  children,
}: {
  feature: FeatureKey;
  title: string;
  children: React.ReactNode;
}) {
  const { business } = useBusiness();
  if (hasFeature(business.plan, feature)) return <>{children}</>;

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      <div className="card-elevated p-10 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/15 grid place-items-center text-primary mb-4">
          <Lock className="h-5 w-5" />
        </div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {business.name} · {business.plan} plan
        </div>
        <h2 className="text-2xl font-semibold tracking-tight mt-2">
          {title} is a Growth feature
        </h2>
        <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
          The Foundation plan (£45/month) covers the core dashboard, basic KPIs and
          footfall tracking. Upgrade to <strong className="text-foreground">Growth (£85/month)</strong>{" "}
          to unlock the full digital twin, AI recommendations, staff optimisation, inventory
          intelligence and zone performance.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            to="/settings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 glow-teal"
          >
            <Sparkles className="h-4 w-4" /> Upgrade to Growth
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 rounded-md border border-border text-sm hover:bg-accent"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
