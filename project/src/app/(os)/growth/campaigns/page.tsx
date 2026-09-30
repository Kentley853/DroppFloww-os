"use client"

import { toast } from "sonner"
import { PageHeader, Surface } from "@/components/blocks"
import { money, useGrowthView } from "@/components/growth/kit"
import { Button } from "@/components/ui/button"

export default function CampaignsPage() {
  const { profile, store } = useGrowthView()
  return (
    <div>
      <PageHeader title="Campaigns" description="The campaign agent recommends. It does not change a budget." />
      <div className="space-y-4">
        {profile.campaignWatch.map((campaign) => (
          <Surface key={campaign.id} className="p-5">
            <h2 className="text-lg font-semibold">{campaign.name}</h2>
            <p className="mt-2 text-sm">Spent {money(campaign.spend)} in the current view.</p>
            <p className="mt-2 text-sm leading-6">{campaign.leadMove} {campaign.qualityMove}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{campaign.note}</p>
            <p className="mt-3 text-sm leading-6">{campaign.recommendation}</p>
            <div className="mt-2 text-[13px] text-muted-foreground">Based on: campaign data for this demo company. Not a live ad account.</div>
            <Button className="mt-4" onClick={() => {
              store.addExtraApproval({
                id: `ap-${campaign.id}-${Date.now()}`,
                agentId: "campaign",
                action: `Adjust budget on ${campaign.name}`,
                reason: campaign.recommendation,
                impact: "A recommendation only. No ad account is connected.",
                risk: "Medium",
                requestedAt: "Just now",
                facts: [{ label: "Spend", value: money(campaign.spend) }, { label: "Quality", value: campaign.qualityMove }],
              })
              toast.success("Sent to Approvals. Budget is unchanged.")
            }}>Send recommendation for approval</Button>
          </Surface>
        ))}
      </div>
    </div>
  )
}
