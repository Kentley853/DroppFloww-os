export const onboardingSteps = [
  {
    id: "company",
    title: "Connect company information",
    detail: "Legal name, entities, and the person who receives the morning briefing.",
    kind: "setup" as const,
  },
  {
    id: "drive",
    title: "Connect Google Drive",
    detail: "Proposals, contracts, and photos the agents are allowed to read.",
    kind: "integration" as const,
  },
  {
    id: "email",
    title: "Connect email",
    detail: "So follow-ups can be drafted from real threads.",
    kind: "integration" as const,
  },
  {
    id: "crm",
    title: "Connect CRM",
    detail: "Or begin from a spreadsheet if a CRM is not in place yet.",
    kind: "integration" as const,
  },
  {
    id: "accounting",
    title: "Connect accounting platform",
    detail: "Invoices, payments, and overdue balances.",
    kind: "integration" as const,
  },
  {
    id: "departments",
    title: "Configure departments",
    detail: "Sales, finance, operations, marketing, and customer service.",
    kind: "setup" as const,
  },
  {
    id: "agents",
    title: "Create agents",
    detail: "Choose who works alongside each team.",
    kind: "setup" as const,
  },
  {
    id: "permissions",
    title: "Choose approval permissions",
    detail: "Decide what agents may prepare, and what must wait for you.",
    kind: "setup" as const,
  },
  {
    id: "briefing",
    title: "Configure owner briefing",
    detail: "A morning summary on the dashboard and, later, on WhatsApp.",
    kind: "setup" as const,
  },
  {
    id: "test",
    title: "Test system",
    detail: "Run one invoice check, one follow-up, and one briefing.",
    kind: "setup" as const,
  },
  {
    id: "launch",
    title: "Launch",
    detail: "Invite the team. Sensitive actions still wait for approval.",
    kind: "setup" as const,
  },
]
