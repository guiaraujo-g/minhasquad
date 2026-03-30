import {
  N3_SLA_MAX_HOURS,
  N3_SLA_TARGET_PERCENT,
  TEAM_DISPLAY_NAMES,
  intIoamIssueSearchFields,
} from "../config";
import type { JiraClientConfig } from "../jira/client";
import { jqlIntsIoamOpenSprint } from "../jira/jql";
import { storyPointsFromIssueFields } from "../jira/storyPoints";
import { searchAllIssues } from "../jira/search";
import type { JiraIssue } from "../jira/search";
import type { CountRow, N3SlaSummary, PivotRow, SpRow } from "./types";

export function assigneeName(fields: Record<string, unknown>): string {
  const a = fields.assignee as { displayName?: string } | null | undefined;
  const n = a?.displayName?.trim();
  return n || "Não atribuído";
}

export function priorityName(fields: Record<string, unknown>): string {
  const p = fields.priority as { name?: string } | null | undefined;
  return p?.name?.trim() || "Outros";
}

function parseJiraDateTime(iso: unknown): number | null {
  if (typeof iso !== "string" || iso.length < 10) return null;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : null;
}

export function computeN3Sla(issues: JiraIssue[]): N3SlaSummary {
  let within = 0;
  let missing = 0;
  const maxMs = N3_SLA_MAX_HOURS * 60 * 60 * 1000;
  for (const iss of issues) {
    const c = parseJiraDateTime(iss.fields.created);
    const r = parseJiraDateTime(iss.fields.resolutiondate);
    if (c === null || r === null) {
      missing++;
      continue;
    }
    if (r - c <= maxMs) within++;
  }
  const n = issues.length;
  const share = n > 0 ? (100 * within) / n : 0;
  return {
    n,
    within48h: within,
    sharePercent: Math.round(share * 100) / 100,
    targetPercent: N3_SLA_TARGET_PERCENT,
    note:
      missing > 0
        ? `${missing} ticket(s) sem created ou resolutiondate utilizável.`
        : null,
  };
}

export function resolutionMonthKey(fields: Record<string, unknown>): string | null {
  const rd = fields.resolutiondate;
  if (typeof rd !== "string" || rd.length < 7) return null;
  return rd.slice(0, 7);
}

export function sortCountRowsTeamFirst(rows: CountRow[]): CountRow[] {
  const order = new Map(TEAM_DISPLAY_NAMES.map((n, i) => [n, i]));
  return [...rows].sort((a, b) => {
    const ia = order.has(a.label) ? (order.get(a.label) as number) : 999;
    const ib = order.has(b.label) ? (order.get(b.label) as number) : 999;
    if (ia !== ib) return ia - ib;
    return a.label.localeCompare(b.label, "pt-BR");
  });
}

export function sortSpRowsTeamFirst(rows: SpRow[]): SpRow[] {
  const order = new Map(TEAM_DISPLAY_NAMES.map((n, i) => [n, i]));
  return [...rows].sort((a, b) => {
    const ia = order.has(a.label) ? (order.get(a.label) as number) : 999;
    const ib = order.has(b.label) ? (order.get(b.label) as number) : 999;
    if (ia !== ib) return ia - ib;
    return a.label.localeCompare(b.label, "pt-BR");
  });
}

export function countByLabels(
  issues: JiraIssue[],
  labelFn: (f: Record<string, unknown>) => string,
): CountRow[] {
  const map = new Map<string, number>();
  for (const iss of issues) {
    const lab = labelFn(iss.fields);
    map.set(lab, (map.get(lab) ?? 0) + 1);
  }
  return [...map.entries()].map(([label, count]) => ({ label, count }));
}

export function sumSpByAssignee(issues: JiraIssue[], spFieldIds: readonly string[]): SpRow[] {
  const map = new Map<string, number>();
  for (const name of TEAM_DISPLAY_NAMES) {
    map.set(name, 0);
  }
  for (const iss of issues) {
    const name = assigneeName(iss.fields);
    const sp = storyPointsFromIssueFields(iss.fields, spFieldIds);
    map.set(name, (map.get(name) ?? 0) + sp);
  }
  return sortSpRowsTeamFirst([...map.entries()].map(([label, sp]) => ({ label, sp })));
}

function buildPivotRows(
  issues: JiraIssue[],
  monthKeys: string[],
  valueFn: (iss: JiraIssue) => number,
): PivotRow[] {
  const monthIndex = new Map(monthKeys.map((k, i) => [k, i]));
  const perPerson = new Map<string, number[]>();

  for (const name of TEAM_DISPLAY_NAMES) {
    perPerson.set(name, monthKeys.map(() => 0));
  }

  for (const iss of issues) {
    const mk = resolutionMonthKey(iss.fields);
    if (!mk) continue;
    const idx = monthIndex.get(mk);
    if (idx === undefined) continue;
    const name = assigneeName(iss.fields);
    if (!perPerson.has(name)) {
      perPerson.set(name, monthKeys.map(() => 0));
    }
    const row = perPerson.get(name)!;
    row[idx] += valueFn(iss);
  }

  const rows: PivotRow[] = [];
  for (const [label, byMonth] of perPerson) {
    const total = byMonth.reduce((a, b) => a + b, 0);
    if (total > 0 || TEAM_DISPLAY_NAMES.includes(label)) {
      rows.push({ label, byMonth: [...byMonth], total });
    }
  }

  rows.sort((a, b) => {
    const oa = TEAM_DISPLAY_NAMES.indexOf(a.label);
    const ob = TEAM_DISPLAY_NAMES.indexOf(b.label);
    const ia = oa === -1 ? 999 : oa;
    const ib = ob === -1 ? 999 : ob;
    if (ia !== ib) return ia - ib;
    return a.label.localeCompare(b.label, "pt-BR");
  });

  const totalRow: number[] = monthKeys.map((_, i) => rows.reduce((s, r) => s + r.byMonth[i], 0));
  const grand = totalRow.reduce((a, b) => a + b, 0);
  rows.push({ label: "Total", byMonth: totalRow, total: grand });

  return rows;
}

export function buildPivotCountRows(issues: JiraIssue[], monthKeys: string[]): PivotRow[] {
  return buildPivotRows(issues, monthKeys, () => 1);
}

export function buildPivotSpRows(
  issues: JiraIssue[],
  monthKeys: string[],
  spFieldIds: readonly string[],
): PivotRow[] {
  return buildPivotRows(issues, monthKeys, (iss) =>
    storyPointsFromIssueFields(iss.fields, spFieldIds),
  );
}

export async function safeSprintSpTotal(
  cfg: JiraClientConfig,
  spFieldIds: readonly string[],
): Promise<{ total: number | null; note: string | null }> {
  try {
    const issues = await searchAllIssues(cfg, jqlIntsIoamOpenSprint(), intIoamIssueSearchFields());
    let sum = 0;
    for (const iss of issues) {
      sum += storyPointsFromIssueFields(iss.fields, spFieldIds);
    }
    return { total: sum, note: null };
  } catch {
    return {
      total: null,
      note: "Não foi possível carregar a sprint aberta (permissão, JQL ou API).",
    };
  }
}
