import type { HistoricoSectionData } from "@/lib/report/types";
import { HistoricoPivotTables } from "../HistoricoPivotTables";

type Props = { data: HistoricoSectionData };

export function HistoricoSection({ data }: Props) {
  return (
    <section className="report-section">
      <details open className="report-collapsible">
        <summary className="report-collapsible-summary">
          <h2>3. Visão histórica (pivot mensal)</h2>
        </summary>
        <HistoricoPivotTables
          months={data.historico.months}
          spPivot={data.historico.spPivot}
          alResolvedPivot={data.historico.alResolvedPivot}
          n3Pivot={data.historico.n3Pivot}
        />
      </details>
    </section>
  );
}
