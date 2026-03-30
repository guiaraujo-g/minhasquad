type Props = {
  from: string;
  to: string;
};

export function DateRangeForm({ from, to }: Props) {
  return (
    <form className="date-toolbar" method="get" action="/">
      <label>
        De
        <input type="date" name="from" defaultValue={from} required />
      </label>
      <label>
        Até
        <input type="date" name="to" defaultValue={to} required />
      </label>
      <button type="submit">Atualizar período</button>
    </form>
  );
}
