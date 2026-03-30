import type { JiraClientConfig } from "@/lib/jira/client";
import {
  loadDiretoriaSection,
  loadGestaoSection,
  loadHistoricoSection,
} from "@/lib/report/sectionLoaders";
import { DiretoriaSection } from "./sections/DiretoriaSection";
import { GestaoSection } from "./sections/GestaoSection";
import { HistoricoSection } from "./sections/HistoricoSection";

export function ReportSectionSkeleton({ title }: { title: string }) {
  return (
    <section className="report-section report-section-skeleton" aria-busy="true">
      <div className="skeleton-summary">{title}</div>
      <div className="skeleton-metric-row">
        <div className="skeleton-chip" />
        <div className="skeleton-chip" />
        <div className="skeleton-chip" />
      </div>
      <div className="skeleton-block" />
    </section>
  );
}

function SectionError({ message }: { message: string }) {
  return (
    <section className="report-section">
      <div className="error-banner" role="alert">
        {message}
      </div>
    </section>
  );
}

export async function DiretoriaReportBlock({
  cfg,
  from,
  to,
  periodLabelBr,
}: {
  cfg: JiraClientConfig;
  from: string;
  to: string;
  periodLabelBr: string;
}) {
  const r = await loadDiretoriaSection(cfg, from, to, periodLabelBr);
  if (!r.ok) return <SectionError message={r.error} />;
  return <DiretoriaSection data={r.data} />;
}

export async function GestaoReportBlock({
  cfg,
  from,
  to,
}: {
  cfg: JiraClientConfig;
  from: string;
  to: string;
}) {
  const r = await loadGestaoSection(cfg, from, to);
  if (!r.ok) return <SectionError message={r.error} />;
  return <GestaoSection data={r.data} />;
}

export async function HistoricoReportBlock({
  cfg,
  to,
}: {
  cfg: JiraClientConfig;
  to: string;
}) {
  const r = await loadHistoricoSection(cfg, to);
  if (!r.ok) return <SectionError message={r.error} />;
  return <HistoricoSection data={r.data} />;
}
