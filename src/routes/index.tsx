import { createFileRoute } from "@tanstack/react-router";
import TwinIQLanding from "@/components/twiniq/TwinIQLanding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TwinIQ — Operational Intelligence for SMEs · by Axis31" },
      {
        name: "description",
        content:
          "TwinIQ creates a living digital replica of your business — using the data you already own. Join the waitlist for early access and 2 months free.",
      },
      { property: "og:title", content: "TwinIQ — Operational Intelligence for SMEs" },
      {
        property: "og:description",
        content:
          "AI-powered, hardware-free, live in 48 hours. Join the TwinIQ waitlist for early access and 2 months free at launch.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return <TwinIQLanding />;
}
