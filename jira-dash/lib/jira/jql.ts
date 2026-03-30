import { PROJECT_KEYS, jqlResolvedFieldName, teamAssigneeInJql } from "../config";

function quoteJqlDate(iso: string): string {
  return `"${iso}"`;
}

function resolvedInRange(from: string, to: string): string {
  const f = jqlResolvedFieldName();
  return `${f} >= ${quoteJqlDate(from)} AND ${f} <= ${quoteJqlDate(to)}`;
}

export function jqlAlCreatedInRange(from: string, to: string): string {
  const p = PROJECT_KEYS.al;
  return `project = ${p} AND created >= ${quoteJqlDate(from)} AND created <= ${quoteJqlDate(to)}`;
}

export function jqlAlResolvedInRange(from: string, to: string): string {
  const p = PROJECT_KEYS.al;
  return `project = ${p} AND ${resolvedInRange(from, to)}`;
}

export function jqlNeResolvedInRange(from: string, to: string): string {
  const p = PROJECT_KEYS.ne;
  const assignee = teamAssigneeInJql();
  const base = `project = ${p} AND ${resolvedInRange(from, to)}`;
  if (!assignee) return base;
  return `${base} AND ${assignee}`;
}

export function jqlIntsIoamResolvedInRange(from: string, to: string): string {
  const { ints, ioam } = PROJECT_KEYS;
  return `project in (${ints}, ${ioam}) AND ${resolvedInRange(from, to)}`;
}

/** SP alocados em sprint aberta (INTS + IOAM). */
export function jqlIntsIoamOpenSprint(): string {
  const { ints, ioam } = PROJECT_KEYS;
  return `project in (${ints}, ${ioam}) AND sprint in openSprints()`;
}
