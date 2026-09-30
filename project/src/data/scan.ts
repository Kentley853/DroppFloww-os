export type ScanStep = {
  id: string
  title: string
  helper: string
  options: string[]
}

export const scanSteps: ScanStep[] = [
  {
    id: "industry",
    title: "What industry are you in?",
    helper: "We use this to choose language, agents, and the first workflows.",
    options: [
      "Logistics",
      "Dental or clinic",
      "Construction",
      "Professional services",
      "Retail",
      "Other",
    ],
  },
  {
    id: "employees",
    title: "How many people are on the team?",
    helper: "A rough range is enough.",
    options: ["1–10", "11–30", "31–75", "76–200", "More than 200"],
  },
  {
    id: "leads",
    title: "How does your sales team currently track leads?",
    helper: "This is usually where follow-ups get lost.",
    options: [
      "Excel / Google Sheets",
      "CRM",
      "WhatsApp",
      "Email",
      "Not formally tracked",
      "Other",
    ],
  },
  {
    id: "contact",
    title: "How do customers usually contact you?",
    helper: "We will meet customers where they already are.",
    options: ["WhatsApp", "Phone", "Email", "Instagram", "Walk-in", "A mix of these"],
  },
  {
    id: "invoices",
    title: "How do you create and follow up on invoices?",
    helper: "Collections are one of the fastest places to recover time.",
    options: [
      "Accounting software",
      "Excel",
      "Word or PDF",
      "WhatsApp",
      "We often forget",
      "Other",
    ],
  },
  {
    id: "software",
    title: "Which tools does the team already use?",
    helper: "Droppflow sits across them. Nothing has to be replaced on day one.",
    options: [
      "Google Workspace",
      "Accurate or Jurnal",
      "A CRM",
      "WhatsApp only",
      "Mostly spreadsheets",
      "Several tools, not connected",
    ],
  },
  {
    id: "pain",
    title: "What usually slips, or takes the most time?",
    helper: "Pick the one you would most like off the owner's plate.",
    options: [
      "Follow-ups",
      "Invoices and collections",
      "Scheduling",
      "Reporting to the owner",
      "Customer complaints",
      "All of the above",
    ],
  },
]

export type ScanReport = {
  agents: string[]
  automations: string[]
  leadWorkflows: string[]
  followWorkflows: string[]
  socialWorkflows: string[]
  notifications: string[]
  missedLeads: string
  hours: string
  workflows: number
  roadmap: { title: string; detail: string }[]
}

export function buildScanReport(answers: Record<string, string>): ScanReport {
  const agents = new Set<string>()
  const automations = new Set<string>()

  const leads = answers.leads ?? ""
  const invoices = answers.invoices ?? ""
  const contact = answers.contact ?? ""
  const industry = answers.industry ?? ""
  const pain = answers.pain ?? ""
  const employees = answers.employees ?? "11–30"

  agents.add("Lead Generation Agent")
  agents.add("Sales Agent")
  if (invoices !== "Accounting software") agents.add("Finance Agent")
  if (["WhatsApp", "Phone", "Instagram", "A mix of these"].includes(contact) || pain === "Customer complaints") {
    agents.add("Customer Service Agent")
  }
  if (
    industry === "Logistics" ||
    industry === "Construction" ||
    pain === "Scheduling" ||
    pain === "All of the above"
  ) {
    agents.add("Operations Agent")
  }
  if (contact === "Instagram" || pain === "Follow-ups" || pain === "All of the above") {
    agents.add("Marketing Agent")
  }
  agents.add("Owner Daily Briefing")

  automations.add("Website → CRM")
  if (contact === "WhatsApp" || contact === "A mix of these" || leads === "WhatsApp") {
    automations.add("WhatsApp → lead qualification")
  }
  if (leads !== "CRM" || pain === "Follow-ups" || pain === "All of the above") {
    automations.add("Lead → follow-up")
  }
  automations.add("Proposal → reminder")
  if (contact === "Instagram" || contact === "A mix of these") {
    automations.add("Social enquiry → CRM")
  }
  if (invoices !== "Accounting software" || pain === "Invoices and collections" || pain === "All of the above") {
    automations.add("Automatic invoice follow-ups")
  }
  automations.add("Daily owner briefing")
  if (industry === "Dental or clinic") automations.add("Missed appointment reminders")
  if (industry === "Construction" || industry === "Logistics") {
    automations.add("Delay alerts to the owner")
  }
  if (pain === "Customer complaints") automations.add("Repeat-complaint escalation")

  const hours: Record<string, string> = {
    "1–10": "8–12",
    "11–30": "18–26",
    "31–75": "30–46",
    "76–200": "48–72",
    "More than 200": "70–110",
  }

  const agentList = Array.from(agents)
  const automationList = Array.from(automations)

  const leadWorkflows = ["Prospect list stays simulated until a source is connected", "Score against the profile you describe", "Website enquiry lands in one inbox"]
  const followWorkflows = ["Quiet lead after one day", "Proposal with no reply", "Meeting recap the same day"]
  const socialWorkflows =
    contact === "Instagram" || contact === "A mix of these"
      ? ["Comment that asks a buying question", "Draft, then wait for approval", "Move a real enquiry into the inbox"]
      : ["Monthly draft calendar", "Nothing publishes without approval"]
  const notifications = ["Critical: a hot enquiry with no reply", "Needs a decision: a proposal gone quiet", "Daily summary for everything else"]

  return {
    agents: agentList,
    automations: automationList,
    leadWorkflows,
    followWorkflows,
    socialWorkflows,
    notifications,
    missedLeads: "6–12 leads/month",
    hours: `${hours[employees] ?? "18–26"} hours/week`,
    workflows: automationList.length + Math.max(agentList.length - 1, 1),
    roadmap: [
      {
        title: "Week 1",
        detail: "Connect the records you already have and turn on the owner briefing.",
      },
      {
        title: "Week 2",
        detail: "Start with the two agents that cover the work most often forgotten.",
      },
      {
        title: "Week 3",
        detail: "Add approval rules so sensitive actions wait for a person.",
      },
      {
        title: "Week 4",
        detail: "Invite the team and review one week of real activity together.",
      },
    ],
  }
}
