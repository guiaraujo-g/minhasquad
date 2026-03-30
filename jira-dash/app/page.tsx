import { DateRangeForm } from "@/components/DateRangeForm";
import { QuickRangeLinks } from "@/components/QuickRangeLinks";
import { ReportJqlPanel } from "@/components/ReportJqlPanel";
import { DiretoriaSection } from "@/components/sections/DiretoriaSection";
import { GestaoSection } from "@/components/sections/GestaoSection";
import { HistoricoSection } from "@/components/sections/HistoricoSection";
import { defaultTimezone, firstDayOfMonthIso, todayIsoInTimezone } from "@/lib/dates";
import { resolveActiveSprintRange } from "@/lib/jira/activeSprint";
import { getJiraClientConfig } from "@/lib/jira/client";
import { buildReport } from "@/lib/report/buildReport";
import { redirect } from "next/navigation";

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

  const result = await buildReport(sp.from, sp.to);

  const tz = defaultTimezone();
  const today = todayIsoInTimezone(tz);
  const thisMonthFrom = firstDayOfMonthIso(today);

  if (!result.ok) {
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
          {result.error}
        </div>
        <DateRangeForm from={sp.from ?? thisMonthFrom} to={sp.to ?? today} />
        <QuickRangeLinks thisMonthFrom={thisMonthFrom} thisMonthTo={today} />
      </div>
    );
  }

  const { data } = result;

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Análise de Produtividade · Jira</h1>
        <p className="period-line">Período: {data.periodLabelBr}</p>
      </header>

      {sprintNotice ? (
        <div className="action-box" role="status">
          {sprintNotice}
        </div>
      ) : null}

      <DateRangeForm from={data.period.from} to={data.period.to} />
      <QuickRangeLinks thisMonthFrom={thisMonthFrom} thisMonthTo={today} />

      <DiretoriaSection data={data} />
      <GestaoSection data={data} />
      <HistoricoSection data={data} />
      <ReportJqlPanel items={data.jqlUsed} />
    </div>
  );
}
