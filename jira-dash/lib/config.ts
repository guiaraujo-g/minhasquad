/** Projetos e time alinhados a squads/jira-productivity/_memory/memories.md */

export const PROJECT_KEYS = {
  al: process.env.JIRA_PROJECT_AL ?? "AL",
  ne: process.env.JIRA_PROJECT_NE ?? "NE",
  ints: process.env.JIRA_PROJECT_INTS ?? "INTS",
  ioam: process.env.JIRA_PROJECT_IOAM ?? "IOAM",
} as const;

export const TEAM_DISPLAY_NAMES: readonly string[] = [
  "Adriel Henrique Borges Cochito",
  "Antonio Balardino",
  "Bruna Elis Vogel",
  "Daniel Cruz",
  "Wellington Casas",
  "Pedro Bittencourt",
  "Jonas Elan",
  "Maria Eduarda da Silva Joaquim",
];

/** Alinhado a squads/goals-tracker/pipeline/data/jira-queries.md (`resolved`). Use `resolutiondate` só se o Jira da instância exigir. */
export function jqlResolvedFieldName(): "resolved" | "resolutiondate" {
  const v = process.env.JIRA_JQL_RESOLVED_FIELD?.trim().toLowerCase();
  if (v === "resolutiondate") return "resolutiondate";
  return "resolved";
}

export type TeamFilterMode = "displayName" | "accountId";

/**
 * `displayName` (padrão): mesmo filtro do squad (`assignee IN ("Nome",…)`).
 * `accountId`: exige `JIRA_TEAM_ACCOUNT_IDS`.
 */
export function teamFilterMode(): TeamFilterMode {
  const v = process.env.JIRA_TEAM_FILTER_MODE?.trim().toLowerCase();
  if (v === "accountid" || v === "account_id") return "accountId";
  return "displayName";
}

export function escapeJqlString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** Fragmento `assignee in (...)` ou null se accountId sem IDs. */
export function teamAssigneeInJql(): string | null {
  if (teamFilterMode() === "displayName") {
    const parts = TEAM_DISPLAY_NAMES.map((n) => `"${escapeJqlString(n)}"`);
    return `assignee in (${parts.join(", ")})`;
  }
  const ids = teamAccountIds();
  if (ids.length === 0) return null;
  return `assignee in (${ids.map((id) => `"${escapeJqlString(id)}"`).join(", ")})`;
}

/** Há filtro explícito de time para métricas N3 (squad). */
export function n3TeamScopeActive(): boolean {
  const assignee = teamAssigneeInJql();
  return assignee !== null;
}

export function storyPointsFieldId(): string {
  return process.env.JIRA_STORY_POINTS_FIELD?.trim() || "customfield_10016";
}

/** AccountIds quando `JIRA_TEAM_FILTER_MODE=accountId`. */
export function teamAccountIds(): string[] {
  const raw = process.env.JIRA_TEAM_ACCOUNT_IDS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function exactIssueCountsEnabled(): boolean {
  const v = process.env.JIRA_EXACT_ISSUE_COUNTS?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export const META_SP_PER_PERSON = 30;

export const MAX_REPORT_RANGE_DAYS = 548;

/** Máximo de colunas de mês nos pivots (referência HTML). */
export const PIVOT_MAX_MONTHS = 7;

/** Meta formal SLA N3 (Goals Tracker). */
export const N3_SLA_TARGET_PERCENT = 50;

/** Janela SLA N3 em horas (created → resolution). */
export const N3_SLA_MAX_HOURS = 48;
