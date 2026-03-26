# Domain Research Brief: Executive Reporting & Goal Tracking

**Purpose:** Inform a squad that ingests goals from Jira and Google Sheets and produces **(A)** leadership-facing reports (impediments, decisions, action plans) and **(B)** team-facing reports (transparency, engagement).

## 1. Executive Reporting Best Practices

### Frameworks and Methodologies
- **Business translation of technical metrics:** Map engineering signals to outcomes executives care about (revenue, cost, risk, speed).
- **Audience-specific framing:** Different leaders optimize for different outcomes.
- **RAG (Red–Amber–Green) status:** Standard qualitative status on dimensions such as schedule, scope, quality, dependencies, team health.
- **Action-oriented metric design:** Each metric should drive a decision.

### Output Examples
- **“Big picture” executive blurb:** One sentence on what happened and why it matters, followed by 2-4 bullets with quantified impact.
- **Weekly engineering status:** Executive verdict (on track / at risk / off track), active work, blockers needing leadership action, next 1-3 priorities.

### Common Mistakes
- Vanity metrics for executives (raw story points, commit counts).
- Metric overload (more than 4-6 KPIs).
- Technical language without translation.
- “Green” reporting until sudden red (no early warning).
- Activity-focused updates instead of outcome-focused.

### Quality Benchmarks
- **30–60 second test:** A stakeholder can answer: current status, what’s in flight, what must be unblocked.
- **Decision test:** Every chart or section implies a plausible management action.
- **Honest early warning:** Risks appear when they’re still correctable.

### Domain Vocabulary
- **Prefer:** Predictability, time-to-market, reliability, customer impact, cost of delay, risk, on track / at risk / off track, decision, trade-off, dependency, mitigation.
- **Avoid:** Story points, commits, “velocity” without context, “synergy”, undecoded acronyms, vanity counts.

## 2. Agile Goal Tracking and Impediment Reporting

### Frameworks and Methodologies
- **OKRs (Objectives & Key Results):** Objectives are qualitative aims; key results are measurable.
- **Weekly OKR check-ins:** Short recurring review of progress, confidence, blockers, next steps.
- **Confidence scoring:** Explicit probability or Likert-style “will we hit this KR?” (e.g., 0-10 or 0-100%).
- **“Five Whats” (impediment framing):** Structured questions: goal, blocker, impact, what’s been tried, ideal resolution.

### Output Examples
- **OKR check-in snippet:** KR, Progress, Confidence, Blocker, Ask, Next week.
- **“Five Whats” short form:** Doing, Blocked by, Impact, Tried, Ideal fix.

### Common Mistakes
- Tool-only reporting (Jira boards without forecasting).
- OKRs written as tasks.
- No confidence score until the KR is already lost.
- Escalation without impact or without “what we tried”.

### Quality Benchmarks
- **10-second KR read:** Progress + confidence + blocker visible at a glance.
- **Single scoring model:** Consistent confidence scoring.
- **Impediments:** Every item has owner, next action, and escalation path.

### Domain Vocabulary
- **Prefer:** Objective, Key Result, confidence, dependency, impediment, escalation, mitigation, owner, date, impact, cost of delay.
- **Avoid:** Using “OKR” for every task, ambiguous “fine” or “mostly done”, “blocked” with no owner.

## 3. Team Transparency and Engagement Reporting

### Frameworks and Methodologies
- **Transparency dimensions:** Openness on accountability, decision-making, workplace connections, and personal work.
- **Internal communications strategy:** Aligns message, channel, cadence, and audience.
- **Psychological safety:** Team climate where people speak up, admit mistakes, and disagree safely.

### Output Examples
- **Team weekly narrative:** Our focus this week, Shipped / demoed, Where we’re stuck, Decisions made / needed, How to get involved, Shout-outs.

### Common Mistakes
- Generic broadcasts to all roles.
- Corporate jargon and buzzwords.
- Transparency theater (saying “we’re transparent” without decisions, trade-offs, or bad news).
- Only cheerleading (reduces engagement versus balanced, respectful honesty).

### Quality Benchmarks
- **Alignment:** Employees can state how their work ties to goals.
- **Trust signal:** Reduced rumor-driven clarification.
- **Action loop:** Every pulse or retro theme gets owned follow-up visible next cycle.

### Domain Vocabulary
- **Prefer:** Priorities, roadmap, rationale, trade-off, impact on users/customers, we / our team, blocker, dependency, help needed, decision, learning, experiment, outcome.
- **Avoid:** Empty superlatives, vague “stakeholders”, blamey language, punitive framing.
