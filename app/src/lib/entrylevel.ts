/**
 * Can a civilian off the street actually enlist into this job?
 *
 * This is NOT the same question as "is it enlisted", and conflating the two was a
 * real bug in this site. A large share of enlisted specialties — roughly a fifth of
 * the Marine Corps MOS list, plus the Army's recruiter and career-counsellor MOSs,
 * plus most Air Force special-duty identifiers — are awarded ONLY by lateral move,
 * reclassification, or promotion from another specialty. You must already be
 * serving to hold them. A seventeen-year-old cannot pick one at MEPS.
 *
 * The discovery tool answers "what could I actually do". Offering a reader a job he
 * is structurally ineligible for is the single worst thing this site could do, and
 * `track: "enlisted"` cheerfully passes every one of them.
 *
 * So each branch was classified against its own authority — the Marine Corps MOS
 * Manual, goarmy's careers API, the Air Force AFECD, the Navy's source-rating list
 * — and the verdict lives here, as a boolean with a sourced reason.
 *
 * FAIL CLOSED. A job with no verdict is treated as NOT entry level. It is far
 * better to omit a real entry-level job than to offer a reader one he cannot have.
 */

type Verdict = { entry_level: boolean; reason: string; confidence?: string };
type File = { branch: string; source?: string; jobs: (Verdict & { id: string })[] };

const modules = import.meta.glob<{ default: File }>('../research/entrylevel-*.json', {
  eager: true,
});

const verdicts = new Map<string, Verdict>();

for (const m of Object.values(modules)) {
  for (const j of m.default?.jobs ?? []) {
    if (j?.id) verdicts.set(j.id, { entry_level: j.entry_level, reason: j.reason, confidence: j.confidence });
  }
}

/** True only when a source says a civilian can enlist directly into this job. */
export function isEntryLevel(id: string): boolean {
  return verdicts.get(id)?.entry_level === true;
}

/** Why a job is closed to new recruits — for saying so out loud, not for hiding it. */
export function entryLevelReason(id: string): string | null {
  const v = verdicts.get(id);
  return v && !v.entry_level ? v.reason : null;
}

export function hasVerdict(id: string): boolean {
  return verdicts.has(id);
}

export const classifiedCount = verdicts.size;
export const entryLevelCount = [...verdicts.values()].filter((v) => v.entry_level).length;
