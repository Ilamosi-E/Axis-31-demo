import { createFileRoute } from "@tanstack/react-router";
import { Card, Badge, Dot, PageHeader } from "@/components/ui-bits";
import { type Zone, useBusiness } from "@/lib/twiniq-data";
import { FeatureGate } from "@/components/FeatureGate";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_dash/twin")({
  head: () => ({ meta: [{ title: "Digital Twin - TwinIQ" }] }),
  component: () => <FeatureGate feature="twin" title="Digital Twin"><TwinPage /></FeatureGate>,
});

function heatColor(d: number) {
  if (d < 0.4) return `color-mix(in oklch, oklch(0.6 0.2 250) ${d * 200}%, transparent)`;
  if (d < 0.75) return `color-mix(in oklch, oklch(0.78 0.16 70) ${d * 100}%, transparent)`;
  return `color-mix(in oklch, oklch(0.7 0.2 25) ${d * 100}%, transparent)`;
}

type Mode = "live" | "predicted" | "historical";

// Per-vertical glyphs for the "assets" overlay
const ASSET_GLYPH: Record<string, { label: string; symbol: string; noun: string }> = {
  fielding: { label: "Tills & fixtures",  symbol: "T", noun: "tills" },
  corner:   { label: "Tables & bar taps", symbol: "●", noun: "tables" },
  apex:     { label: "MHE & dock doors",  symbol: "F", noun: "forklifts" },
};

function TwinPage() {
  const { business, data } = useBusiness();
  const { zones, twinFloorAccuracy, twinNotes } = data;
  const [mode, setMode] = useState<Mode>("live");
  const [layers, setLayers] = useState({ heatmap: true, staff: false, assets: false, wifi: false });
  const [sel, setSel] = useState<Zone | null>(zones[1]);
  const [hour, setHour] = useState(13); // 0..23

  // Mode + slider transform the live zone densities into the visible view
  const view = useMemo(() => {
    const hourFactor = (h: number) => {
      // bell curve peaking ~14:00, range ~0.35..1.15
      const norm = Math.max(0, 1 - Math.abs(h - 14) / 9);
      return 0.35 + norm * 0.8;
    };
    const modeMul =
      mode === "predicted" ? 1.18 :
      mode === "historical" ? hourFactor(hour) / hourFactor(13) : 1;
    const label =
      mode === "live" ? "Live · just now" :
      mode === "predicted" ? `Predicted +2h · ${String((new Date().getHours() + 2) % 24).padStart(2, "0")}:00` :
      `Historical · ${String(hour).padStart(2, "0")}:00`;
    const adjZones = zones.map((z) => {
      const density = Math.max(0.05, Math.min(1, z.density * modeMul + (mode === "predicted" ? 0.04 : 0)));
      const traffic = Math.round(z.traffic * modeMul);
      const dwell = +(z.dwell * (mode === "historical" ? 0.85 + hourFactor(hour) * 0.3 : modeMul)).toFixed(1);
      return { ...z, density, traffic, dwell };
    });
    return { zones: adjZones, modeLabel: label, modeMul };
  }, [zones, mode, hour]);

  // Re-resolve the selected zone against the transformed view
  const selView = sel ? view.zones.find((z) => z.id === sel.id) ?? null : null;

  // Per-business overlay data derived deterministically from zones
  const overlay = useMemo(() => {
    const perZone = view.zones.map((z) => {
      const baseStaff = business.id === "apex" ? z.traffic / 4 : z.traffic / 9;
      const staff = Math.max(1, Math.round(baseStaff * view.modeMul));
      const assetsCount =
        business.id === "fielding" ? (z.id === "C" ? 4 : z.id === "B" ? 6 : z.id === "A" ? 2 : 3) :
        business.id === "corner"   ? (z.id === "B" ? 12 : z.id === "C" ? 8 : z.id === "A" ? 6 : 4) :
        /* apex */                   (z.id === "A" ? 4 : z.id === "B" ? 8 : z.id === "C" ? 5 : 6);
      const apCount = z.w * z.h > 1500 ? 2 : 1;
      const devices = Math.round(z.traffic * (business.id === "corner" ? 2.4 : business.id === "apex" ? 0.6 : 3.2) * view.modeMul);
      return { zone: z, staff, assetsCount, apCount, devices };
    });
    const totals = perZone.reduce(
      (a, p) => ({ staff: a.staff + p.staff, assets: a.assets + p.assetsCount, devices: a.devices + p.devices, aps: a.aps + p.apCount }),
      { staff: 0, assets: 0, devices: 0, aps: 0 }
    );
    return { perZone, totals };
  }, [view.zones, view.modeMul, business.id]);

  const selOverlay = selView ? overlay.perZone.find((p) => p.zone.id === selView.id) : null;
  const glyph = ASSET_GLYPH[business.id] ?? ASSET_GLYPH.fielding;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader title="Digital Twin" subtitle={`${business.name} - ${business.spaceLabel}`}
        right={<Badge tone="primary">Model accuracy {twinFloorAccuracy}%</Badge>} />

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-md border border-border p-0.5 text-xs">
            {([["live", "Live View"], ["predicted", "Predicted (2hr)"], ["historical", "Historical Replay"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setMode(k)} className={`px-3 py-1.5 rounded ${mode === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{l}</button>
            ))}
          </div>
          {mode === "historical" && (
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <input
                type="range" min={6} max={22} step={1} value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="flex-1 accent-[oklch(0.74_0.14_180)]"
              />
              <span className="text-xs tabular-nums text-muted-foreground w-12">{String(hour).padStart(2, "0")}:00</span>
            </div>
          )}
          <span className="text-[11px] text-muted-foreground">{view.modeLabel}</span>
          <div className="ml-auto flex flex-wrap gap-2 text-xs">
            {Object.entries(layers).map(([k, v]) => (
              <button key={k} onClick={() => setLayers((s) => ({ ...s, [k]: !v }))}
                className={`px-2.5 py-1 rounded border ${v ? "bg-primary/15 border-primary/40 text-primary" : "border-border text-muted-foreground"}`}>
                {k[0].toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Live overlay totals */}
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          {layers.staff && <Badge tone="primary">Staff on floor: {overlay.totals.staff}</Badge>}
          {layers.assets && <Badge tone="primary">{glyph.label}: {overlay.totals.assets}</Badge>}
          {layers.wifi && <Badge tone="primary">WiFi APs: {overlay.totals.aps} · devices: {overlay.totals.devices}</Badge>}
          {layers.heatmap && <Badge tone="primary">Heatmap density mode: {mode}</Badge>}
        </div>
      </Card>

      <div className="grid lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3 p-0 overflow-hidden">
          <div className="relative aspect-[16/9] bg-gradient-to-br from-background to-card">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
              <defs>
                <pattern id="floor" width="4" height="4" patternUnits="userSpaceOnUse">
                  <path d="M4 0H0V4" fill="none" stroke="oklch(0.3 0.03 250)" strokeWidth="0.15" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#floor)" />

              {view.zones.map((z) => {
                const ov = overlay.perZone.find((p) => p.zone.id === z.id)!;
                return (
                  <g key={z.id} onClick={() => setSel(z)} className="cursor-pointer">
                    <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="1.2"
                      fill="oklch(0.22 0.03 250)" stroke={sel?.id === z.id ? "oklch(0.74 0.14 180)" : "oklch(0.3 0.03 250)"} strokeWidth="0.4" />
                    {layers.heatmap && (
                      <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="1.2"
                        fill={heatColor(z.density)} className={z.density > 0.7 ? "animate-pulse-zone" : ""} />
                    )}
                    <text x={z.x + 1.8} y={z.y + 4.8} fontSize="4.2" fill="#ffffff" fontWeight="900" fontFamily="'Arial Black', 'Helvetica Neue', Impact, sans-serif" stroke="oklch(0.12 0.03 250)" strokeWidth="0.6" paintOrder="stroke" style={{ letterSpacing: "0.05em" }}>{z.id}</text>
                    <text x={z.x + 1.8} y={z.y + 9.2} fontSize="3" fill="#ffffff" fontWeight="900" fontFamily="'Arial Black', 'Helvetica Neue', Impact, sans-serif" stroke="oklch(0.12 0.03 250)" strokeWidth="0.55" paintOrder="stroke" style={{ letterSpacing: "0.03em" }}>{z.category}</text>


                    {/* Staff overlay */}
                    {layers.staff && Array.from({ length: ov.staff }).map((_, i) => {
                      const cols = Math.max(1, Math.ceil(Math.sqrt(ov.staff)));
                      const col = i % cols, row = Math.floor(i / cols);
                      const cx = z.x + 4 + col * Math.min(4, (z.w - 6) / cols);
                      const cy = z.y + z.h - 4 - row * 3.5;
                      return <circle key={`s${i}`} cx={cx} cy={cy} r={0.9} fill="oklch(0.74 0.14 180)" stroke="oklch(0.18 0.03 250)" strokeWidth={0.2} />;
                    })}

                    {/* Assets overlay */}
                    {layers.assets && Array.from({ length: ov.assetsCount }).map((_, i) => {
                      const cols = Math.max(1, Math.ceil(Math.sqrt(ov.assetsCount)));
                      const col = i % cols, row = Math.floor(i / cols);
                      const cx = z.x + z.w - 4 - col * Math.min(5, (z.w - 6) / cols);
                      const cy = z.y + 10 + row * 4;
                      return (
                        <g key={`a${i}`}>
                          <rect x={cx - 1.4} y={cy - 1.4} width={2.8} height={2.8} rx={0.4}
                            fill="oklch(0.28 0.04 250)" stroke="oklch(0.74 0.14 180)" strokeWidth={0.25} />
                          <text x={cx} y={cy + 0.8} fontSize="1.6" textAnchor="middle" fill="oklch(0.85 0.08 180)" fontWeight={700}>{glyph.symbol}</text>
                        </g>
                      );
                    })}

                    {/* WiFi overlay */}
                    {layers.wifi && Array.from({ length: ov.apCount }).map((_, i) => {
                      const cx = z.x + (z.w / (ov.apCount + 1)) * (i + 1);
                      const cy = z.y + z.h / 2;
                      return (
                        <g key={`w${i}`}>
                          <circle cx={cx} cy={cy} r={4} fill="none" stroke="oklch(0.74 0.14 180)" strokeWidth={0.25} opacity={0.5}>
                            <animate attributeName="r" values="2;6;2" dur="3s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.7;0.05;0.7" dur="3s" repeatCount="indefinite" />
                          </circle>
                          <circle cx={cx} cy={cy} r={1} fill="oklch(0.74 0.14 180)" />
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* moving dots - speed varies with mode */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <circle key={i} cx={20 + i * 12} cy={45 + (i % 2) * 10} r="0.6" fill="oklch(0.74 0.14 180)" opacity={mode === "historical" ? 0.4 : 0.7}>
                  <animate attributeName="cx" values={`${10 + i * 12};${80 - i * 6};${10 + i * 12}`}
                    dur={`${(mode === "predicted" ? 5 : mode === "historical" ? 14 : 8) + i}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </svg>
            <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[10px] text-muted-foreground bg-background/70 backdrop-blur px-3 py-1.5 rounded-md border border-border">
              <span>Density:</span>
              <span className="inline-block h-2 w-12 rounded" style={{ background: "linear-gradient(90deg, oklch(0.5 0.2 250), oklch(0.78 0.16 70), oklch(0.7 0.2 25))" }} />
              <span>Low → High</span>
            </div>
          </div>
        </Card>

        {selView && (
          <Card>
            <div className="flex items-center gap-2"><Dot tone={selView.status} /><h3 className="font-semibold tracking-tight">{selView.name}</h3></div>
            <p className="text-xs text-muted-foreground mt-1">{selView.category} · {view.modeLabel}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Stat label="Traffic" v={`${selView.traffic}%`} />
              <Stat label="Dwell time" v={`${selView.dwell} min`} />
              <Stat label="Revenue" v={`${selView.revenue}%`} />
              <Stat label="Density" v={`${Math.round(selView.density * 100)}%`} />
              {layers.staff && selOverlay && <Stat label="Staff in zone" v={`${selOverlay.staff}`} />}
              {layers.assets && selOverlay && <Stat label={glyph.noun} v={`${selOverlay.assetsCount}`} />}
              {layers.wifi && selOverlay && <Stat label="WiFi devices" v={`${selOverlay.devices}`} />}
              {layers.wifi && selOverlay && <Stat label="Access points" v={`${selOverlay.apCount}`} />}
            </dl>
            <div className="mt-4 p-3 rounded-md bg-primary/10 border border-primary/30">
              <div className="text-[10px] uppercase tracking-wider text-primary mb-1">AI note</div>
              <p className="text-xs leading-relaxed">
                {twinNotes[selView.id] ?? "Performance within expected band. No action required."}
              </p>
            </div>
            <div className="mt-4 h-16 flex items-end gap-1">
              {[3, 5, 4, 6, 8, 7, 9].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-primary/60" style={{ height: `${h * 8 * view.modeMul}px` }} />
              ))}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">Last 7 days</div>
          </Card>
        )}
      </div>

      <Card className="mt-4" title="Zone Summary">
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="text-left py-2">Zone</th><th className="text-left">Traffic %</th><th className="text-left">Dwell</th><th className="text-left">Revenue</th><th className="text-left">Status</th><th className="text-left">AI Flag</th></tr>
          </thead>
          <tbody>
            {view.zones.map((z) => (
              <tr key={z.id} className={`border-t border-border ${z.status === "alert" ? "bg-destructive/5" : z.status === "warn" ? "bg-warning/5" : ""}`}>
                <td className="py-2.5 font-medium">{z.name}</td>
                <td>{z.traffic}%</td>
                <td>{z.dwell} min</td>
                <td>{z.revenue}%</td>
                <td><Badge tone={z.status === "good" ? "ok" : z.status === "warn" ? "warn" : "alert"}>{z.status}</Badge></td>
                <td className="text-xs text-muted-foreground">{z.status === "alert" ? "Understaffed - 12–14h" : z.status === "warn" ? "High dwell at checkout" : "Nominal"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="p-2.5 rounded-md bg-secondary/40">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-semibold mt-0.5">{v}</div>
    </div>
  );
}
