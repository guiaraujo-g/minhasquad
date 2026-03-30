import { DateRangeForm } from "@/components/DateRangeForm";
import { QuickRangeLinks } from "@/components/QuickRangeLinks";
import { ReportJqlPanel } from "@/components/ReportJqlPanel";
import {
  DiretoriaReportBlock,
  GestaoReportBlock,
  HistoricoReportBlock,
  ReportSectionSkeleton,
} from "@/components/ReportStreamBlocks";
import { MAX_REPORT_RANGE_DAYS, storyPointsFieldIds } from "@/lib/config";
import {
  defaultTimezone,
  firstDayOfMonthIso,
  formatDateBr,
  resolvePeriod,
  todayIsoInTimezone,
} from "@/lib/dates";
import { resolveActiveSprintRange } from "@/lib/jira/activeSprint";
import { getJiraClientConfig } from "@/lib/jira/client";
import { buildJqlSnapshot } from "@/lib/report/jqlSnapshot";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<{ from?: string; to?: string; sprint?: string }>;
};

function wantsSprintShortcut(s: string | undefined): boolean {
  const v = s?.trim().toLowerCase();
  return v === "current" || v === "atual" || v === "1";
}

export default async function Home({ searchParams }: PageProps) {
  const sp = await searchParams;

  let sprintNotice: string | null = null;
  if (wantsSprintShortcut(sp.sprint)) {
    const cfg = getJiraClientConfig();
    if (!cfg) {
      sprintNotice =
        "Configure JIRA_BASE_URL, JIRA_EMAIL e JIRA_API_TOKEN para usar o atalho Sprint atual.";
    } else {
      const range = await resolveActiveSprintRange(cfg);
      if (range) {
        redirect(
          `/?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`,
        );
      }
      sprintNotice =
        "Não foi possível obter a sprint ativa (boards scrum INTS/IOAM, Jira Software ou permissões Agile).";
    }
  }

  const tz = defaultTimezone();
  const today = todayIsoInTimezone(tz);
  const thisMonthFrom = firstDayOfMonthIso(today);

  const period = resolvePeriod(sp.from, sp.to, MAX_REPORT_RANGE_DAYS);
  if (!period.ok) {
    return (
      <div className="container">
        <header className="page-header">
          <h1 className="page-title">Análise de Produtividade · Jira</h1>
        </header>
        {sprintNotice ? (
          <div className="action-box" role="status">
            {sprintNotice}
          </div>
        ) : null}
        <div className="error-banner" role="alert">
          {period.error}
        </div>
        <DateRangeForm from={sp.from ?? thisMonthFrom} to={sp.to ?? today} />
        <QuickRangeLinks thisMonthFrom={thisMonthFrom} thisMonthTo={today} />
      </div>
    );
  }

  const { from, to } = period;
  const periodLabelBr = `${formatDateBr(from)} a ${formatDateBr(to)}`;

  const cfg = getJiraClientConfig();
  if (!cfg) {
    return (
      <div className="container">
        <header className="page-header">
          <h1 className="page-title">Análise de Produtividade · Jira</h1>
        </header>
        {sprintNotice ? (
          <div className="action-box" role="status">
            {sprintNotice}
          </div>
        ) : null}
        <div className="error-banner" role="alert">
          Configure JIRA_BASE_URL, JIRA_EMAIL e JIRA_API_TOKEN em .env.local (veja .env.example).
        </div>
        <DateRangeForm from={from} to={to} />
        <QuickRangeLinks thisMonthFrom={thisMonthFrom} thisMonthTo={today} />
      </div>
    );
  }

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Análise de Produtividade · Jira</h1>
        <p className="period-line">Período: {periodLabelBr}</p>
      </header>

      {sprintNotice ? (
        <div className="action-box" role="status">
          {sprintNotice}
        </div>
      ) : null}

      <DateRangeForm from={from} to={to} />
      <QuickRangeLinks thisMonthFrom={thisMonthFrom} thisMonthTo={today} />

      <Suspense
        fallback={<ReportSectionSkeleton title="1. Visão Diretoria (executivo) — carregando…" />}
      >
        <DiretoriaReportBlock cfg={cfg} from={from} to={to} periodLabelBr={periodLabelBr} />
      </Suspense>

      <Suspense fallback={<ReportSectionSkeleton title="2. Visão Gestão (fluxo) — carregando…" />}>
        <GestaoReportBlock cfg={cfg} from={from} to={to} />
      </Suspense>

      <Suspense
        fallback={<ReportSectionSkeleton title="3. Visão histórica (pivot mensal) — carregando…" />}
      >
        <HistoricoReportBlock cfg={cfg} to={to} />
      </Suspense>

      <ReportJqlPanel
        items={buildJqlSnapshot(from, to)}
        storyPointsFieldIds={storyPointsFieldIds()}
      />
    </div>
  );
}
