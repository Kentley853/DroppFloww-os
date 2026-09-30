import type { AgentDef, AgentId, PermissionLevel } from "@/types"

export const permissionLabel: Record<PermissionLevel, string> = {
  read: "Allowed",
  suggest: "Allowed",
  modify: "Allowed",
  approval: "Approval required",
  denied: "Not permitted",
}

export const agents: AgentDef[] = [
  {
    id: "executive",
    name: "Executive Agent",
    department: "Management",
    purpose: "Answers questions across the entire business and prepares the owner briefing.",
    capabilities: [
      "Cross-department questions",
      "Morning owner briefing",
      "Priority setting",
      "Exception summaries",
    ],
    permissions: [
      { action: "Read company metrics", level: "read" },
      { action: "Prepare owner briefing", level: "suggest" },
      { action: "Send briefing to the owner", level: "approval" },
      { action: "Change agent permissions", level: "denied" },
      { action: "Move money", level: "denied" },
    ],
    exampleTasks: [
      "Why did revenue move this week?",
      "What should management focus on today?",
      "Which customers are at risk?",
    ],
    tools: ["Company metrics", "Department summaries", "Approval queue", "Activity log"],
  },
  {
    id: "sales",
    name: "Sales Agent",
    department: "Sales",
    purpose: "Keeps the pipeline current and makes sure promising conversations are not left waiting.",
    capabilities: [
      "Lead qualification",
      "Follow-up suggestions",
      "Pipeline monitoring",
      "Draft quotations",
      "CRM updates",
      "Sales summaries",
    ],
    permissions: [
      { action: "Read pipeline", level: "read" },
      { action: "Draft a quotation", level: "suggest" },
      { action: "Update CRM notes", level: "modify" },
      { action: "Apply a discount", level: "approval" },
      { action: "Delete a customer", level: "denied" },
    ],
    exampleTasks: [
      "Which opportunities need a follow-up?",
      "Draft a revised proposal",
      "Summarize this account",
    ],
    tools: ["Pipeline", "Contact history", "Quotations", "Owner assignments"],
  },
  {
    id: "finance",
    name: "Finance Agent",
    department: "Finance",
    purpose: "Watches cash, invoices, and anything that should be collected or questioned.",
    capabilities: [
      "Outstanding invoice monitoring",
      "Expense summaries",
      "Cash flow analysis",
      "Payment follow-ups",
      "Financial anomaly detection",
      "Invoice preparation",
    ],
    permissions: [
      { action: "Read invoices", level: "read" },
      { action: "Prepare invoice", level: "modify" },
      { action: "Send invoice", level: "approval" },
      { action: "Issue refund", level: "approval" },
      { action: "Bank transfer", level: "denied" },
    ],
    exampleTasks: [
      "Which invoices are overdue?",
      "How much cash are we expecting this week?",
      "Draft a payment reminder",
    ],
    tools: ["Invoices", "Collections", "Cash position", "Reminder drafts"],
  },
  {
    id: "operations",
    name: "Operations Agent",
    department: "Operations",
    purpose: "Tracks work in motion and flags delays before they surprise the owner.",
    capabilities: [
      "Project tracking",
      "Inventory warnings",
      "Supplier monitoring",
      "Deadline monitoring",
      "Operational reporting",
    ],
    permissions: [
      { action: "Read active work", level: "read" },
      { action: "Update a schedule note", level: "modify" },
      { action: "Change a supplier", level: "approval" },
      { action: "Approve a supplier payment", level: "denied" },
    ],
    exampleTasks: [
      "Why is this work delayed?",
      "What is at risk this week?",
      "Summarize open operational issues",
    ],
    tools: ["Schedules", "Suppliers", "Issue log", "Team assignments"],
  },
  {
    id: "marketing",
    name: "Marketing Agent",
    department: "Marketing",
    purpose: "Explains which campaigns are creating demand, and where spend is not converting.",
    capabilities: [
      "Campaign analysis",
      "Content ideas",
      "Lead source performance",
      "Ad performance",
      "Customer segmentation",
    ],
    permissions: [
      { action: "Read campaign results", level: "read" },
      { action: "Draft content", level: "suggest" },
      { action: "Adjust a small budget", level: "modify" },
      { action: "Launch a campaign", level: "approval" },
      { action: "Change billing details", level: "denied" },
    ],
    exampleTasks: [
      "Which channel brought the best leads?",
      "Why did conversion drop?",
      "Draft this week's campaign note",
    ],
    tools: ["Campaigns", "Lead sources", "Spend", "Content drafts"],
  },
  {
    id: "support",
    name: "Customer Service Agent",
    department: "Customer Service",
    purpose: "Summarizes customer problems, drafts replies, and escalates what should not wait.",
    capabilities: [
      "Summarize complaints",
      "Draft responses",
      "Identify recurring customer problems",
      "Escalate urgent cases",
    ],
    permissions: [
      { action: "Read conversations", level: "read" },
      { action: "Draft a reply", level: "suggest" },
      { action: "Send a reply", level: "approval" },
      { action: "Escalate a case", level: "modify" },
      { action: "Issue a refund", level: "denied" },
    ],
    exampleTasks: [
      "Which customers are unhappy?",
      "Draft a reply to the latest complaint",
      "What problems keep coming back?",
    ],
    tools: ["Conversations", "Complaint history", "Reply drafts", "Escalations"],
  },
  {
    id: "lead",
    name: "Lead Generation Agent",
    department: "Growth",
    purpose: "Finds and organizes companies that match the ideal customer profile. Discovery in this prototype is simulated.",
    capabilities: ["Prospect discovery", "Lead enrichment", "Decision-maker identification", "Lead scoring", "ICP matching"],
    permissions: [
      { action: "Read the ideal customer profile", level: "read" },
      { action: "Suggest prospects", level: "suggest" },
      { action: "Add a prospect to the pipeline", level: "modify" },
      { action: "Start a mass outreach campaign", level: "approval" },
      { action: "Buy contact data", level: "denied" },
    ],
    exampleTasks: ["Who matches our profile?", "Score this account", "Which city should we focus on?"],
    tools: ["ICP", "Demo prospect list", "Pipeline", "Company notes"],
  },
  {
    id: "speed",
    name: "Speed-to-Lead Agent",
    department: "Growth",
    purpose: "Watches new enquiries and drafts a first response so good leads are not left waiting.",
    capabilities: ["First response drafts", "Qualification questions", "SLA watch", "Escalation of high-value leads"],
    permissions: [
      { action: "Read new enquiries", level: "read" },
      { action: "Draft a first reply", level: "suggest" },
      { action: "Send a first reply", level: "approval" },
      { action: "Book a meeting without review", level: "approval" },
    ],
    exampleTasks: ["Who is still waiting?", "Draft a reply to the newest enquiry"],
    tools: ["Lead inbox", "Response clock", "Qualification notes"],
  },
  {
    id: "followup",
    name: "Follow-Up Agent",
    department: "Growth",
    purpose: "Surfaces conversations that have gone quiet before they are forgotten.",
    capabilities: ["Stale lead watch", "Proposal follow-up", "Meeting recap reminders", "Nurture suggestions"],
    permissions: [
      { action: "Read pipeline activity", level: "read" },
      { action: "Draft a follow-up", level: "suggest" },
      { action: "Send a follow-up", level: "approval" },
      { action: "Close a deal lost", level: "approval" },
    ],
    exampleTasks: ["Which deals need a follow-up?", "Draft a note to the quiet proposal"],
    tools: ["Pipeline", "Message opens", "Tasks"],
  },
  {
    id: "social",
    name: "Social Media Agent",
    department: "Growth",
    purpose: "Prepares posts and spots comments that look like real demand. Nothing is published from this prototype.",
    capabilities: ["Content ideas", "Captions", "Calendar drafts", "Engagement that might be a lead"],
    permissions: [
      { action: "Draft a post", level: "suggest" },
      { action: "Schedule a post", level: "approval" },
      { action: "Publish immediately", level: "denied" },
      { action: "Reply to a public comment", level: "approval" },
    ],
    exampleTasks: ["What should we post this week?", "Turn this comment into a lead"],
    tools: ["Content calendar", "Demo comments", "Brand notes"],
  },
  {
    id: "campaign",
    name: "Campaign Agent",
    department: "Growth",
    purpose: "Watches spend and lead quality, then recommends a change. It does not move budget on its own.",
    capabilities: ["Spend review", "Lead quality", "Audience notes", "Budget recommendations"],
    permissions: [
      { action: "Read campaign results", level: "read" },
      { action: "Recommend a budget change", level: "suggest" },
      { action: "Change ad budget", level: "approval" },
      { action: "Pause an account", level: "approval" },
    ],
    exampleTasks: ["Which campaign needs a look?", "Why did lead quality drop?"],
    tools: ["Campaign results", "Audience splits", "Approvals"],
  },
  {
    id: "meeting",
    name: "Meeting Agent",
    department: "Growth",
    purpose: "Prepares the briefing, offers times, and drafts the note after the conversation.",
    capabilities: ["Qualification check", "Time options", "Briefing", "Reminder", "Follow-up draft"],
    permissions: [
      { action: "Read the lead record", level: "read" },
      { action: "Offer meeting times", level: "suggest" },
      { action: "Book on a calendar", level: "approval" },
      { action: "Send a calendar invite", level: "approval" },
    ],
    exampleTasks: ["Prepare me for the next meeting", "Which meetings are tomorrow?"],
    tools: ["Meetings", "Lead history", "Briefing notes"],
  },
]

export function getAgent(id: AgentId) {
  const agent = agents.find((item) => item.id === id)
  if (!agent) throw new Error(`Unknown agent ${id}`)
  return agent
}

export function isAgentId(value: string): value is AgentId {
  return agents.some((agent) => agent.id === value)
}
