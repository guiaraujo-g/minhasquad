"use client";

import { useState } from "react";
import type { HistoricoMonth, PivotRow } from "@/lib/report/types";

const MAX_MESES = 7;

type Props = {
  months: HistoricoMonth[];
  spPivot: PivotRow[];
  alResolvedPivot: PivotRow[];
  n3Pivot: PivotRow[];
};

function slicePivot(rows: PivotRow[], start: number, end: number): PivotRow[] {
  const body = rows.filter((r) => r.label !== "Total");
  const slicedBody = body.map((r) => {
    const slice = r.byMonth.slice(start, end + 1);
    const total = slice.reduce((a, b) => a + b, 0);
    return { label: r.label, byMonth: slice, total };
  });
  const n = end - start + 1;
  const colTotals = Array.from({ length: n }, (_, j) =>
    slicedBody.reduce((s, r) => s + r.byMonth[j], 0),
  );
  const grand = colTotals.reduce((a, b) => a + b, 0);
  return [...slicedBody, { label: "Total", byMonth: colTotals, total: grand }];
}

function pctRow(rowTotal: number, grand: number): string {
  if (grand <= 0 || rowTotal <= 0) return "0.00";
  return ((100 * rowTotal) / grand).toFixed(2);
}

function PivotTable({
  title,
  rows,
  visibleMonths,
  showPct,
}: {
  title: string;
  rows: PivotRow[];
  visibleMonths: HistoricoMonth[];
  showPct: boolean;
}) {
  const grand = rows.find((r) => r.label === "Total")?.total ?? 0;

  return (
    <div className="historico-pivot">
      <h3>{title}</h3>
      <div className="table-scroll">
        <table className="data-table table-pivot">
          <thead>
            <tr>
              <th>Responsável</th>
              {visibleMonths.map((m) => (
                <th key={m.key} className="num">
                  {m.label}
                </th>
              ))}
              <th className="num">Total</th>
              {showPct ? <th className="num">Peso %</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <td>{r.label}</td>
                {r.byMonth.map((v, i) => (
                  <td key={visibleMonths[i]?.key ?? i} className="num">
                    {v}
                  </td>
                ))}
                <td className="num">{r.total}</td>
                {showPct ? (
                  <td className="num">
                    {r.label === "Total" ? "—" : pctRow(r.total, grand)}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function HistoricoPivotTables({ months, spPivot, alResolvedPivot, n3Pivot }: Props) {
  const n = Math.max(0, months.length);
  const last = Math.max(0, n - 1);
  const [startIdx, setStartIdx] = useState(0);
  const [endIdx, setEndIdx] = useState(last);

  const onStartChange = (i: number) => {
    const s = Math.min(Math.max(0, i), last);
    setStartIdx(s);
    setEndIdx((e) => {
      const minE = s;
      let ne = Math.max(e, minE);
      if (ne - s + 1 > MAX_MESES) ne = s + MAX_MESES - 1;
      return Math.min(ne, last);
    });
  };

  const onEndChange = (i: number) => {
    const e = Math.min(Math.max(0, i), last);
    setEndIdx(e);
    setStartIdx((s) => {
      let ns = Math.min(s, e);
      if (e - ns + 1 > MAX_MESES) ns = e - MAX_MESES + 1;
      return Math.max(0, ns);
    });
  };

  const visibleMonths = n ? months.slice(startIdx, endIdx + 1) : [];
  const spRows = n ? slicePivot(spPivot, startIdx, endIdx) : [];
  const alRows = n ? slicePivot(alResolvedPivot, startIdx, endIdx) : [];
  const n3Rows = n && n3Pivot.length ? slicePivot(n3Pivot, startIdx, endIdx) : [];

  return (
    <div id="sec-historico">
      <p style={{ color: "var(--text-muted)", marginBottom: 12 }}>
        Pivots mensais alinhados ao período de <strong>até {MAX_MESES} meses</strong> encerrando no mês
        da data &quot;Até&quot; do relatório. Ajuste a janela abaixo (máximo {MAX_MESES} colunas
        contíguas).
      </p>

      {n === 0 ? (
        <p className="stub-note">Sem meses para exibir no pivot.</p>
      ) : (
        <>
          <div className="pivot-period-filter" role="region" aria-label="Filtro de período dos pivots">
            <div>
              <label htmlFor="pivotMesInicio">Mês inicial</label>
              <select
                id="pivotMesInicio"
                value={startIdx}
                onChange={(ev) => onStartChange(Number(ev.target.value))}
                aria-describedby="pivotHint"
              >
                {months.map((m, i) => (
                  <option key={m.key} value={i}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pivotMesFim">Mês final</label>
              <select
                id="pivotMesFim"
                value={endIdx}
                onChange={(ev) => onEndChange(Number(ev.target.value))}
                aria-describedby="pivotHint"
              >
                {months.map((m, i) => (
                  <option key={m.key} value={i}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <p id="pivotHint" className="hint">
              A janela não pode ultrapassar {MAX_MESES} meses. As tabelas compartilham o mesmo filtro.
            </p>
          </div>

          <PivotTable
            title="Story Points por atividades (mensal · INTS+IOAM)"
            rows={spRows}
            visibleMonths={visibleMonths}
            showPct
          />
          <PivotTable
            title="Contagem de alertas resolvidos (mensal · AL)"
            rows={alRows}
            visibleMonths={visibleMonths}
            showPct
          />
          {n3Rows.length === 0 ? (
            <p className="stub-note">
              Pivot N3 indisponível sem <code>JIRA_TEAM_ACCOUNT_IDS</code> ou sem linhas calculadas.
            </p>
          ) : (
            <PivotTable
              title="Tickets N3 (mensal · NE · time)"
              rows={n3Rows}
              visibleMonths={visibleMonths}
              showPct
            />
          )}
        </>
      )}
    </div>
  );
}
