import { getAgent } from "@/agents/definitions"
import { getGrowth } from "@/data/growth"
import { formatCompactIdr, formatIdr } from "@/lib/format"
import type { AgentAnswer, AgentId, Company } from "@/types"

function includesAny(query: string, words: string[]) {
  return words.some((word) => query.includes(word))
}

function metric(company: Company, id: string) {
  return company.metrics.find((item) => item.id === id)
}

export function answerQuestion(company: Company, agentId: AgentId, rawQuery: string): AgentAnswer {
  const query = rawQuery.toLowerCase()
  const routed = routeAgent(agentId, query)
  const agent = getAgent(routed)
  const overdue = company.invoices.filter((invoice) => invoice.status === "overdue")
  const overdueTotal = overdue.reduce((sum, invoice) => sum + invoice.amount, 0)
  const openDeals = company.opportunities.filter((item) => item.status !== "won")
  const quiet = [...openDeals].sort((a, b) => b.lastContactDays - a.lastContactDays)
  const strongest = [...openDeals].sort((a, b) => b.value * b.probability - a.value * a.probability)
  const delayed = company.work.filter((item) => item.status === "delayed" || item.status === "at-risk")
  const named = findNamed(company, query)
  const growthHit = matchGrowth(company, query)
  if (!named && growthHit) return growthHit

  if (named?.kind === "opportunity") {
    const deal = named.record
    return {
      agentId: routed,
      speaker: agent.name,
      text: `${deal.company} is with ${deal.owner}. The ${company.labels.pipeline.toLowerCase()} is ${formatCompactIdr(deal.value)} at ${deal.stage.toLowerCase()}, and the last conversation was ${deal.lastContactDays === 0 ? "today" : `${deal.lastContactDays} days ago`}. ${deal.note}`,
      cards: [
        { label: company.labels.pipeline, value: formatCompactIdr(deal.value) },
        { label: "Stage", value: deal.stage },
        { label: "Last contact", value: deal.lastContact },
        { label: "Owner", value: deal.owner },
        { label: "Recommended action", value: deal.lastContactDays >= 3 ? "Follow up today" : "Keep the current owner on it" },
      ],
      actions: [
        { id: "draft", label: "Draft message" },
        { id: "open", label: `Open ${company.labels.customer.toLowerCase()}`, href: "/sales" },
        { id: "assign", label: "Assign owner" },
        { id: "remind", label: "Remind me tomorrow" },
      ],
    }
  }

  if (includesAny(query, ["owe", "overdue", "unpaid", "outstanding", "invoice", "balance", "retention", "who owes"])) {
    const lines = overdue.map((invoice) => `${invoice.customer} · ${formatCompactIdr(invoice.amount)}`).join(", ")
    return {
      agentId: "finance",
      speaker: "Finance Agent",
      text: overdue.length
        ? `${overdue.length} balances are overdue, totaling ${formatCompactIdr(overdueTotal)}. I would start with ${overdue[0].customer}. ${overdue[0].note}`
        : "Nothing is overdue right now.",
      cards: [
        { label: "Overdue", value: formatCompactIdr(overdueTotal) },
        { label: "Accounts", value: String(overdue.length) },
        { label: "Largest", value: overdue[0] ? `${overdue[0].customer}` : "—" },
        { label: "Detail", value: lines || "None" },
      ],
      actions: [
        { id: "draft", label: "Draft reminder" },
        { id: "open", label: "Open finance", href: "/finance" },
        { id: "approve", label: "Review approval", href: "/approvals" },
      ],
    }
  }

  if (includesAny(query, ["collect", "cash", "collected", "expecting"])) {
    const cash = metric(company, "cash")
    const week = includesAny(query, ["week", "expecting"])
    return {
      agentId: "finance",
      speaker: "Finance Agent",
      text: week
        ? `We are expecting ${formatCompactIdr(company.cashThisWeek)} this week. ${company.cashThisWeekNote}`
        : `Cash collected this month is ${formatIdr(cash?.value ?? 0)}, ${cash && cash.change >= 0 ? "up" : "down"} ${Math.abs(cash?.change ?? 0).toFixed(1)}% versus last month.`,
      cards: [
        { label: week ? "Expected this week" : "Collected", value: formatCompactIdr(week ? company.cashThisWeek : cash?.value ?? 0) },
        { label: "Collected this month", value: formatCompactIdr(cash?.value ?? 0) },
        { label: "Note", value: week ? company.cashThisWeekNote : cash?.context ?? "" },
      ],
      actions: [{ id: "open", label: "Open finance", href: "/finance" }],
    }
  }

  if (includesAny(query, ["revenue", "decrease", "softer", "behind", "why did"])) {
    const revenue = metric(company, "revenue")
    return {
      agentId: routed,
      speaker: agent.name,
      text: company.weeklyNarrative,
      cards: [
        { label: "Revenue this month", value: formatCompactIdr(revenue?.value ?? 0) },
        { label: "Versus last month", value: `${revenue && revenue.change >= 0 ? "+" : ""}${revenue?.change.toFixed(1)}%` },
        { label: "Collected", value: formatCompactIdr(metric(company, "cash")?.value ?? 0) },
      ],
      actions: [{ id: "open", label: "Open overview", href: "/" }],
    }
  }

  if (includesAny(query, ["focus", "attention", "today", "brief", "priority"])) {
    const top = company.pulse.slice(0, 3)
    return {
      agentId: "executive",
      speaker: "Executive Agent",
      text: `Three things need your attention. ${top.map((item, index) => `${index + 1}. ${item.title}`).join(" ")}`,
      cards: top.map((item) => ({ label: item.department, value: item.title })),
      actions: [
        { id: "open", label: "Open company pulse", href: "/pulse" },
        { id: "approve", label: "Open approvals", href: "/approvals" },
      ],
    }
  }

  if (includesAny(query, ["opportunit", "pipeline", "strongest", "bid", "treatment", "deal"])) {
    const top = strongest.slice(0, 3)
    return {
      agentId: "sales",
      speaker: "Sales Agent",
      text: `The strongest open ${company.labels.pipeline.toLowerCase()} is ${top[0]?.company ?? "none"}, at ${formatCompactIdr(top[0]?.value ?? 0)} and ${top[0]?.probability ?? 0}% probability. ${top[0]?.note ?? ""}`,
      cards: top.map((deal) => ({
        label: deal.company,
        value: `${formatCompactIdr(deal.value)} · ${deal.stage}`,
      })),
      actions: [
        { id: "draft", label: "Draft follow-up" },
        { id: "open", label: "Open sales", href: "/sales" },
      ],
    }
  }

  if (includesAny(query, ["follow", "salesperson", "quiet", "waiting", "inactive"])) {
    const stale = quiet.filter((deal) => deal.lastContactDays >= 3).slice(0, 4)
    return {
      agentId: "sales",
      speaker: "Sales Agent",
      text: stale.length
        ? `${stale.length} ${company.labels.pipeline.toLowerCase()}s have been quiet for at least three days. ${stale[0].company} is the one I would call first. ${stale[0].note}`
        : "Nothing important has been waiting more than a couple of days.",
      cards: stale.map((deal) => ({
        label: deal.owner,
        value: `${deal.company} · ${deal.lastContactDays} days`,
      })),
      actions: [
        { id: "assign", label: "Assign owner" },
        { id: "open", label: "Open sales", href: "/sales" },
      ],
    }
  }

  if (includesAny(query, ["delay", "late", "behind", "tangerang", "bsd", "appointment", "missed", "schedule", "site", "rebar", "material"])) {
    const item = delayed[0]
    return {
      agentId: "operations",
      speaker: "Operations Agent",
      text: item
        ? `${item.name} needs a look. ${item.note}`
        : "Nothing is running late right now.",
      cards: delayed.slice(0, 3).map((work) => ({
        label: work.name,
        value: work.status === "delayed" ? "Delayed" : "At risk",
      })),
      actions: [
        { id: "open", label: "Open operations", href: "/operations" },
        { id: "assign", label: "Assign owner" },
      ],
    }
  }

  if (includesAny(query, ["campaign", "ads", "marketing", "conversion", "instagram", "channel", "thursday"])) {
    const campaign = company.campaigns[0]
    return {
      agentId: "marketing",
      speaker: "Marketing Agent",
      text: campaign ? `${campaign.name} (${campaign.channel}): ${campaign.note}` : "No campaigns are active.",
      cards: company.campaigns.slice(0, 3).map((item) => ({
        label: item.channel,
        value: `${item.leads} leads · ${item.conversion}%`,
      })),
      actions: [{ id: "open", label: "Open marketing", href: "/marketing" }],
    }
  }

  if (includesAny(query, ["complaint", "risk", "unhappy", "waiting time", "support", "customer problem"])) {
    const ticket = company.tickets.find((item) => item.priority === "high") ?? company.tickets[0]
    return {
      agentId: "support",
      speaker: "Customer Service Agent",
      text: ticket ? `${ticket.customer}: ${ticket.summary}` : "No open complaints.",
      cards: company.tickets.slice(0, 3).map((item) => ({
        label: item.customer,
        value: item.subject,
      })),
      actions: [
        { id: "draft", label: "Draft reply" },
        { id: "open", label: "Open customer service", href: "/support" },
      ],
    }
  }

  const runtime = company.agents.find((item) => item.agentId === routed)
  return {
    agentId: routed,
    speaker: agent.name,
    text: runtime?.intro ?? agent.purpose,
    cards: company.contexts[routed]?.slice(0, 4),
    actions: [
      { id: "open", label: "View records", href: hrefFor(routed) },
      { id: "remind", label: "Remind me tomorrow" },
    ],
  }
}

function matchGrowth(company: Company, query: string): AgentAnswer | null {
  const growth = getGrowth(company.id)
  const hot = growth.leads.filter((lead) => lead.classification === "hot")
  const bestChannel = [...growth.channels].sort((a, b) => b.conversion - a.conversion)[0]
  const worst = [...growth.channels].filter((channel) => channel.leads > 0).sort((a, b) => a.conversion - b.conversion)[0]
  if (includesAny(query, ["best leads", "coming from", "lead source", "where are our"])) {
    return {
      agentId: "marketing",
      speaker: "Marketing Agent",
      text: `${bestChannel?.name ?? "Referral"} is producing the customers who move. ${growth.marketingNote}`,
      cards: growth.channels.slice(0, 4).map((channel) => ({ label: channel.name, value: `${channel.leads} leads · ${channel.conversion}%` })),
      actions: [{ id: "open", label: "Open marketing", href: "/growth/marketing" }],
    }
  }
  if (includesAny(query, ["hottest", "hot lead", "call today", "should we call"])) {
    return {
      agentId: "lead",
      speaker: "Lead Generation Agent",
      text: hot[0] ? `${hot[0].company} should be first. ${hot[0].reason}` : "Nothing is marked hot right now.",
      cards: hot.slice(0, 3).map((lead) => ({ label: lead.company, value: `${lead.score} · ${lead.next}` })),
      actions: [{ id: "open", label: "Open lead inbox", href: "/growth/inbox" }],
    }
  }
  if (includesAny(query, ["salesperson", "needs help", "who should we follow", "follow up with", "follow-up", "gone cold", "deals need"])) {
    const item = growth.followups[0]
    return {
      agentId: "followup",
      speaker: "Follow-Up Agent",
      text: item ? `${item.title} ${item.detail}` : "You’re caught up. New follow-up opportunities will appear here.",
      cards: growth.followups.map((follow) => ({ label: follow.company, value: follow.title })),
      actions: [
        { id: "draft", label: "Draft follow-up" },
        { id: "open", label: "Open pipeline", href: "/growth/pipeline" },
      ],
    }
  }
  if (includesAny(query, ["performing worst", "performing worse", "lead quality", "google ads"])) {
    const watch = growth.campaignWatch[0]
    return {
      agentId: "campaign",
      speaker: "Campaign Agent",
      text: watch ? `${watch.name}: ${watch.leadMove} ${watch.qualityMove} ${watch.recommendation}` : growth.marketingNote,
      cards: [{ label: "Based on", value: "Campaign data, this month" }, { label: "Weakest conversion", value: worst ? `${worst.name} · ${worst.conversion}%` : "—" }],
      actions: [{ id: "open", label: "Review campaign", href: "/growth/campaigns" }],
    }
  }
  if (includesAny(query, ["instagram", "social performance"])) {
    const ig = growth.channels.find((channel) => channel.name === "Instagram")
    return {
      agentId: "social",
      speaker: "Social Media Agent",
      text: ig ? `Instagram has ${ig.leads} enquiries this month and a ${ig.conversion}% conversion to a meeting or appointment. ${growth.marketingNote}` : growth.marketingNote,
      cards: ig ? [{ label: "Leads", value: String(ig.leads) }, { label: "Meetings", value: String(ig.meetings) }] : undefined,
      actions: [{ id: "open", label: "Open social", href: "/growth/social" }],
    }
  }
  if (includesAny(query, ["meetings did", "meetings book", "how many meetings"])) {
    return {
      agentId: "meeting",
      speaker: "Meeting Agent",
      text: `${growth.metrics.find((item) => item.id === "meetings")?.display ?? "—"} are booked this month. ${growth.meetings[0] ? `Next up: ${growth.meetings[0].company}, ${growth.meetings[0].when}.` : ""}`,
      cards: growth.meetings.slice(0, 3).map((meeting) => ({ label: meeting.company, value: meeting.when })),
      actions: [{ id: "open", label: "Open meetings", href: "/growth/meetings" }],
    }
  }
  if (includesAny(query, ["marketing focus", "what should marketing"])) {
    return {
      agentId: "marketing",
      speaker: "Marketing Agent",
      text: growth.marketingNote,
      actions: [{ id: "open", label: "Open marketing", href: "/growth/marketing" }],
    }
  }
  if (includesAny(query, ["show lead", "draft reply", "assign sales"])) {
    const lead = hot[0] ?? growth.leads[0]
    const owner = lead && lead.owner !== "Unassigned" && lead.owner !== "—" ? lead.owner : "the salesperson already on similar accounts"
    return {
      agentId: "speed",
      speaker: "Speed-to-Lead Agent",
      text: lead
        ? `${lead.company} · ${lead.name}. ${lead.reason} I would assign ${owner}. Suggested reply, not sent: ${growth.speed.sampleReply}`
        : "No open lead is waiting.",
      cards: lead
        ? [
            { label: "Score", value: String(lead.score) },
            { label: "Source", value: lead.source },
            { label: "Next", value: lead.next },
          ]
        : undefined,
      actions: [{ id: "open", label: "Open lead inbox", href: "/growth/inbox" }],
    }
  }
  if (includesAny(query, ["open the sales pipeline", "show pipeline", "show me our pipeline"])) {
    return {
      agentId: "sales",
      speaker: "Sales Agent",
      text: `The growth pipeline is ${growth.metrics.find((item) => item.id === "pipeline")?.display}. ${growth.pipelineNote}`,
      actions: [{ id: "open", label: "Open pipeline", href: "/growth/pipeline" }],
    }
  }
  return null
}

function routeAgent(current: AgentId, query: string): AgentId {
  if (current !== "executive") return current
  if (includesAny(query, ["invoice", "cash", "owe", "collect", "retention"])) return "finance"
  if (includesAny(query, ["opportunit", "proposal", "bid", "pipeline", "follow"])) return "sales"
  if (includesAny(query, ["delay", "site", "project", "appointment", "schedule"])) return "operations"
  if (includesAny(query, ["campaign", "ads", "instagram"])) return "marketing"
  if (includesAny(query, ["complaint", "ticket", "waiting time"])) return "support"
  return current
}

function hrefFor(agentId: AgentId) {
  if (agentId === "sales") return "/sales"
  if (agentId === "finance") return "/finance"
  if (agentId === "operations") return "/operations"
  if (agentId === "marketing") return "/marketing"
  if (agentId === "support") return "/support"
  if (agentId === "lead") return "/growth/leads"
  if (agentId === "speed") return "/growth/inbox"
  if (agentId === "followup") return "/growth/pipeline"
  if (agentId === "social") return "/growth/social"
  if (agentId === "campaign") return "/growth/campaigns"
  if (agentId === "meeting") return "/growth/meetings"
  return "/"
}

function findNamed(company: Company, query: string) {
  const opportunity = company.opportunities.find((item) => {
    const words = `${item.company} ${item.contact}`.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3)
    return words.some((word) => query.includes(word))
  })
  if (opportunity) return { kind: "opportunity" as const, record: opportunity }
  return null
}

export function draftFor(company: Company, query?: string) {
  const named = query ? findNamed(company, query.toLowerCase()) : null
  const deal = named?.kind === "opportunity" ? named.record : company.opportunities.find((item) => item.status === "at-risk") ?? company.opportunities[0]
  const overdue = company.invoices.find((item) => item.status === "overdue")
  if (query && includesAny(query.toLowerCase(), ["remind", "invoice", "owe", "overdue"])) {
    return `Good afternoon,\n\nI am writing about ${overdue?.number ?? "the open invoice"} for ${overdue ? formatIdr(overdue.amount) : "the outstanding balance"}. Could you confirm when payment will be scheduled?\n\nHappy to resend the document if useful.\n\nAlex`
  }
  if (!deal) return "Good afternoon,\n\nFollowing up on our last conversation. Happy to pick this up today.\n\nAlex"
  return `Good afternoon ${deal.contact.split("—")[0].trim()},\n\nFollowing up on ${deal.company}. ${deal.note} I can send the updated ${company.labels.pipeline.toLowerCase()} today if that is useful.\n\nAlex`
}

export function briefingText(company: Company) {
  const growth = getGrowth(company.id)
  const lines = [
    "Good morning.",
    "",
    "Growth briefing for 24 September.",
    "",
    `${growth.yesterday.leads} new leads yesterday.`,
    `${growth.yesterday.qualified} were qualified.`,
    `${growth.yesterday.meetings} meetings were booked.`,
    `Estimated new pipeline: ${growth.yesterday.pipeline}.`,
    "",
    growth.yesterday.note,
    "",
    "Company",
    ...company.metrics.slice(0, 2).map((item) => `${item.label}: ${item.format === "idr" ? formatCompactIdr(item.value) : item.value}`),
    "",
    "Attention",
    ...company.pulse.slice(0, 2).map((item, index) => `${index + 1}. ${item.title}`),
    "",
    "Reply: show lead, draft reply, assign sales, or show pipeline.",
  ]
  return lines.join("\n")
}

export function searchRecords(company: Company, query: string) {
  const q = query.toLowerCase().trim()
  if (q.length < 2) return []
  const results: { title: string; meta: string; href: string }[] = []
  for (const deal of company.opportunities) {
    if (`${deal.company} ${deal.contact}`.toLowerCase().includes(q)) {
      results.push({ title: deal.company, meta: `${company.labels.pipeline} · ${deal.stage}`, href: "/sales" })
    }
  }
  for (const invoice of company.invoices) {
    if (`${invoice.customer} ${invoice.number}`.toLowerCase().includes(q)) {
      results.push({ title: invoice.customer, meta: `${invoice.number} · ${invoice.status}`, href: "/finance" })
    }
  }
  for (const work of company.work) {
    if (work.name.toLowerCase().includes(q)) {
      results.push({ title: work.name, meta: work.status, href: "/operations" })
    }
  }
  for (const ticket of company.tickets) {
    if (`${ticket.customer} ${ticket.subject}`.toLowerCase().includes(q)) {
      results.push({ title: ticket.customer, meta: ticket.subject, href: "/support" })
    }
  }
  for (const lead of getGrowth(company.id).leads) {
    if (`${lead.company} ${lead.name}`.toLowerCase().includes(q)) {
      results.push({ title: lead.company, meta: `${lead.source} · ${lead.classification}`, href: "/growth/inbox" })
    }
  }
  return results.slice(0, 6)
}
