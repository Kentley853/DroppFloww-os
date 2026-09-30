"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { getAgent, isAgentId, permissionLabel } from "@/agents/definitions"
import { getGrowth } from "@/data/growth"
import { PageHeader, Surface } from "@/components/blocks"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useCompany } from "@/hooks/company-store"
import { answerQuestion, draftFor } from "@/services/assistant"
import type { AgentId, ChatMessage } from "@/types"
import { cn } from "cn"

const asked = new Set<string>()

export default function AgentWorkspacePage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Opening workspace…</p>}>
      <AgentGate />
    </Suspense>
  )
}

function AgentGate() {
  const params = useParams<{ agent: string }>()
  const id = params.agent
  if (!isAgentId(id)) {
    return <PageHeader title="This agent is not on the team" description="Open AI Workforce and choose a department." />
  }
  return <Workspace agentId={id} />
}

function Workspace({ agentId }: { agentId: AgentId }) {
  const router = useRouter()
  const search = useSearchParams()
  const prompt = search.get("q")
  const store = useCompany()
  const { company } = store
  const agent = getAgent(agentId)
  const runtime = company.agents.find((item) => item.agentId === agentId) ??
    getGrowth(company.id).agents.find((item) => item.agentId === agentId) ?? {
      agentId,
      status: "idle" as const,
      focus: agent.purpose,
      tasksToday: 0,
      lastActivity: "—",
      suggestions: agent.exampleTasks.slice(0, 2),
      intro: agent.purpose,
    }
  const facts = company.contexts[agentId] ?? getGrowth(company.id).contexts[agentId] ?? []
  const key = `${company.id}:${agentId}`
  const seed = useMemo<ChatMessage[]>(
    () => [
      {
        id: `seed-${agentId}`,
        role: "agent",
        speaker: agent.name,
        text: runtime.intro,
        cards: facts,
        at: runtime.lastActivity,
        actions: [
          { id: "draft", label: "Draft message" },
          { id: "assign", label: "Assign owner" },
          { id: "remind", label: "Remind me tomorrow" },
        ],
      },
    ],
    [agent.name, agentId, facts, runtime.intro, runtime.lastActivity]
  )
  const messages = store.threads[key] ?? seed
  const [draft, setDraft] = useState("")
  const [pending, setPending] = useState(false)
  const [panel, setPanel] = useState<"chat" | "context" | "history">("chat")
  const [draftOpen, setDraftOpen] = useState(false)
  const [draftText, setDraftText] = useState("")
  const [assignOpen, setAssignOpen] = useState(false)
  const [person, setPerson] = useState(company.people[0] ?? "")
  const scroller = useRef<HTMLDivElement>(null)

  function send(text: string) {
    const clean = text.trim()
    if (!clean || pending) return
    const user: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      speaker: "Alex",
      text: clean,
      at: "Just now",
    }
    const next = [...messages, user]
    store.saveThread(agentId, next)
    setDraft("")
    setPending(true)
    window.setTimeout(() => {
      const reply = answerQuestion(company, agentId, clean)
      const agentMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "agent",
        speaker: reply.speaker,
        text: reply.text,
        cards: reply.cards,
        actions: reply.actions,
        at: "Just now",
      }
      store.saveThread(agentId, [...next, agentMessage])
      setPending(false)
    }, 650)
  }

  useEffect(() => {
    if (!prompt || asked.has(`${agentId}:${prompt}`)) return
    asked.add(`${agentId}:${prompt}`)
    send(prompt)
    router.replace(`/workforce/${agentId}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, agentId])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
  }, [messages, pending])

  return (
    <div>
      <PageHeader title={agent.name} description={agent.purpose} />
      <div className="mb-3 flex gap-2 lg:hidden">
        {(["chat", "context", "history"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setPanel(item)}
            className={cn("rounded-full border px-3 py-1 text-sm capitalize", panel === item && "border-transparent bg-brand-soft text-brand")}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_300px]">
        <Surface className={cn("p-3 lg:block", panel === "history" ? "block" : "hidden")}>
          <div className="px-2 py-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">History</div>
          <div className="mt-1 space-y-1">
            {messages.filter((message) => message.role === "user").length === 0 ? (
              <p className="px-2 py-2 text-[13px] leading-5 text-muted-foreground">This conversation started with today’s briefing.</p>
            ) : null}
            {messages
              .filter((message) => message.role === "user")
              .map((message) => (
                <div key={message.id} className="rounded-lg px-2 py-2 text-[13px] leading-5 hover:bg-muted">
                  {message.text}
                </div>
              ))}
          </div>
        </Surface>
        <Surface className={cn("flex min-h-[640px] flex-col", panel === "chat" ? "flex" : "hidden lg:flex")}>
          <div ref={scroller} className="flex-1 space-y-6 overflow-auto px-5 py-5">
            {messages.map((message) => (
              <article key={message.id} className={message.role === "user" ? "ml-8" : ""}>
                <div className="text-[12px] text-muted-foreground">
                  <span className={cn("font-medium", message.role === "agent" && "text-brand")}>{message.speaker}</span>
                  <span> · {message.at}</span>
                </div>
                <p className={cn("mt-1.5 text-[15px] leading-6", message.role === "user" && "text-foreground")}>{message.text}</p>
                {message.cards ? (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {message.cards.map((card) => (
                      <div key={card.label} className="rounded-lg border px-3 py-2.5">
                        <div className="text-[12px] text-muted-foreground">{card.label}</div>
                        <div className="mt-0.5 text-sm font-medium">{card.value}</div>
                      </div>
                    ))}
                  </div>
                ) : null}
                {message.actions ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.actions.map((action) => (
                      <Button
                        key={action.label}
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (action.href) router.push(action.href)
                          else if (action.id === "draft") {
                            setDraftText(draftFor(company, message.text))
                            setDraftOpen(true)
                          } else if (action.id === "assign") setAssignOpen(true)
                          else if (action.id === "remind") toast.success("Reminder set for tomorrow at 8:00")
                          else if (action.id === "approve") router.push("/approvals")
                        }}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
            {pending ? <p className="text-sm text-muted-foreground">Reviewing company records…</p> : null}
          </div>
          <div className="border-t p-3">
            <div className="mb-2 flex gap-2 overflow-auto">
              {runtime.suggestions.map((suggestion) => (
                <button key={suggestion} className="shrink-0 rounded-full border px-2.5 py-1 text-[12px] hover:bg-muted" onClick={() => send(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                send(draft)
              }}
            >
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={`Ask ${agent.name}…`}
                className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring"
              />
              <Button type="submit" disabled={pending || !draft.trim()}>
                Send
              </Button>
            </form>
          </div>
        </Surface>
        <Surface className={cn("p-5", panel === "context" ? "block" : "hidden lg:block")}>
          <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Currently in view</div>
          <dl className="mt-3 space-y-3">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[12px] text-muted-foreground">{fact.label}</dt>
                <dd className="text-sm font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Permissions</div>
          <ul className="mt-2 divide-y">
            {agent.permissions.map((permission) => (
              <li key={permission.action} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                <span>{permission.action}</span>
                <span className={cn("shrink-0 text-[13px]", permission.level === "approval" && "text-amber-800 dark:text-amber-200", permission.level === "denied" && "text-muted-foreground")}>
                  {permissionLabel[permission.level]}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Works with</div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{agent.tools.join(" · ")}</p>
        </Surface>
      </div>
      <Dialog open={draftOpen} onOpenChange={setDraftOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Draft</DialogTitle>
            <DialogDescription>Nothing is sent until you copy it or ask someone to send it.</DialogDescription>
          </DialogHeader>
          <Textarea value={draftText} onChange={(event) => setDraftText(event.target.value)} className="min-h-40" />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(draftText)
                  toast.success("Copied")
                } catch {
                  toast.error("Could not copy from this browser")
                }
              }}
            >
              Copy
            </Button>
            <Button
              onClick={() => {
                store.addActivity("saved a draft for follow-up.", agent.department)
                toast.success("Draft saved to activity")
                setDraftOpen(false)
              }}
            >
              Save draft
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign an owner</DialogTitle>
            <DialogDescription>This records the assignment. It does not message the customer.</DialogDescription>
          </DialogHeader>
          <select className="h-9 rounded-lg border bg-background px-2 text-sm" value={person} onChange={(event) => setPerson(event.target.value)}>
            {company.people.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                store.addActivity(`assigned ${person} from the ${agent.name} workspace.`, agent.department)
                toast.success(`Assigned to ${person}`)
                setAssignOpen(false)
              }}
            >
              Assign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
