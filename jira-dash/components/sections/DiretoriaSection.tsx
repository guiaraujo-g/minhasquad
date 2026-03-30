import { teamAssigneeInJql } from "@/lib/config";
import type { DiretoriaSectionData } from "@/lib/report/types";

type Props = { data: DiretoriaSectionData };

export function DiretoriaSection({ data }: Props) {
  const teamScope = teamAssigneeInJql() !== null;
  const alPeriodHint = teamScope
    ? "Projeto AL · total no período · do time"
    : "Projeto AL · total no período (sem filtro assignee)";
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
          <strong>{data.periodLabelBr}</strong> — AL, INTS+IOAM (incl. SP concluídos no período) e sprint
          aberta usam o mesmo escopo de assignees que{" "}
          <code>TEAM_DISPLAY_NAMES</code> / <code>JIRA_TEAM_FILTER_MODE</code> (quando configurado); N3
          (projeto configurável, ex. NE) segue a mesma regra quando o filtro de time está ativo.
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Story Points concluídos no período · INTS+IOAM</div>
            <div className="metric-value">{data.intIoamSpPeriodTotal}</div>
            <div className="metric-label">
              {data.intIoamSpPeriodNote ??
                "Soma de SP de issues resolvidas entre as datas do relatório (par com a Gestão)."}
            </div>
          </div>
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
            <div className="metric-label">{alPeriodHint}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Alertas resolvidos</div>
            <div className="metric-value">{data.alResolvedTotal}</div>
            <div className="metric-label">{alPeriodHint}</div>
          </div>
        </div>
      </details>
    </section>
  );
}
