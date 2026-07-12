import raw from '../research/bonuses.json';
import type { BranchId, SpecialtyRecord } from './types';
import { BRANCH_NAME_TO_ID } from './types';

/**
 * Enlistment bonuses.
 *
 * Source tiers differ and the app says so. The Coast Guard figures are OFFICIAL
 * (gocoastguard.com). The other four branches are SECONDARY (Military.com,
 * published 2026-06-15) because official service bonus tables return HTTP 403 to
 * automated retrieval.
 *
 * The two sources CONFLICT on the Coast Guard maximum ($75k secondary vs $60k
 * official). That conflict is surfaced, not reconciled.
 *
 * The Space Force has no bonus data from either source. It is flagged as a gap
 * rather than padded with an assumed Air Force figure.
 */

export type BonusProgram = {
  name: string;
  amount_usd: number | null;
  conditions: string;
  /** Preformatted display, used when the real value is a RANGE. Showing only the
   *  ceiling of a $30k-$60k range as "the" bonus is the exact over-claim this
   *  whole module exists to prevent. */
  display?: string;
};

export type BranchBonus = {
  branch: BranchId;
  name: string;
  max_bonus_usd: number | null;
  max_note: string;
  source_tier?: string;
  source_url?: string;
  accuracy_warning?: string;
  no_per_afsc_figures?: string;
  official_caveat?: string;
  conflict?: { note: string; secondary_figure_usd: number; official_figure_usd: number };
  programs: BonusProgram[];
  eligible_fields?: string[];
  non_cash_incentives?: { name: string; detail: string }[];
  /** Bonuses STACK to the ceiling — the headline is a sum, not one payment. */
  stacking?: {
    rule: string;
    stackable: string[];
    restriction?: string;
    source?: string;
  };
  payment_terms?: string;
  source_retrieved?: string;
};

export type BonusMechanics = {
  how_it_is_paid: { under_20k: string; over_20k: string; plain: string };
  tax: string;
  recoupment: { plain: string; detail: string; why_it_matters: string };
  adjusted_regularly: string;
  figures_warning: string;
};

export type Reenlistment = {
  name: string;
  eligibility: string[];
  maximum: string;
  payment: string;
  note: string;
};

type File = {
  source: { title: string; publisher: string; url: string; published_date: string; tier: string; tier_note: string };
  hard_caveats: string[];
  branches: BranchBonus[];
  unverified: string[];
  mechanics?: BonusMechanics;
  reenlistment?: Reenlistment;
};

const F = raw as unknown as File;

export const BONUS_SOURCE = F.source;
export const BONUS_CAVEATS = F.hard_caveats ?? [];
export const BONUS_UNVERIFIED = F.unverified ?? [];
export const BONUS_BRANCHES = F.branches ?? [];
export const BONUS_MECHANICS = F.mechanics;
export const REENLISTMENT = F.reenlistment;

export const bonusForBranch = (b: BranchId): BranchBonus | undefined =>
  BONUS_BRANCHES.find((x) => x.branch === b);

/* ------------------------------------------------------------- matching */

/**
 * Parenthetical content is KEPT, not stripped. "(Submarines)" and "(Advanced)"
 * are the qualifiers that distinguish one bonus from another — throwing them
 * away is how "Machinist's Mate Submarines" ends up attached to an Aviation
 * Machinist's Mate.
 */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Words too generic to distinguish one job from another.
 *
 * NOTE what is deliberately NOT here: submarines, submarine, surface, aviation,
 * advanced, nuclear, interpretive. Those are DISAMBIGUATORS. An earlier version
 * treated them as noise, and the result was that every "Machinist's Mate" — the
 * aviation one, the surface one, the submarine one — matched the submarine
 * bonus. Showing a teenager a $10,000 figure for a job that doesn't pay it is a
 * lie about money, so the qualifiers stay.
 */
const STOP = new Set([
  'technician', 'specialist', 'operator', 'systems', 'career', 'bonus',
  'the', 'and', 'of', 'corps', 'navy', 'army', 'air', 'force', 'coast',
  'guard', 'marine', 'mate', 'year', 'contract',
]);

/** A real, non-UNVERIFIED bonus recorded on the specialty itself. */
function ownBonus(s: SpecialtyRecord): BonusProgram | null {
  const v = s.bonuses?.enlistment_bonus_range_usd;
  if (Array.isArray(v) && v.length === 2) {
    const [a, b] = v.map(Number);
    if (Number.isFinite(a) && a > 0) {
      const hi = Number.isFinite(b) && b > a ? b : null;
      return {
        name: `${s.name} enlistment bonus`,
        amount_usd: a,
        display: hi
          ? `$${a.toLocaleString()} – $${hi.toLocaleString()}`
          : `$${a.toLocaleString()}`,
        conditions:
          s.bonuses?.conditions ||
          'Researched for this specialty specifically. Confirm the current figure with a recruiter.',
      };
    }
  }
  return null;
}

/**
 * Match a specialty to a NAMED bonus program.
 *
 * Order: the specialty's own researched bonus first (most specific), then a
 * conservative program-name match. It requires EVERY distinctive word of the
 * program name to appear in the specialty, so a near-miss returns nothing rather
 * than the wrong number.
 */
export function bonusForSpecialty(s: SpecialtyRecord): {
  branch: BranchBonus | undefined;
  matched: BonusProgram | null;
} {
  const bid = BRANCH_NAME_TO_ID[s.branch];
  const branch = bid ? bonusForBranch(bid) : undefined;

  const own = ownBonus(s);
  if (own) return { branch, matched: own };

  if (!branch?.programs?.length) return { branch, matched: null };

  const hayWords = new Set(norm(`${s.name} ${s.code}`).split(' '));

  let best: BonusProgram | null = null;
  let bestScore = 0;

  for (const p of branch.programs) {
    if (p.amount_usd === null) continue;
    // Guard/Reserve programs must never attach to an active-duty specialty.
    if (/reserve|national guard/i.test(p.name)) continue;

    const pWords = norm(p.name)
      .split(' ')
      .filter((w) => w.length > 2 && !STOP.has(w));
    if (!pWords.length) continue;

    const hits = pWords.filter((w) => hayWords.has(w)).length;
    if (hits === pWords.length && hits > bestScore) {
      bestScore = hits;
      best = p;
    }
  }

  return { branch, matched: best };
}
