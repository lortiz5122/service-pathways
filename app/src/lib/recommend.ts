import { allSpecialties, branchIdOf } from './data';
import { evaluate, type Tier } from '../data/eligibility';
import type { SpecialtyRecord } from './types';

/**
 * Interest walkthrough scoring.
 *
 * Deliberately transparent, and deliberately NOT a ranking.
 *
 * It produces no "87% match" number — that would be a fabricated precision the
 * data cannot support. It shows no ordinal position either: a "1" beside the
 * Army and a "5" beside the Coast Guard reads as a quality grade, and nothing
 * here supports the claim that one service or one job is better than another.
 *
 * What it does is ORDER results by how closely they fit what the user said they
 * wanted, and then SHOW exactly which signals fired, in plain language, citing
 * the real value from the specialty record. The user judges; the tool does not.
 *
 * It also always surfaces the cautions — credential gap, clearance gate, common
 * disability claims — because a recommendation engine that only shows upside is
 * recruiting material, which this is explicitly not.
 */

export type Priority =
  | 'civilian'
  | 'pay'
  | 'fast'
  | 'clearance'
  | 'lowrisk';

export const PRIORITIES: { id: Priority; label: string; blurb: string }[] = [
  {
    id: 'civilian',
    label: 'A real civilian career after',
    blurb: 'Favours specialties whose training maps onto a licensed, well-paid civilian job.',
  },
  {
    id: 'pay',
    label: 'Earning as much as possible now',
    blurb: 'Favours the highest entry compensation. Note this is the smallest lever of the five.',
  },
  {
    id: 'fast',
    label: 'Getting to work quickly',
    blurb: 'Favours a short training pipeline. Some specialties take over a year before you do the job.',
  },
  {
    id: 'clearance',
    label: 'Technical work and a security clearance',
    blurb: 'Favours specialties requiring a clearance — the clearance itself has real civilian value.',
  },
  {
    id: 'lowrisk',
    label: 'Lower physical toll on my body',
    blurb: 'Deprioritises specialties with high rates of hearing loss, musculoskeletal injury, TBI and PTSD.',
  },
];

export type Criterion = {
  label: string;
  met: boolean;
};

export type Scored = {
  specialty: SpecialtyRecord;
  score: number;
  reasons: string[];
  cautions: string[];
  /**
   * The checklist of what the reader asked for and what this job has.
   *
   * There is deliberately NO score and NO percentage. A number next to a job —
   * whether it is "1" or "80%" — gets read as a grade, and nothing in this data
   * supports the claim that one service or one job is better than another. The
   * checklist shows the reader exactly what they are trading; they do the judging.
   */
  criteria: Criterion[];
  metCount: number;
  totalCount: number;
  /** Whether the user's AFQT clears this specialty's branch. */
  branchGate: 'pass' | 'fail' | 'conflict' | 'unknown';
  branchGateLabel: string;
};

/* ----------------------------------------------------------------- helpers */

function pipelineWeeks(s: SpecialtyRecord): number | null {
  const p = s.training_pipeline ?? [];
  if (!p.length) return null;
  const n = p.reduce((a, st) => a + (Number(st.length_weeks) || 0), 0);
  return n > 0 ? n : null;
}

function salaryMid(s: SpecialtyRecord): number | null {
  const v = s.civilian_crosswalk?.estimated_civilian_salary_range_usd;
  if (Array.isArray(v) && v.length === 2) {
    const [a, b] = v.map(Number);
    if (Number.isFinite(a) && Number.isFinite(b)) return (a + b) / 2;
  }
  return null;
}

function entryComp(s: SpecialtyRecord): number | null {
  const v = s.pay_and_compensation?.total_compensation_estimate_annual_usd;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function hasClearance(s: SpecialtyRecord): boolean {
  const c = s.entry_requirements?.security_clearance;
  return Boolean(c) && !/none|n\/a/i.test(String(c));
}

const HARD_ON_BODY = /hearing|tinnitus|musculoskeletal|back|knee|tbi|traumatic brain|ptsd|joint|spine/i;

function bodyClaims(s: SpecialtyRecord): string[] {
  const raw = s.transition?.va_disability_common_claims;
  const list = Array.isArray(raw) ? raw.map(String) : [];
  return list.filter((c) => HARD_ON_BODY.test(c));
}

/** Scale a value into 0..max across the observed range of the whole dataset. */
function norm(v: number, min: number, max: number, cap: number): number {
  if (max <= min) return 0;
  return ((v - min) / (max - min)) * cap;
}

/* ------------------------------------------------------------------ scoring */

export function recommend(
  interests: string[],
  priorities: Priority[],
  afqt: number,
  tier: Tier,
): Scored[] {
  const pool = interests.length
    ? allSpecialties.filter((s) =>
        (s.interest_cluster_ids ?? []).some((c) => interests.includes(c)),
      )
    : allSpecialties;

  if (!pool.length) return [];

  // Observed ranges, so normalisation is relative to real data, not a guess.
  const sals = pool.map(salaryMid).filter((n): n is number => n !== null);
  const comps = pool.map(entryComp).filter((n): n is number => n !== null);
  const weeks = pool.map(pipelineWeeks).filter((n): n is number => n !== null);

  const sMin = Math.min(...sals, 0);
  const sMax = Math.max(...sals, 1);
  const cMin = Math.min(...comps, 0);
  const cMax = Math.max(...comps, 1);
  const wMin = Math.min(...weeks, 0);
  const wMax = Math.max(...weeks, 1);

  const gates = evaluate(afqt, tier);

  // Medians, so "meets this criterion" is relative to the real pool, not a guess.
  const median = (xs: number[]) => {
    if (!xs.length) return null;
    const a = [...xs].sort((x, y) => x - y);
    return a[Math.floor(a.length / 2)];
  };
  const sMed = median(sals);
  const cMed = median(comps);
  const wMed = median(weeks);

  const scored: Scored[] = pool.map((s) => {
    const reasons: string[] = [];
    const cautions: string[] = [];
    const criteria: Criterion[] = [];
    let score = 0;

    // --- interest match -----------------------------------------------
    const matched = (s.interest_cluster_ids ?? []).filter((c) =>
      interests.includes(c),
    );
    if (interests.length) {
      criteria.push({
        label: 'In an interest area you picked',
        met: matched.length > 0,
      });
    }
    if (matched.length) {
      score += 100;
      reasons.push(
        `Sits in ${matched.length > 1 ? 'the interest areas' : 'the interest area'} you picked.`,
      );
    }

    // --- priorities ----------------------------------------------------
    if (priorities.includes('civilian')) {
      const mid = salaryMid(s);
      const certs0 = s.civilian_crosswalk?.relevant_certifications ?? [];
      criteria.push({
        label: 'Leads to a real civilian career',
        met:
          (mid !== null && sMed !== null && mid >= sMed) || certs0.length >= 2,
      });
      if (mid !== null) {
        const pts = norm(mid, sMin, sMax, 45);
        score += pts;
        if (pts > 28) {
          reasons.push(
            `Among the stronger civilian salary ranges here — about $${Math.round(mid).toLocaleString()} at the midpoint.`,
          );
        }
      }
      const certs = s.civilian_crosswalk?.relevant_certifications ?? [];
      if (certs.length >= 2) {
        score += 10;
        reasons.push(
          `Maps to recognised civilian certifications (${certs.slice(0, 2).join(', ')}).`,
        );
      }
    }

    if (priorities.includes('pay')) {
      const c = entryComp(s);
      criteria.push({
        label: 'Above-median entry pay',
        met: c !== null && cMed !== null && c >= cMed,
      });
      if (c !== null) {
        const pts = norm(c, cMin, cMax, 40);
        score += pts;
        if (pts > 26) {
          reasons.push(
            `Higher entry compensation than most — about $${Math.round(c).toLocaleString()}/yr estimated.`,
          );
        }
      }
    }

    if (priorities.includes('fast')) {
      const w = pipelineWeeks(s);
      criteria.push({
        label: 'Shorter-than-median training',
        met: w !== null && wMed !== null && w <= wMed,
      });
      if (w !== null) {
        // shorter is better -> invert
        const pts = 40 - norm(w, wMin, wMax, 40);
        score += pts;
        if (w <= 25) {
          reasons.push(`Short pipeline — about ${w} weeks of training before you do the job.`);
        }
      }
    }

    if (priorities.includes('clearance')) {
      criteria.push({
        label: 'Requires a security clearance',
        met: hasClearance(s),
      });
      if (hasClearance(s)) {
        score += 40;
        reasons.push(
          `Requires a security clearance (${s.entry_requirements.security_clearance}) — the clearance itself carries real civilian labour-market value.`,
        );
      }
    }

    if (priorities.includes('lowrisk')) {
      const claims0 = bodyClaims(s);
      criteria.push({
        label: 'Lower physical toll',
        met: claims0.length === 0,
      });
      const claims = claims0;
      if (claims.length >= 2) {
        score -= 45;
      } else if (claims.length === 0) {
        score += 20;
        reasons.push('No high-incidence physical disability claims recorded for this specialty.');
      }
    }

    // --- cautions, always shown ----------------------------------------
    const gap = s.civilian_crosswalk?.credential_gap_note;
    if (gap) cautions.push(gap);

    if (hasClearance(s) && !priorities.includes('clearance')) {
      cautions.push(
        `Clearance gate: ${s.entry_requirements.security_clearance}. Eligibility is decided by background, finances and foreign contacts — independently of your ASVAB score.`,
      );
    }

    const claims = bodyClaims(s);
    if (claims.length) {
      cautions.push(
        `Common VA disability claims in this line of work: ${claims.join(', ')}.`,
      );
    }

    // --- branch gate ----------------------------------------------------
    const bid = branchIdOf(s);
    const g = gates.find((x) => x.branch === bid);
    const branchGate = g?.verdict ?? 'unknown';
    if (branchGate === 'fail') score -= 60;
    if (branchGate === 'conflict') score -= 10;

    const metCount = criteria.filter((c) => c.met).length;
    const totalCount = criteria.length;

    return {
      specialty: s,
      score,
      reasons,
      cautions,
      criteria,
      metCount,
      totalCount,
      branchGate,
      branchGateLabel: g?.label ?? 'Not published',
    };
  });

  // Order by how many of the reader's own criteria are met, then by signal
  // strength as a tiebreak. Order is not a quality judgement, and no number is
  // ever shown for it.
  return scored.sort(
    (a, b) => b.metCount - a.metCount || b.score - a.score,
  );
}
