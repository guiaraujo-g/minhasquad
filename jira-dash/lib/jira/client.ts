export type JiraClientConfig = {
  baseUrl: string;
  authHeader: string;
};

/** Garante URL absoluta para fetch (ex.: host sem https quebra com "Failed to parse URL"). */
export function normalizeJiraBaseUrl(raw: string): string {
  let s = raw.trim().replace(/\/$/, "");
  if (!/^https?:\/\//i.test(s)) {
    s = `https://${s}`;
  }
  return s;
}

export function getJiraClientConfig(): JiraClientConfig | null {
  const raw = process.env.JIRA_BASE_URL?.trim();
  if (!raw) return null;
  const baseUrl = normalizeJiraBaseUrl(raw);
  const email = process.env.JIRA_EMAIL?.trim();
  const token = process.env.JIRA_API_TOKEN?.trim();
  if (!email || !token) return null;
  const authHeader = `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`;
  return { baseUrl, authHeader };
}

export class JiraHttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: string,
  ) {
    super(message);
    this.name = "JiraHttpError";
  }
}

export async function jiraFetchJson<T>(
  cfg: JiraClientConfig,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${cfg.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const method = (init?.method ?? "GET").toUpperCase();
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: cfg.authHeader,
  };
  if (method !== "GET" && method !== "HEAD") {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(url, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers as Record<string, string>),
    },
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) {
    throw new JiraHttpError(`Jira HTTP ${res.status}`, res.status, text);
  }
  return text ? (JSON.parse(text) as T) : ({} as T);
}
