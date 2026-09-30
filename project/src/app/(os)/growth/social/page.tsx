"use client"

import { useState } from "react"
import { toast } from "sonner"
import { PageHeader, Surface } from "@/components/blocks"
import { useGrowthView } from "@/components/growth/kit"
import { Button } from "@/components/ui/button"

export default function SocialPage() {
  const { profile, overlay, store } = useGrowthView()
  const [day, setDay] = useState<number | null>(28)
  const posts = profile.posts.map((post) => ({ ...post, status: overlay.postStatus[post.id] ?? post.status }))
  const visible = posts.filter((post) => day === null || post.day === day)
  return (
    <div>
      <PageHeader title="Social media" description="Scheduling here is simulated. Nothing is published to Instagram, LinkedIn, or any other network." />
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <Surface className="p-4">
          <div className="mb-2 text-sm font-medium">September</div>
          <div className="grid grid-cols-7 gap-1 text-center text-[12px]">
            {Array.from({ length: 30 }, (_, index) => index + 1).map((date) => {
              const has = posts.some((post) => post.day === date)
              return <button key={date} onClick={() => setDay(date)} className={`rounded-md py-1 ${day === date ? "bg-brand-soft text-brand" : has ? "bg-muted" : ""}`}>{date}</button>
            })}
          </div>
          <button className="mt-3 text-[13px] text-brand" onClick={() => setDay(null)}>Show all</button>
        </Surface>
        <div className="space-y-3">
          {visible.length === 0 ? <Surface className="p-6 text-sm text-muted-foreground">Nothing is planned for this date.</Surface> : null}
          {visible.map((post) => (
            <Surface key={post.id} className="p-5">
              <div className="text-[12px] text-muted-foreground">September {post.day} · {post.channel}</div>
              <h2 className="mt-1 text-lg font-semibold">{post.topic}</h2>
              <div className="mt-2 text-sm">{post.status}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => toast.message("Edit stays in this demo. The copy is the topic above.")}>Edit</Button>
                <Button size="sm" onClick={() => { store.setPostStatus(post.id, "Scheduled"); toast.success("Approved to schedule. Not published.") }}>Approve</Button>
                <Button size="sm" variant="outline" onClick={() => toast.success("Moved to the next open weekday in this demo")}>Reschedule</Button>
                <Button size="sm" variant="ghost" onClick={() => { store.setPostStatus(post.id, "Draft"); toast("Moved back to draft") }}>Delete</Button>
              </div>
            </Surface>
          ))}
          <Surface className="p-5">
            <div className="text-[12px] font-medium tracking-wide text-muted-foreground uppercase">Demo · comment that could be a lead</div>
            <p className="mt-2 text-sm leading-6">“{profile.socialLead.comment}”</p>
            <p className="mt-2 text-sm">{profile.socialLead.classification} · {profile.socialLead.company}</p>
            <p className="mt-1 text-sm text-muted-foreground">{profile.socialLead.action}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.success("Public reply drafted. Not posted.")}>Reply</Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("Direct message drafted. Not sent.")}>Send DM</Button>
              <Button size="sm" onClick={() => { store.addActivity(`added ${profile.socialLead.company} from a social comment. Simulated.`, "Growth", "Social Media Agent"); toast.success("Added to the inbox story") }}>Add to CRM</Button>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  )
}
