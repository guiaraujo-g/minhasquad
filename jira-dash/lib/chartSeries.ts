import { TEAM_DISPLAY_NAMES } from "./config";
import type { SpRow } from "./report/types";

export function shortPersonLabel(full: string): string {
  const parts = full.trim().split(/\s+/);
  return parts[0] ?? full;
}

/** Série alinhada à ordem do time (memórias do squad). */
export function productivitySeriesForTeam(rows: SpRow[]): { labels: string[]; values: number[] } {
  const map = new Map(rows.map((r) => [r.label, r.sp]));
  const labels: string[] = [];
  const values: number[] = [];
  for (const name of TEAM_DISPLAY_NAMES) {
    labels.push(shortPersonLabel(name));
    values.push(map.get(name) ?? 0);
  }
  return { labels, values };
}
