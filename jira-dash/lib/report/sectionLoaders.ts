import {
  META_SP_PER_PERSON,
  PIVOT_MAX_MONTHS,
  exactIssueCountsEnabled,
  intIoamIssueSearchFields,
  n3TeamScopeActive,
  storyPointsFieldIds as getStoryPointsFieldIds,
} from "../config";
import {
  firstDayUtc,
  formatDateBr,
  lastDayUtc,
  lastNMonthKeys,
  monthKeyFromIso,
  monthLabelPt,
} from "../dates";
import type { JiraClientConfig } from "../jira/client";
import {
  jqlAlCreatedInRange,
  jqlAlResolvedInRange,
  jqlIntsIoamResolvedInRange,
  jqlNeResolvedInRange,
} from "../jira/jql";
import { searchAllIssues, searchExactIssueCount, searchTotal } from "../jira/search";
import {
  buildPivotCountRows,
  buildPivotSpRows,
  computeN3Sla,
  countByLabels,
  assigneeName,
  priorityName,
  safeSprintSpTotal,
  sortCountRowsTeamFirst,
  sumSpByAssignee,
} from "./aggregations";
import { getCachedN3IssuesInPeriod } from "./cachedFetchers";
import { buildJqlSnapshot } from "./jqlSnapshot";
import type {
  DiretoriaSectionData,
  GestaoSectionData,
  HistoricoSectionData,
  ReportDTO,
} from "./types";

export type SectionResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function issueCount(cfg: JiraClientConfig, jql: string): Promise<number> {
  if (exactIssueCountsEnabled()) {
    return searchExactIssueCount(cfg, jql);
  }
  return searchTotal(cfg, jql);
}

function sectionError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  return `Falha ao consultar o Jira: ${msg}`;
}

export async function loadDiretoriaSection(
  cfg: JiraClientConfig,
  from: string,
  to: string,
  periodLabelBr: string,
): Promise<SectionResult<DiretoriaSectionData>> {
  const n3Active = n3TeamScopeActive();
  const spFieldIds = getStoryPointsFieldIds();

  try {
    const n3IssuesP = n3Active ? getCachedN3IssuesInPeriod(from, to) : Promise.resolve([]);
    const [alCreatedTotal, alResolvedTotal, n3Total, n3Issues, sprint] = await Promise.all([
      issueCount(cfg, jqlAlCreatedInRange(from, to)),
      issueCount(cfg, jqlAlResolvedInRange(from, to)),
      n3Active ? issueCount(cfg, jqlNeResolvedInRange(from, to)) : Promise.resolve(0),
      n3IssuesP,
      safeSprintSpTotal(cfg, spFieldIds),
    ]);

    const n3Sla = n3Active ? computeN3Sla(n3Issues) : null;

    return {
      ok: true,
      data: {
        period: { from, to },
        periodLabelBr,
        alCreatedTotal,
        alResolvedTotal,
        sprintSpTotal: sprint.total,
        sprintSpNote: sprint.note,
        n3ResolvedTeamTotal: n3Active ? n3Total : null,
        n3Note: n3Active
          ? null
          : "Sem filtro de time para N3: o padrão é displayName (nomes em código); ou use JIRA_TEAM_FILTER_MODE=accountId e JIRA_TEAM_ACCOUNT_IDS.",
        n3Sla,
      },
    };
  } catch (e) {
    return { ok: false, error: sectionError(e) };
  }
}

export async function loadGestaoSection(
  cfg: JiraClientConfig,
  from: string,
  to: string,
): Promise<SectionResult<GestaoSectionData>> {
  const n3Active = n3TeamScopeActive();
  const spFieldIds = getStoryPointsFieldIds();
  const fieldsIntIoam = intIoamIssueSearchFields();

  try {
    const [alResolvedIssues, alCreatedIssues, intIoamIssues, n3Issues] = await Promise.all([
      searchAllIssues(cfg, jqlAlResolvedInRange(from, to), ["assignee", "priority"]),
      searchAllIssues(cfg, jqlAlCreatedInRange(from, to), ["priority"]),
      searchAllIssues(cfg, jqlIntsIoamResolvedInRange(from, to), fieldsIntIoam),
      n3Active ? getCachedN3IssuesInPeriod(from, to) : Promise.resolve([]),
    ]);

    const intIoamSpRows = sumSpByAssignee(intIoamIssues, spFieldIds);
    const intIoamSpSum = intIoamSpRows.reduce((s, r) => s + r.sp, 0);
    const intIoamSpNote =
      intIoamIssues.length === 0
        ? "Nenhuma issue INTS+IOAM resolvida no período com a JQL atual."
        : intIoamSpSum === 0
          ? "Issues retornadas, mas nenhum Story Point reconhecido. Confira JIRA_STORY_POINTS_FIELD no export JSON da issue ou defina JIRA_INTIOAM_SP_FIELDS=navigable."
          : null;

    return {
      ok: true,
      data: {
        alResolvedByAssignee: sortCountRowsTeamFirst(
          countByLabels(alResolvedIssues, assigneeName),
        ),
        alCreatedByPriority: countByLabels(alCreatedIssues, priorityName).sort(
          (a, b) => b.count - a.count,
        ),
        intIoamSpCompletedByAssignee: intIoamSpRows,
        intIoamSpNote,
        n3ResolvedByAssignee: n3Active
          ? sortCountRowsTeamFirst(countByLabels(n3Issues, assigneeName))
          : [],
        metaSpPerPerson: META_SP_PER_PERSON,
      },
    };
  } catch (e) {
    return { ok: false, error: sectionError(e) };
  }
}

export async function loadHistoricoSection(
  cfg: JiraClientConfig,
  to: string,
): Promise<SectionResult<HistoricoSectionData>> {
  const n3Active = n3TeamScopeActive();
  const spFieldIds = getStoryPointsFieldIds();
  const endYm = monthKeyFromIso(to);
  const monthKeys = lastNMonthKeys(endYm, PIVOT_MAX_MONTHS);
  const histFrom = firstDayUtc(monthKeys[0] ?? endYm);
  const histTo = lastDayUtc(endYm);
  const fieldsIntIoam = intIoamIssueSearchFields();

  try {
    const [histIntIoam, histAl, histNe] = await Promise.all([
      searchAllIssues(cfg, jqlIntsIoamResolvedInRange(histFrom, histTo), fieldsIntIoam),
      searchAllIssues(cfg, jqlAlResolvedInRange(histFrom, histTo), [
        "assignee",
        "resolutiondate",
      ]),
      n3Active
        ? searchAllIssues(cfg, jqlNeResolvedInRange(histFrom, histTo), [
            "assignee",
            "resolutiondate",
          ])
        : Promise.resolve([]),
    ]);

    const months = monthKeys.map((key) => ({
      key,
      label: monthLabelPt(key),
    }));

    return {
      ok: true,
      data: {
        historico: {
          months,
          spPivot: buildPivotSpRows(histIntIoam, monthKeys, spFieldIds),
          alResolvedPivot: buildPivotCountRows(histAl, monthKeys),
          n3Pivot: n3Active ? buildPivotCountRows(histNe, monthKeys) : [],
        },
      },
    };
  } catch (e) {
    return { ok: false, error: sectionError(e) };
  }
}

/** Monta `ReportDTO` completo (ex.: `buildReport`); executa as três seções em paralelo. */
export async function loadFullReportData(
  cfg: JiraClientConfig,
  from: string,
  to: string,
): Promise<SectionResult<ReportDTO>> {
  const periodLabelBr = `${formatDateBr(from)} a ${formatDateBr(to)}`;
  const [dir, gest, hist] = await Promise.all([
    loadDiretoriaSection(cfg, from, to, periodLabelBr),
    loadGestaoSection(cfg, from, to),
    loadHistoricoSection(cfg, to),
  ]);

  if (!dir.ok) return dir;
  if (!gest.ok) return gest;
  if (!hist.ok) return hist;

  return {
    ok: true,
    data: {
      ...dir.data,
      ...gest.data,
      ...hist.data,
      jqlUsed: buildJqlSnapshot(from, to),
      storyPointsFieldIds: getStoryPointsFieldIds(),
    },
  };
}
