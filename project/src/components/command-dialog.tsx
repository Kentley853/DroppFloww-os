"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useCompany } from "@/hooks/company-store"
import { answerQuestion, searchRecords } from "@/services/assistant"
import type { AgentAnswer } from "@/types"

const pages = [
  { label: "Overview", href: "/" },
  { label: "Command Center", href: "/command-center" },
  { label: "AI Workforce", href: "/workforce" },
  { label: "Sales", href: "/sales" },
  { label: "Finance", href: "/finance" },
  { label: "Operations", href: "/operations" },
  { label: "Marketing", href: "/marketing" },
  { label: "Customer Service", href: "/support" },
  { label: "Approvals", href: "/approvals" },
  { label: "Company Pulse", href: "/pulse" },
  { label: "Activity", href: "/activity" },
  { label: "Business Scan", href: "/scan" },
  { label: "ROI Calculator", href: "/roi" },
  { label: "WhatsApp", href: "/whatsapp" },
  { label: "Growth Engine", href: "/growth" },
  { label: "Lead Generation", href: "/growth/leads" },
  { label: "Lead Inbox", href: "/growth/inbox" },
  { label: "Sales Pipeline", href: "/growth/pipeline" },
  { label: "Outbound", href: "/growth/outbound" },
  { label: "Growth Marketing", href: "/growth/marketing" },
  { label: "Social Media", href: "/growth/social" },
  { label: "Campaigns", href: "/growth/campaigns" },
  { label: "Content Studio", href: "/growth/content" },
  { label: "Meetings", href: "/growth/meetings" },
  { label: "Growth Analytics", href: "/growth/analytics" },
  { label: "Growth Command", href: "/growth/command" },
  { label: "Morning Brief", href: "/brief" },
  { label: "Daily Wrap-Up", href: "/wrap-up" },
  { label: "Automations", href: "/automations" },
  { label: "Agent Builder", href: "/agent-builder" },
  { label: "Integrations", href: "/integrations" },
  { label: "Settings", href: "/settings" },
]

const suggestions = [
  "What should I focus on today?",
  "Which customers owe us money?",
  "How much cash are we expecting this week?",
  "Show me our strongest sales opportunities.",
  "Why did revenue move this week?",
  "Where are our best leads coming from?",
  "Which leads should we call today?",
  "Which proposals have gone cold?",
  "What campaign is performing worst?",
]

export function CommandDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { company } = useCompany()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState<AgentAnswer | null>(null)

  useEffect(() => {
    if (!open) {
      setQuery("")
      setAnswer(null)
      setLoading(false)
    }
  }, [open])

  function ask(text: string) {
    setQuery(text)
    setLoading(true)
    setAnswer(null)
    window.setTimeout(() => {
      setAnswer(answerQuestion(company, "executive", text))
      setLoading(false)
    }, 450)
  }

  const pageHits = pages.filter((page) => page.label.toLowerCase().includes(query.toLowerCase().trim()))
  const records = searchRecords(company, query)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-xl" showCloseButton={false}>
        <DialogTitle className="sr-only">Ask Droppflow</DialogTitle>
        <div className="flex items-center gap-2 border-b px-3">
          <Search className="size-4 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setAnswer(null)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && query.trim()) ask(query.trim())
            }}
            placeholder="Ask Droppflow anything…"
            className="h-12 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="max-h-[420px] overflow-auto p-2">
          {loading ? <div className="px-3 py-6 text-sm text-muted-foreground">Checking company records…</div> : null}
          {answer ? (
            <div className="space-y-3 px-3 py-3">
              <div className="text-[12px] font-medium text-brand">{answer.speaker}</div>
              <p className="text-sm leading-6">{answer.text}</p>
              {answer.cards ? (
                <div className="grid grid-cols-2 gap-2">
                  {answer.cards.map((card) => (
                    <div key={card.label} className="rounded-lg border px-3 py-2">
                      <div className="text-[12px] text-muted-foreground">{card.label}</div>
                      <div className="mt-0.5 text-sm font-medium">{card.value}</div>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {answer.actions?.map((action) => (
                  <Button
                    key={action.label}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (action.href) {
                        router.push(action.href)
                        onOpenChange(false)
                      }
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
          {!answer && !loading && query.trim() ? (
            <button className="flex w-full rounded-lg px-3 py-2.5 text-left text-sm hover:bg-muted" onClick={() => ask(query.trim())}>
              Ask Droppflow about “{query.trim()}”
            </button>
          ) : null}
          {!answer && !loading ? (
            <>
              <div className="px-3 pt-2 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                {query.trim() ? "Records" : "Suggested"}
              </div>
              {(query.trim() ? records : suggestions.map((item) => ({ title: item, meta: "Question", href: "" }))).map((item) => (
                <button
                  key={item.title}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    if (item.href) {
                      router.push(item.href)
                      onOpenChange(false)
                    } else ask(item.title)
                  }}
                >
                  <span>{item.title}</span>
                  <span className="text-[12px] text-muted-foreground">{item.meta}</span>
                </button>
              ))}
              <div className="px-3 pt-3 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Pages</div>
              {(query.trim() ? pageHits : pages.slice(0, 6)).map((page) => (
                <button
                  key={page.href}
                  className="flex w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    router.push(page.href)
                    onOpenChange(false)
                  }}
                >
                  {page.label}
                </button>
              ))}
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
