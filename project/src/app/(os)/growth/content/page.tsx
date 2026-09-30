"use client"

import { useState } from "react"
import { PageHeader, Surface } from "@/components/blocks"
import { useGrowthView } from "@/components/growth/kit"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function ContentStudioPage() {
  const { profile } = useGrowthView()
  const [topic, setTopic] = useState(profile.posts[0]?.topic ?? "Customer updates")
  const [pieces, setPieces] = useState<string[]>([])
  const [source, setSource] = useState("")

  function build(from: string) {
    const subject = from.trim() || topic
    setPieces([
      `LinkedIn: ${subject}. One story, one number, one question.`,
      `LinkedIn: What ${profile.pain} costs in a normal week.`,
      `LinkedIn: A note for ${profile.icp.buyers.split(",")[0]}.`,
      `Instagram: ${subject} — three lines, no hashtag pile.`,
      `Instagram: The question customers ask before they buy.`,
      `Instagram: What we stopped doing manually.`,
      `Carousel: 1. The problem 2. The hour it takes 3. What changed 4. Who it is for 5. What it is not`,
      `Short video: Open on the chase. End on the update the customer receives.`,
      `Short video: 20 seconds. One desk. One message that used to take six.`,
      `Email: ${subject}. Two paragraphs. One next step.`,
      `Blog outline: why it happens, what good looks like, what to ignore.`,
      `Sales note: ${profile.offer}.`,
    ])
  }

  return (
    <div>
      <PageHeader title="Content studio" description="Drafts stay in this browser. Publishing still requires a real channel and your approval." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Surface className="p-5">
          <label className="text-sm">
            <span className="mb-1 block text-[13px] text-muted-foreground">Topic</span>
            <Textarea value={topic} onChange={(event) => setTopic(event.target.value)} />
          </label>
          <div className="mt-3 flex gap-2">
            <Button onClick={() => build(topic)}>Generate</Button>
            <Button variant="outline" onClick={() => build(source || topic)}>Repurpose</Button>
          </div>
          <label className="mt-4 block text-sm">
            <span className="mb-1 block text-[13px] text-muted-foreground">Paste a longer note to repurpose</span>
            <Textarea value={source} onChange={(event) => setSource(event.target.value)} placeholder="Paste an article or a call note" className="min-h-28" />
          </label>
        </Surface>
        <div className="space-y-2">
          {pieces.length === 0 ? <Surface className="p-6 text-sm text-muted-foreground">Generate a set when you are ready. Empty is a fine starting point.</Surface> : pieces.map((piece) => (
            <Surface key={piece} className="p-4 text-sm leading-6">{piece}</Surface>
          ))}
        </div>
      </div>
    </div>
  )
}
