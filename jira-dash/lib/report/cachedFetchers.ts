import { cache } from "react";
import { intIoamIssueSearchFields, n3TeamScopeActive } from "../config";
import { getJiraClientConfig } from "../jira/client";
import { jqlIntsIoamResolvedInRange, jqlNeResolvedInRange } from "../jira/jql";
import { searchAllIssues } from "../jira/search";
import type { JiraIssue } from "../jira/search";

/** Issues N3 do período (Diretoria SLA + Gestão tabela) — deduplicado por request via React.cache. */
export const getCachedN3IssuesInPeriod = cache(
  async (from: string, to: string): Promise<JiraIssue[]> => {
    const cfg = getJiraClientConfig();
    if (!cfg || !n3TeamScopeActive()) return [];
    return searchAllIssues(cfg, jqlNeResolvedInRange(from, to), [
      "assignee",
      "resolutiondate",
      "created",
    ]);
  },
);

/** INTS+IOAM resolvidas no intervalo (Diretoria SP total + Gestão distribuição) — React.cache por request. */
export const getCachedIntIoamResolvedIssuesInPeriod = cache(
  async (from: string, to: string): Promise<JiraIssue[]> => {
    const cfg = getJiraClientConfig();
    if (!cfg) return [];
    return searchAllIssues(cfg, jqlIntsIoamResolvedInRange(from, to), intIoamIssueSearchFields());
  },
);
