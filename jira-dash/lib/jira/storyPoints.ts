/** Coerce Jira custom field payload to a finite number, or null if absent / not numeric. */
export function coerceStoryPoints(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  if (Array.isArray(raw)) {
    if (raw.length === 1) return coerceStoryPoints(raw[0]);
    return null;
  }
  if (typeof raw === "object" && raw !== null) {
    const o = raw as Record<string, unknown>;
    if ("value" in o) return coerceStoryPoints(o.value);
    if ("number" in o) return coerceStoryPoints(o.number);
    if ("amount" in o) return coerceStoryPoints(o.amount);
  }
  return null;
}

function customFieldNumericSuffix(key: string): number | null {
  const m = /^customfield_(\d+)$/.exec(key);
  return m ? Number(m[1]) : null;
}

/**
 * Se só existir **um** `customfield_*` com valor numérico na issue, usa (útil quando o ID não está no .env).
 * Se houver vários, não adivinha (retorna 0).
 */
function storyPointsFromUnconfiguredCustomFields(fields: Record<string, unknown>): number {
  const hits: { key: string; n: number }[] = [];
  for (const key of Object.keys(fields)) {
    if (customFieldNumericSuffix(key) === null) continue;
    const n = coerceStoryPoints(fields[key]);
    if (n !== null) hits.push({ key, n });
  }
  if (hits.length === 0) return 0;
  if (hits.length === 1) return hits[0].n;
  return 0;
}

/**
 * Usa o primeiro campo da lista com valor coercível (incluindo 0).
 * Depois tenta um único custom field numérico na issue (fallback).
 */
export function storyPointsFromIssueFields(
  fields: Record<string, unknown>,
  fieldIds: readonly string[],
): number {
  for (const id of fieldIds) {
    const n = coerceStoryPoints(fields[id]);
    if (n !== null) return n;
  }
  return storyPointsFromUnconfiguredCustomFields(fields);
}
