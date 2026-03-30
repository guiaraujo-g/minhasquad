export type CountRow = { label: string; count: number };

export type SpRow = { label: string; sp: number };

export type HistoricoMonth = { key: string; label: string };

export type PivotRow = {
  label: string;
  byMonth: number[];
  total: number;
};

export type ReportDTO = {
  period: { from: string; to: string };
  periodLabelBr: string;
  alCreatedTotal: number;
  alResolvedTotal: number;
  alResolvedByAssignee: CountRow[];
  alCreatedByPriority: CountRow[];
  /** Soma de SP em sprint aberta INTS+IOAM; null se a consulta falhar. */
  sprintSpTotal: number | null;
  sprintSpNote: string | null;
  /** N3 (NE) resolvido no período só pelo time; null sem JIRA_TEAM_ACCOUNT_IDS. */
  n3ResolvedTeamTotal: number | null;
  n3Note: string | null;
  n3ResolvedByAssignee: CountRow[];
  intIoamSpCompletedByAssignee: SpRow[];
  metaSpPerPerson: number;
  historico: {
    months: HistoricoMonth[];
    spPivot: PivotRow[];
    alResolvedPivot: PivotRow[];
    n3Pivot: PivotRow[];
  };
};

export type ReportResult =
  | { ok: true; data: ReportDTO }
  | { ok: false; error: string };
