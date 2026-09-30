export type CompanyId = "logistics" | "dental" | "construction"

export type AgentId =
  | "executive"
  | "sales"
  | "finance"
  | "operations"
  | "marketing"
  | "support"
  | "lead"
  | "speed"
  | "followup"
  | "social"
  | "campaign"
  | "meeting"

export type PermissionLevel = "read" | "suggest" | "modify" | "approval" | "denied"

export type Permission = {
  action: string
  level: PermissionLevel
}

export type AgentDef = {
  id: AgentId
  name: string
  department: string
  purpose: string
  capabilities: string[]
  permissions: Permission[]
  exampleTasks: string[]
  tools: string[]
}

export type Priority = "high" | "medium" | "low"

export type PulseAction = "view" | "ask" | "assign" | "approve" | "dismiss"

export type PulseItem = {
  id: string
  priority: Priority
  title: string
  body: string
  department: string
  time: string
  actions: PulseAction[]
  href?: string
  askPrompt?: string
  approvalId?: string
}

export type Metric = {
  id: string
  label: string
  value: number
  format: "idr" | "number"
  change: number
  upIsGood: boolean
  context: string
}

export type SeriesPoint = {
  month: string
  revenue: number
  collected: number
}

export type Opportunity = {
  id: string
  company: string
  contact: string
  value: number
  stage: string
  probability: number
  owner: string
  lastContact: string
  lastContactDays: number
  note: string
  status: "active" | "at-risk" | "pending" | "won"
}

export type Invoice = {
  id: string
  customer: string
  number: string
  amount: number
  due: string
  status: "paid" | "open" | "overdue" | "pending"
  note: string
}

export type WorkItem = {
  id: string
  name: string
  owner: string
  status: "on-track" | "at-risk" | "delayed" | "completed"
  progress: number
  due: string
  note: string
}

export type Campaign = {
  id: string
  name: string
  channel: string
  spend: number
  leads: number
  conversion: number
  status: "active" | "paused" | "completed"
  note: string
}

export type Ticket = {
  id: string
  customer: string
  subject: string
  priority: Priority
  status: "open" | "pending" | "resolved"
  owner: string
  opened: string
  summary: string
}

export type Approval = {
  id: string
  agentId: AgentId
  action: string
  reason: string
  impact: string
  risk: "Low" | "Medium" | "High"
  requestedAt: string
  facts: { label: string; value: string }[]
}

export type ActivityItem = {
  id: string
  time: string
  actor: string
  text: string
  department: string
}

export type AppNotification = {
  id: string
  category: "critical" | "approval" | "opportunity" | "information"
  title: string
  body: string
  time: string
  href: string
}

export type BrainNode = {
  id: string
  name: string
  status: string
  metric: string
  href: string
}

export type AgentRuntime = {
  agentId: AgentId
  status: "active" | "idle"
  focus: string
  tasksToday: number
  lastActivity: string
  suggestions: string[]
  intro: string
}

export type Fact = { label: string; value: string }

export type ReplyAction = { id: string; label: string; href?: string }

export type ChatMessage = {
  id: string
  role: "user" | "agent"
  text: string
  cards?: Fact[]
  actions?: ReplyAction[]
  at: string
  speaker: string
}

export type Company = {
  id: CompanyId
  name: string
  industry: string
  summary: string
  employees: number
  labels: {
    customer: string
    pipeline: string
    work: string
  }
  blurbs: {
    sales: string
    finance: string
    operations: string
    marketing: string
    support: string
  }
  metrics: Metric[]
  series: SeriesPoint[]
  weeklyNarrative: string
  cashThisWeek: number
  cashThisWeekNote: string
  counts: {
    opportunities: number
    invoices: number
    projects: number
    campaigns: number
    conversations: number
  }
  pulse: PulseItem[]
  opportunities: Opportunity[]
  invoices: Invoice[]
  work: WorkItem[]
  campaigns: Campaign[]
  tickets: Ticket[]
  approvals: Approval[]
  activity: ActivityItem[]
  notifications: AppNotification[]
  brain: BrainNode[]
  agents: AgentRuntime[]
  contexts: Partial<Record<AgentId, Fact[]>>
  people: string[]
}

export type AgentAnswer = {
  agentId: AgentId
  speaker: string
  text: string
  cards?: Fact[]
  actions?: ReplyAction[]
}
