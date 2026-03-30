import { MAX_REPORT_RANGE_DAYS } from "../config";
import { resolvePeriod, type PeriodParseResult } from "../dates";
import { getJiraClientConfig } from "../jira/client";
import { loadFullReportData } from "./sectionLoaders";
import type { ReportResult } from "./types";

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
    return await loadFullReportData(cfg, from, to);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: `Falha ao consultar o Jira: ${msg}` };
  }
}
