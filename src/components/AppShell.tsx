import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Map, TrendingUp, Users, Grid3x3, Package,
  Sparkles, AlertTriangle, Plug, Settings, Bell, ChevronDown, Search, X, Lock, Home,
} from "lucide-react";
import { useState } from "react";
import { businesses, BusinessContext, datasets, hasFeature, type FeatureKey } from "@/lib/twiniq-data";
import { TwinIQLogo } from "./TwinIQLogo";

const nav: { to: string; label: string; icon: typeof LayoutDashboard; feature?: FeatureKey }[] = [
  { to: "/", label: "Homepage", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/twin", label: "Digital Twin", icon: Map, feature: "twin" },
  { to: "/footfall", label: "Footfall & Demand", icon: TrendingUp },
  { to: "/staff", label: "Staff Optimisation", icon: Users, feature: "staff" },
  { to: "/zones", label: "Zone Performance", icon: Grid3x3, feature: "zones" },
  { to: "/inventory", label: "Inventory Intelligence", icon: Package, feature: "inventory" },
  { to: "/recommendations", label: "AI Recommendations", icon: Sparkles, feature: "recommendations" },
  { to: "/alerts", label: "Alerts & Anomalies", icon: AlertTriangle },
  { to: "/integrations", label: "Integrations", icon: Plug },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [bizId, setBizId] = useState(businesses[0].id);
  const biz = businesses.find((b) => b.id === bizId)!;
  const data = datasets[bizId];
  const [bizOpen, setBizOpen] = useState(false);
  const [demoBanner, setDemoBanner] = useState(true);

  return (
    <BusinessContext.Provider value={{ business: biz, data, setBusinessId: setBizId }}>
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="px-5 py-5 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2.5">
            <TwinIQLogo className="h-8 w-8" />
            <div>
              <div className="text-sidebar-foreground font-semibold tracking-tight">TwinIQ</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">by Axis31</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, label, icon: Icon, feature }) => {
            const active = to === "/" ? pathname === "/" : (pathname === to || pathname.startsWith(to + "/"));
            const locked = feature ? !hasFeature(biz.plan, feature) : false;
            return (
              <Link
                key={to}
                to={to}
                title={locked ? `${label} - upgrade to Growth to unlock` : label}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary"
                    : locked
                    ? "text-sidebar-foreground/40 hover:bg-sidebar-accent/40"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{label}</span>
                {locked && <Lock className="h-3 w-3 text-muted-foreground" />}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-sidebar-border text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live data stream</div>
          <div className="mt-1">{biz.model}</div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card/40 backdrop-blur flex items-center px-4 md:px-6 gap-3">
          <div className="md:hidden">
            <TwinIQLogo className="h-7 w-7" />
          </div>

          <div className="relative">
            <button
              onClick={() => setBizOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary hover:bg-accent text-sm border border-border"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="font-medium">{biz.name}</span>
              <span className="text-muted-foreground hidden sm:inline">- {biz.location}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {bizOpen && (
              <div className="absolute z-20 mt-2 w-72 rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
                {businesses.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => { setBizId(b.id); setBizOpen(false); }}
                    className="w-full text-left px-3 py-2.5 hover:bg-accent text-sm flex flex-col"
                  >
                    <span className="font-medium">{b.name}</span>
                    <span className="text-xs text-muted-foreground">{b.vertical} · {b.location}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-2 ml-2 px-3 py-1.5 rounded-md bg-secondary/60 text-xs text-muted-foreground border border-border">
            <Search className="h-3.5 w-3.5" /> Search zones, SKUs, alerts…
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 rounded-md hover:bg-accent">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-warning glow-amber" />
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-chart-3 grid place-items-center text-xs font-semibold text-primary-foreground">{biz.account.owner.split(" ").map((p) => p[0]).join("").slice(0, 2)}</div>
          </div>
        </header>

        {demoBanner && (
          <div className="bg-primary/10 border-b border-primary/20 text-xs text-foreground/90 px-4 md:px-6 py-2 flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-semibold text-[10px] uppercase tracking-wider">Demo</span>
            <span>You're viewing a live demo with simulated data. Real deployments connect to your existing POS, WiFi, and CCTV systems.</span>
            <button onClick={() => setDemoBanner(false)} className="ml-auto p-1 hover:bg-accent rounded">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden border-t border-border bg-sidebar flex justify-around py-2">
          {nav.slice(0, 5).map(({ to, icon: Icon, label }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to} className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}>
                <Icon className="h-4 w-4" />
                <span>{label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      </div>
    </BusinessContext.Provider>
  );
}
