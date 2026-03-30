import { PROJECT_KEYS } from "../config";
import { defaultTimezone, todayIsoInTimezone } from "../dates";
import type { JiraClientConfig } from "./client";
import { jiraFetchJson } from "./client";

type BoardList = { values?: { id: number; type: string }[] };

type SprintList = {
  values?: { startDate?: string; endDate?: string; state: string }[];
};

function toIsoDate(d: string): string {
  return d.length >= 10 ? d.slice(0, 10) : d;
}

/**
 * Descobre datas da sprint **ativa** (API Agile) em board scrum do projeto INTS ou IOAM.
 * Requer Jira Software + permissão de browse no projeto/board.
 */
export async function resolveActiveSprintRange(
  cfg: JiraClientConfig,
): Promise<{ from: string; to: string } | null> {
  for (const projectKey of [PROJECT_KEYS.ints, PROJECT_KEYS.ioam] as const) {
    try {
      const boards = await jiraFetchJson<BoardList>(
        cfg,
        `/rest/agile/1.0/board?projectKeyOrId=${encodeURIComponent(projectKey)}`,
        { method: "GET" },
      );
      const board = boards.values?.find((b) => b.type === "scrum");
      if (!board) continue;

      const sprints = await jiraFetchJson<SprintList>(
        cfg,
        `/rest/agile/1.0/board/${board.id}/sprint?state=active`,
        { method: "GET" },
      );
      const active = sprints.values?.[0];
      if (!active) continue;

      const from = active.startDate ? toIsoDate(active.startDate) : null;
      const endRaw = active.endDate ? toIsoDate(active.endDate) : null;
      const today = todayIsoInTimezone(defaultTimezone());

      if (from && endRaw) {
        return { from, to: endRaw };
      }
      if (from) {
        return { from, to: today };
      }
    } catch {
      continue;
    }
  }
  return null;
}
