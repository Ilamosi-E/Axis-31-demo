import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  X,
  Plug,
  Cloud,
  BarChart3,
  Settings2,
  LineChart,
  Lightbulb,
  Link2,
  Sparkles,
  Bell,
  ChevronRight,
  Dna,
  TrendingUp,
  ShieldCheck,
  Zap,
} from "lucide-react";

const WAITLIST_URL = "https://forms.gle/UYt9yzBRSF5Rqtpp6";
const CALL_URL = "https://calendar.app.google/SzxdDnvqz9o7vQcT6";
const CALL_SEYI_URL = "https://calendar.app.google/MzQak3Kxxo8vep8S8";
const CALL_BUSAYO_URL = "https://calendar.app.google/fZ9XXabmM1mBHesCA";

const ext = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const text = size === "sm" ? "text-base" : "text-xl";
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size === "sm" ? 22 : 26}
        height={size === "sm" ? 22 : 26}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
      >
        <path d="M4 26 L14 6 L16 10 L8 26 Z" fill="#00C2A8" />
        <path d="M28 26 L18 6 L16 10 L24 26 Z" fill="#00C2A8" opacity="0.7" />
      </svg>
      <div className="leading-none">
        <div className={`${text} font-extrabold tracking-tight`}>
          <span className="text-white">Twin</span>
          <span className="text-teal">IQ</span>
        </div>
        <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
          by Axis31
        </div>
      </div>
    </div>
  );
}

function PillButton({
  href,
  variant = "solid",
  size = "md",
  children,
}: {
  href: string;
  variant?: "solid" | "outline";
  size?: "md" | "lg";
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 whitespace-nowrap";
  const sizes =
    size === "lg"
      ? "px-10 py-4 text-[17px]"
      : "px-5 py-2.5 text-[14px]";
  const styles =
    variant === "solid"
      ? "bg-teal text-navy hover:scale-[1.03] shadow-[0_0_24px_rgba(0,194,168,0.35)] hover:shadow-[0_0_36px_rgba(0,194,168,0.55)]"
      : "border-2 border-teal text-teal bg-transparent hover:bg-teal/10 hover:scale-[1.03]";
  return (
    <a href={href} {...ext} className={`${base} ${sizes} ${styles}`}>
      {children}
    </a>
  );
}

function DemoMenu({
  size = "md",
  variant = "outline",
}: {
  size?: "md" | "lg";
  variant?: "solid" | "outline";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const base =
    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 whitespace-nowrap";
  const sizes =
    size === "lg" ? "px-10 py-4 text-[17px]" : "px-5 py-2.5 text-[14px]";
  const styles =
    variant === "solid"
      ? "bg-teal text-navy hover:scale-[1.03] shadow-[0_0_24px_rgba(0,194,168,0.35)] hover:shadow-[0_0_36px_rgba(0,194,168,0.55)]"
      : "border-2 border-teal text-teal bg-transparent hover:bg-teal/10 hover:scale-[1.03]";
  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`${base} ${sizes} ${styles} cursor-pointer`}
      >
        Book a Demo
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-1/2 z-50 mt-2 w-64 -translate-x-1/2 overflow-hidden rounded-2xl border border-divider/70 bg-navy/95 shadow-2xl backdrop-blur-xl"
        >
          <a
            href={CALL_SEYI_URL}
            {...ext}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-5 py-3 text-left text-[14px] font-semibold text-ink transition hover:bg-teal/10 hover:text-teal"
          >
            Book a call with Seyi
          </a>
          <div className="h-px bg-divider/60" />
          <a
            href={CALL_BUSAYO_URL}
            {...ext}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-5 py-3 text-left text-[14px] font-semibold text-ink transition hover:bg-teal/10 hover:text-teal"
          >
            Book a call with Busayo
          </a>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center">
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal underline underline-offset-[6px] decoration-teal/60">
        {children}
      </span>
    </div>
  );
}

function useCountUp(target: number, duration = 1400) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return { ref, val };
}

function Stat({
  value,
  suffix = "",
  label,
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
}) {
  const { ref, val } = useCountUp(value);
  return (
    <div className="flex flex-col items-center text-center">
      <span
        ref={ref}
        className="text-[28px] font-extrabold text-teal tabular-nums"
      >
        {val.toFixed(decimals)}
        {suffix}
      </span>
      <span className="mt-1 text-[13px] text-ink-muted">{label}</span>
    </div>
  );
}

function AnnouncementBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="animate-banner sticky top-0 z-50 w-full bg-teal text-navy">
      <div className="relative mx-auto flex max-w-7xl items-center justify-center px-4 py-2.5 text-center text-[14px] font-semibold">
        <span className="pr-8">
          <span className="font-extrabold">Join the TwinIQ waitlist for free</span>, Early
          members get <span className="font-extrabold">2 months free access</span> when we launch.
        </span>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-navy/80 transition hover:bg-navy/10 hover:text-navy"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

function Navbar({ bannerVisible }: { bannerVisible: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav
      className={`sticky z-40 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-divider/60 bg-navy/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
      style={{ top: bannerVisible ? 41 : 0 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Logo />
        <div className="flex items-center gap-2 md:gap-3">
          <PillButton href={WAITLIST_URL}>Join the Waitlist</PillButton>
          <div className="hidden sm:block">
            <DemoMenu variant="outline" size="md" />
          </div>
        </div>
      </div>
    </nav>
  );
}

function FloatingDashboardCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="relative mx-auto mt-16 w-full max-w-3xl"
    >
      <div className="absolute -inset-8 -z-10 rounded-[36px] bg-teal/15 blur-3xl" />
      <div className="animate-float overflow-hidden rounded-2xl border border-divider bg-surface shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between border-b border-divider px-5 py-3">
          <div className="text-sm font-semibold text-ink">XYZ Company Limited</div>
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-teal/60" />
            <span className="h-2 w-2 rounded-full bg-amber/60" />
            <span className="h-2 w-2 rounded-full bg-ink-muted/40" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">
          {[
            { l: "Today's Footfall", v: "1,247", d: "↑ 12%", c: "text-teal" },
            { l: "Revenue Forecast", v: "£8,340", d: "On Track ✓", c: "text-teal" },
            { l: "Active Alerts", v: "3", d: "View", c: "text-amber" },
          ].map((k) => (
            <div
              key={k.l}
              className="rounded-xl border border-divider/70 bg-navy/60 p-3"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                {k.l}
              </div>
              <div className="mt-1.5 text-xl font-extrabold text-ink">{k.v}</div>
              <div className={`mt-0.5 text-xs ${k.c}`}>{k.d}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1.5 px-5 pb-3">
          {["#00C2A8", "#F5A623", "#E5484D", "#F5A623", "#1E3A52"].map((c, i) => (
            <div
              key={i}
              className="h-7 rounded-md"
              style={{ backgroundColor: c, opacity: 0.65 }}
            />
          ))}
        </div>
        <div className="m-5 mt-3 rounded-xl border border-teal/40 bg-teal/[0.06] p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-teal/20 p-1.5 text-teal">
              <Sparkles size={16} />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-ink">
                Move 2 staff to Zone B between 12–2pm
              </div>
              <div className="mt-1 text-ink-muted">
                Predicted impact:{" "}
                <span className="font-semibold text-teal">+£340 today</span>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Hero() {
  const words = ["Your", "Business."];
  const words2 = ["Operational", "Intelligence."];
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-[0.25]" />
      <div className="radial-glow absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-20 text-center md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-teal"
        >
          <Zap size={12} /> Operational Intelligence . Live in 48 hours
        </motion.div>

        <h1 className="mt-8 text-[40px] font-extrabold leading-[1.05] tracking-[-0.02em] md:text-[64px]">
          <div className="flex flex-wrap justify-center gap-x-3 text-white">
            {words.map((w, i) => (
              <motion.span
                key={w}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              >
                {w}
              </motion.span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 text-teal">
            {words2.map((w, i) => (
              <motion.span
                key={w}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 + i * 0.08, duration: 0.5 }}
              >
                {w}
              </motion.span>
            ))}
          </div>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mx-auto mt-7 max-w-[640px] text-[17px] leading-[1.7] text-ink-muted md:text-[18px]"
        >
          AI-Driven Digital Twin Platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10"
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
            Now Accepting Waitlist Applications
          </div>
          <h2 className="mt-5 text-[32px] font-extrabold leading-[1.1] tracking-tight md:text-[44px]">
            Be first. Get <span className="text-teal">two months free.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <PillButton href={WAITLIST_URL} size="lg">
            Join the Waitlist, It's Free
          </PillButton>
          <DemoMenu variant="outline" size="lg" />
        </motion.div>
        <p className="mt-4 text-[13px] italic text-ink-muted">
          No credit card required · Early access · Cancel anytime
        </p>

        <div className="mx-auto mt-14 max-w-4xl border-t border-divider/60 pt-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <Stat value={48} suffix="hrs" label="Deployment Time" />
            <Stat value={0} label="Hardware Required" />
            <Stat value={15} suffix="%" label="Efficiency Uplift (10–15%)" />
            <Stat value={94} suffix="%" label="AI Model Accuracy" />
          </div>
        </div>

        <FloatingDashboardCard />
      </div>
    </section>
  );
}

function Problem() {
  const cards = [
    {
      title: "Managing by intuition, not data",
      body: "No real-time visibility into footfall, zones, or customer flow.",
    },
    {
      title: "Staffing based on gut feel",
      body: "20–30% labour cost wasted on misaligned rotas.",
    },
    {
      title: "Inventory flying blind",
      body: "Stockouts and overstock draining cash and killing sales.",
    },
  ];
  return (
    <section className="bg-navy-soft py-24">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <SectionLabel>The Problem</SectionLabel>
        <h2 className="mx-auto max-w-3xl text-[32px] font-bold leading-tight tracking-tight md:text-[40px]">
          Enterprise AI for every business.
          <br />
          <span className="text-teal">Not just the big ones.</span>
        </h2>
        <div className="mx-auto mt-8 max-w-[720px] space-y-5 text-left text-[17px] leading-[1.75] text-ink-muted">
          <p>
            Large enterprises use Digital Twin technology to optimise their operations in real time
            , predicting demand, scheduling staff intelligently, and eliminating waste before it
            happens. The result? Measurable competitive advantage.
          </p>
          <p>
            For the 5.5 million SMEs that form the backbone of the UK economy, this technology has
            been completely out of reach, too expensive, too complex, too hardware-heavy.
          </p>
          <p className="text-ink">
            <span className="font-bold text-white">We changed that.</span> We built the same
            operational intelligence from the ground up for small and medium-sized businesses,
            using the data you already have.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-[#3a1820] bg-[#1A1020] p-6 text-left"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E5484D]/15 text-[#E5484D]">
                <X size={18} strokeWidth={3} />
              </div>
              <h3 className="mt-4 text-[17px] font-bold text-ink">{c.title}</h3>
              <p className="mt-2 text-[14px] italic text-ink-muted">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ZoneHeatmap() {
  const zones = [
    { id: "A", label: "Zone A · Entrance", color: "#F5A623", x: 8, y: 10, w: 80, h: 40 },
    { id: "B", label: "Zone B · Main Floor", color: "#E5484D", x: 92, y: 10, w: 140, h: 90 },
    { id: "C", label: "Zone C · Checkout", color: "#F5A623", x: 8, y: 56, w: 80, h: 44 },
    { id: "D", label: "Zone D · Stock Room", color: "#00C2A8", x: 236, y: 10, w: 60, h: 90 },
  ];
  return (
    <div className="rounded-xl border border-divider bg-navy/50 p-4">
      <div className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-ink-muted">
        Zone Heatmap · Live
      </div>
      <svg viewBox="0 0 304 110" className="w-full">
        <defs>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {zones.map((z) => (
          <g key={z.id} filter="url(#glow)">
            <rect
              x={z.x}
              y={z.y}
              width={z.w}
              height={z.h}
              rx="6"
              fill={z.color}
              opacity="0.55"
            />
            <text
              x={z.x + 8}
              y={z.y + 18}
              fill="#fff"
              fontSize="10"
              fontWeight={700}
            >
              {z.id}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-teal" /> Low
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber" /> Moderate
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#E5484D]" /> Peak
        </span>
      </div>
    </div>
  );
}

function MiniChart() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const foot = [38, 52, 44, 60, 78, 88, 70];
  const rev = [42, 48, 50, 64, 72, 84, 76];
  const max = 100;
  const w = 320;
  const h = 90;
  const padX = 16;
  const step = (w - padX * 2) / (days.length - 1);
  const xAt = (i: number) => padX + i * step;
  const toPath = (arr: number[]) =>
    arr
      .map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${h - (v / max) * h}`)
      .join(" ");
  return (
    <div className="rounded-xl border border-divider bg-navy/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-muted">
          Weekly Footfall vs Revenue
        </div>
        <div className="flex gap-3 text-[11px] text-ink-muted">
          <span className="flex items-center gap-1">
            <span className="h-0.5 w-3 bg-teal" /> Footfall
          </span>
          <span className="flex items-center gap-1">
            <span className="h-0.5 w-3 border-t border-dashed border-white" /> Revenue
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full">
        <path d={`${toPath(foot)} L ${xAt(days.length - 1)} ${h} L ${xAt(0)} ${h} Z`} fill="rgba(0,194,168,0.18)" />
        <path d={toPath(foot)} fill="none" stroke="#00C2A8" strokeWidth="2" />
        <path d={toPath(rev)} fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="4 3" />
        {days.map((d, i) => (
          <text
            key={i}
            x={xAt(i)}
            y={h + 14}
            fill={i === 5 ? "#00C2A8" : "#8FA3B8"}
            fontSize="10"
            textAnchor="middle"
            fontWeight={i === 5 ? 700 : 400}
          >
            {d}
          </text>
        ))}
      </svg>
    </div>
  );
}

function DemoPreview() {
  return (
    <section className="bg-navy py-24">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <SectionLabel>Live Demo Preview</SectionLabel>
        <h2 className="mx-auto max-w-3xl text-[32px] font-bold leading-tight tracking-tight md:text-[40px]">
          A complete operational picture.
          <br />
          <span className="text-teal">Updated every 5 minutes.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[16px] text-ink-muted">
          Here's what XYZ Company Limited sees when they log into TwinIQ.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto mt-12 max-w-5xl text-left"
        >
          <div className="absolute -inset-6 -z-10 rounded-[40px] bg-teal/10 blur-3xl" />
          <div className="overflow-hidden rounded-2xl border border-divider bg-surface shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 border-b border-divider bg-navy-deep px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E5484D]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-teal/70" />
              </div>
              <div className="mx-auto rounded-md border border-divider bg-navy/70 px-3 py-1 text-[11px] text-ink-muted">
                app.twiniq.io · XYZ Company Limited
              </div>
            </div>

            {/* App top bar */}
            <div className="flex items-center justify-between border-b border-divider px-5 py-3">
              <div className="flex items-center gap-4">
                <Logo size="sm" />
                <div className="hidden h-5 w-px bg-divider sm:block" />
                <div className="hidden text-[13px] text-ink-muted sm:flex sm:items-center sm:gap-1">
                  XYZ Company Limited
                  <ChevronRight size={14} />
                  <span className="text-ink">Main Site</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-ink-muted">
                <Bell size={16} />
                <Sparkles size={16} />
                <Settings2 size={16} />
              </div>
            </div>

            <div className="space-y-4 p-5">
              {/* KPI row */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { l: "Today's Footfall", v: "1,247", d: "↑ 12% vs last week", c: "text-teal" },
                  { l: "Revenue Forecast", v: "£8,340", d: "✓ On Track", c: "text-teal" },
                  { l: "Staff Efficiency", v: "74%", d: "↑ 6pts this week", c: "text-teal" },
                  { l: "Active Alerts", v: "3", d: "Needs review", c: "text-amber" },
                ].map((k) => (
                  <div
                    key={k.l}
                    className="rounded-xl border border-divider/70 bg-navy/60 p-3.5"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                      {k.l}
                    </div>
                    <div className="mt-1.5 text-2xl font-extrabold text-ink">{k.v}</div>
                    <div className={`mt-0.5 text-[12px] ${k.c}`}>{k.d}</div>
                  </div>
                ))}
              </div>

              {/* Two columns */}
              <div className="grid gap-4 lg:grid-cols-2">
                <ZoneHeatmap />
                <div className="rounded-xl border border-teal/40 bg-teal/[0.06] p-4">
                  <div className="flex items-center gap-2 text-teal">
                    <Sparkles size={16} />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      AI Recommendation
                    </span>
                  </div>
                  <h4 className="mt-3 text-[16px] font-bold text-ink">
                    Move 2 staff to Zone B, 12:00–14:00 today
                  </h4>
                  <p className="mt-2 text-[13px] leading-[1.6] text-ink-muted">
                    Footfall predicted to peak at 1.3× average. Current staffing 30% below
                    optimal. Estimated revenue impact: +£340.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-[11px] font-semibold text-teal">
                      Confidence 91%
                    </span>
                    <span className="rounded-full bg-teal px-3 py-1 text-[11px] font-bold text-navy">
                      +£340 today
                    </span>
                  </div>
                </div>
              </div>

              <MiniChart />
            </div>
          </div>
        </motion.div>

        <div className="mt-12">
          <p className="text-[16px] text-ink-muted">
            This is what operational intelligence looks like for your business.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PillButton href={WAITLIST_URL} size="lg">
              Join the Waitlist
            </PillButton>
            <DemoMenu variant="outline" size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyTwinIQ() {
  const features = [
    {
      icon: Plug,
      title: "Hardware-Free",
      body: "TwinIQ connects to your existing POS, WiFi, and CCTV metadata. Zero new sensors. Zero installation. Zero disruption to your operation.",
    },
    {
      icon: Cloud,
      title: "SaaS Deployment",
      body: "Fully cloud-native. Access your operational intelligence from any browser or mobile device, anywhere, at any time. Live in under 48 hours.",
    },
    {
      icon: BarChart3,
      title: "Business Intelligence",
      body: "Real-time KPI dashboards, trend analysis, and performance benchmarks, a single, unified view of how your business is actually performing.",
    },
    {
      icon: Settings2,
      title: "Optimisation Models",
      body: "Vertical-specific AI models trained for retail, hospitality, logistics, and manufacturing. Smarter than generic analytics, built for businesses like yours.",
    },
    {
      icon: LineChart,
      title: "Performance Monitoring",
      body: "Zone-level tracking, footfall prediction, revenue correlation, and staff efficiency scoring, updated every 5 minutes so nothing slips through.",
    },
    {
      icon: Lightbulb,
      title: "Recommendations & Alerts",
      body: "The TwinIQ AI engine doesn't just show you data, it tells you exactly what to do. Specific, actionable recommendations with projected financial impact.",
    },
    {
      icon: Link2,
      title: "Integrations",
      body: "Connect to Square, Shopify, Lightspeed, Cisco Meraki WiFi, CCTV metadata APIs, and more. Your data ecosystem, unified in one place.",
    },
  ];
  const logos = [
    "Square",
    "Shopify",
    "Lightspeed",
    "Cisco Meraki",
    "Xero",
    "Deputy",
    "QuickBooks",
  ];
  return (
    <section className="bg-navy-soft py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <SectionLabel>Why TwinIQ</SectionLabel>
          <h2 className="mx-auto max-w-3xl text-[32px] font-bold leading-tight tracking-tight md:text-[40px]">
            Everything your operation needs.
            <br />
            <span className="text-teal">Nothing it doesn't.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: (i % 2) * 0.08 }}
                className="rounded-2xl border border-divider/70 border-l-[3px] border-l-teal bg-surface p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-teal/10 text-teal">
                    <Icon size={20} />
                  </div>
                  <div>
                     <h3 className="text-[18px] font-bold text-ink">{f.title}</h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: Link2,
      title: "Connect Your Data",
      body: "Tell us which systems you use (POS, WiFi, CCTV) and we handle the integration. Our no-code connector setup takes under 2 hours with no IT team required. Your data stays yours, processed in compliance with GDPR using our federated learning methodology.",
    },
    {
      n: "02",
      icon: Dna,
      title: "Your Digital Twin Goes Live",
      body: "Within 48 hours, TwinIQ automatically builds a real-time digital replica of your operation. No engineers. No on-site visits. Just your data, intelligently modelled and instantly ready.",
    },
    {
      n: "03",
      icon: Lightbulb,
      title: "Insights, Predictions & Recommendations",
      body: "From day one, your dashboard shows live KPIs, zone heatmaps, footfall forecasts, and AI-generated recommendations, each one specific, actionable, and tied to a projected financial outcome.",
    },
    {
      n: "04",
      icon: TrendingUp,
      title: "Measure. Improve. Repeat.",
      body: "TwinIQ tracks the impact of every recommendation applied. You see exactly what changed, what improved, and what the financial return was. Continuous learning means the platform gets smarter the longer you use it.",
    },
  ];

  return (
    <section className="bg-navy py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="mx-auto max-w-3xl text-[32px] font-bold leading-tight tracking-tight md:text-[40px]">
            From sign-up to operational intelligence.
            <br />
            <span className="text-teal">Transparent. Outcome-aligned.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-[1.7] text-ink-muted">
            We built TwinIQ with one principle: you should see value before you pay full price.
            Our onboarding is fast, our process is clear, and our commercial model only wins when
            you win.
          </p>
        </div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="absolute left-6 top-0 bottom-0 hidden w-px bg-divider md:left-1/2 md:block" />
          <div className="space-y-10">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, x: left ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55 }}
                  className={`md:grid md:grid-cols-2 md:gap-10 ${
                    left ? "" : "md:[&>*:first-child]:order-2"
                  }`}
                >
                  <div className={`flex items-start gap-4 ${left ? "md:justify-end md:text-right" : ""}`}>
                    <div className={`${left ? "md:order-2" : ""} flex h-14 w-14 flex-none items-center justify-center rounded-2xl border-2 border-teal/50 text-2xl font-extrabold text-teal`}>
                      {s.n}
                    </div>
                    <div className={`pt-1 ${left ? "md:order-1" : ""}`}>
                      <div className={`inline-flex items-center gap-2 rounded-md bg-teal/10 px-2 py-1 text-teal`}>
                        <Icon size={14} />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">
                          Step {s.n}
                        </span>
                      </div>
                      <h3 className="mt-3 text-[20px] font-bold text-ink">{s.title}</h3>
                    </div>
                  </div>
                  <div className={`mt-3 md:mt-0 ${left ? "" : ""}`} />
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

function SocialProof() {
  const stats = [
    { v: "74%", d: "of SME owners said lack of real-time data is a critical barrier to profitability" },
    { v: "8 in 10", d: "have no operational visibility beyond basic POS reporting" },
    { v: "100%", d: "confirmed willingness to adopt TwinIQ at our entry-level tier" },
  ];
  return (
    <section className="bg-navy-soft py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <SectionLabel>Validated by Real SMEs</SectionLabel>
          <h2 className="mx-auto max-w-3xl text-[32px] font-bold leading-tight tracking-tight md:text-[40px]">
            Not built in a vacuum.
            <br />
            <span className="text-teal">Built from 68 real conversations.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-[1.7] text-ink-muted">
            Before writing a single line of code, the Axis31 founders spoke directly with SME
            owners and managers across the UK, in retail, hospitality, logistics, and
            manufacturing. Here's what they told us.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.v}
              className="rounded-2xl border border-divider bg-surface p-7 text-center border-t-[3px] border-t-teal"
            >
              <div className="text-[44px] font-extrabold leading-none text-teal">{s.v}</div>
              <p className="mt-4 text-[14px] leading-[1.6] text-ink-muted">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            {
              q: "We're flying blind most of the time. I know something's wrong when the till totals come in, but by then it's too late to do anything about it.",
              a: "Operations Manager, Independent Retail, Reading",
            },
            {
              q: "If something told me exactly when to staff up and what to put near the counter, I'd pay for that tomorrow.",
              a: "Owner, Hospitality SME, Coventry",
            },
          ].map((t) => (
            <div
              key={t.a}
              className="rounded-2xl border border-divider bg-surface p-6 border-l-[3px] border-l-teal"
            >
              <p className="text-[16px] italic leading-[1.7] text-ink">"{t.q}"</p>
              <p className="mt-4 text-[13px] text-ink-muted">- {t.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden py-28"
      style={{
        background: "linear-gradient(135deg, #0D1B2A 0%, #052E2B 100%)",
      }}
    >
      <div className="bg-grid absolute inset-0 opacity-[0.15]" />
      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-[1.7] text-ink-muted">
          Join the waitlist today and be among the first businesses to get access, with two
          months completely free as our way of saying thank you for believing in us early.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PillButton href={WAITLIST_URL} size="lg">
            Join the Waitlist, It's Free
          </PillButton>
          <DemoMenu variant="outline" size="lg" />
        </div>

        <ul className="mx-auto mt-8 flex flex-col items-center gap-2 text-[14px] text-ink-muted sm:flex-row sm:justify-center sm:gap-8">
          <li className="flex items-center gap-2"><span className="text-teal">✓</span> No credit card required</li>
          <li className="flex items-center gap-2"><span className="text-teal">✓</span> Cancel or opt out at any time</li>
          <li className="flex items-center gap-2"><span className="text-teal">✓</span> GDPR compliant, your data is yours</li>
        </ul>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: "#070F18" }} className="border-t border-divider/40">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 text-[14px] text-ink-muted">Your operation. Understood.</p>
            <p className="mt-2 text-[13px] text-ink-muted">
              A product by Axis31 Limited · London, UK
            </p>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
              Quick Links
            </div>
            <ul className="mt-4 space-y-2 text-[14px]">
              <li>
                <a href={WAITLIST_URL} {...ext} className="text-ink-muted transition hover:text-teal">
                  Join the Waitlist
                </a>
              </li>
              <li>
                <a href={CALL_SEYI_URL} {...ext} className="text-ink-muted transition hover:text-teal">
                  Book a call with Seyi
                </a>
              </li>
              <li>
                <a href={CALL_BUSAYO_URL} {...ext} className="text-ink-muted transition hover:text-teal">
                  Book a call with Busayo
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
              Legal & Contact
            </div>
            <p className="mt-4 text-[13px] text-ink-muted">© 2026 Axis31 Limited. All rights reserved.</p>
            <p className="mt-2 text-[13px] text-ink-muted">
              TwinIQ™ is a trademark of Axis31 Limited.
            </p>
          </div>
        </div>
        <div className="mt-12 border-t border-divider/40 pt-6 text-center text-[12px] text-ink-muted">
          TwinIQ processes only anonymised, aggregated operational metadata. No personal customer
          data is stored. GDPR-compliant by design.
        </div>
      </div>
    </footer>
  );
}

export default function TwinIQLanding() {
  const [bannerVisible, setBannerVisible] = useState(true);
  return (
    <div className="min-h-screen bg-navy text-ink">
      {bannerVisible && <AnnouncementBanner onDismiss={() => setBannerVisible(false)} />}
      <Navbar bannerVisible={bannerVisible} />
      <main>
        <Hero />
        <Problem />
        <DemoPreview />
        <WhyTwinIQ />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}