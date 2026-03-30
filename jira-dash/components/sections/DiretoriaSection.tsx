import type { DiretoriaSectionData } from "@/lib/report/types";

type Props = { data: DiretoriaSectionData };

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
          <strong>{data.periodLabelBr}</strong> — AL (alertas), N3 (projeto configurável, ex. NE/N3)
          com o mesmo filtro de time que o squad (displayName por padrão), e SP em sprint aberta
          INTS+IOAM quando a API responder.
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
              {data.n3Note ??
                "Filtro assignee alinhado ao squad (veja README: JIRA_TEAM_FILTER_MODE)."}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">SLA N3 (≤48h criado → resolução)</div>
            <div className="metric-value">
              {data.n3Sla ? `${data.n3Sla.within48h} / ${data.n3Sla.n}` : "—"}
            </div>
            <div className="metric-label">
              {data.n3Sla ? (
                <>
                  {data.n3Sla.sharePercent}% no prazo · meta {data.n3Sla.targetPercent}%
                  {data.n3Sla.note ? ` · ${data.n3Sla.note}` : ""}
                </>
              ) : (
                "Ativo quando o filtro de time N3 está configurado."
              )}
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
