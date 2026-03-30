export type CountRow = { label: string; count: number };

export type SpRow = { label: string; sp: number };

export type HistoricoMonth = { key: string; label: string };

export type PivotRow = {
  label: string;
  byMonth: number[];
  total: number;
};

export type JqlSnapshotItem = {
  id: string;
  label: string;
  jql: string;
};

/** SLA N3 em até 48h (Goals Tracker); null se escopo N3 inativo. */
export type N3SlaSummary = {
  n: number;
  within48h: number;
  sharePercent: number;
  targetPercent: number;
  /** Lacunas (ex.: tickets sem created). */
  note: string | null;
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
  /** N3 (NE) resolvidos no período pelo time (filtro squad); null se escopo N3 inativo. */
  n3ResolvedTeamTotal: number | null;
  n3Note: string | null;
  n3ResolvedByAssignee: CountRow[];
  intIoamSpCompletedByAssignee: SpRow[];
  metaSpPerPerson: number;
  /** JQL usada neste run (diff com raw-metrics.md). */
  jqlUsed: JqlSnapshotItem[];
  /** SLA created → resolution ≤ 48h, meta 50%. */
  n3Sla: N3SlaSummary | null;
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
