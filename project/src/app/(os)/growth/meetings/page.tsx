"use client"

import { useState } from "react"
import { toast } from "sonner"
import { PageHeader, Surface } from "@/components/blocks"
import { useGrowthView } from "@/components/growth/kit"
import { Button } from "@/components/ui/button"

export default function MeetingsPage() {
  const { profile, store } = useGrowthView()
  const [id, setId] = useState(profile.meetings[0]?.id ?? "")
  const meeting = profile.meetings.find((item) => item.id === id) ?? profile.meetings[0]
  if (!meeting) return <PageHeader title="Meetings" description="No meetings are on the book." />
  return (
    <div>
      <PageHeader title="Meetings" description="Qualification, a briefing, and a follow-up draft. Calendar invites are not sent from this prototype." />
      <div className="mb-4 flex flex-wrap gap-2">
        {profile.meetings.map((item) => (
          <button key={item.id} onClick={() => setId(item.id)} className={`rounded-full border px-3 py-1 text-sm ${item.id === meeting.id ? "bg-brand-soft text-brand" : ""}`}>{item.company}</button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Surface className="p-5">
          <div className="text-[12px] text-muted-foreground">{meeting.when}</div>
          <h2 className="mt-1 text-xl font-semibold">{meeting.company}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Attendees" value={meeting.attendees} />
            <Row label="Opportunity" value={meeting.value} />
            <Row label="Source" value={meeting.source} />
            <Row label="Previous conversations" value={meeting.history} />
            <Row label="Pain" value={meeting.pains} />
            <Row label="Questions they asked" value={meeting.questions} />
            <Row label="What they care about" value={meeting.cares} />
            <Row label="Objections" value={meeting.objections} />
            <Row label="Talking points" value={meeting.points} />
            <Row label="Suggested next step" value={meeting.next} />
          </dl>
        </Surface>
        <Surface className="p-5">
          <h2 className="text-lg font-semibold">How a meeting gets on the book</h2>
          <ol className="mt-3 space-y-2 text-sm leading-6">
            {["Lead qualifies", "Agent offers two times", "A person confirms", "The record is updated", "The owner of the meeting gets this briefing", "Afterward, a note and a follow-up are drafted"].map((step, index) => <li key={step}>{index + 1}. {step}</li>)}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => { store.addActivity(`offered meeting times for ${meeting.company}. No invite was sent.`, "Growth", "Meeting Agent"); toast.success("Times drafted. Not sent.") }}>Offer times</Button>
            <Button variant="outline" onClick={() => toast.success("Follow-up note drafted for after the meeting")}>Draft follow-up</Button>
          </div>
          <p className="mt-4 text-[13px] text-muted-foreground">Connect a calendar to book live. This demo keeps the briefing even without one.</p>
        </Surface>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-[12px] text-muted-foreground">{label}</dt><dd className="mt-0.5">{value}</dd></div>
}
