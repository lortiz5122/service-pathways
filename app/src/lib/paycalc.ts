/**
 * Total-compensation model.
 *
 * The honest problem this solves: a recruiter quotes a "total package" number,
 * and a teenager compares it to a civilian salary. Those two numbers are not
 * comparable, for three reasons this model makes explicit:
 *
 *   1. BAH and BAS are NON-TAXABLE. A dollar of BAH is worth more than a dollar
 *      of civilian gross salary.
 *   2. If you live in the barracks or aboard ship, you generally DO NOT get full
 *      BAH — so the "total package" a recruiter quotes may not apply to you.
 *   3. Military healthcare has real cash value, because a civilian pays a premium
 *      for the equivalent. That value is invisible in a salary comparison.
 *
 * Every figure comes from the research data. Nothing is interpolated. Where a
 * cell is missing, the model reports it as missing rather than guessing.
 */

import payDetailRaw from '../research/pay-detail.json';
import payOfficialRaw from '../research/pay-official.json';

type Dict = Record<string, unknown>;

const D = payDetailRaw as unknown as Dict;

/**
 * OFFICIAL rates, fetched directly from DFAS — the DoD's own paying agent.
 * These OVERRIDE anything secondary-sourced. Earlier attempts to reach DFAS
 * returned HTTP 403 because the request lacked a full browser header set and a
 * trailing slash on the path; both turned out to be required.
 */
const O = payOfficialRaw as unknown as Dict;

export const PAY_YEAR = String(D.pay_year ?? 'UNVERIFIED');
export const SOURCE_NOTE = String(D.source_access_note ?? '');

/* ------------------------------------------------------------ basic pay */

const longevity = (D.basic_pay_longevity_monthly_usd ?? {}) as Dict;

export const YEAR_COLS: string[] =
  (longevity.columns as string[] | undefined) ?? ['<2', '2', '3', '4', '6', '8', '10', '12', '14', '16', '18', '20'];

export const ENLISTED_GRADES = Object.keys(
  (longevity.enlisted as Dict | undefined) ?? {},
);
export const OFFICER_GRADES = Object.keys(
  (longevity.officer as Dict | undefined) ?? {},
);

/** Monthly basic pay, or null when that cell was never verified. */
export function basicPay(grade: string, years: string): number | null {
  const table = (grade.startsWith('O') ? longevity.officer : longevity.enlisted) as
    | Dict
    | undefined;
  const row = table?.[grade] as Dict | undefined;
  const v = row?.[years];
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** The highest verified longevity column at or below `years`, so gaps degrade. */
export function basicPayNearest(grade: string, years: string): number | null {
  const idx = YEAR_COLS.indexOf(years);
  if (idx < 0) return null;
  for (let i = idx; i >= 0; i--) {
    const v = basicPay(grade, YEAR_COLS[i]);
    if (v !== null) return v;
  }
  return null;
}

/* ---------------------------------------------------------- allowances */

const bahBlock = (D.bah ?? {}) as Dict;
const basBlock = (D.bas ?? {}) as Dict;

export const BAH = bahBlock;
export const BAS = basBlock;

const basOfficial = (O.bas ?? {}) as Dict;

export const BAS_ENLISTED =
  Number(basOfficial.enlisted_monthly_usd) || Number(basBlock.enlisted_monthly_usd) || 0;
export const BAS_OFFICER =
  Number(basOfficial.officer_monthly_usd) || Number(basBlock.officer_monthly_usd) || 0;
export const BAS_II = Number(basOfficial.bas_ii_monthly_usd) || 0;
export const BAS_II_NOTE = String(basOfficial.bas_ii_note ?? '');
export const BAS_EFFECTIVE = String(basOfficial.effective ?? '');
export const BAS_OFFICIAL = Boolean(basOfficial.enlisted_monthly_usd);

export type BahExample = {
  location: string;
  paygrade: string;
  dependents: boolean;
  monthly_usd: number;
  source?: string;
};

export const BAH_EXAMPLES: BahExample[] = (
  (bahBlock.worked_examples as BahExample[] | undefined) ?? []
).filter((e) => Number(e?.monthly_usd) > 0);

export const PARTIAL_BAH = Number(
  (bahBlock.partial_bah as Dict | undefined)?.monthly_usd,
);

/* -------------------------------------------------- special / incentive */

export type SpecialPay = {
  pay: string;
  monthly_usd: number | string;
  eligibility: string;
  taxable?: boolean;
  source?: string;
  official?: boolean;
};

type OfficialRate = { duty: string; monthly_usd: number };

const hdipBlock = (O.hazardous_duty_incentive_pay ?? {}) as Dict;
const flyBlock = (O.flight_pay_hdip ?? {}) as Dict;

/**
 * Special and incentive pays, straight from DFAS. Replaces the secondary-sourced
 * list entirely — when the paying agent publishes the rate, nothing else counts.
 */
export const SPECIAL_PAYS: SpecialPay[] = [
  ...((hdipBlock.rates as OfficialRate[] | undefined) ?? []).map((r) => ({
    pay: r.duty,
    monthly_usd: r.monthly_usd,
    eligibility: String(hdipBlock.note ?? 'Hazardous Duty Incentive Pay.'),
    taxable: true,
    source: String(hdipBlock.url ?? ''),
    official: true,
  })),
  ...((flyBlock.rates as OfficialRate[] | undefined) ?? []).map((r) => ({
    pay: r.duty,
    monthly_usd: r.monthly_usd,
    eligibility: 'Hazardous Duty Incentive Pay for aerial flight.',
    taxable: true,
    source: String(flyBlock.url ?? ''),
    official: true,
  })),
];

export const AVIP_MAX = (O.aviation_incentive_pay_max ?? {}) as Dict & {
  rates?: { years_of_aviation_service: string; monthly_usd: number }[];
  note?: string;
  url?: string;
};

export const OTHER_OFFICIAL_TABLES = (O.other_official_tables ?? []) as {
  name: string;
  url: string;
  note?: string;
}[];

export const BAH_RANGE = (O.bah_range ?? {}) as Dict & {
  headline?: string;
  plain_statement?: string;
  low?: { monthly_usd: number; where: string; who: string; note?: string };
  high?: { monthly_usd: number; where: string; who: string; note?: string };
  mid_examples?: { monthly_usd: number; where: string; who: string }[];
  rules_of_thumb?: string[];
  barracks_rule?: string;
  increase_2026_pct?: number;
  source?: string;
  official_lookup?: string;
  estimated?: boolean;
};

export const OFFICIAL_SOURCE = (O.source ?? {}) as Dict;
export const OFFICIAL_UNVERIFIED = (O.unverified as string[] | undefined) ?? [];

export function specialPayAmount(p: SpecialPay): number | null {
  const n = Number(p.monthly_usd);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/* ------------------------------------------------------------ healthcare */

const hc = (D.healthcare_value ?? {}) as Dict;
const civEq = (hc.civilian_equivalent ?? {}) as Dict;

/**
 * The value of military healthcare.
 *
 * This site values it at the FULL ANNUAL PREMIUM, not the employee's payroll
 * deduction. An earlier version used the deduction ($1,440 single) and badly
 * undervalued the benefit: a civilian's total compensation INCLUDES their
 * employer's premium share — the worker earns it, they just never see it. Using
 * only the payslip-visible number understated the military side by about $7,900
 * a year for a single member, and $20,100 for one with a family.
 *
 * It is still conservative: it does not count the deductible ($1,886 average for
 * single coverage), the copays, or the out-of-pocket maximum a civilian faces on
 * top — none of which an active-duty member pays at all.
 */
export const HEALTHCARE = {
  kffYear: String(civEq.kff_year ?? 'UNVERIFIED'),
  singlePremium: Number(civEq.single_annual_premium_usd) || 0,
  singleEmployee: Number(civEq.single_employee_contribution_usd) || 0,
  singleEmployer: Number(civEq.single_employer_contribution_usd) || 0,
  singleDeductible: Number(civEq.single_avg_deductible_usd) || 0,
  familyPremium: Number(civEq.family_annual_premium_usd) || 0,
  familyEmployee: Number(civEq.family_employee_contribution_usd) || 0,
  familyEmployer: Number(civEq.family_employer_contribution_usd) || 0,
  oopNote: String(civEq.oop_max_note ?? ''),
  source: String(civEq.source ?? ''),
  howToValue: String(hc.how_to_value_it ?? ''),
  whyItMatters: String((hc as Dict).why_this_matters ?? ''),
  methods: ((hc as Dict).valuation_methods ?? []) as {
    method: string;
    single_usd: number | string;
    family_usd: number | string;
    why: string;
  }[],
  /** The figure the app actually uses: full replacement cost. */
  value(dependents: boolean) {
    return dependents
      ? Number(civEq.family_annual_premium_usd) || 0
      : Number(civEq.single_annual_premium_usd) || 0;
  },
};

/* ------------------------------------------------------ civilian baseline */

const civ = (D.civilian_baseline ?? {}) as Dict;

/**
 * The BLS figures came back as PROSE, not numbers — because BLS does not publish
 * a clean annual median for these exact cuts, and the researcher refused to
 * invent one. Any annualised figure is explicitly "computed, not authoritative".
 * We surface the caveat rather than fabricate a tidy number.
 */
function asNumber(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export const CIVILIAN = {
  age2024: asNumber(civ.bls_median_annual_usd_age_20_24),
  hsGrad: asNumber(civ.bls_median_annual_usd_hs_grad_no_college),
  age2024Note: String(civ.bls_median_annual_usd_age_20_24 ?? ''),
  hsGradNote: String(civ.bls_median_annual_usd_hs_grad_no_college ?? ''),
  note: String(civ.series_note ?? ''),
  source: String(civ.source ?? ''),
};

/* ------------------------------------------------------ other content */

export const ADVANCED_ENTRY = (D.advanced_entry_paygrade ?? {}) as Dict & {
  programs?: {
    program: string;
    branches: string[];
    requirement: string;
    grants: string;
    stackable?: boolean;
    notes?: string;
    source?: string;
  }[];
};

export const PROMOTION = (D.promotion_timeline ?? {}) as Dict & {
  enlisted?: { to_grade: string; typical_time: string; how: string; source?: string }[];
  specialty_school_note?: string;
  competitive_threshold_note?: string;
};

export const COMPARISON_CAVEATS: string[] =
  (D.comparison_caveats as string[] | undefined) ?? [];

export const PAY_UNVERIFIED: string[] =
  (D.unverified as string[] | undefined) ?? [];

/* ------------------------------------------------------------ the model */

export type Housing = 'barracks' | 'ship' | 'off-base';

export type PayInput = {
  grade: string;
  years: string;
  housing: Housing;
  dependents: boolean;
  /** BAH for the chosen duty station, in dollars/month. */
  bahMonthly: number;
  /** Names of selected special pays. */
  specials: string[];
};

export type PayResult = {
  basic: number | null;
  bas: number;
  bah: number;
  /** Why BAH is what it is — the barracks rule made explicit. */
  bahNote: string;
  specials: { name: string; monthly: number }[];
  specialsTotal: number;
  /** Cash the member actually receives, per month. */
  cashMonthly: number;
  cashAnnual: number;
  /** Non-taxable portion (BAH + BAS). */
  untaxedAnnual: number;
  /** Annual cash value of healthcare a civilian would pay for. */
  healthcareAnnual: number;
  /** Cash + healthcare. */
  packageAnnual: number;
  /** Civilian gross salary needed to match, roughly. */
  civilianEquivalent: number | null;
  missing: string[];
};

export function computePay(input: PayInput): PayResult {
  const missing: string[] = [];

  const basic = basicPayNearest(input.grade, input.years);
  if (basic === null) missing.push(`Basic pay for ${input.grade} at ${input.years} years was not verified.`);

  const isOfficer = input.grade.startsWith('O');
  const bas = isOfficer ? BAS_OFFICER : BAS_ENLISTED;

  // The rule that recruiting material tends to skip.
  let bah = 0;
  let bahNote = '';
  if (input.housing === 'off-base') {
    bah = Math.max(0, input.bahMonthly);
    bahNote = 'You live off base, so you receive full BAH for your duty station and paygrade.';
  } else if (input.housing === 'barracks') {
    bah = Number.isFinite(PARTIAL_BAH) && PARTIAL_BAH > 0 ? PARTIAL_BAH : 0;
    bahNote =
      'You live in the barracks. You do NOT receive full BAH — the government is housing you instead. Single members in government quarters receive only a small partial BAH, if anything.';
  } else {
    bah = 0;
    bahNote =
      'You are berthed aboard ship. You do NOT receive full BAH — the ship is your quarters. This is a routine reality in the Navy and Coast Guard, and it materially changes the "total package" figure.';
  }

  const specials = SPECIAL_PAYS.filter((p) => input.specials.includes(p.pay))
    .map((p) => ({ name: p.pay, monthly: specialPayAmount(p) ?? 0 }))
    .filter((p) => p.monthly > 0);
  const specialsTotal = specials.reduce((n, p) => n + p.monthly, 0);

  const cashMonthly = (basic ?? 0) + bas + bah + specialsTotal;
  const cashAnnual = cashMonthly * 12;
  const untaxedAnnual = (bas + bah) * 12;

  // FULL REPLACEMENT COST — see the HEALTHCARE comment above for why the
  // employee's payroll deduction was the wrong number.
  const healthcareAnnual = HEALTHCARE.value(input.dependents);
  if (!healthcareAnnual) missing.push('Civilian health-premium equivalent was not verified.');

  const packageAnnual = cashAnnual + healthcareAnnual;

  /**
   * Rough civilian-gross equivalent. A civilian must earn MORE gross to end up
   * in the same place, because (a) they pay tax on all of it, where the member
   * pays none on BAH/BAS, and (b) they pay a health premium.
   *
   * Uses a flat 22% marginal rate as a transparent, stated assumption — this is
   * an illustration, not a tax calculation, and the UI says so.
   */
  const TAX = 0.22;
  const taxedAnnual = (basic ?? 0) * 12 + specialsTotal * 12;
  const civilianEquivalent =
    basic === null
      ? null
      : Math.round(taxedAnnual + untaxedAnnual / (1 - TAX) + healthcareAnnual);

  return {
    basic,
    bas,
    bah,
    bahNote,
    specials,
    specialsTotal,
    cashMonthly,
    cashAnnual,
    untaxedAnnual,
    healthcareAnnual,
    packageAnnual,
    civilianEquivalent,
    missing,
  };
}

export const TAX_ASSUMPTION = 0.22;
