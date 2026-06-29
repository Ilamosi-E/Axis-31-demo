import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Zap, Brain, TrendingUp, Plug, Cpu, LineChart } from "lucide-react";
import { TwinIQLogo } from "@/components/TwinIQLogo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TwinIQ - Your operation. Understood." },
      { name: "description", content: "TwinIQ creates a living digital replica of your operation using POS, WiFi, and CCTV metadata. No sensors. No engineers. Live in 48 hours." },
      { property: "og:title", content: "TwinIQ - Your operation. Understood." },
      { property: "og:description", content: "AI-powered operational intelligence for UK SMEs. Live in 48 hours." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur bg-background/70 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <div className="flex items-center gap-2.5">
            <TwinIQLogo className="h-8 w-8" />
            <div className="leading-tight">
              <div className="font-semibold tracking-tight">TwinIQ</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">by Axis31</div>
            </div>
          </div>
          <nav className="hidden md:flex gap-7 ml-12 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
          </nav>
          <div className="ml-auto flex gap-2">
            <Link to="/signin" className="hidden sm:inline-flex items-center text-sm px-3 py-1.5 rounded-md border border-border hover:bg-accent">Sign in</Link>
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 font-medium">
              Start Free Demo <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <ParticleBg />
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs text-primary mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Operational intelligence · Live in 48 hours
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight max-w-4xl mx-auto leading-[1.05]">
            Your Business <span className="bg-gradient-to-r from-primary via-primary to-chart-3 bg-clip-text text-transparent">Operational Intelligence</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-Driven Digital Twin Platform
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 glow-teal">
              Start Free Demo <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how" className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border hover:bg-accent">
              See How It Works
            </a>
          </div>

          {/* Mock dashboard preview */}
          <div className="mt-16 max-w-5xl mx-auto rounded-2xl border border-border bg-card/60 backdrop-blur p-3 shadow-2xl glow-teal">
            <DashboardPreview />
          </div>
        </div>

        {/* Trust bar */}
        <div className="border-y border-border/60 bg-card/30">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              ["48-hour", "deployment"],
              ["No new", "hardware"],
              ["10–15%", "efficiency uplift"],
              ["From £45", "/month"],
            ].map(([a, b]) => (
              <div key={a}>
                <div className="text-xl font-semibold text-primary">{a}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Why TwinIQ</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Built for SMEs that need practical results.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: Cpu, title: "Hardware-Free Digital Twin", body: "We model your space using POS, WiFi, and CCTV metadata. No installation required." },
            { icon: Brain, title: "Vertical AI Models", body: "Pre-trained on your industry. Built for retail, hospitality, logistics, and manufacturing." },
            { icon: TrendingUp, title: "Outcome-Based Pricing", body: "We only win when you win. 50% of implementation fees paid only after agreed ROI targets." },
          ].map((f) => (
            <div key={f.title} className="card-elevated p-6">
              <div className="h-10 w-10 rounded-md bg-primary/15 grid place-items-center text-primary mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold tracking-tight">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="bg-card/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-[0.2em] text-primary mb-3">How it works</div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">From signed-up to insight in 48 hours</h2>
          </div>
          <ol className="grid md:grid-cols-3 gap-6 mt-12 relative">
            {[
              { n: 1, icon: Plug, t: "Connect your data", b: "POS, WiFi, CCTV - under 2 hours." },
              { n: 2, icon: Zap, t: "Build your digital twin", b: "Automated, AI-powered, no IT team needed." },
              { n: 3, icon: LineChart, t: "Get live insights", b: "Actionable. Specific. Yours." },
            ].map(({ n, icon: Icon, t, b }) => (
              <li key={n} className="card-elevated p-6 relative">
                <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Step {n}</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-primary/15 grid place-items-center text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold tracking-tight">{t}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-3">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Pricing</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Transparent. Outcome-aligned.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            { name: "Foundation", price: "£45", per: "/month", feats: ["Core dashboard", "Basic KPIs", "Footfall tracking", "1 site"] },
            { name: "Growth", price: "£85", per: "/month", featured: true, feats: ["Full digital twin", "AI recommendations", "Staff optimisation", "Up to 3 sites"] },
            { name: "Enterprise+", price: "Custom", per: "", feats: ["Multi-site & franchise mode", "White-labelling", "Dedicated CSM", "Outcome-based pricing"] },
          ].map((t) => (
            <div key={t.name} className={`card-elevated p-6 ${t.featured ? "border-primary glow-teal" : ""}`}>
              {t.featured && <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">Most popular</div>}
              <h3 className="font-semibold tracking-tight">{t.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-semibold">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.per}</span>
              </div>
              <ul className="mt-5 space-y-2.5 text-sm">
                {t.feats.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/dashboard" className={`mt-6 block text-center px-4 py-2 rounded-md text-sm font-medium ${t.featured ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent"}`}>
                {t.name === "Enterprise+" ? "Talk to sales" : "Start with " + t.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-chart-3/15 border border-primary/30 p-10 md:p-14 text-center glow-teal">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Ready to see your business differently?</h2>
          <p className="mt-3 text-muted-foreground">Launch the live demo. No sign-up. No card.</p>
          <Link to="/dashboard" className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90">
            Launch Demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <TwinIQLogo className="h-6 w-6" />
          <span>© {new Date().getFullYear()} Axis31 Ltd · twiniq.io · London, UK</span>
          <span className="ml-auto">Your operation. Understood.</span>
        </div>
      </footer>
    </div>
  );
}

function ParticleBg() {
  const dots = Array.from({ length: 28 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((_, i) => {
        const top = (i * 37) % 100;
        const left = (i * 53) % 100;
        const delay = (i % 7) * 0.4;
        return (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary/40"
            style={{ top: `${top}%`, left: `${left}%`, animation: `pulse-zone ${3 + (i % 4)}s ease-in-out ${delay}s infinite` }}
          />
        );
      })}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="rounded-xl bg-background/80 p-4 text-left">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        </div>
        <div className="text-xs text-muted-foreground ml-2">app.twiniq.io · Fielding & Co - Reading</div>
      </div>
      <div className="grid grid-cols-4 gap-3 mt-4">
        {[
          ["Footfall", "1,247", "+12%"],
          ["Revenue", "£8,340", "On track"],
          ["Efficiency", "74%", "+6pts"],
          ["Alerts", "3", "Anomalies"],
        ].map(([l, v, d]) => (
          <div key={l} className="rounded-md border border-border bg-card/60 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
            <div className="text-lg font-semibold mt-1">{v}</div>
            <div className="text-[10px] text-primary">{d}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="col-span-2 rounded-md border border-border bg-card/60 p-3 h-40 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Weekly performance</div>
          <svg viewBox="0 0 200 80" className="w-full h-full absolute inset-0 p-3 pt-6">
            <defs>
              <linearGradient id="prev-g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.74 0.14 180)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="oklch(0.74 0.14 180)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 60 L30 50 L60 40 L90 35 L120 25 L150 20 L180 12 L200 18 L200 80 L0 80 Z" fill="url(#prev-g)" />
            <path d="M0 60 L30 50 L60 40 L90 35 L120 25 L150 20 L180 12 L200 18" fill="none" stroke="oklch(0.74 0.14 180)" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="rounded-md border border-border bg-card/60 p-3 h-40">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Top recommendation</div>
          <div className="mt-2 text-xs font-medium leading-snug">Move 2 staff to floor 12–14:00</div>
          <div className="mt-1 text-[10px] text-muted-foreground">Footfall predicted +30%</div>
          <div className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded bg-primary/15 text-primary">+£340 today</div>
        </div>
      </div>
    </div>
  );
}
