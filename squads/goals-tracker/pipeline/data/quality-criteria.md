# Quality Criteria: Executive Reporting & Goal Tracking

## Leadership Report Criteria
- [ ] **Canonical layout (obrigatório em todo run):** O `leadership-report.md` contém **apenas** as quatro seções, nesta ordem: Resumo executivo (1 frase + 2–4 bullets) → Status das metas (RAG), quatro áreas de `squad-goals.md` → Impedimentos e decisões (Five Whats) → Próximos passos recomendados. **Sem** Painel gestor, Painel de progresso, seções A–E, RAG em tabela duplicada. O `leadership-report.html` espelha o run `2026-03-26-112700`: **um** `progressChart` Chart.js; sem painel gestor HTML nem gráficos extras. Ver `pipeline/steps/step-03-write.md`.
- [ ] **30-60 Second Test:** A stakeholder can read the report in under a minute and answer: current status, what's in flight, and what must be unblocked.
- [ ] **Decision Test:** Every highlighted risk or impediment implies a plausible management action or decision.
- [ ] **Bounded Surface:** Presents a maximum of 4-6 top-level metrics/goals without overwhelming technical detail.
- [ ] **Outcome Linkage:** Metrics are translated into business outcomes (efficiency, customer impact, risk) rather than vanity metrics (story points, commit counts).
- [ ] **Impediment Clarity:** Major blockers follow the "Five Whats" structure (Goal, Blocker, Impact, Tried, Ideal Fix) and include an owner and next action.

## Team Report Criteria
- [ ] **Alignment:** Clearly connects recent work and shipped items to the overarching semester goals.
- [ ] **Transparency:** Honestly acknowledges blockers and trade-offs without blamey language.
- [ ] **Recognition:** Includes specific shout-outs to team members for their contributions, avoiding generic praise.
- [ ] **Jargon-Free:** Avoids corporate buzzwords ("synergy", "move the needle") and undecoded acronyms.
- [ ] **Action Loop:** Clearly states decisions made, why they were made, and how the team can get involved or provide feedback.

## General Criteria
- [ ] **Data Accuracy:** Accurately reflects the data pulled from Jira and Google Sheets.
- [ ] **Consistent Scoring:** Uses a consistent confidence scoring model (e.g., RAG) across all goals.
- [ ] **Balanced Narrative:** Highlights both wins and challenges; does not present "green" reporting if there are underlying risks.
