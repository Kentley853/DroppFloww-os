"use client"

import { PageHeader, Surface } from "@/components/blocks"
import { money, useGrowthView } from "@/components/growth/kit"
import { RevenueChart } from "@/components/revenue-chart"

export default function GrowthMarketingPage() {
  const { profile, store } = useGrowthView()
  const spend = profile.channels.reduce((sum, channel) => sum + channel.spend, 0)
  const leads = profile.channels.reduce((sum, channel) => sum + channel.leads, 0)
  const qualified = profile.channels.reduce((sum, channel) => sum + channel.qualified, 0)
  const meetings = profile.channels.reduce((sum, channel) => sum + channel.meetings, 0)
  const revenue = profile.channels.reduce((sum, channel) => sum + channel.revenue, 0)
  return (
    <div>
      <PageHeader title="Marketing" description={profile.marketingNote} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Tile label="Spend" value={money(spend)} />
        <Tile label="Leads" value={String(leads)} />
        <Tile label="Cost per lead" value={leads ? money(Math.round(spend / leads)) : "—"} />
        <Tile label="Cost per qualified lead" value={qualified ? money(Math.round(spend / qualified)) : "—"} />
        <Tile label="Meetings" value={String(meetings)} />
        <Tile label="Revenue attributed" value={money(revenue)} />
        <Tile label="Return on spend" value={spend ? `${(revenue / spend).toFixed(1)}x` : "—"} />
        <Tile label="Lead-to-meeting" value={profile.metrics.find((item) => item.id === "conversion")?.display ?? "—"} />
      </div>
      <p className="mt-3 text-[13px] text-muted-foreground">Channel totals match this month’s lead count of {profile.metrics.find((item) => item.id === "leads")?.display}. Attributed revenue is pipeline influenced, not collected cash.</p>
      <Surface className="mt-6 overflow-hidden">
        <table className="hidden w-full text-sm md:table">
          <thead><tr className="border-b text-left text-[13px] text-muted-foreground">{["Channel", "Spend", "Leads", "Qualified", "Meetings", "Conversion"].map((header) => <th key={header} className="px-4 py-3 font-medium">{header}</th>)}</tr></thead>
          <tbody>
            {profile.channels.map((channel) => (
              <tr key={channel.name} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{channel.name}</td>
                <td className="px-4 py-3 tabular-nums">{money(channel.spend)}</td>
                <td className="px-4 py-3 tabular-nums">{channel.leads}</td>
                <td className="px-4 py-3 tabular-nums">{channel.qualified}</td>
                <td className="px-4 py-3 tabular-nums">{channel.meetings}</td>
                <td className="px-4 py-3 tabular-nums">{channel.conversion}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="space-y-3 p-3 md:hidden">
          {profile.channels.map((channel) => (
            <div key={channel.name} className="rounded-lg border p-3 text-sm">
              <div className="font-medium">{channel.name}</div>
              <div className="mt-1 text-muted-foreground">{channel.leads} leads · {channel.meetings} meetings · {channel.conversion}%</div>
            </div>
          ))}
        </div>
      </Surface>
      <Surface className="mt-6 p-5">
        <h2 className="text-lg font-semibold">Journey · {profile.journey.company}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{profile.journey.value}</p>
        <ol className="mt-4 space-y-2">
          {profile.journey.steps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm"><span className="w-6 text-muted-foreground">{index + 1}</span>{step}</li>
          ))}
        </ol>
      </Surface>
      <Surface className="mt-6 p-5">
        <h2 className="text-lg font-semibold">Revenue and collections</h2>
        <p className="mb-3 text-[13px] text-muted-foreground">Operating revenue, so marketing is not read on its own.</p>
        <RevenueChart data={store.company.series} />
      </Surface>
    </div>
  )
}

function Tile({ label, value }: { label: string; value: string }) {
  return <Surface className="p-4"><div className="text-[13px] text-muted-foreground">{label}</div><div className="mt-1 text-[22px] font-semibold tabular-nums">{value}</div></Surface>
}
