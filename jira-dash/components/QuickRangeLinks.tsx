import Link from "next/link";

type Props = {
  thisMonthFrom: string;
  thisMonthTo: string;
};

export function QuickRangeLinks({ thisMonthFrom, thisMonthTo }: Props) {
  const q = (f: string, t: string) => `/?from=${encodeURIComponent(f)}&to=${encodeURIComponent(t)}`;
  return (
    <div className="date-toolbar" style={{ marginTop: -12, paddingTop: 0 }}>
      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", width: "100%", textAlign: "center" }}>
        Atalhos
      </span>
      <div className="quick-links" style={{ justifyContent: "center", width: "100%" }}>
        <Link className="link-btn link-secondary" href={q(thisMonthFrom, thisMonthTo)}>
          Mês atual
        </Link>
        <Link className="link-btn link-secondary" href="/?sprint=current">
          Sprint atual
        </Link>
      </div>
    </div>
  );
}
