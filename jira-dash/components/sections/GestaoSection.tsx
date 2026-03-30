import { productivitySeriesForTeam } from "@/lib/chartSeries";
import type { CountRow, ReportDTO, SpRow } from "@/lib/report/types";
import { ProductivityChart } from "../ProductivityChart";

type Props = { data: ReportDTO };

function totalCount(rows: CountRow[]): number {
  return rows.reduce((s, r) => s + r.count, 0);
}

function totalSp(rows: SpRow[]): number {
  return rows.reduce((s, r) => s + r.sp, 0);
}

function pct(part: number, whole: number): string {
  if (whole <= 0) return "0.00";
  return ((100 * part) / whole).toFixed(2);
}

function CountDistributionTable({ rows }: { rows: CountRow[] }) {
  const whole = totalCount(rows);
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Responsável</th>
            <th className="num">Total</th>
            <th className="num">Peso %</th>
            <th className="bar-cell" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <td className="num">{r.count}</td>
              <td className="num">{pct(r.count, whole)}</td>
              <td>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(100 * r.count) / max}%` }} />
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td className="num">{whole}</td>
            <td className="num">—</td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SpDistributionTable({ rows }: { rows: SpRow[] }) {
  const whole = totalSp(rows);
  const max = Math.max(...rows.map((r) => r.sp), 1);
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Responsável</th>
            <th className="num">Total (SP)</th>
            <th className="num">Peso %</th>
            <th className="bar-cell" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <td className="num">{r.sp}</td>
              <td className="num">{pct(r.sp, whole)}</td>
              <td>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(100 * r.sp) / max}%` }} />
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td className="num">{whole}</td>
            <td className="num">—</td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function GestaoSection({ data }: Props) {
  const { labels, values } = productivitySeriesForTeam(data.intIoamSpCompletedByAssignee);

  return (
    <section className="report-section">
      <details open className="report-collapsible">
        <summary className="report-collapsible-summary">
          <h2>2. Visão Gestão (fluxo)</h2>
        </summary>

        <p className="stub-note">
          Story points medem <strong>carga/capacidade</strong> no período (INTS+IOAM concluídos), não
          velocity.
        </p>

        <h3 className="section-h3">Produtividade vs meta ({data.metaSpPerPerson} SP por pessoa)</h3>
        <ProductivityChart labels={labels} values={values} metaPerPerson={data.metaSpPerPerson} />

        <h3 className="section-h3">Distribuição de carga (Story Points · INTS+IOAM)</h3>
        <SpDistributionTable rows={data.intIoamSpCompletedByAssignee} />

        <h3 className="section-h3">Tickets N3 resolvidos pelo time (período)</h3>
        <p className="stub-note">
          Com <code>JIRA_TEAM_FILTER_MODE=displayName</code> (padrão) o filtro usa os nomes do time em
          código; com <code>accountId</code> é preciso <code>JIRA_TEAM_ACCOUNT_IDS</code>.
        </p>
        {data.n3ResolvedByAssignee.length === 0 ? (
          <p className="stub-note">Sem dados de N3 filtrados pelo time neste período.</p>
        ) : (
          <CountDistributionTable rows={data.n3ResolvedByAssignee} />
        )}

        <h3 className="section-h3">Alertas resolvidos por pessoa (período)</h3>
        <CountDistributionTable rows={data.alResolvedByAssignee} />

        <h3 className="section-h3">Alertas criados por prioridade (período)</h3>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Prioridade</th>
                <th className="num">Total</th>
                <th className="num">Peso %</th>
                <th className="bar-cell" />
              </tr>
            </thead>
            <tbody>
              {(() => {
                const pri = data.alCreatedByPriority;
                const whole = totalCount(pri);
                const max = Math.max(...pri.map((x) => x.count), 1);
                return pri.map((r) => (
                  <tr key={r.label}>
                    <td>{r.label}</td>
                    <td className="num">{r.count}</td>
                    <td className="num">{pct(r.count, whole)}</td>
                    <td>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${(100 * r.count) / max}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ));
              })()}
              <tr>
                <td>Total</td>
                <td className="num">{totalCount(data.alCreatedByPriority)}</td>
                <td className="num">—</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
