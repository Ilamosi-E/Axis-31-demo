import { createFileRoute } from "@tanstack/react-router";
import { Card, Badge, PageHeader } from "@/components/ui-bits";
import { useBusiness } from "@/lib/twiniq-data";
import { Plus, Plug } from "lucide-react";

export const Route = createFileRoute("/_dash/integrations")({
  head: () => ({ meta: [{ title: "Integrations - TwinIQ" }] }),
  component: IntPage,
});

function IntPage() {
  const { integrations } = useBusiness().data;
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader title="Connected Data Sources" subtitle="POS, WiFi, CCTV metadata, workforce" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((i) => {
          const connected = i.status === "connected";
          return (
            <Card key={i.name} className={connected ? "" : "border-dashed"}>
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-md grid place-items-center ${connected ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  {connected ? <Plug className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold tracking-tight">{i.name}</h3>
                    {connected ? <Badge tone="ok">Connected</Badge> : <Badge>Available</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{i.note}</p>
                  {connected && (
                    <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Last sync: {i.sync}</span>
                      <span className="text-primary">{i.points}</span>
                    </div>
                  )}
                  {!connected && (
                    <button className="mt-3 text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground">Connect</button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 border-primary/20">
        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">GDPR compliant by design.</strong> TwinIQ processes only anonymised, aggregated metadata. No personal data is stored or transmitted. We use a federated learning methodology, your raw data never leaves your premises.
        </div>
      </Card>
    </div>
  );
}
