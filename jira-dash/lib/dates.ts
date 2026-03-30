const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** YYYY-MM-DD no fuso configurável (default America/Sao_Paulo). */
export function todayIsoInTimezone(tz: string): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  if (!y || !m || !d) throw new Error("Invalid date format");
  return `${y}-${m}-${d}`;
}

/**
 * Converte instante ISO da API Agile (UTC) para YYYY-MM-DD no **calendário local** do fuso
 * (alinhado ao board / REPORT_DEFAULT_TIMEZONE). Evita usar só `slice(0,10)` em UTC.
 */
export function agileInstantToLocalIsoDate(iso: string, tz: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso.length >= 10 ? iso.slice(0, 10) : iso;
  }
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  if (!y || !m || !day) throw new Error("Invalid date format");
  return `${y}-${m}-${day}`;
}

/** Primeiro dia do mês corrente no mesmo fuso que `todayIsoInTimezone`. */
export function firstDayOfMonthIso(todayIso: string): string {
  const [y, m] = todayIso.split("-").map(Number);
  return `${y}-${pad2(m)}-01`;
}

export function defaultTimezone(): string {
  return process.env.REPORT_DEFAULT_TIMEZONE?.trim() || "America/Sao_Paulo";
}

export function parseIsoDate(s: string | undefined): string | null {
  if (!s || !ISO_DATE.test(s)) return null;
  const d = new Date(`${s}T12:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return null;
  return s;
}

export function daysBetweenInclusive(from: string, to: string): number {
  const a = new Date(`${from}T00:00:00.000Z`).getTime();
  const b = new Date(`${to}T00:00:00.000Z`).getTime();
  return Math.floor((b - a) / (24 * 60 * 60 * 1000)) + 1;
}

export type PeriodParseResult =
  | { ok: true; from: string; to: string }
  | { ok: false; error: string };

export function resolvePeriod(
  fromParam: string | undefined,
  toParam: string | undefined,
  maxRangeDays: number,
): PeriodParseResult {
  const tz = defaultTimezone();
  const today = todayIsoInTimezone(tz);
  const defaultFrom = firstDayOfMonthIso(today);
  const from = parseIsoDate(fromParam) ?? defaultFrom;
  const to = parseIsoDate(toParam) ?? today;

  if (from > to) {
    return { ok: false, error: "A data inicial não pode ser posterior à final." };
  }

  const span = daysBetweenInclusive(from, to);
  if (span > maxRangeDays) {
    return {
      ok: false,
      error: `Intervalo máximo: ${maxRangeDays} dias (~18 meses). Reduza o período.`,
    };
  }

  return { ok: true, from, to };
}

const MONTH_SHORT_PT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
] as const;

/** Mês civil UTC a partir de YYYY-MM-DD (âncora). */
export function monthKeyFromIso(iso: string): string {
  return iso.slice(0, 7);
}

export function addMonthsYm(ym: string, delta: number): string {
  const [ys, ms] = ym.split("-").map(Number);
  const d = new Date(Date.UTC(ys, ms - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}`;
}

export function monthLabelPt(ym: string): string {
  const [ys, ms] = ym.split("-").map(Number);
  const m = MONTH_SHORT_PT[(ms || 1) - 1] ?? "???";
  const yy = String(ys).slice(-2);
  return `${m}/${yy}`;
}

/** Lista de chaves YYYY-MM dos últimos `count` meses terminando em `endYm` (inclusivo). */
export function lastNMonthKeys(endYm: string, count: number): string[] {
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    keys.push(addMonthsYm(endYm, -i));
  }
  return keys;
}

export function firstDayUtc(ym: string): string {
  return `${ym}-01`;
}

export function lastDayUtc(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0));
  return `${last.getUTCFullYear()}-${pad2(last.getUTCMonth() + 1)}-${pad2(last.getUTCDate())}`;
}

/** DD/MM/YYYY para exibição (datas já normalizadas YYYY-MM-DD). */
export function formatDateBr(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}
