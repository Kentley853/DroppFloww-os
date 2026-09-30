"use client"

import { useEffect, useRef, useState } from "react"
import { PageHeader } from "@/components/blocks"
import { Button } from "@/components/ui/button"
import { useCompany } from "@/hooks/company-store"
import { answerQuestion, briefingText } from "@/services/assistant"
import type { ChatMessage } from "@/types"

const prompts = ["show lead", "draft reply", "assign sales", "show pipeline", "What should I focus on today?"]

const alertLabels = [
  { id: "critical", label: "Critical only" },
  { id: "daily", label: "Daily summary" },
  { id: "important", label: "All important" },
  { id: "muted", label: "Muted" },
] as const

export default function WhatsAppPage() {
  const store = useCompany()
  const { company } = store
  const saved = store.whatsapp[company.id]
  const seed: ChatMessage[] = [
    {
      id: "brief",
      role: "agent",
      speaker: "Droppflow",
      text: briefingText(company),
      at: "07:30",
    },
  ]
  const messages = saved ?? seed
  const [text, setText] = useState("")
  const [pending, setPending] = useState(false)
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" })
  }, [messages, pending])

  function send(value: string) {
    const clean = value.trim()
    if (!clean || pending) return
    const user: ChatMessage = { id: `w-${Date.now()}`, role: "user", speaker: "Alex", text: clean, at: "Now" }
    const next = [...messages, user]
    store.saveWhatsapp(next)
    setText("")
    setPending(true)
    window.setTimeout(() => {
      const reply = answerQuestion(company, "executive", clean)
      store.saveWhatsapp([
        ...next,
        {
          id: `wr-${Date.now()}`,
          role: "agent",
          speaker: "Droppflow",
          text: `${reply.speaker}:\n\n${reply.text}`,
          at: "Now",
        },
      ])
      setPending(false)
    }, 600)
  }

  return (
    <div>
      <PageHeader
        title="Owner WhatsApp"
        description="A preview of the morning briefing the owner would receive. No WhatsApp account is connected."
      />
      <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,420px)]">
        <div className="text-sm leading-6 text-muted-foreground">
          <p>This is the remote control we can demonstrate before a WhatsApp integration exists.</p>
          <p className="mt-3">Replies use the same company records as the dashboard.</p>
          <div className="mt-4 flex flex-col gap-2">
            {prompts.map((prompt) => (
              <Button key={prompt} variant="outline" className="h-auto justify-start py-2 text-left whitespace-normal" onClick={() => send(prompt)}>
                {prompt}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                store.saveWhatsapp(seed)
                setText("")
              }}
            >
              Show today’s briefing
            </Button>
          </div>
          <p className="mt-6 text-[13px] font-medium text-foreground">Owner alerts</p>
          <p className="mt-1">Routine items stay in the morning brief. Only the level you choose reaches this preview immediately.</p>
          <div className="mt-3 flex flex-col gap-2">
            {alertLabels.map((mode) => (
              <Button
                key={mode.id}
                variant={store.growth[company.id].alertMode === mode.id ? "default" : "outline"}
                className="justify-start"
                onClick={() => store.patchGrowth({ alertMode: mode.id })}
              >
                {mode.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="mx-auto w-full max-w-[420px] rounded-[28px] border bg-card p-3 shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
          <div className="flex items-center gap-3 border-b px-3 py-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">D</span>
            <div>
              <div className="text-sm font-semibold">Droppflow</div>
              <div className="text-[12px] text-muted-foreground">{company.name}</div>
            </div>
          </div>
          <div className="h-[520px] space-y-3 overflow-auto bg-background px-3 py-4">
            {messages.map((message) => (
              <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={message.role === "user" ? "max-w-[85%] rounded-2xl rounded-br-md bg-brand-soft px-3 py-2 text-sm leading-6" : "max-w-[85%] rounded-2xl rounded-bl-md border bg-card px-3 py-2 text-sm leading-6"}>
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}
            {pending ? <p className="text-[12px] text-muted-foreground">Droppflow is checking the records…</p> : null}
            <div ref={end} />
          </div>
          <form
            className="flex gap-2 border-t p-3"
            onSubmit={(event) => {
              event.preventDefault()
              send(text)
            }}
          >
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Reply or ask anything"
              className="h-10 flex-1 rounded-full border bg-background px-3 text-sm outline-none"
            />
            <Button type="submit" disabled={!text.trim() || pending}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
