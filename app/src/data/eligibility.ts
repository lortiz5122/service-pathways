import type { BranchId } from './content';

/**
 * AFQT enlistment gates, per branch.
 *
 * Deliberately NOT modeled: the raw-composite -> percentile conversion. The
 * AFQT formula (2*VE + AR + MK) is public, but the DoD norm tables that turn
 * that raw composite into a 1–99 percentile are not in the source document.
 * Rather than invent a curve, the screener takes the AFQT percentile directly.
 */

export type Tier = 'diploma' | 'ged';
export type Verdict = 'pass' | 'fail' | 'conflict' | 'unknown';

type Gate = {
  branch: BranchId;
  /** Minimum published on the service's own page. */
  official: { diploma: number; ged: number } | null;
  /** Higher figure cited operationally, where the sources disagree. */
  operational?: { diploma: number; ged: number };
  note: string;
};

export const GATES: Gate[] = [
  {
    branch: 'army',
    official: { diploma: 31, ged: 50 },
    note: 'goarmy.com. The Future Soldier Prep Course can take applicants scoring 21–49.',
  },
  {
    branch: 'navy',
    official: { diploma: 31, ged: 50 },
    note: 'COMNAVCRUITCOMINST 1130.8 via navycs.com. The often-quoted "35" is outdated.',
  },
  {
    branch: 'marine-corps',
    official: { diploma: 31, ged: 50 },
    note: 'marines.com says 31; secondary sources widely repeat 32. GED is capped near 5% of accessions.',
  },
  {
    branch: 'air-force',
    official: { diploma: 31, ged: 50 },
    operational: { diploma: 36, ged: 65 },
    note: 'Sources conflict: airforce.com’s ASVAB page says 31/50, its how-to-join page and recruiting affiliates say 36/65.',
  },
  {
    branch: 'space-force',
    official: null,
    note: 'No branch-specific minimum is published — spaceforce.com says only "a qualifying ASVAB score." It inherits the Air Force pipeline and is highly selective in practice.',
  },
  {
    branch: 'coast-guard',
    official: { diploma: 32, ged: 50 },
    note: 'GAO-25-107224. The 2024 average for active-duty enlisted recruits was 64. The Reserve minimum is reportedly still 40 (unverified).',
  },
];

export type Result = {
  branch: BranchId;
  verdict: Verdict;
  label: string;
  detail: string;
};

export function evaluate(afqt: number, tier: Tier): Result[] {
  return GATES.map((g): Result => {
    if (!g.official) {
      return {
        branch: g.branch,
        verdict: 'unknown',
        label: 'Not published',
        detail: g.note,
      };
    }

    const min = g.official[tier];
    const op = g.operational?.[tier];

    if (afqt < min) {
      return {
        branch: g.branch,
        verdict: 'fail',
        label: `Below ${min}`,
        detail: g.note,
      };
    }

    if (op && afqt < op) {
      return {
        branch: g.branch,
        verdict: 'conflict',
        label: `Clears ${min}, not ${op}`,
        detail: g.note,
      };
    }

    return {
      branch: g.branch,
      verdict: 'pass',
      label: `Clears ${op ?? min}`,
      detail: g.note,
    };
  });
}
