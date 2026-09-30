"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getGrowth, type GrowthDeal, type GrowthLead, type GrowthProfile } from "@/data/growth"
import { getCompany } from "@/data/companies"
import type { ActivityItem, AgentId, Approval, ChatMessage, CompanyId } from "@/types"

type Decision = {
  status: "approved" | "rejected" | "modified"
  note?: string
  at: string
}

export type GrowthOverlay = {
  stages: Record<string, string>
  statuses: Record<string, string>
  dismissedFollowups: string[]
  extraLeads: GrowthLead[]
  extraDeals: GrowthDeal[]
  postStatus: Record<string, string>
  alertMode: "critical" | "daily" | "important" | "muted"
  icp: GrowthProfile["icp"] | null
  automations: { id: string; name: string; when: string; condition: string; action: string }[]
  sequenceNotes: Record<string, string>
  approvedDrafts: string[]
  extraApprovals: Approval[]
  agentNotes: Record<string, string>
}

function emptyOverlay(): GrowthOverlay {
  return {
    stages: {},
    statuses: {},
    dismissedFollowups: [],
    extraLeads: [],
    extraDeals: [],
    postStatus: {},
    alertMode: "important",
    icp: null,
    automations: [],
    sequenceNotes: {},
    approvedDrafts: [],
    extraApprovals: [],
    agentNotes: {},
  }
}

type Persisted = {
  companyId: CompanyId
  dismissedPulse: string[]
  decisions: Record<string, Decision>
  readNotifications: string[]
  dismissedNotifications: string[]
  extraActivity: { companyId: CompanyId; item: ActivityItem }[]
  threads: Record<string, ChatMessage[]>
  whatsapp: Record<string, ChatMessage[]>
  onboarding: Record<string, boolean>
  scan: { step: number; answers: Record<string, string>; done: boolean }
  growth: Record<CompanyId, GrowthOverlay>
  demoStep: number | null
}

const defaultState: Persisted = {
  companyId: "logistics",
  dismissedPulse: [],
  decisions: {},
  readNotifications: [],
  dismissedNotifications: [],
  extraActivity: [],
  threads: {},
  whatsapp: {},
  onboarding: {},
  scan: { step: 0, answers: {}, done: false },
  growth: { logistics: emptyOverlay(), dental: emptyOverlay(), construction: emptyOverlay() },
  demoStep: null,
}

type Store = Persisted & {
  ready: boolean
  company: ReturnType<typeof getCompany>
  setCompanyId: (id: CompanyId) => void
  dismissPulse: (id: string) => void
  restorePulse: (id: string) => void
  decide: (id: string, status: Decision["status"], note?: string) => void
  addActivity: (text: string, department: string, actor?: string) => void
  markNotificationRead: (id: string) => void
  dismissNotification: (id: string) => void
  saveThread: (agentId: AgentId, messages: ChatMessage[]) => void
  saveWhatsapp: (messages: ChatMessage[]) => void
  completeStep: (id: string) => void
  setScan: (scan: Persisted["scan"]) => void
  resetCompany: () => void
  patchGrowth: (partial: Partial<GrowthOverlay>) => void
  setDealStage: (id: string, stage: string) => void
  setLeadStatus: (id: string, status: string) => void
  dismissFollowup: (id: string) => void
  simulateLead: () => GrowthLead
  setPostStatus: (id: string, status: string) => void
  setDemoStep: (step: number | null) => void
  addAutomation: (item: GrowthOverlay["automations"][number]) => void
  addExtraApproval: (item: Approval) => void
  addDeal: (deal: GrowthDeal) => void
}

const CompanyContext = createContext<Store | null>(null)
const KEY = "droppflow-os-v1"

function mergeOverlay(value: GrowthOverlay | undefined): GrowthOverlay {
  return { ...emptyOverlay(), ...value, extraApprovals: value?.extraApprovals ?? [], automations: value?.automations ?? [], extraLeads: value?.extraLeads ?? [], extraDeals: value?.extraDeals ?? [] }
}

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(defaultState)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Persisted>
        setState({
          ...defaultState,
          ...parsed,
          scan: { ...defaultState.scan, ...parsed.scan },
          growth: {
            logistics: mergeOverlay(parsed.growth?.logistics),
            dental: mergeOverlay(parsed.growth?.dental),
            construction: mergeOverlay(parsed.growth?.construction),
          },
          demoStep: parsed.demoStep ?? null,
        })
      }
    } catch {
      /* keep defaults */
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state, ready])

  const company = getCompany(state.companyId)

  const value = useMemo<Store>(() => {
    const patch = (partial: Partial<GrowthOverlay>) =>
      setState((current) => ({
        ...current,
        growth: { ...current.growth, [current.companyId]: { ...current.growth[current.companyId], ...partial } },
      }))
    return {
      ...state,
      ready,
      company,
      setCompanyId: (companyId) => setState((current) => ({ ...current, companyId, demoStep: null })),
      dismissPulse: (id) =>
        setState((current) => ({
          ...current,
          dismissedPulse: current.dismissedPulse.includes(id) ? current.dismissedPulse : [...current.dismissedPulse, id],
        })),
      restorePulse: (id) => setState((current) => ({ ...current, dismissedPulse: current.dismissedPulse.filter((item) => item !== id) })),
      decide: (id, status, note) =>
        setState((current) => ({
          ...current,
          decisions: { ...current.decisions, [id]: { status, note, at: "Just now" } },
        })),
      addActivity: (text, department, actor = "Alex") =>
        setState((current) => ({
          ...current,
          extraActivity: [
            { companyId: current.companyId, item: { id: `act-${Date.now()}`, time: "Just now", actor, text, department } },
            ...current.extraActivity,
          ],
        })),
      markNotificationRead: (id) =>
        setState((current) => ({
          ...current,
          readNotifications: current.readNotifications.includes(id) ? current.readNotifications : [...current.readNotifications, id],
        })),
      dismissNotification: (id) => setState((current) => ({ ...current, dismissedNotifications: [...current.dismissedNotifications, id] })),
      saveThread: (agentId, messages) =>
        setState((current) => ({
          ...current,
          threads: { ...current.threads, [`${current.companyId}:${agentId}`]: messages },
        })),
      saveWhatsapp: (messages) => setState((current) => ({ ...current, whatsapp: { ...current.whatsapp, [current.companyId]: messages } })),
      completeStep: (id) => setState((current) => ({ ...current, onboarding: { ...current.onboarding, [id]: true } })),
      setScan: (scan) => setState((current) => ({ ...current, scan })),
      resetCompany: () =>
        setState((current) => ({
          ...current,
          dismissedPulse: [],
          decisions: {},
          readNotifications: [],
          dismissedNotifications: [],
          extraActivity: current.extraActivity.filter((item) => item.companyId !== current.companyId),
          threads: Object.fromEntries(Object.entries(current.threads).filter(([key]) => !key.startsWith(`${current.companyId}:`))),
          whatsapp: Object.fromEntries(Object.entries(current.whatsapp).filter(([key]) => key !== current.companyId)),
          growth: { ...current.growth, [current.companyId]: emptyOverlay() },
          demoStep: null,
        })),
      patchGrowth: patch,
      setDealStage: (id, stage) =>
        setState((current) => ({
          ...current,
          growth: {
            ...current.growth,
            [current.companyId]: { ...current.growth[current.companyId], stages: { ...current.growth[current.companyId].stages, [id]: stage } },
          },
        })),
      setLeadStatus: (id, status) =>
        setState((current) => ({
          ...current,
          growth: {
            ...current.growth,
            [current.companyId]: { ...current.growth[current.companyId], statuses: { ...current.growth[current.companyId].statuses, [id]: status } },
          },
        })),
      dismissFollowup: (id) =>
        setState((current) => ({
          ...current,
          growth: {
            ...current.growth,
            [current.companyId]: {
              ...current.growth[current.companyId],
              dismissedFollowups: [...current.growth[current.companyId].dismissedFollowups, id],
            },
          },
        })),
      simulateLead: () => {
        const lead = { ...getGrowth(state.companyId).simulation, id: `sim-${Date.now()}` }
        setState((current) => ({
          ...current,
          growth: {
            ...current.growth,
            [current.companyId]: { ...current.growth[current.companyId], extraLeads: [lead, ...current.growth[current.companyId].extraLeads] },
          },
          extraActivity: [
            {
              companyId: current.companyId,
              item: { id: `act-${Date.now()}`, time: "Just now", actor: "Lead Generation Agent", text: `A simulated enquiry arrived from ${lead.company}.`, department: "Growth" },
            },
            ...current.extraActivity,
          ],
        }))
        return lead
      },
      setPostStatus: (id, status) =>
        setState((current) => ({
          ...current,
          growth: {
            ...current.growth,
            [current.companyId]: { ...current.growth[current.companyId], postStatus: { ...current.growth[current.companyId].postStatus, [id]: status } },
          },
        })),
      setDemoStep: (demoStep) => setState((current) => ({ ...current, demoStep })),
      addAutomation: (item) =>
        setState((current) => ({
          ...current,
          growth: {
            ...current.growth,
            [current.companyId]: { ...current.growth[current.companyId], automations: [item, ...current.growth[current.companyId].automations] },
          },
        })),
      addExtraApproval: (item) =>
        setState((current) => ({
          ...current,
          growth: {
            ...current.growth,
            [current.companyId]: { ...current.growth[current.companyId], extraApprovals: [item, ...current.growth[current.companyId].extraApprovals] },
          },
        })),
      addDeal: (deal) =>
        setState((current) => ({
          ...current,
          growth: {
            ...current.growth,
            [current.companyId]: { ...current.growth[current.companyId], extraDeals: [deal, ...current.growth[current.companyId].extraDeals] },
          },
        })),
    }
  }, [state, ready, company])

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
}

export function useCompany() {
  const store = useContext(CompanyContext)
  if (!store) throw new Error("useCompany must be used within CompanyProvider")
  return store
}
