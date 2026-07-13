import raw from '../research/pay-officer.json';

/**
 * Officer and warrant-officer basic pay.
 *
 * The site had E-1..E-9 and O-1..O-3 and nothing else — while telling readers that
 * Army Aviator (Warrant Officer) is the way to fly without a degree, and then showing
 * them nothing about what that route actually pays. A career "progression" that stops
 * at Captain is not a progression.
 *
 * All figures: DFAS, effective 1 January 2026 (FY2026 NDAA raise). Monthly basic pay,
 * before allowances, special pays and tax.
 *
 * A BLANK cell is not a zero. O-10 has no rate at two years of service and W-5 has none
 * before twenty, because nobody holds that grade that early. Those render as absent —
 * never as $0, which would be a lie about a real number.
 */

type Table = Record<string, Record<string, number | null>>;

const d = raw as unknown as {
  pay_year: number;
  effective: string;
  source: { publisher: string; urls: string[]; authority: string };
  commissioned_basic_pay_monthly_usd: Table;
  warrant_basic_pay_monthly_usd: Table;
  prior_enlisted_officer_pay_monthly_usd: Table;
  notes: string[];
};

export const OFFICER_PAY = d.commissioned_basic_pay_monthly_usd;
export const WARRANT_PAY = d.warrant_basic_pay_monthly_usd;
export const PRIOR_ENLISTED_PAY = d.prior_enlisted_officer_pay_monthly_usd;

export const OFFICER_PAY_YEAR = d.pay_year;
export const OFFICER_PAY_EFFECTIVE = d.effective;
export const OFFICER_PAY_SOURCE = d.source;
export const OFFICER_PAY_NOTES = d.notes;

/** The years-of-service columns, in order, as DFAS publishes them. */
export const YOS_COLUMNS = Object.keys(OFFICER_PAY['O-3'] ?? {});

/** A trimmed set of columns for a readable on-screen ladder. */
export const YOS_SHOWN = [
  '2 or less',
  'Over 4',
  'Over 6',
  'Over 10',
  'Over 14',
  'Over 20',
];

export const OFFICER_GRADES = ['O-1', 'O-2', 'O-3', 'O-4', 'O-5', 'O-6'];
export const WARRANT_GRADES = ['W-1', 'W-2', 'W-3', 'W-4', 'W-5'];

export function monthly(table: Table, grade: string, yos: string): number | null {
  const v = table[grade]?.[yos];
  return typeof v === 'number' ? v : null;
}

export const annual = (m: number | null) => (m === null ? null : m * 12);

/**
 * What four years of prior ENLISTED service is worth once you commission.
 *
 * This is the number the site exists to surface. Enlist first, commission later, and
 * you are paid on the O-1E/O-2E/O-3E scale rather than the plain O-1/O-2/O-3 scale —
 * and at fourteen years that is over $1,200 a month more, for the same rank, doing the
 * same job. It appears on no recruiting pay chart a seventeen-year-old will ever see.
 *
 * Note the two scales are IDENTICAL at four years and only diverge from six onward.
 * Quoting the four-year column would show a $0 difference and make the whole point
 * look like nothing.
 */
export function priorEnlistedBonus(
  grade: 'O-1E' | 'O-2E' | 'O-3E',
  yos: string,
): { plain: number | null; prior: number | null; extraMonthly: number | null; extraAnnual: number | null } {
  const plainGrade = grade.slice(0, -1);
  const plain = monthly(OFFICER_PAY, plainGrade, yos);
  const prior = monthly(PRIOR_ENLISTED_PAY, grade, yos);
  const extraMonthly = plain !== null && prior !== null ? prior - plain : null;
  return {
    plain,
    prior,
    extraMonthly,
    extraAnnual: extraMonthly === null ? null : extraMonthly * 12,
  };
}
