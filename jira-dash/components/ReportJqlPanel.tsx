import type { JqlSnapshotItem } from "@/lib/report/types";

type Props = {
  items: JqlSnapshotItem[];
  storyPointsFieldIds: string[];
};

export function ReportJqlPanel({ items, storyPointsFieldIds }: Props) {
  const spLine =
    storyPointsFieldIds.length > 0
      ? storyPointsFieldIds.join(", ")
      : "(nenhum — ver JIRA_STORY_POINTS_FIELD)";

  return (
    <footer className="report-jql-footer">
      <details className="report-collapsible">
        <summary className="report-collapsible-summary report-jql-summary">
          <h2 className="report-jql-heading">JQL usada neste relatório</h2>
        </summary>
        <p className="report-jql-intro">
          Copie e compare com o <code>raw-metrics.md</code> do squad (mesmo período e variáveis de ambiente).
        </p>
        <p className="report-jql-intro">
          <strong>Campos de Story Points (ordem de fallback):</strong>{" "}
          <code className="jql-inline-code">{spLine}</code>
        </p>
        <div className="jql-snapshot-list">
          {items.map((item) => (
            <div key={item.id} className="jql-block">
              <div className="jql-block-label">{item.label}</div>
              <pre className="jql-block-code">
                <code>{item.jql}</code>
              </pre>
            </div>
          ))}
        </div>
      </details>
    </footer>
  );
}
