import { PROJECT_KEYS, n3TeamScopeActive, teamAssigneeInJql } from "../config";
import {
  jqlAlCreatedInRange,
  jqlAlResolvedInRange,
  jqlIntsIoamOpenSprint,
  jqlIntsIoamResolvedInRange,
  jqlNeResolvedInRange,
} from "../jira/jql";
import type { JqlSnapshotItem } from "./types";

function teamJqlLabelSuffix(): string {
  return teamAssigneeInJql() ? " · time" : "";
}

export function buildJqlSnapshot(from: string, to: string): JqlSnapshotItem[] {
  const t = teamJqlLabelSuffix();
  const items: JqlSnapshotItem[] = [
    {
      id: "al_created",
      label: `AL criados no período${t}`,
      jql: jqlAlCreatedInRange(from, to),
    },
    {
      id: "al_resolved",
      label: `AL resolvidos no período${t}`,
      jql: jqlAlResolvedInRange(from, to),
    },
    {
      id: "ints_ioam_resolved",
      label: `INTS+IOAM resolvidos no período${t}`,
      jql: jqlIntsIoamResolvedInRange(from, to),
    },
    {
      id: "ints_ioam_open_sprint",
      label: `INTS+IOAM · sprint aberta (soma SP)${t}`,
      jql: jqlIntsIoamOpenSprint(),
    },
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
