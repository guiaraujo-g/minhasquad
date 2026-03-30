import type { ReportDTO } from "@/lib/report/types";

type Props = { data: ReportDTO };

export function DiretoriaSection({ data }: Props) {
  const sprintVal =
    data.sprintSpTotal === null ? "—" : String(data.sprintSpTotal);
  const n3Val =
    data.n3ResolvedTeamTotal === null ? "—" : String(data.n3ResolvedTeamTotal);

  return (
    <section className="report-section">
      <details open className="report-collapsible">
        <summary className="report-collapsible-summary">
          <h2>1. Visão Diretoria (executivo)</h2>
        </summary>

        <div className="highlight-box">
          <strong>Resumo:</strong> Indicadores consolidados do período{" "}
          <strong>{data.periodLabelBr}</strong> — AL (alertas), N3 (NE) filtrado pelo time quando
          configurado, e SP em sprint aberta INTS+IOAM quando a API responder.
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Story Points alocados (sprint)</div>
            <div className="metric-value">{sprintVal}</div>
            <div className="metric-label">
              Soma de pontos na sprint aberta · {data.sprintSpNote ?? "INTS + IOAM"}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Tickets N3 resolvidos (time)</div>
            <div className="metric-value">{n3Val}</div>
            <div className="metric-label">
              {data.n3Note ?? "Projeto NE · apenas assignees em JIRA_TEAM_ACCOUNT_IDS"}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Alertas criados</div>
            <div className="metric-value">{data.alCreatedTotal}</div>
            <div className="metric-label">Projeto AL · total no período</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Alertas resolvidos</div>
            <div className="metric-value">{data.alResolvedTotal}</div>
            <div className="metric-label">Projeto AL · total no período</div>
          </div>
        </div>
      </details>
    </section>
  );
}
