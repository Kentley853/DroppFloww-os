"use client"

import { PageHeader, Surface } from "@/components/blocks"
import { useGrowthView } from "@/components/growth/kit"

export default function GrowthAnalyticsPage() {
  const { profile } = useGrowthView()
  const best = [...profile.channels].sort((a, b) => b.conversion - a.conversion)[0]
  return (
    <div>
      <PageHeader title="Growth analytics" description="The numbers on this page are the same ones as the overview, the funnel, and the channel table." />
      <div className="grid gap-3 md:grid-cols-3">
        {profile.metrics.slice(0, 6).map((metric) => (
          <Surface key={metric.id} className="p-4">
            <div className="text-[13px] text-muted-foreground">{metric.label}</div>
            <div className="mt-1 text-[24px] font-semibold">{metric.display}</div>
          </Surface>
        ))}
      </div>
      <Surface className="mt-6 p-5">
        <h2 className="text-lg font-semibold">What to read first</h2>
        <p className="mt-2 text-sm leading-6">{profile.marketingNote}</p>
        <p className="mt-2 text-sm leading-6">Best conversion in this set: {best?.name} at {best?.conversion}%.</p>
        <p className="mt-2 text-sm leading-6">{profile.pipelineNote}</p>
      </Surface>
    </div>
  )
}
