// Mock demo data for TwinIQ - per-business variants
import { createContext, useContext } from "react";

export type Plan = "Foundation" | "Growth" | "Enterprise+";

export type Business = {
  id: string;
  name: string;
  vertical: string;
  location: string;
  model: string;
  unitLabel: string;            // e.g. "visitors", "covers", "parcels"
  trafficVerb: string;          // e.g. "Footfall", "Covers", "Throughput"
  spaceLabel: string;           // e.g. "800 sq ft retail floor"
  plan: Plan;
  planPrice: string;            // e.g. "£85/month"
  account: { owner: string; email: string };
};

export const businesses: Business[] = [
  { id: "fielding", name: "Fielding & Co", vertical: "Retail",       location: "Reading High St", model: "Retail Vertical AI v2.1",      unitLabel: "visitors", trafficVerb: "Footfall",  spaceLabel: "800 sq ft retail floor",   plan: "Growth",      planPrice: "£85/month",  account: { owner: "Jane Mendoza", email: "jane@fieldingco.uk" } },
  { id: "corner",   name: "The Corner House", vertical: "Hospitality", location: "Coventry",       model: "Hospitality Vertical AI v1.8", unitLabel: "covers",   trafficVerb: "Covers",    spaceLabel: "120-cover gastro pub",      plan: "Foundation",  planPrice: "£45/month",  account: { owner: "Mark Doherty", email: "mark@cornerhouse.pub" } },
  { id: "apex",     name: "Apex Logistics", vertical: "Warehouse",    location: "Birmingham",      model: "Logistics Vertical AI v1.4",   unitLabel: "parcels",  trafficVerb: "Throughput", spaceLabel: "42,000 sq ft fulfilment hub", plan: "Enterprise+", planPrice: "Custom",     account: { owner: "Priya Shah",    email: "priya@apexlogistics.co.uk" } },
];

// Feature gating per plan.
// Foundation: Core dashboard, Basic KPIs, Footfall tracking, 1 site.
// Growth: + Full digital twin, AI recommendations, Staff optimisation, up to 3 sites.
// Enterprise+: everything.
export type FeatureKey = "twin" | "staff" | "recommendations" | "inventory" | "zones";

export const PLAN_FEATURES: Record<Plan, Set<FeatureKey>> = {
  Foundation: new Set<FeatureKey>(["twin"]),
  Growth: new Set<FeatureKey>(["twin", "staff", "recommendations", "inventory", "zones"]),
  "Enterprise+": new Set<FeatureKey>(["twin", "staff", "recommendations", "inventory", "zones"]),
};


export function hasFeature(plan: Plan, feature: FeatureKey): boolean {
  return PLAN_FEATURES[plan].has(feature);
}

export type Zone = {
  id: string;
  name: string;
  category: string;
  traffic: number;
  dwell: number;
  revenue: number;
  status: "good" | "warn" | "alert";
  density: number;
  x: number; y: number; w: number; h: number;
};

export type Dataset = {
  kpis: {
    footfall: { value: number; delta: number; label: string; title: string; sub: string };
    revenue:  { value: number; status: string; title: string };
    efficiency: { value: number; delta: number };
    alerts: { value: number; sub: string };
  };
  topRec: { title: string; body: string; impact: string };
  weeklyPerformance: { day: string; footfall: number; revenue: number; staffCost: number }[];
  liveFeed: { time: string; level: "ok" | "warn" | "alert"; text: string }[];
  zones: Zone[];
  twinFloorAccuracy: number;
  twinNotes: Record<string, string>;
  forecast7d: { day: string; predicted: number; actual: number | null; lower: number; upper: number }[];
  hourlyHeatmap: { day: string; hours: { hour: number; value: number }[] }[];
  revenueScatter: { footfall: number; revenue: number }[];
  forecastInsight: { headline: string; visitors: number; deltaPct: number; recs: string[]; peakWindow: string };
  staffSchedule: { shift: string; Mon: [number, number]; Tue: [number, number]; Wed: [number, number]; Thu: [number, number]; Fri: [number, number]; Sat: [number, number]; Sun: [number, number] }[];
  staffRoster?: { name: string; role: string; days: Record<"Mon"|"Tue"|"Wed"|"Thu"|"Fri"|"Sat"|"Sun", { start: string; end: string; overtime: number } | null> }[];
  staffRecs: { sev: "alert" | "warn" | "ok"; title: string; body: string }[];
  staffCost: { current: number; optimised: number; savings: number; effFrom: number; effTo: number };

  inventory: { sku: string; cat: string; stock: number; days: number; demand: number; reorder: boolean; status: "urgent" | "soon" | "healthy" | "overstock" }[];
  inventoryTrend: { day: number; stock: number; demand: number }[];
  invKpis: { atRiskCount: number; overstockValue: number; topSkus: string[]; reorders: number; trendTitle: string; tableTitle: string; insight: string; categoryPing: string };
  recommendations: { sev: "high" | "med" | "low"; cat: string; title: string; body: string; impact: string; confidence: number; ago: string }[];
  recsStats: { week: number; applied: number; revenue: number; confidence: number };
  alerts: { sev: "alert" | "warn" | "ok"; time: string; title: string; body: string; action: string; status: string }[];
  integrations: { name: string; status: "connected" | "available"; sync: string; note: string; points: string }[];
};

// ---------- helpers
const makeHeatmap = (scale: number, peakDays: string[] = ["Sat", "Fri"]) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((d) => ({
    day: d,
    hours: Array.from({ length: 12 }, (_, i) => {
      const hour = i + 8;
      const peak = peakDays.includes(d) ? 1.25 : 1;
      const base = Math.sin(((hour - 8) / 11) * Math.PI) * 0.85 + 0.15;
      return { hour, value: Math.round(base * scale * peak) };
    }),
  }));
};

const makeScatter = (slope: number, base: number, noiseAmp: number, n = 28, xMin = 600, xMax = 1900) =>
  Array.from({ length: n }, () => {
    const x = xMin + Math.round(Math.random() * (xMax - xMin));
    const noise = (Math.random() - 0.5) * noiseAmp;
    return { footfall: x, revenue: Math.round(x * slope + noise + base) };
  });

const makeInvTrend = (start: number, decay: number, demandBase: number, demandWave: number) =>
  Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    stock: Math.max(20, start - i * decay + Math.round(Math.random() * 20)),
    demand: demandBase + Math.round(Math.sin(i / 4) * demandWave + Math.random() * 8),
  }));

// ============================================================
// RETAIL - Fielding & Co
// ============================================================
const retail: Dataset = {
  kpis: {
    footfall: { value: 1247, delta: 12, label: "vs last Tuesday", title: "Today's Footfall", sub: "↑ 12% vs last Tuesday" },
    revenue:  { value: 8340, status: "On track", title: "Revenue Forecast" },
    efficiency: { value: 74, delta: 6 },
    alerts: { value: 3, sub: "3 anomalies detected" },
  },
  topRec: { title: "Move 2 staff to the floor between 12:00–14:00",
    body: "Footfall is predicted to peak at 1.3× average in Zone B during lunch. Current staffing is 30% below optimal for this window.",
    impact: "Est. impact +£340 today" },
  weeklyPerformance: [
    { day: "Mon", footfall: 920,  revenue: 6100,  staffCost: 540 },
    { day: "Tue", footfall: 1247, revenue: 8340,  staffCost: 610 },
    { day: "Wed", footfall: 1080, revenue: 7200,  staffCost: 580 },
    { day: "Thu", footfall: 1320, revenue: 8900,  staffCost: 640 },
    { day: "Fri", footfall: 1510, revenue: 10200, staffCost: 720 },
    { day: "Sat", footfall: 1840, revenue: 12400, staffCost: 880 },
    { day: "Sun", footfall: 1190, revenue: 7800,  staffCost: 590 },
  ],
  liveFeed: [
    { time: "12:04 PM", level: "warn",  text: "Zone C (Entrance) reaching capacity threshold - 87% of peak" },
    { time: "11:50 AM", level: "ok",    text: "POS integration sync successful - 847 transactions processed" },
    { time: "11:30 AM", level: "alert", text: "Staff ratio below optimal in Zone B - recommend moving 1 staff member" },
    { time: "11:00 AM", level: "ok",    text: "Saturday demand model updated - confidence 92%" },
    { time: "10:42 AM", level: "ok",    text: "WiFi analytics live - 312 unique devices detected this hour" },
    { time: "10:15 AM", level: "warn",  text: "Dwell time spike in Zone D - 4.2 min avg (baseline 2.1)" },
  ],
  zones: [
    { id: "A", name: "Zone A - Entrance",   category: "Entry",         traffic: 28, dwell: 0.8, revenue: 6,  status: "good",  density: 0.72, x: 4,  y: 4,  w: 30, h: 18 },
    { id: "B", name: "Zone B - Main Floor", category: "Sales Floor",   traffic: 41, dwell: 4.2, revenue: 58, status: "alert", density: 0.92, x: 4,  y: 24, w: 60, h: 38 },
    { id: "C", name: "Zone C - Checkout",   category: "Checkout",      traffic: 22, dwell: 3.4, revenue: 30, status: "warn",  density: 0.62, x: 66, y: 24, w: 30, h: 38 },
    { id: "D", name: "Zone D - Stock Room", category: "Back of House", traffic: 9,  dwell: 1.1, revenue: 6,  status: "good",  density: 0.18, x: 4,  y: 64, w: 92, h: 32 },
  ],
  twinFloorAccuracy: 94.2,
  twinNotes: {
    B: "Staff ratio in this zone is 42% below optimal during the 12–14h window. Consider redeploying 1 BoH staff.",
    C: "Dwell time is 23% above industry benchmark - consider adding a self-checkout point.",
  },
  forecast7d: [
    { day: "Mon", predicted: 980,  actual: 950,  lower: 880,  upper: 1080 },
    { day: "Tue", predicted: 1280, actual: 1247, lower: 1160, upper: 1400 },
    { day: "Wed", predicted: 1100, actual: 1080, lower: 990,  upper: 1210 },
    { day: "Thu", predicted: 1350, actual: 1320, lower: 1220, upper: 1480 },
    { day: "Fri", predicted: 1540, actual: 1510, lower: 1390, upper: 1690 },
    { day: "Sat", predicted: 1847, actual: null, lower: 1690, upper: 2010 },
    { day: "Sun", predicted: 1210, actual: null, lower: 1080, upper: 1340 },
  ],
  hourlyHeatmap: makeHeatmap(200),
  revenueScatter: makeScatter(6.4, 800, 1200),
  forecastInsight: { headline: "This Saturday is your highest-traffic day this month.", visitors: 1847, deltaPct: 23, peakWindow: "Saturday peak window · 12–2pm - 340 visitors/hr",
    recs: ["Recommend full staff deployment 11am–3pm", "Proactive stock check of top-5 SKUs by Thursday", "Pre-position 2 staff at Zone B entry"] },
  staffSchedule: [
    { shift: "Morning (8–11)",    Mon: [2,2], Tue: [2,2], Wed: [2,2], Thu: [2,3], Fri: [3,3], Sat: [3,4], Sun: [2,2] },
    { shift: "Midday (11–14)",    Mon: [3,3], Tue: [3,3], Wed: [3,3], Thu: [3,4], Fri: [4,4], Sat: [3,5], Sun: [3,3] },
    { shift: "Afternoon (14–17)", Mon: [3,2], Tue: [3,3], Wed: [3,3], Thu: [3,3], Fri: [4,4], Sat: [4,5], Sun: [3,3] },
    { shift: "Evening (17–20)",   Mon: [2,2], Tue: [2,2], Wed: [2,2], Thu: [3,3], Fri: [4,4], Sat: [4,4], Sun: [2,2] },
  ],
  staffRoster: [
    { name: "Sarah Chen",    role: "Floor Lead",  days: { Mon:{start:"08:00",end:"16:00",overtime:0}, Tue:{start:"08:00",end:"17:00",overtime:1}, Wed:{start:"08:00",end:"16:00",overtime:0}, Thu:{start:"08:00",end:"17:00",overtime:1}, Fri:{start:"09:00",end:"18:00",overtime:0}, Sat:{start:"09:00",end:"19:30",overtime:2.5}, Sun:null } },
    { name: "James O'Brien", role: "Sales Assoc.", days: { Mon:{start:"11:00",end:"19:00",overtime:0}, Tue:null, Wed:{start:"11:00",end:"20:00",overtime:1}, Thu:{start:"11:00",end:"19:00",overtime:0}, Fri:{start:"12:00",end:"20:00",overtime:0}, Sat:{start:"10:00",end:"20:00",overtime:2}, Sun:{start:"11:00",end:"17:00",overtime:0} } },
    { name: "Priya Kaur",    role: "Checkout",     days: { Mon:{start:"09:00",end:"15:00",overtime:0}, Tue:{start:"09:00",end:"16:00",overtime:0}, Wed:null, Thu:{start:"12:00",end:"20:00",overtime:0.5}, Fri:{start:"12:00",end:"20:00",overtime:0}, Sat:{start:"10:00",end:"19:00",overtime:1}, Sun:{start:"11:00",end:"17:00",overtime:0} } },
    { name: "Tom Reilly",    role: "Stock",        days: { Mon:{start:"07:00",end:"13:00",overtime:0}, Tue:{start:"07:00",end:"13:00",overtime:0}, Wed:{start:"07:00",end:"14:00",overtime:1}, Thu:null, Fri:{start:"07:00",end:"15:00",overtime:0}, Sat:{start:"07:00",end:"15:00",overtime:0}, Sun:null } },
    { name: "Mia Nascimento",role: "Sales Assoc.", days: { Mon:null, Tue:{start:"13:00",end:"20:00",overtime:0}, Wed:{start:"13:00",end:"20:00",overtime:0}, Thu:{start:"13:00",end:"21:00",overtime:1}, Fri:{start:"14:00",end:"21:00",overtime:0}, Sat:{start:"12:00",end:"20:30",overtime:1.5}, Sun:{start:"12:00",end:"18:00",overtime:0} } },
  ],

  staffRecs: [
    { sev: "alert", title: "Saturday 12pm–2pm - Add 2 floor staff", body: "Predicted peak footfall. Estimated revenue uplift: +£420." },
    { sev: "warn",  title: "Monday 9am–11am - Reduce checkout by 1", body: "Historically low-traffic window. Save ~£60." },
    { sev: "ok",    title: "Wednesday 6pm–8pm - Optimal", body: "Current staffing matches model. No action needed." },
    { sev: "warn",  title: "Thursday midday - Shift 1 from BoH to floor", body: "Conversion rate dropping during 12–14 window." },
  ],
  staffCost: { current: 4230, optimised: 3590, savings: 640, effFrom: 74, effTo: 88 },
  inventory: [
    { sku: "FC-DM-32", cat: "Denim",       stock: 12,  days: 2,  demand: 38, reorder: true,  status: "urgent" },
    { sku: "FC-KW-08", cat: "Knitwear",    stock: 24,  days: 4,  demand: 22, reorder: true,  status: "soon" },
    { sku: "FC-AC-14", cat: "Accessories", stock: 88,  days: 18, demand: 9,  reorder: false, status: "healthy" },
    { sku: "FC-OW-21", cat: "Outerwear",   stock: 6,   days: 1,  demand: 14, reorder: true,  status: "urgent" },
    { sku: "FC-FW-03", cat: "Footwear",    stock: 31,  days: 9,  demand: 12, reorder: false, status: "healthy" },
    { sku: "FC-AC-22", cat: "Accessories", stock: 142, days: 60, demand: 4,  reorder: false, status: "overstock" },
    { sku: "FC-DM-19", cat: "Denim",       stock: 18,  days: 5,  demand: 16, reorder: true,  status: "soon" },
  ],
  inventoryTrend: makeInvTrend(240, 6, 30, 15),
  invKpis: { atRiskCount: 3, overstockValue: 2100, topSkus: ["FC-DM-32", "FC-KW-08", "FC-OW-21"], reorders: 4, tableTitle: "Demand Forecast", trendTitle: "30-day inventory vs demand · top 5 SKUs",
    insight: "Based on footfall forecasts for this weekend, demand for Outerwear is projected to increase 28%. Current stock runs out by Friday afternoon. Recommend placing a reorder by Wednesday EOD.",
    categoryPing: "Outerwear" },
  recommendations: [
    { sev: "high", cat: "Staffing", title: "Shift 2 staff to checkout between 12–2pm on Saturday",
      body: "Footfall model predicts 1,340 visitors during this window. Current staffing ratio is 42% below optimal. Queue time will exceed 8 minutes without intervention, historically correlated with a 17% abandonment rate.",
      impact: "+£380 / week", confidence: 91, ago: "12 mins ago" },
    { sev: "high", cat: "Inventory", title: "Reorder FC-OW-21 (Outerwear) by Wednesday EOD",
      body: "Predicted demand for outerwear up 28% this weekend. Current stock runs out Friday afternoon. Reorder lead time is 2 days.",
      impact: "+£620 / week", confidence: 88, ago: "34 mins ago" },
    { sev: "med", cat: "Layout", title: "Move impulse SKUs to Zone B entry point",
      body: "Products placed at Zone B entry generate 3.4x more impulse purchases. Current layout underutilises this premium position.",
      impact: "+£210 / week", confidence: 82, ago: "1 hr ago" },
    { sev: "med", cat: "Scheduling", title: "Reduce Monday morning checkout staff by 1",
      body: "Mondays 9–11am consistently 38% below average traffic. Saves ~£60/week without service impact.",
      impact: "-£240 cost / mo", confidence: 86, ago: "2 hrs ago" },
    { sev: "low", cat: "Revenue", title: "Extend Saturday opening by 1 hr (trial)",
      body: "Demand model shows residual footfall at closing time on Saturdays. Trial 1-hour extension for 2 weeks.",
      impact: "+£180 / week", confidence: 71, ago: "4 hrs ago" },
    { sev: "high", cat: "Staffing", title: "Cross-train 2 BoH staff for floor coverage",
      body: "Lunch-hour shortfalls recur weekly. Cross-training enables flex coverage without new hires.",
      impact: "+£300 / week", confidence: 89, ago: "Yesterday" },
  ],
  recsStats: { week: 14, applied: 9, revenue: 2140, confidence: 88 },
  alerts: [
    { sev: "alert", time: "14:15", title: "Unusual drop in Zone B revenue - 34% below Tuesday baseline",
      body: "Revenue in Zone B fell sharply at 2:15pm. Footfall is normal. Possible till issue or product stock gap.",
      action: "Check till #2 status; verify top SKU stock in Zone B.", status: "Investigating" },
    { sev: "warn", time: "12:04", title: "Zone C entrance reaching capacity threshold",
      body: "Footfall at 87% of recorded peak. Queue formation likely within 15 minutes.",
      action: "Reassign 1 floor staff to checkout assist.", status: "Open" },
    { sev: "warn", time: "11:30", title: "Staff ratio below optimal in Zone B",
      body: "Current ratio is 1 staff per 38 visitors. Optimal: 1 per 22.",
      action: "Move 1 staff from Zone D to Zone B.", status: "Open" },
    { sev: "ok",   time: "10:00", title: "Demand model retrained successfully",
      body: "Saturday forecast confidence improved from 88% → 92%.",
      action: "No action required.", status: "Resolved" },
    { sev: "alert", time: "09:12", title: "Inventory anomaly - FC-OW-21 stock below safety threshold",
      body: "Only 6 units left, predicted demand 14 over next 24h.",
      action: "Trigger urgent reorder.", status: "Open" },
  ],
  integrations: [
    { name: "Square POS",          status: "connected", sync: "5 min ago",  note: "Transactions, product sales, timestamps - syncing every 5 mins", points: "2,340 transactions today" },
    { name: "Shopify",             status: "connected", sync: "8 min ago",  note: "E-commerce + in-store data unified", points: "184 online orders today" },
    { name: "Cisco Meraki WiFi",   status: "connected", sync: "15 min ago", note: "Footfall detection via device pings", points: "1,247 unique visitors today" },
    { name: "CCTV Metadata API",   status: "connected", sync: "2 min ago",  note: "Movement vectors, dwell time - no video stored", points: "Metadata only - GDPR safe" },
    { name: "Lightspeed POS",      status: "available", sync: "-", note: "Click to connect", points: "" },
    { name: "Deputy (Workforce)",  status: "available", sync: "-", note: "Click to connect", points: "" },
    { name: "Xero (Accounting)",   status: "available", sync: "-", note: "Click to connect", points: "" },
    { name: "Salesforce",          status: "available", sync: "-", note: "CRM data - customers, opportunities, support cases", points: "" },
  ],
};

// ============================================================
// HOSPITALITY - The Corner House (gastro pub)
// ============================================================
const hospitality: Dataset = {
  kpis: {
    footfall: { value: 312, delta: 9, label: "covers vs last Tuesday", title: "Today's Covers", sub: "↑ 9% vs last Tuesday" },
    revenue:  { value: 4820, status: "Above target", title: "Tab Revenue (live)" },
    efficiency: { value: 68, delta: 4 },
    alerts: { value: 2, sub: "kitchen ticket spike" },
  },
  topRec: { title: "Add 1 runner & 1 KP for Friday 19:00–22:00",
    body: "Predicted 142 covers in the dinner window - 22% above last Friday. Current rota will push ticket times past 14 minutes after 19:30.",
    impact: "Protects ~£480 in tips & rebookings" },
  weeklyPerformance: [
    { day: "Mon", footfall: 180, revenue: 2400, staffCost: 380 },
    { day: "Tue", footfall: 312, revenue: 4820, staffCost: 460 },
    { day: "Wed", footfall: 268, revenue: 4100, staffCost: 440 },
    { day: "Thu", footfall: 340, revenue: 5300, staffCost: 510 },
    { day: "Fri", footfall: 460, revenue: 7900, staffCost: 720 },
    { day: "Sat", footfall: 540, revenue: 9600, staffCost: 880 },
    { day: "Sun", footfall: 410, revenue: 6700, staffCost: 640 },
  ],
  liveFeed: [
    { time: "12:18 PM", level: "warn",  text: "Kitchen ticket time 11.4 min - drifting above 9 min target" },
    { time: "12:02 PM", level: "ok",    text: "Toast POS sync - 84 tabs open, avg spend £18.40" },
    { time: "11:45 AM", level: "alert", text: "Bar wait time spike - recommend pulling 1 server to bar" },
    { time: "11:20 AM", level: "ok",    text: "Friday demand model updated - confidence 90%" },
    { time: "10:55 AM", level: "ok",    text: "OpenTable feed live - 142 covers booked for tonight" },
    { time: "10:30 AM", level: "warn",  text: "Patio occupancy 92% - turning 3 tables/hr (baseline 4.2)" },
  ],
  zones: [
    { id: "A", name: "Zone A - Bar",     category: "Bar & Drinks", traffic: 34, dwell: 22, revenue: 28, status: "alert", density: 0.88, x: 4,  y: 4,  w: 40, h: 22 },
    { id: "B", name: "Zone B - Dining",  category: "Dining Room",  traffic: 48, dwell: 58, revenue: 52, status: "warn",  density: 0.80, x: 46, y: 4,  w: 50, h: 32 },
    { id: "C", name: "Zone C - Patio",   category: "Outdoor Seating", traffic: 14, dwell: 64, revenue: 14, status: "good", density: 0.55, x: 4,  y: 28, w: 40, h: 34 },
    { id: "D", name: "Zone D - Kitchen", category: "Back of House", traffic: 4,  dwell: 0,  revenue: 6,  status: "warn",  density: 0.42, x: 4,  y: 64, w: 92, h: 32 },
  ],
  twinFloorAccuracy: 91.6,
  twinNotes: {
    A: "Bar wait time averaging 4.8 min vs 2.5 target. Pull 1 floor server to bar between 12–2pm.",
    B: "Dwell time within band - table turn rate is the bottleneck, not service speed.",
    D: "Ticket times trending up - KP support recommended after 19:00 on Fri/Sat.",
  },
  forecast7d: [
    { day: "Mon", predicted: 190, actual: 178, lower: 160, upper: 220 },
    { day: "Tue", predicted: 320, actual: 312, lower: 280, upper: 360 },
    { day: "Wed", predicted: 280, actual: 268, lower: 240, upper: 320 },
    { day: "Thu", predicted: 350, actual: 340, lower: 310, upper: 390 },
    { day: "Fri", predicted: 470, actual: 460, lower: 420, upper: 520 },
    { day: "Sat", predicted: 560, actual: null, lower: 500, upper: 620 },
    { day: "Sun", predicted: 420, actual: null, lower: 370, upper: 470 },
  ],
  hourlyHeatmap: makeHeatmap(70, ["Fri", "Sat", "Sun"]),
  revenueScatter: makeScatter(17.2, 400, 900, 28, 150, 600),
  forecastInsight: { headline: "Saturday is your busiest service of the month.", visitors: 560, deltaPct: 18, peakWindow: "Saturday peak window · 19:00–21:00 - 92 covers/hr",
    recs: ["Add 1 KP & 1 runner for Fri & Sat dinner", "Pre-batch top-3 starters at 18:30", "Hold 6 walk-in seats at the bar"] },
  staffSchedule: [
    { shift: "Prep (9–12)",      Mon: [2,2], Tue: [2,2], Wed: [2,2], Thu: [2,3], Fri: [3,3], Sat: [3,4], Sun: [2,2] },
    { shift: "Lunch (12–15)",    Mon: [4,3], Tue: [4,4], Wed: [4,4], Thu: [5,5], Fri: [5,6], Sat: [6,7], Sun: [5,5] },
    { shift: "Turn-down (15–17)", Mon: [2,2], Tue: [2,2], Wed: [2,2], Thu: [2,2], Fri: [3,3], Sat: [3,3], Sun: [3,3] },
    { shift: "Dinner (17–22)",   Mon: [4,3], Tue: [5,4], Wed: [5,4], Thu: [6,6], Fri: [7,8], Sat: [8,9], Sun: [6,6] },
  ],
  staffRecs: [
    { sev: "alert", title: "Friday 19:00–22:00 - Add 1 runner + 1 KP", body: "Predicted 142 covers. Protects ~£480 in tips & rebookings." },
    { sev: "warn",  title: "Monday lunch - Drop 1 server", body: "Historically the quietest service. Save ~£70." },
    { sev: "ok",    title: "Wednesday dinner - Optimal", body: "Brigade matches forecast. No action needed." },
    { sev: "warn",  title: "Saturday 12pm - Move 1 from prep to bar", body: "Bar wait time exceeds 4 min during pre-lunch rush." },
  ],
  staffCost: { current: 6840, optimised: 5980, savings: 860, effFrom: 68, effTo: 84 },
  inventory: [
    { sku: "TCH-IPA-04", cat: "Draught Beer", stock: 2,   days: 1,  demand: 14, reorder: true,  status: "urgent" },
    { sku: "TCH-WIN-12", cat: "Wine",          stock: 18,  days: 4,  demand: 9,  reorder: true,  status: "soon" },
    { sku: "TCH-FOO-21", cat: "Steaks",        stock: 14,  days: 1,  demand: 22, reorder: true,  status: "urgent" },
    { sku: "TCH-FOO-08", cat: "Burgers",       stock: 64,  days: 5,  demand: 28, reorder: false, status: "healthy" },
    { sku: "TCH-DES-03", cat: "Desserts",      stock: 22,  days: 7,  demand: 6,  reorder: false, status: "healthy" },
    { sku: "TCH-SPI-09", cat: "Spirits",       stock: 110, days: 45, demand: 3,  reorder: false, status: "overstock" },
    { sku: "TCH-NA-02",  cat: "Soft Drinks",   stock: 38,  days: 6,  demand: 14, reorder: false, status: "healthy" },
  ],
  inventoryTrend: makeInvTrend(180, 4, 18, 8),
  invKpis: { atRiskCount: 3, overstockValue: 740, topSkus: ["TCH-IPA-04", "TCH-FOO-21", "TCH-WIN-12"], reorders: 5, tableTitle: "Stock & 86 Risk", trendTitle: "30-day pour & plate volumes",
    insight: "Demand for Steaks is projected up 32% this weekend driven by Saturday bookings. Current stock runs out Friday service. Place a butcher order by Thursday 10am.",
    categoryPing: "Steaks" },
  recommendations: [
    { sev: "high", cat: "Staffing",   title: "Add 1 KP & 1 runner Fri 19:00–22:00",
      body: "Predicted 142 covers in the dinner window. Without support, ticket time pushes past 14 min - historically correlated with 18% reduction in tip percentage and a 6% drop in rebookings.",
      impact: "+£480 / week", confidence: 92, ago: "9 mins ago" },
    { sev: "high", cat: "Inventory",  title: "Reorder TCH-FOO-21 (Steaks) by Thursday 10am",
      body: "Weekend forecast shows steak orders up 32%. Current stock covers Friday lunch only. Butcher lead time 24h.",
      impact: "+£560 / week", confidence: 90, ago: "26 mins ago" },
    { sev: "med", cat: "Layout",      title: "Reseat patio to 2-tops on Sundays",
      body: "Patio Sunday turnover is 28% below average - 4-tops sit half-empty. 2-tops increase capacity by 18%.",
      impact: "+£240 / week", confidence: 81, ago: "1 hr ago" },
    { sev: "med", cat: "Scheduling",  title: "Drop 1 lunch server on Mondays",
      body: "Monday lunch covers consistently 35% below average. Brigade can absorb without ticket-time impact.",
      impact: "-£280 cost / mo", confidence: 84, ago: "2 hrs ago" },
    { sev: "low", cat: "Revenue",     title: "Run a Tuesday burger + pint promo",
      body: "Tuesday demand model shows soft midweek dip. Bundle promo historically lifts covers 14%.",
      impact: "+£210 / week", confidence: 73, ago: "5 hrs ago" },
    { sev: "high", cat: "Staffing",   title: "Cross-train 2 servers on bar",
      body: "Bar bottleneck recurs every Friday 12–2pm. Cross-training removes need for an extra hire.",
      impact: "+£260 / week", confidence: 87, ago: "Yesterday" },
  ],
  recsStats: { week: 12, applied: 8, revenue: 1860, confidence: 86 },
  alerts: [
    { sev: "alert", time: "19:42", title: "Kitchen ticket time exceeded 14 min - Fri dinner",
      body: "Ticket queue at 9 active; brigade running 1 short. Drink wait also rising.",
      action: "Pull 1 server to runner, flag KP support for next shift.", status: "Investigating" },
    { sev: "warn",  time: "12:18", title: "Bar wait time drifting above target",
      body: "Avg 4.8 min vs 2.5 target. 84 open tabs.",
      action: "Move 1 floor server to bar.", status: "Open" },
    { sev: "warn",  time: "11:30", title: "Patio occupancy 92% with low turnover",
      body: "Turn rate 3 tables/hr vs 4.2 baseline - group lingering on bottomless brunch.",
      action: "Time-cap brunch sittings to 90 min next weekend.", status: "Open" },
    { sev: "ok",    time: "10:00", title: "Friday forecast model retrained",
      body: "Confidence improved from 86% → 90%.",
      action: "No action required.", status: "Resolved" },
    { sev: "alert", time: "09:12", title: "IPA keg TCH-IPA-04 below safety threshold",
      body: "2 kegs left; weekend pour forecast 14.",
      action: "Trigger urgent draught order.", status: "Open" },
  ],
  integrations: [
    { name: "Toast POS",           status: "connected", sync: "4 min ago",  note: "Tabs, menu items, table state - syncing every 5 mins", points: "84 open tabs · £18.40 avg" },
    { name: "OpenTable",           status: "connected", sync: "6 min ago",  note: "Bookings, no-shows, party size", points: "142 covers booked tonight" },
    { name: "Cisco Meraki WiFi",   status: "connected", sync: "12 min ago", note: "Patio & dining footfall detection", points: "312 unique guests today" },
    { name: "CCTV Metadata API",   status: "connected", sync: "2 min ago",  note: "Queue & dwell at bar - no video stored", points: "Metadata only - GDPR safe" },
    { name: "Lightspeed K-Series", status: "available", sync: "-", note: "Click to connect", points: "" },
    { name: "Deputy (Workforce)",  status: "available", sync: "-", note: "Click to connect", points: "" },
    { name: "Xero (Accounting)",   status: "available", sync: "-", note: "Click to connect", points: "" },
    { name: "Salesforce",          status: "available", sync: "-", note: "Guest CRM - repeat diners, complaints, comps", points: "" },
  ],
};

// ============================================================
// WAREHOUSE - Apex Logistics
// ============================================================
const warehouse: Dataset = {
  kpis: {
    footfall: { value: 8420, delta: 7, label: "parcels vs Tuesday avg", title: "Parcels Processed", sub: "↑ 7% vs Tuesday avg" },
    revenue:  { value: 22600, status: "On track", title: "Throughput Value (£)" },
    efficiency: { value: 81, delta: 3 },
    alerts: { value: 4, sub: "1 dock congestion · 3 pick errors" },
  },
  topRec: { title: "Reassign 3 pickers from Storage B to Sortation 14:00–16:00",
    body: "Inbound truck arrival creates a 38% throughput dip in Sortation. Reallocating from low-utilisation Storage B clears the backlog before outbound cut-off.",
    impact: "Saves ~£610 in late-dispatch penalties" },
  weeklyPerformance: [
    { day: "Mon", footfall: 7600,  revenue: 19400, staffCost: 2100 },
    { day: "Tue", footfall: 8420,  revenue: 22600, staffCost: 2240 },
    { day: "Wed", footfall: 8100,  revenue: 21800, staffCost: 2180 },
    { day: "Thu", footfall: 9200,  revenue: 24800, staffCost: 2380 },
    { day: "Fri", footfall: 11400, revenue: 31000, staffCost: 2820 },
    { day: "Sat", footfall: 6200,  revenue: 16800, staffCost: 1740 },
    { day: "Sun", footfall: 3100,  revenue: 8400,  staffCost: 1120 },
  ],
  liveFeed: [
    { time: "12:04 PM", level: "warn",  text: "Inbound Dock 2 at 91% capacity - 3 trailers queued" },
    { time: "11:50 AM", level: "ok",    text: "Manhattan WMS sync - 4,210 parcels picked today" },
    { time: "11:30 AM", level: "alert", text: "Pick-rate in Storage A dropped 18% - possible aisle congestion" },
    { time: "11:00 AM", level: "ok",    text: "Friday surge model updated - confidence 93%" },
    { time: "10:42 AM", level: "ok",    text: "RFID gate live - 1,840 units scanned this hour" },
    { time: "10:15 AM", level: "warn",  text: "Outbound cut-off risk - 142 parcels behind schedule" },
  ],
  zones: [
    { id: "A", name: "Zone A - Inbound Dock",  category: "Receiving",  traffic: 22, dwell: 18,  revenue: 12, status: "warn",  density: 0.86, x: 4,  y: 4,  w: 30, h: 18 },
    { id: "B", name: "Zone B - Sortation",     category: "Cross-dock", traffic: 38, dwell: 6,   revenue: 44, status: "alert", density: 0.94, x: 4,  y: 24, w: 60, h: 38 },
    { id: "C", name: "Zone C - Outbound Dock", category: "Dispatch",   traffic: 28, dwell: 4,   revenue: 38, status: "warn",  density: 0.72, x: 66, y: 24, w: 30, h: 38 },
    { id: "D", name: "Zone D - Storage A/B",   category: "Bulk Storage", traffic: 12, dwell: 92, revenue: 6,  status: "good",  density: 0.34, x: 4,  y: 64, w: 92, h: 32 },
  ],
  twinFloorAccuracy: 96.1,
  twinNotes: {
    B: "Sortation throughput 18% below model. Aisle congestion likely - re-route MHE for 30 min and reassess.",
    A: "Trailer queue at 3 - dock door 2 idle. Reassign 1 banksman to balance load.",
    C: "On track for 16:30 cut-off if pick-rate holds; flag a re-check at 15:00.",
  },
  forecast7d: [
    { day: "Mon", predicted: 7800,  actual: 7600,  lower: 7000,  upper: 8600 },
    { day: "Tue", predicted: 8500,  actual: 8420,  lower: 7800,  upper: 9200 },
    { day: "Wed", predicted: 8200,  actual: 8100,  lower: 7400,  upper: 9000 },
    { day: "Thu", predicted: 9400,  actual: 9200,  lower: 8500,  upper: 10300 },
    { day: "Fri", predicted: 11500, actual: 11400, lower: 10400, upper: 12600 },
    { day: "Sat", predicted: 6400,  actual: null,  lower: 5800,  upper: 7000 },
    { day: "Sun", predicted: 3200,  actual: null,  lower: 2800,  upper: 3600 },
  ],
  hourlyHeatmap: makeHeatmap(1200, ["Thu", "Fri"]),
  revenueScatter: makeScatter(2.6, 200, 4000, 28, 4000, 12000),
  forecastInsight: { headline: "Friday will be the highest-throughput day this month.", visitors: 11500, deltaPct: 21, peakWindow: "Friday peak window · 13:00–17:00 - 1,840 parcels/hr",
    recs: ["Pre-stage all priority lanes by 11:00 Friday", "Add 4 pickers to Sortation 13:00–17:00", "Hold 2 standby trailers for overflow dispatch"] },
  staffSchedule: [
    { shift: "Inbound (06–10)",  Mon: [6,6], Tue: [6,6], Wed: [6,6], Thu: [7,7], Fri: [8,8], Sat: [4,4], Sun: [2,2] },
    { shift: "Sortation (10–14)", Mon: [10,10], Tue: [10,11], Wed: [10,10], Thu: [11,12], Fri: [12,14], Sat: [6,7], Sun: [3,3] },
    { shift: "Pick & Pack (14–18)", Mon: [12,11], Tue: [12,12], Wed: [12,12], Thu: [13,14], Fri: [14,16], Sat: [7,7], Sun: [4,4] },
    { shift: "Outbound (18–22)", Mon: [6,6], Tue: [6,6], Wed: [6,6], Thu: [7,7], Fri: [8,9], Sat: [4,4], Sun: [2,2] },
  ],
  staffRoster: [
    { name: "Darren Wallace", role: "Shift Supervisor", days: { Mon:{start:"06:00",end:"14:30",overtime:0.5}, Tue:{start:"06:00",end:"14:00",overtime:0}, Wed:{start:"06:00",end:"15:00",overtime:1}, Thu:{start:"06:00",end:"15:30",overtime:1.5}, Fri:{start:"06:00",end:"16:00",overtime:2}, Sat:null, Sun:null } },
    { name: "Aiyana Bello",   role: "MHE Operator",     days: { Mon:{start:"06:00",end:"14:00",overtime:0}, Tue:{start:"06:00",end:"15:00",overtime:1}, Wed:null, Thu:{start:"10:00",end:"19:00",overtime:1}, Fri:{start:"10:00",end:"20:00",overtime:2}, Sat:{start:"08:00",end:"14:00",overtime:0}, Sun:null } },
    { name: "Marcin Kowal",   role: "Picker",           days: { Mon:{start:"10:00",end:"18:00",overtime:0}, Tue:{start:"10:00",end:"18:30",overtime:0.5}, Wed:{start:"10:00",end:"18:00",overtime:0}, Thu:{start:"10:00",end:"19:00",overtime:1}, Fri:{start:"10:00",end:"20:30",overtime:2.5}, Sat:{start:"10:00",end:"16:00",overtime:0}, Sun:{start:"10:00",end:"15:00",overtime:0} } },
    { name: "Lana Adebayo",   role: "Sortation Lead",   days: { Mon:{start:"10:00",end:"18:00",overtime:0}, Tue:null, Wed:{start:"10:00",end:"19:00",overtime:1}, Thu:{start:"10:00",end:"19:00",overtime:1}, Fri:{start:"10:00",end:"20:00",overtime:2}, Sat:{start:"10:00",end:"15:00",overtime:0}, Sun:null } },
    { name: "Hiro Takeda",    role: "Outbound Banksman", days: { Mon:{start:"14:00",end:"22:00",overtime:0}, Tue:{start:"14:00",end:"22:00",overtime:0}, Wed:{start:"14:00",end:"22:30",overtime:0.5}, Thu:{start:"14:00",end:"22:00",overtime:0}, Fri:{start:"14:00",end:"23:00",overtime:1}, Sat:{start:"14:00",end:"20:00",overtime:0}, Sun:{start:"14:00",end:"19:00",overtime:0} } },
    { name: "Grace Mwangi",   role: "Inbound Coord.",   days: { Mon:{start:"06:00",end:"14:00",overtime:0}, Tue:{start:"06:00",end:"14:00",overtime:0}, Wed:{start:"06:00",end:"15:00",overtime:1}, Thu:{start:"06:00",end:"14:00",overtime:0}, Fri:{start:"06:00",end:"15:30",overtime:1.5}, Sat:null, Sun:null } },
  ],

  staffRecs: [
    { sev: "alert", title: "Friday 13:00–17:00 - Add 2 pickers", body: "Predicted peak surge. Avoids ~£860 in late-dispatch penalties." },
    { sev: "warn",  title: "Sunday Sortation - Reduce by 1", body: "Volumes 60% below weekday baseline. Save ~£140." },
    { sev: "ok",    title: "Wednesday Pick & Pack - Optimal", body: "Matches model. No action needed." },
    { sev: "warn",  title: "Thursday 14:00 - Shift 2 from Storage to Sortation", body: "Cross-dock backlog building." },
  ],
  staffCost: { current: 14600, optimised: 13200, savings: 1400, effFrom: 81, effTo: 90 },
  inventory: [
    { sku: "APX-PAL-118", cat: "Pallets - Electronics", stock: 48,  days: 2,  demand: 22, reorder: true,  status: "urgent" },
    { sku: "APX-PAL-204", cat: "Pallets - Apparel",     stock: 132, days: 6,  demand: 24, reorder: false, status: "healthy" },
    { sku: "APX-CON-091", cat: "Consumables - Tape",    stock: 18,  days: 3,  demand: 6,  reorder: true,  status: "soon" },
    { sku: "APX-PAL-077", cat: "Pallets - Returns",     stock: 6,   days: 1,  demand: 14, reorder: true,  status: "urgent" },
    { sku: "APX-CON-014", cat: "Consumables - Boxes",   stock: 480, days: 12, demand: 38, reorder: false, status: "healthy" },
    { sku: "APX-PAL-302", cat: "Pallets - Seasonal",    stock: 940, days: 80, demand: 12, reorder: false, status: "overstock" },
    { sku: "APX-PAL-145", cat: "Pallets - Grocery",     stock: 60,  days: 4,  demand: 18, reorder: true,  status: "soon" },
  ],
  inventoryTrend: makeInvTrend(900, 22, 220, 60),
  invKpis: { atRiskCount: 4, overstockValue: 11800, topSkus: ["APX-PAL-118", "APX-PAL-077", "APX-CON-091"], reorders: 6, tableTitle: "Pallet & Consumable Forecast", trendTitle: "30-day stock vs throughput",
    insight: "Friday surge drives Electronics pallets demand up 26%. Current stock covers Thursday only. Trigger inbound reorder against supplier APX-EL by Wednesday EOD.",
    categoryPing: "Electronics pallets" },
  recommendations: [
    { sev: "high", cat: "Staffing", title: "Reassign 3 pickers to Sortation Fri 13:00–17:00",
      body: "Model predicts 1,840 parcels/hr in the Friday surge. Without rebalancing, cut-off slips by 38 minutes and 142 parcels miss dispatch - penalty exposure ~£860.",
      impact: "+£860 / week", confidence: 93, ago: "8 mins ago" },
    { sev: "high", cat: "Inventory", title: "Trigger inbound for APX-PAL-118 (Electronics) by Wed EOD",
      body: "Friday surge consumes current stock by Thursday close. Supplier lead time 2 days; missing it forces split dispatches.",
      impact: "+£1,240 / week", confidence: 91, ago: "28 mins ago" },
    { sev: "med", cat: "Layout", title: "Re-slot fast-movers to Pick Face B-12 to B-18",
      body: "Travel time analysis shows top-20 SKUs walked 38% further than necessary. Re-slotting saves 1.2 min/pick avg.",
      impact: "+£420 / week", confidence: 84, ago: "1 hr ago" },
    { sev: "med", cat: "Scheduling", title: "Reduce Sunday Sortation crew by 1",
      body: "Sunday parcel volume runs 60% below weekday baseline. Crew can absorb without throughput impact.",
      impact: "-£560 cost / mo", confidence: 88, ago: "2 hrs ago" },
    { sev: "low", cat: "Revenue", title: "Open Saturday inbound window (trial)",
      body: "Carrier survey shows demand for Saturday inbound slots. Trial 2 weeks against existing dock capacity.",
      impact: "+£640 / week", confidence: 74, ago: "5 hrs ago" },
    { sev: "high", cat: "Staffing", title: "Cross-train 3 storage staff on MHE",
      body: "Surge bottlenecks recur weekly. Cross-training removes need for agency cover.",
      impact: "+£520 / week", confidence: 89, ago: "Yesterday" },
  ],
  recsStats: { week: 18, applied: 12, revenue: 5240, confidence: 90 },
  alerts: [
    { sev: "alert", time: "14:15", title: "Sortation throughput 18% below model",
      body: "Pick-rate slowed at 14:08. Aisle congestion suspected near pick face B-14.",
      action: "Re-route MHE for 30 min; reassess at 14:45.", status: "Investigating" },
    { sev: "warn",  time: "12:04", title: "Inbound Dock 2 at 91% capacity",
      body: "3 trailers queued; dwell rising past 18 min.",
      action: "Reassign 1 banksman; open dock door 5 for overflow.", status: "Open" },
    { sev: "warn",  time: "11:30", title: "Outbound cut-off risk - 142 parcels behind schedule",
      body: "At current pick-rate, 16:30 cut-off slips by ~22 min.",
      action: "Shift 2 pickers from Storage A to Pick & Pack.", status: "Open" },
    { sev: "ok",    time: "10:00", title: "Friday surge model retrained",
      body: "Confidence improved from 90% → 93%.",
      action: "No action required.", status: "Resolved" },
    { sev: "alert", time: "09:12", title: "Pallet anomaly - APX-PAL-077 below safety threshold",
      body: "Only 6 pallets; predicted demand 14 over next 24h.",
      action: "Trigger urgent inbound order.", status: "Open" },
  ],
  integrations: [
    { name: "Manhattan WMS",       status: "connected", sync: "3 min ago",  note: "Pick, pack & dispatch events - syncing in near real-time", points: "4,210 parcels picked today" },
    { name: "SAP S/4HANA",         status: "connected", sync: "7 min ago",  note: "Inbound orders, supplier scheduling", points: "38 inbound orders this week" },
    { name: "Zebra RFID Gateway",  status: "connected", sync: "1 min ago",  note: "Gate scans & MHE telemetry", points: "1,840 scans this hour" },
    { name: "CCTV Metadata API",   status: "connected", sync: "2 min ago",  note: "Aisle congestion & dwell - no video stored", points: "Metadata only - GDPR safe" },
    { name: "Korber WMS",          status: "available", sync: "-", note: "Click to connect", points: "" },
    { name: "Deputy (Workforce)",  status: "available", sync: "-", note: "Click to connect", points: "" },
    { name: "Xero (Accounting)",   status: "available", sync: "-", note: "Click to connect", points: "" },
    { name: "Salesforce",          status: "available", sync: "-", note: "Carrier & customer accounts - SLAs, claims, opportunities", points: "" },
  ],
};

export const datasets: Record<string, Dataset> = {
  fielding: retail,
  corner: hospitality,
  apex: warehouse,
};

// ---------- React context
type Ctx = { business: Business; data: Dataset; setBusinessId: (id: string) => void };
export const BusinessContext = createContext<Ctx | null>(null);

export function useBusiness(): Ctx {
  const c = useContext(BusinessContext);
  if (!c) throw new Error("useBusiness must be used within BusinessProvider");
  return c;
}
