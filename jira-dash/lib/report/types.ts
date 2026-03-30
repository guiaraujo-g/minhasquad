export type CountRow = { label: string; count: number };

export type SpRow = { label: string; sp: number };

export type HistoricoMonth = { key: string; label: string };

export type PivotRow = {
  label: string;
  byMonth: number[];
  total: number;
};

export type HistoricoBlock = {
  months: HistoricoMonth[];
  spPivot: PivotRow[];
  alResolvedPivot: PivotRow[];
  n3Pivot: PivotRow[];
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

export type DiretoriaSectionData = {
  period: { from: string; to: string };
  periodLabelBr: string;
  alCreatedTotal: number;
  alResolvedTotal: number;
  sprintSpTotal: number | null;
  sprintSpNote: string | null;
  n3ResolvedTeamTotal: number | null;
  n3Note: string | null;
  n3Sla: N3SlaSummary | null;
};

export type GestaoSectionData = {
  alResolvedByAssignee: CountRow[];
  alCreatedByPriority: CountRow[];
  intIoamSpCompletedByAssignee: SpRow[];
  /** Diagnóstico quando não há issues INTS+IOAM ou SP não foi lido dos campos. */
  intIoamSpNote: string | null;
  n3ResolvedByAssignee: CountRow[];
  metaSpPerPerson: number;
};

export type HistoricoSectionData = {
  historico: HistoricoBlock;
};

export type ReportDTO = DiretoriaSectionData &
  GestaoSectionData & {
    /** JQL usada neste run (diff com raw-metrics.md). */
    jqlUsed: JqlSnapshotItem[];
    /** Custom fields usados para somar Story Points (ordem de fallback). */
    storyPointsFieldIds: string[];
    historico: HistoricoBlock;
  };

export type ReportResult =
  | { ok: true; data: ReportDTO }
  | { ok: false; error: string };
