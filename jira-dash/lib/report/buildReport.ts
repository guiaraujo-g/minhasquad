import {
  MAX_REPORT_RANGE_DAYS,
  META_SP_PER_PERSON,
  PIVOT_MAX_MONTHS,
  PROJECT_KEYS,
  TEAM_DISPLAY_NAMES,
  exactIssueCountsEnabled,
  n3TeamScopeActive,
  N3_SLA_MAX_HOURS,
  N3_SLA_TARGET_PERCENT,
  storyPointsFieldId,
} from "../config";
import {
  firstDayUtc,
  formatDateBr,
  lastDayUtc,
  lastNMonthKeys,
  monthKeyFromIso,
  monthLabelPt,
  resolvePeriod,
  type PeriodParseResult,
} from "../dates";
import type { JiraClientConfig } from "../jira/client";
import { getJiraClientConfig } from "../jira/client";
import {
  jqlAlCreatedInRange,
  jqlAlResolvedInRange,
  jqlIntsIoamOpenSprint,
  jqlIntsIoamResolvedInRange,
  jqlNeResolvedInRange,
} from "../jira/jql";
import { searchAllIssues, searchExactIssueCount, searchTotal } from "../jira/search";
import type { JiraIssue } from "../jira/search";
import type {
  CountRow,
  HistoricoMonth,
  JqlSnapshotItem,
  N3SlaSummary,
  PivotRow,
  ReportDTO,
  ReportResult,
  SpRow,
} from "./types";

function assigneeName(fields: Record<string, unknown>): string {
  const a = fields.assignee as { displayName?: string } | null | undefined;
  const n = a?.displayName?.trim();
  return n || "Não atribuído";
}

function priorityName(fields: Record<string, unknown>): string {
  const p = fields.priority as { name?: string } | null | undefined;
  return p?.name?.trim() || "Outros";
}

function storyPointsFrom(fields: Record<string, unknown>, fieldId: string): number {
  const v = fields[fieldId];
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function parseJiraDateTime(iso: unknown): number | null {
  if (typeof iso !== "string" || iso.length < 10) return null;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : null;
}

function computeN3Sla(issues: JiraIssue[]): N3SlaSummary {
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

async function issueCount(cfg: JiraClientConfig, jql: string): Promise<number> {
  if (exactIssueCountsEnabled()) {
    return searchExactIssueCount(cfg, jql);
  }
  return searchTotal(cfg, jql);
}

function buildJqlSnapshot(from: string, to: string): JqlSnapshotItem[] {
  const items: JqlSnapshotItem[] = [
    { id: "al_created", label: "AL criados no período", jql: jqlAlCreatedInRange(from, to) },
    { id: "al_resolved", label: "AL resolvidos no período", jql: jqlAlResolvedInRange(from, to) },
    {
      id: "ints_ioam_resolved",
      label: "INTS+IOAM resolvidos no período",
      jql: jqlIntsIoamResolvedInRange(from, to),
    },
    { id: "ints_ioam_open_sprint", label: "INTS+IOAM · sprint aberta (soma SP)", jql: jqlIntsIoamOpenSprint() },
  ];
  if (n3TeamScopeActive()) {
    items.splice(3, 0, {
      id: "ne_resolved_team",
      label: `${PROJECT_KEYS.ne} (N3) resolvidos no período · time`,
      jql: jqlNeResolvedInRange(from, to),
    });
  }
  return items;
}

function resolutionMonthKey(fields: Record<string, unknown>): string | null {
  const rd = fields.resolutiondate;
  if (typeof rd !== "string" || rd.length < 7) return null;
  return rd.slice(0, 7);
}

function sortCountRowsTeamFirst(rows: CountRow[]): CountRow[] {
  const order = new Map(TEAM_DISPLAY_NAMES.map((n, i) => [n, i]));
  return [...rows].sort((a, b) => {
    const ia = order.has(a.label) ? (order.get(a.label) as number) : 999;
    const ib = order.has(b.label) ? (order.get(b.label) as number) : 999;
    if (ia !== ib) return ia - ib;
    return a.label.localeCompare(b.label, "pt-BR");
  });
}

function sortSpRowsTeamFirst(rows: SpRow[]): SpRow[] {
  const order = new Map(TEAM_DISPLAY_NAMES.map((n, i) => [n, i]));
  return [...rows].sort((a, b) => {
    const ia = order.has(a.label) ? (order.get(a.label) as number) : 999;
    const ib = order.has(b.label) ? (order.get(b.label) as number) : 999;
    if (ia !== ib) return ia - ib;
    return a.label.localeCompare(b.label, "pt-BR");
  });
}

function countByLabels(issues: JiraIssue[], labelFn: (f: Record<string, unknown>) => string): CountRow[] {
  const map = new Map<string, number>();
  for (const iss of issues) {
    const lab = labelFn(iss.fields);
    map.set(lab, (map.get(lab) ?? 0) + 1);
  }
  return [...map.entries()].map(([label, count]) => ({ label, count }));
}

function sumSpByAssignee(issues: JiraIssue[], spField: string): SpRow[] {
  const map = new Map<string, number>();
  for (const iss of issues) {
    const name = assigneeName(iss.fields);
    const sp = storyPointsFrom(iss.fields, spField);
    map.set(name, (map.get(name) ?? 0) + sp);
  }
  return [...map.entries()].map(([label, sp]) => ({ label, sp }));
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

function buildPivotCountRows(issues: JiraIssue[], monthKeys: string[]): PivotRow[] {
  return buildPivotRows(issues, monthKeys, () => 1);
}

function buildPivotSpRows(issues: JiraIssue[], monthKeys: string[], spField: string): PivotRow[] {
  return buildPivotRows(issues, monthKeys, (iss) => storyPointsFrom(iss.fields, spField));
}

async function safeSprintSpTotal(cfg: JiraClientConfig, spField: string): Promise<{ total: number | null; note: string | null }> {
  try {
    const issues = await searchAllIssues(cfg, jqlIntsIoamOpenSprint(), ["assignee", spField]);
    let sum = 0;
    for (const iss of issues) {
      sum += storyPointsFrom(iss.fields, spField);
    }
    return { total: sum, note: null };
  } catch {
    return {
      total: null,
      note: "Não foi possível carregar a sprint aberta (permissão, JQL ou API).",
    };
  }
}

async function computeReport(cfg: JiraClientConfig, from: string, to: string): Promise<ReportResult> {
  const spField = storyPointsFieldId();
  const n3Active = n3TeamScopeActive();

  const alCreatedTotalP = issueCount(cfg, jqlAlCreatedInRange(from, to));
  const alResolvedTotalP = issueCount(cfg, jqlAlResolvedInRange(from, to));
  const alResolvedIssuesP = searchAllIssues(cfg, jqlAlResolvedInRange(from, to), [
    "assignee",
    "priority",
  ]);
  const alCreatedIssuesP = searchAllIssues(cfg, jqlAlCreatedInRange(from, to), ["priority"]);

  const intIoamIssuesP = searchAllIssues(cfg, jqlIntsIoamResolvedInRange(from, to), [
    "assignee",
    spField,
    "resolutiondate",
  ]);

  const n3TotalP = n3Active
    ? issueCount(cfg, jqlNeResolvedInRange(from, to))
    : Promise.resolve(0);
  const n3IssuesP = n3Active
    ? searchAllIssues(cfg, jqlNeResolvedInRange(from, to), [
        "assignee",
        "resolutiondate",
        "created",
      ])
    : Promise.resolve([] as JiraIssue[]);

  const sprintP = safeSprintSpTotal(cfg, spField);

  const endYm = monthKeyFromIso(to);
  const monthKeys = lastNMonthKeys(endYm, PIVOT_MAX_MONTHS);
  const histFrom = firstDayUtc(monthKeys[0] ?? endYm);
  const histTo = lastDayUtc(endYm);

  const histIntIoamP = searchAllIssues(
    cfg,
    jqlIntsIoamResolvedInRange(histFrom, histTo),
    ["assignee", spField, "resolutiondate"],
  );
  const histAlP = searchAllIssues(cfg, jqlAlResolvedInRange(histFrom, histTo), [
    "assignee",
    "resolutiondate",
  ]);
  const histNeP = n3Active
    ? searchAllIssues(cfg, jqlNeResolvedInRange(histFrom, histTo), [
        "assignee",
        "resolutiondate",
      ])
    : Promise.resolve([] as JiraIssue[]);

  const [
    alCreatedTotal,
    alResolvedTotal,
    alResolvedIssues,
    alCreatedIssues,
    intIoamIssues,
    n3Total,
    n3Issues,
    sprint,
    histIntIoam,
    histAl,
    histNe,
  ] = await Promise.all([
    alCreatedTotalP,
    alResolvedTotalP,
    alResolvedIssuesP,
    alCreatedIssuesP,
    intIoamIssuesP,
    n3TotalP,
    n3IssuesP,
    sprintP,
    histIntIoamP,
    histAlP,
    histNeP,
  ]);

  const alResolvedByAssignee = sortCountRowsTeamFirst(
    countByLabels(alResolvedIssues, assigneeName),
  );
  const alCreatedByPriority = countByLabels(alCreatedIssues, priorityName).sort(
    (a, b) => b.count - a.count,
  );

  const intIoamSpCompletedByAssignee = sortSpRowsTeamFirst(
    sumSpByAssignee(intIoamIssues, spField),
  );

  const n3ResolvedByAssignee = n3Active
    ? sortCountRowsTeamFirst(countByLabels(n3Issues, assigneeName))
    : [];

  const n3Sla: N3SlaSummary | null = n3Active ? computeN3Sla(n3Issues) : null;

  const months: HistoricoMonth[] = monthKeys.map((key) => ({
    key,
    label: monthLabelPt(key),
  }));

  const spPivot = buildPivotSpRows(histIntIoam, monthKeys, spField);
  const alResolvedPivot = buildPivotCountRows(histAl, monthKeys);
  const n3Pivot = n3Active ? buildPivotCountRows(histNe, monthKeys) : [];

  const data: ReportDTO = {
    period: { from, to },
    periodLabelBr: `${formatDateBr(from)} a ${formatDateBr(to)}`,
    alCreatedTotal,
    alResolvedTotal,
    alResolvedByAssignee,
    alCreatedByPriority,
    sprintSpTotal: sprint.total,
    sprintSpNote: sprint.note,
    n3ResolvedTeamTotal: n3Active ? n3Total : null,
    n3Note: n3Active
      ? null
      : "Sem filtro de time para N3: o padrão é displayName (nomes em código); ou use JIRA_TEAM_FILTER_MODE=accountId e JIRA_TEAM_ACCOUNT_IDS.",
    n3ResolvedByAssignee,
    intIoamSpCompletedByAssignee,
    metaSpPerPerson: META_SP_PER_PERSON,
    jqlUsed: buildJqlSnapshot(from, to),
    n3Sla,
    historico: {
      months,
      spPivot,
      alResolvedPivot,
      n3Pivot,
    },
  };

  return { ok: true, data };
}

export async function buildReport(
  fromParam: string | undefined,
  toParam: string | undefined,
): Promise<ReportResult> {
  const period: PeriodParseResult = resolvePeriod(fromParam, toParam, MAX_REPORT_RANGE_DAYS);
  if (!period.ok) {
    return { ok: false, error: period.error };
  }

  const { from, to } = period;
  const cfg = getJiraClientConfig();
  if (!cfg) {
    return {
      ok: false,
      error:
        "Configure JIRA_BASE_URL, JIRA_EMAIL e JIRA_API_TOKEN em .env.local (veja .env.example).",
    };
  }

  try {
    return await computeReport(cfg, from, to);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: `Falha ao consultar o Jira: ${msg}` };
  }
}
