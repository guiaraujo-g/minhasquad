import type { JiraClientConfig } from "./client";
import { jiraFetchJson } from "./client";

export type JiraIssue = {
  id: string;
  key: string;
  fields: Record<string, unknown>;
};

/**
 * Resposta de POST /rest/api/3/search/jql (enhanced search).
 * O POST /rest/api/3/search legado retorna 410 Gone no Jira Cloud.
 */
export type JiraSearchJqlResponse = {
  issues: JiraIssue[];
  isLast: boolean;
  nextPageToken?: string;
};

/**
 * POST /rest/api/3/search/jql (Jira Cloud).
 * @see https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-search-jql-post
 */
export async function searchIssuesPage(
  cfg: JiraClientConfig,
  body: {
    jql: string;
    maxResults: number;
    fields: string[];
    nextPageToken?: string;
  },
): Promise<JiraSearchJqlResponse> {
  const payload: Record<string, unknown> = {
    jql: body.jql,
    maxResults: body.maxResults,
    fields: body.fields,
  };
  if (body.nextPageToken) {
    payload.nextPageToken = body.nextPageToken;
  }
  return jiraFetchJson<JiraSearchJqlResponse>(cfg, "/rest/api/3/search/jql", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Contagem via POST /rest/api/3/search/approximate-count (substitui total + maxResults=0 do search legado).
 * @see https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-search-approximate-count-post
 */
export async function searchTotal(cfg: JiraClientConfig, jql: string): Promise<number> {
  const res = await jiraFetchJson<{ count: number }>(cfg, "/rest/api/3/search/approximate-count", {
    method: "POST",
    body: JSON.stringify({ jql }),
  });
  return typeof res.count === "number" ? res.count : 0;
}

const PAGE_SIZE = 100;

/** Contagem exata paginando `search/jql` (mais lenta; alinha a runs do squad sem approximate-count). */
export async function searchExactIssueCount(cfg: JiraClientConfig, jql: string): Promise<number> {
  let count = 0;
  let nextPageToken: string | undefined;
  for (;;) {
    const res = await searchIssuesPage(cfg, {
      jql,
      maxResults: PAGE_SIZE,
      fields: ["key"],
      nextPageToken,
    });
    count += res.issues.length;
    if (res.isLast || res.issues.length === 0) break;
    if (!res.nextPageToken) break;
    nextPageToken = res.nextPageToken;
  }
  return count;
}

/** Paginação por nextPageToken até isLast. */
export async function searchAllIssues(
  cfg: JiraClientConfig,
  jql: string,
  fields: string[],
): Promise<JiraIssue[]> {
  const out: JiraIssue[] = [];
  let nextPageToken: string | undefined;
  for (;;) {
    const res = await searchIssuesPage(cfg, {
      jql,
      maxResults: PAGE_SIZE,
      fields,
      nextPageToken,
    });
    out.push(...res.issues);
    if (res.isLast || res.issues.length === 0) break;
    if (!res.nextPageToken) break;
    nextPageToken = res.nextPageToken;
  }
  return out;
}
