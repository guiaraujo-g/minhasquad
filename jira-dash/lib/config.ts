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

export function storyPointsFieldId(): string {
  return process.env.JIRA_STORY_POINTS_FIELD?.trim() || "customfield_10016";
}

/** AccountIds para JQL `assignee in (...)`. Vazio = métricas que dependem do filtro ficam indisponíveis. */
export function teamAccountIds(): string[] {
  const raw = process.env.JIRA_TEAM_ACCOUNT_IDS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const META_SP_PER_PERSON = 30;

export const MAX_REPORT_RANGE_DAYS = 548;

/** Máximo de colunas de mês nos pivots (referência HTML). */
export const PIVOT_MAX_MONTHS = 7;
