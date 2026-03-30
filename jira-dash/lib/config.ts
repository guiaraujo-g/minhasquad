/** Projetos e time alinhados a squads/jira-productivity/_memory/memories.md */

export const PROJECT_KEYS = {
  al: process.env.JIRA_PROJECT_AL ?? "AL",
  ne: process.env.JIRA_PROJECT_NE ?? "NE",
  ints: process.env.JIRA_PROJECT_INTS ?? "INTS",
  ioam: process.env.JIRA_PROJECT_IOAM ?? "IOAM",
} as const;

/** Ordem em que o atalho “sprint atual” consulta boards (default: INTS → IOAM). */
export function activeSprintProjectQueryOrder(): readonly string[] {
  const v = process.env.JIRA_ACTIVE_SPRINT_PROJECT?.trim().toUpperCase();
  const { ints, ioam } = PROJECT_KEYS;
  if (!v) return [ints, ioam];
  if (v === ioam.toUpperCase() || v === "IOAM") return [ioam, ints];
  return [ints, ioam];
}

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

const DEFAULT_STORY_POINTS_FIELD = "customfield_10016";

/** IDs de custom field para Story Points (vírgula = fallback em ordem). */
export function storyPointsFieldIds(): string[] {
  const raw = process.env.JIRA_STORY_POINTS_FIELD?.trim();
  if (!raw) return [DEFAULT_STORY_POINTS_FIELD];
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    if (!seen.has(p)) {
      seen.add(p);
      out.push(p);
    }
  }
  return out.length > 0 ? out : [DEFAULT_STORY_POINTS_FIELD];
}

/** Primeiro ID (compatível com código legado e uma única coluna na API). */
export function storyPointsFieldId(): string {
  return storyPointsFieldIds()[0] ?? DEFAULT_STORY_POINTS_FIELD;
}

/** Une campos base com todos os IDs de SP para `search/jql`. */
export function jiraSearchFieldsWithStoryPoints(base: readonly string[]): string[] {
  return [...new Set([...base, ...storyPointsFieldIds()])];
}

/**
 * Campos para issues INTS+IOAM onde lemos Story Points.
 * `navigable` usa `*navigable` na API (útil quando `customfield_*` explícitos não aparecem no JSON).
 */
export function intIoamIssueSearchFields(): string[] {
  const v = process.env.JIRA_INTIOAM_SP_FIELDS?.trim().toLowerCase();
  if (v === "navigable" || v === "*navigable") {
    return ["*navigable"];
  }
  return jiraSearchFieldsWithStoryPoints(["assignee", "resolutiondate"]);
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
