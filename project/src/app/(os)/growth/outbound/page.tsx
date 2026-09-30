"use client"

import { useState } from "react"
import { toast } from "sonner"
import { PageHeader, Surface } from "@/components/blocks"
import { useGrowthView } from "@/components/growth/kit"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const styles = ["Direct", "Consultative", "Short", "Warm", "Executive"] as const

export default function OutboundPage() {
  const { profile, overlay, store } = useGrowthView()
  const [form, setForm] = useState({ name: "Jakarta operations leaders", audience: profile.icp.buyers, industry: profile.icp.industries, location: profile.icp.locations, role: "Operations Director", offer: profile.offer, pain: profile.pain, cta: "Worth a 20-minute look this week?", channel: "Email" })
  const [style, setStyle] = useState<(typeof styles)[number]>("Direct")
  const [draft, setDraft] = useState("")
  const [version, setVersion] = useState(0)

  function write(nextStyle = style, nextVersion = version) {
    const company = profile.leads[0]?.company ?? "the team"
    const base = {
      Direct: `Curious if ${company} could take on more work without adding coordinators.\n\nWe help teams with ${form.pain}, so the operations lead spends less time chasing updates.\n\n${form.cta}`,
      Consultative: `A pattern we see with ${form.industry.toLowerCase()} teams in ${form.location}: the work is not the problem. Finding the latest status is.\n\nIf that is true for ${company}, ${form.offer} is the piece we would look at first.\n\n${form.cta}`,
      Short: `${company} — if customer updates are still a person-by-person job, I can show the shorter version.\n\n${form.cta}`,
      Warm: `I was looking at how ${form.role.toLowerCase()}s in ${form.location} handle ${form.pain}.\n\nHappy to share what similar teams changed, with no deck.\n\n${form.cta}`,
      Executive: `${form.role}s usually feel ${form.pain} before it shows up in the numbers.\n\n${form.offer}. I can keep it to twenty minutes.\n\n${form.cta}`,
    }
    let text = base[nextStyle]
    if (nextVersion % 3 === 1) text = text.split("\n").slice(0, 2).join("\n")
    if (nextVersion % 3 === 2) text = text.replace("Curious if", "One question:").replace("A pattern we see", "What we keep hearing")
    setDraft(text)
  }

  return (
    <div>
      <PageHeader title="Outbound" description="Campaigns are prepared here. Nothing is sent unless you approve it, and this prototype has no live email or WhatsApp connection." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Surface className="p-5">
          <h2 className="text-lg font-semibold">New campaign</h2>
          <div className="mt-4 grid gap-3">
            {(["name", "audience", "industry", "location", "role", "offer", "pain", "cta"] as const).map((key) => (
              <label key={key} className="text-sm capitalize">
                <span className="mb-1 block text-[13px] text-muted-foreground">{key}</span>
                <Input className="h-9" value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} />
              </label>
            ))}
            <label className="text-sm">
              <span className="mb-1 block text-[13px] text-muted-foreground">Channel</span>
              <select className="h-9 w-full rounded-lg border bg-background px-2" value={form.channel} onChange={(event) => setForm((current) => ({ ...current, channel: event.target.value }))}>
                {["Email", "LinkedIn", "WhatsApp", "Phone"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <Button onClick={() => { store.addActivity(`saved the outbound campaign “${form.name}”. It has not been sent.`, "Growth"); toast.success("Campaign saved. Not sent.") }}>Save campaign</Button>
          </div>
        </Surface>
        <div className="space-y-4">
          {profile.outbound.length === 0 ? <Surface className="p-5 text-sm text-muted-foreground">No outbound campaign is running for this company. You can save one on the left. It will stay a draft.</Surface> : profile.outbound.map((campaign) => (
            <Surface key={campaign.id} className="p-5">
              <h2 className="text-lg font-semibold">{campaign.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{campaign.audience} · {campaign.channel}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <Stat label="Prospects" value={campaign.prospects} />
                <Stat label="Sent" value={campaign.sent} />
                <Stat label="Replies" value={campaign.replies} />
                <Stat label="Positive" value={campaign.positive} />
                <Stat label="Meetings" value={campaign.meetings} />
                <Stat label="Unsubscribed" value={campaign.unsubscribed} />
              </div>
              <ol className="mt-4 space-y-2 text-sm">
                {campaign.timeline.map((item) => <li key={item}>{item}</li>)}
              </ol>
            </Surface>
          ))}
          <Surface className="p-5">
            <h2 className="text-lg font-semibold">Sequence</h2>
            <p className="mt-1 text-sm text-muted-foreground">Steps are edited locally. They do not send.</p>
            <ol className="mt-4 space-y-4">
              {profile.sequence.map((step) => (
                <li key={step.day}>
                  <div className="text-sm font-medium">{step.day} · {step.title}</div>
                  <Textarea className="mt-2 min-h-16" value={overlay.sequenceNotes[step.day] ?? step.body} onChange={(event) => store.patchGrowth({ sequenceNotes: { ...overlay.sequenceNotes, [step.day]: event.target.value } })} />
                </li>
              ))}
            </ol>
          </Surface>
        </div>
      </div>
      <Surface className="mt-6 p-5">
        <h2 className="text-lg font-semibold">Personalized draft</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {styles.map((item) => (
            <button key={item} className={`rounded-full border px-3 py-1 text-[13px] ${style === item ? "bg-brand-soft text-brand" : ""}`} onClick={() => { setStyle(item); write(item, version) }}>{item}</button>
          ))}
        </div>
        <Textarea className="mt-3 min-h-32" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Choose a style to draft a note." />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => { const next = version + 1; setVersion(next); write(style, next) }}>Regenerate</Button>
          <Button size="sm" variant="outline" onClick={() => setDraft((value) => value.split("\n\n")[0] ?? value)}>Shorten</Button>
          <Button size="sm" variant="outline" onClick={() => setDraft((value) => value.replace("I can", "Happy to").replace("We help", "The useful part is"))}>Make more human</Button>
          <Button size="sm" variant="outline" onClick={() => setForm((current) => ({ ...current, cta: "Should I send two times that work this week?" }))}>Change CTA</Button>
          <Button size="sm" onClick={() => { if (!draft.trim()) { toast.error("Write a draft first"); return } store.patchGrowth({ approvedDrafts: [...overlay.approvedDrafts, draft] }); toast.success("Approved as a draft. Not sent.") }}>Approve</Button>
        </div>
      </Surface>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div><div className="text-[12px] text-muted-foreground">{label}</div><div className="font-medium tabular-nums">{value}</div></div>
}
