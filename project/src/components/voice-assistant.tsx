"use client"

import { useEffect, useRef, useState } from "react"
import { Mic, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useCompany } from "@/hooks/company-store"
import { answerQuestion } from "@/services/assistant"
import type { AgentAnswer } from "@/types"

type SpeechResult = { results: ArrayLike<ArrayLike<{ transcript: string }>> }

type Recognition = {
  lang: string
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: SpeechResult) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}

function getRecognition(): Recognition | null {
  if (typeof window === "undefined") return null
  const win = window as Window & {
    SpeechRecognition?: new () => Recognition
    webkitSpeechRecognition?: new () => Recognition
  }
  const Ctor = win.SpeechRecognition || win.webkitSpeechRecognition
  return Ctor ? new Ctor() : null
}

export function VoiceAssistant({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { company } = useCompany()
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [typed, setTyped] = useState("")
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState<AgentAnswer | null>(null)
  const recognition = useRef<Recognition | null>(null)
  const transcriptRef = useRef("")

  useEffect(() => {
    transcriptRef.current = transcript
  }, [transcript])

  useEffect(() => {
    setSupported(!!getRecognition())
  }, [])

  useEffect(() => {
    if (!open) {
      recognition.current?.stop()
      window.speechSynthesis?.cancel()
      setListening(false)
      setTranscript("")
      setTyped("")
      setAnswer(null)
      setLoading(false)
    }
  }, [open])

  function respond(text: string) {
    setTranscript(text)
    setListening(false)
    setLoading(true)
    window.setTimeout(() => {
      const next = answerQuestion(company, "executive", text)
      setAnswer(next)
      setLoading(false)
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(next.text)
        utterance.rate = 1
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utterance)
      }
    }, 500)
  }

  function start() {
    const rec = getRecognition()
    if (!rec) return
    recognition.current = rec
    rec.lang = "en-US"
    rec.interimResults = true
    rec.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
      setTranscript(text)
    }
    rec.onerror = () => {
      setListening(false)
      setTranscript("")
      setAnswer({
        agentId: "executive",
        speaker: "Droppflow",
        text: "Voice isn’t available in this browser. You can type your request instead.",
      })
    }
    rec.onend = () => {
      setListening(false)
      const text = transcriptRef.current.trim()
      if (text) respond(text)
    }
    setAnswer(null)
    transcriptRef.current = ""
    setTranscript("")
    setListening(true)
    rec.start()
  }

  function stop() {
    recognition.current?.stop()
  }

  return (
    <>
      <button
        type="button"
        aria-label="Voice assistant"
        onClick={() => onOpenChange(true)}
        className="fixed right-4 bottom-4 z-40 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(16,24,40,0.16)] transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98] sm:right-6 sm:bottom-6"
      >
        <Mic className="size-5" />
      </button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Droppflow</DialogTitle>
            <DialogDescription>
              {supported ? "Ask about the company. Speech uses this browser when it is available." : "Voice isn’t available in this browser. You can type your request instead."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex h-12 items-end justify-center gap-1">
            {Array.from({ length: 12 }).map((_, index) => (
              <span
                key={index}
                className={listening ? "wave-bar w-1 rounded-full bg-primary" : "w-1 rounded-full bg-border"}
                style={{ height: listening ? 28 : 6, animationDelay: `${index * 0.07}s` }}
              />
            ))}
          </div>
          <div className="min-h-16 text-center">
            <div className="text-[12px] font-medium tracking-wide text-muted-foreground uppercase">
              {listening ? "Listening" : loading ? "Checking records" : answer ? "Result" : "Ready"}
            </div>
            <p className="mt-2 text-[15px] leading-6">
              {transcript ? `“${transcript}”` : "What requires my attention today?"}
            </p>
          </div>
          {answer ? (
            <div className="rounded-xl border p-3">
              <div className="text-[12px] font-medium text-brand">{answer.speaker}</div>
              <p className="mt-1 text-sm leading-6">{answer.text}</p>
            </div>
          ) : null}
          {supported ? (
            <div className="flex justify-center">
              {listening ? (
                <Button variant="outline" onClick={stop}>
                  <Square className="size-3.5" />
                  Stop
                </Button>
              ) : (
                <Button onClick={start}>
                  <Mic className="size-3.5" />
                  {answer ? "Ask again" : "Start listening"}
                </Button>
              )}
            </div>
          ) : null}
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              if (typed.trim()) respond(typed.trim())
            }}
          >
            <Input value={typed} onChange={(event) => setTyped(event.target.value)} placeholder="Or type a question" className="h-9" />
            <Button type="submit">Ask</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
