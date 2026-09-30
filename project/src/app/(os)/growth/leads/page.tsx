"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { PageHeader, Surface } from "@/components/blocks"
import { money, useGrowthView } from "@/components/growth/kit"
import { Button } from "@/components/ui/button"
import { getGrowth } from "@/data/growth"

export default function LeadGenerationPage() {
  const { profile, overlay, store, leads } = useGrowthView()
  const [filters, setFilters] = useState({ industry: "All", location: "All", score: "All" })
  const [icpOpen, setIcpOpen] = useState(false)
  const [draft, setDraft] = useState(profile.icp)
  const icp = overlay.icp ?? profile.icp
  const rows = useMemo(() => {
    const pool = [...profile.prospects, ...leads]
    return pool.filter((lead) => {
      if (filters.industry !== "All" && lead.industry !== filters.industry) return false
      if (filters.location !== "All" && !lead.location.includes(filters.location)) return false
      if (filters.score === "80+" && lead.score < 80) return false
      return true
    })
  }, [profile.prospects, leads, filters])
  const industries = ["All", ...Array.from(new Set([...profile.prospects, ...leads].map((lead) => lead.industry).filter((item) => item && item !== "—")))]

  return (
    <div>
      <PageHeader title="Lead generation" description="Prospect discovery in this prototype is simulated. Nothing here has been contacted, and the list is not a live data source." />
      <Surface className="mb-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Ideal customer profile</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{icp.industries}. {icp.size}. {icp.locations}. Buyers: {icp.buyers}.</p>
          </div>
          <Button variant="outline" onClick={() => { setDraft(icp); setIcpOpen((value) => !value) }}>{icpOpen ? "Close" : "Edit profile"}</Button>
        </div>
        {icpOpen ? (
          <form
            className="mt-4 grid gap-3 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault()
              store.patchGrowth({ icp: draft })
              toast.success("Profile saved for this demo company")
              setIcpOpen(false)
            }}
          >
            {([
              ["industries", "Industries you serve"],
              ["size", "Company size"],
              ["locations", "Locations"],
              ["buyers", "Decision makers"],
              ["problems", "Problems you solve"],
              ["value", "Typical contract value"],
              ["badFit", "A bad fit"],
            ] as const).map(([key, label]) => (
              <label key={key} className="text-sm md:col-span-2">
                <span className="mb-1 block text-[13px] text-muted-foreground">{label}</span>
                <input className="h-9 w-full rounded-lg border bg-background px-3 text-sm" value={draft[key]} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} />
              </label>
            ))}
            <Button type="submit">Save profile</Button>
          </form>
        ) : null}
      </Surface>
      <div className="mb-3 flex flex-wrap gap-2">
        <select className="h-9 rounded-lg border bg-card px-2 text-sm" value={filters.industry} onChange={(event) => setFilters((current) => ({ ...current, industry: event.target.value }))}>
          {industries.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="h-9 rounded-lg border bg-card px-2 text-sm" value={filters.location} onChange={(event) => setFilters((current) => ({ ...current, location: event.target.value }))}>
          {["All", "Jakarta", "Bekasi", "Tangerang", "Bandung"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="h-9 rounded-lg border bg-card px-2 text-sm" value={filters.score} onChange={(event) => setFilters((current) => ({ ...current, score: event.target.value }))}>
          <option value="All">Any score</option>
          <option value="80+">Score 80+</option>
        </select>
      </div>
      <div className="grid gap-3">
        {rows.map((lead) => (
          <Surface key={lead.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[12px] text-muted-foreground">Simulated prospect · score {lead.score}</div>
                <h2 className="text-lg font-semibold">{lead.company}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{lead.industry} · {lead.employees} people · {lead.location} · {lead.title}</p>
              </div>
              <div className="text-right text-sm">{lead.source}</div>
            </div>
            <p className="mt-3 text-sm leading-6">{lead.fitReason}</p>
            <div className="mt-3 text-[13px] text-muted-foreground">Based on: the ideal customer profile for this demo, not a live database.</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.message(lead.fitReason)}>Research</Button>
              <Button size="sm" onClick={() => { store.addDeal({ id: `deal-${lead.id}`, company: lead.company, value: 50_000_000, owner: store.company.people[0] ?? "Alex", days: 0, last: "Just now", stage: "new", insight: lead.fitReason, source: "Demo prospecting", basis: ["Added from simulated prospecting", "Not contacted"] }); store.addActivity(`added ${lead.company} to the pipeline from simulated prospecting.`, "Growth", "Lead Generation Agent"); toast.success("Added to pipeline") }}>Add to pipeline</Button>
              <Button size="sm" variant="outline" onClick={() => toast.message(`Draft, not sent: ${outreach(lead.company, profile)}`)}>Draft outreach</Button>
              <Button size="sm" variant="outline" onClick={() => { store.addActivity(`assigned ${store.company.people[0]} to research ${lead.company}.`, "Growth"); toast.success("Assigned") }}>Assign</Button>
            </div>
          </Surface>
        ))}
        {rows.length === 0 ? <Surface className="p-8 text-sm text-muted-foreground">No simulated prospects match these filters.</Surface> : null}
      </div>
    </div>
  )
}

function outreach(company: string, profile: ReturnType<typeof getGrowth>) {
  return `Curious whether ${company} is losing time on ${profile.pain}. We help teams with ${profile.offer}. Worth a short look?`
}
