import { PROJECT_KEYS, teamAccountIds } from "../config";

function quoteJqlDate(iso: string): string {
  return `"${iso}"`;
}

export function jqlAlCreatedInRange(from: string, to: string): string {
  const p = PROJECT_KEYS.al;
  return `project = ${p} AND created >= ${quoteJqlDate(from)} AND created <= ${quoteJqlDate(to)}`;
}

export function jqlAlResolvedInRange(from: string, to: string): string {
  const p = PROJECT_KEYS.al;
  return `project = ${p} AND resolutiondate >= ${quoteJqlDate(from)} AND resolutiondate <= ${quoteJqlDate(to)}`;
}

export function jqlNeResolvedInRange(from: string, to: string): string {
  const p = PROJECT_KEYS.ne;
  const ids = teamAccountIds();
  const base = `project = ${p} AND resolutiondate >= ${quoteJqlDate(from)} AND resolutiondate <= ${quoteJqlDate(to)}`;
  if (ids.length === 0) return base;
  const list = ids.map((id) => `"${id}"`).join(", ");
  return `${base} AND assignee in (${list})`;
}

export function jqlIntsIoamResolvedInRange(from: string, to: string): string {
  const { ints, ioam } = PROJECT_KEYS;
  return `project in (${ints}, ${ioam}) AND resolutiondate >= ${quoteJqlDate(from)} AND resolutiondate <= ${quoteJqlDate(to)}`;
}

/** SP alocados em sprint aberta (INTS + IOAM). */
export function jqlIntsIoamOpenSprint(): string {
  const { ints, ioam } = PROJECT_KEYS;
  return `project in (${ints}, ${ioam}) AND sprint in openSprints()`;
}

