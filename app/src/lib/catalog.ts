import { allSpecialties } from './data';
import { BRANCH_NAME_TO_ID, type BranchId, type SpecialtyRecord } from './types';
import { classifiedCount, isEntryLevel } from './entrylevel';

/**
 * The complete job catalogue.
 *
 * The site holds ~103 DEEP records — full lifecycle: pay, pipeline, retirement,
 * transition, the civilian crosswalk, the credential gap, all sourced. But the
 * real universe is roughly 600 specialties, so for every job we researched in
 * depth there were five a reader simply could not find.
 *
 * A job that is missing with no explanation reads as a job that does not exist.
 * That is the same silent-absence failure the site fixes everywhere else, just at
 * a larger scale.
 *
 * So: CATALOG entries make every job findable. They carry what is actually known
 * — code, name, branch, what it is, and a score gate where one is sourced — and
 * they are LABELLED as not deep-researched. They do NOT carry invented pay,
 * retirement or crosswalk data. An honest gap beats a fabricated record.
 */

export type Depth = 'deep' | 'catalog';

export type CatalogEntry = {
  code: string;
  name: string;
  branch: string;
  track: 'enlisted' | 'officer';
  interest_cluster_ids: string[];
  what_it_is?: string;
  asvab?: string | null;
  clearance?: string | null;
  occfld?: string;
  source?: string;
  /** Set when the job exists on paper but is NOT an open accession path yet. */
  not_open_yet?: string;
  depth: 'catalog';
};

/** Anything the directory can list — a deep record or a catalogue entry. */
export type Job = {
  id: string;
  code: string;
  name: string;
  branch: string;
  branchId?: BranchId;
  track: string;
  clusters: string[];
  depth: Depth;
  what?: string;
  asvab?: string | null;
  clearance?: string | null;
  /** Set when the job is not an open accession path yet. */
  notOpenYet?: string;
  /** The full record, when we have one. */
  record?: SpecialtyRecord;
};

const catalogModules = import.meta.glob<{ default: { specialties: CatalogEntry[] } }>(
  '../research/catalog-*.json',
  { eager: true },
);

const catalogEntries: CatalogEntry[] = Object.values(catalogModules)
  .flatMap((m) => m.default?.specialties ?? [])
  .filter((e) => e?.code && e?.name);

/**
 * A stable, UNIQUE id for a catalogue entry.
 *
 * The code alone is not an identity, for two independent reasons:
 *   - Placeholders. Every Space Force entry carries the literal code "UNVERIFIED",
 *     so a code-derived id collapsed all seven onto `space-force-unverified`.
 *   - Genuine collisions. Three Air Force nurse-practitioner specialties really do
 *     share code 46YX, and Marine 0919 and 6044 are each shared by an enlisted and
 *     an officer variant.
 *
 * So: build the natural id, then disambiguate anything that repeats by folding in
 * the job name. Deterministic, stable, and it never silently merges two jobs into
 * one — which is the failure this whole file exists to prevent.
 */
const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function assignIds(
  entries: CatalogEntry[],
  reserved: Set<string> = new Set(),
): Map<CatalogEntry, string> {
  const base = new Map<CatalogEntry, string>();
  const counts = new Map<string, number>();

  for (const e of entries) {
    const known = e.code && !/unverified|unknown/i.test(e.code);
    const id = slug(`${BRANCH_NAME_TO_ID[e.branch] ?? e.branch}-${known ? e.code : e.name}`);
    base.set(e, id);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  const out = new Map<CatalogEntry, string>();
  // Deep-record ids are RESERVED. A catalogue entry that survives dedup (because its
  // deep record was already claimed by a different job) must not land on that record's
  // id — two different jobs, one URL.
  const used = new Set<string>(reserved);
  for (const e of entries) {
    let id = base.get(e)!;
    if ((counts.get(id) ?? 0) > 1 || reserved.has(id)) id = slug(`${id}-${e.name}`);
    // Last resort: still colliding, so number it rather than merge two real jobs.
    let final = id;
    let n = 2;
    while (used.has(final)) final = `${id}-${n++}`;
    used.add(final);
    out.set(e, final);
  }
  return out;
}

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/**
 * Match a catalogue entry to an existing deep record, so we never list both.
 *
 * Deliberately conservative. An early version matched on `code.startsWith(...)`,
 * and because several Space Force records carry the literal code "UNVERIFIED",
 * EVERY Space Force catalogue entry matched every Space Force deep record and
 * silently vanished. A dedup that is too eager doesn't merge jobs — it deletes
 * them, which is the exact silent-absence failure this file exists to prevent.
 */
function deepMatch(e: CatalogEntry): SpecialtyRecord | undefined {
  const code = e.code.trim().toUpperCase();
  const isRealCode = code.length >= 2 && !/UNVERIFIED/i.test(code);
  const name = norm(e.name);

  return allSpecialties.find((s) => {
    if (s.branch !== e.branch) return false;

    // Same code — but only when the code is a real code, not a placeholder.
    if (isRealCode) {
      const sc = String(s.code).trim().toUpperCase();
      if (!/UNVERIFIED/i.test(sc)) {
        // Exact, or the record's code starts with this code (e.g. "1310 (Naval…").
        if (sc === code || sc.startsWith(`${code} `) || sc.startsWith(`${code}(`))
          return true;
      }
    }

    // Otherwise fall back to the job NAME, which is the only reliable key when
    // the code is unknown.
    const sn = norm(s.name);
    return sn === name || sn.startsWith(name) || name.startsWith(sn);
  });
}

const deepJobs: Job[] = allSpecialties.map((s) => ({
  id: s.id,
  code: String(s.code),
  name: s.name,
  branch: s.branch,
  branchId: BRANCH_NAME_TO_ID[s.branch],
  track: s.track,
  clusters: s.interest_cluster_ids ?? [],
  depth: 'deep',
  what: s.entry_requirements?.other ?? undefined,
  asvab: s.entry_requirements?.asvab_line_score ?? null,
  clearance: s.entry_requirements?.security_clearance ?? null,
  record: s,
}));

const catIds = assignIds(catalogEntries, new Set(deepJobs.map((j) => j.id)));


/**
 * A deep record always wins — but it may absorb only ONE catalogue entry, ever.
 *
 * The match is fuzzy (a curated record's id and name rarely equal the catalogue's),
 * and a fuzzy match applied greedily DELETES jobs. Three different Air Force nurse-
 * practitioner specialties genuinely share code 46YX; one deep 46YX record swallowed
 * all three and two real jobs vanished. An earlier fix still leaked, because a record
 * could be claimed once by an exact-id match and AGAIN by a code match.
 *
 * So there is exactly one ledger, and every match path writes to it. A deep record is
 * spoken for after its first catalogue entry. Anything left over is still shown. In
 * the worst case a job appears twice; it may never be silently deleted.
 */
const claimedDeep = new Set<string>();

/** The deep record this catalogue entry IS, if any — id, then code, then name. */
function absorbedBy(e: CatalogEntry): SpecialtyRecord | undefined {
  const id = catIds.get(e)!;
  const byId = deepJobs.find((j) => j.id === id)?.record;
  if (byId) return byId;

  const code = e.code.trim().toUpperCase();
  if (!/UNVERIFIED/i.test(code) && code.length >= 2) {
    const byCode = allSpecialties.find(
      (sp) => sp.branch === e.branch && String(sp.code).trim().toUpperCase() === code,
    );
    if (byCode) return byCode;
  }

  return deepMatch(e);
}

const catalogJobs: Job[] = catalogEntries
  .filter((e) => {
    const deep = absorbedBy(e);
    if (!deep) return true;              // no deep record — show the catalogue entry
    if (claimedDeep.has(deep.id)) return true; // already absorbed one — keep this job
    claimedDeep.add(deep.id);
    return false;                        // the deep record represents this job
  })
  .map((e) => ({
    id: catIds.get(e)!,
    code: e.code,
    name: e.name,
    branch: e.branch,
    branchId: BRANCH_NAME_TO_ID[e.branch],
    track: e.track ?? 'enlisted',
    clusters: e.interest_cluster_ids ?? [],
    depth: 'catalog' as const,
    what: e.what_it_is,
    asvab: e.asvab ?? null,
    clearance: e.clearance ?? null,
    notOpenYet: e.not_open_yet,
  }));

export const allJobs: Job[] = [...deepJobs, ...catalogJobs];

export const jobCounts = {
  total: allJobs.length,
  deep: deepJobs.length,
  catalog: catalogJobs.length,
};

export const jobsForCluster = (clusterId: string) =>
  allJobs.filter((j) => j.clusters.includes(clusterId));

export const jobsForBranch = (b: BranchId) =>
  allJobs.filter((j) => j.branchId === b);

export const jobById = (id: string) => allJobs.find((j) => j.id === id);

/** Plain substring search over code, name, branch and description. */
export function searchJobs(
  q: string,
  filters: { branch?: BranchId | 'all'; cluster?: string | 'all'; depth?: Depth | 'all' } = {},
): Job[] {
  const needle = q.trim().toLowerCase();
  return allJobs.filter((j) => {
    if (filters.branch && filters.branch !== 'all' && j.branchId !== filters.branch)
      return false;
    if (filters.cluster && filters.cluster !== 'all' && !j.clusters.includes(filters.cluster))
      return false;
    if (filters.depth && filters.depth !== 'all' && j.depth !== filters.depth)
      return false;
    if (!needle) return true;
    return (
      j.code.toLowerCase().includes(needle) ||
      j.name.toLowerCase().includes(needle) ||
      j.branch.toLowerCase().includes(needle) ||
      (j.what ?? '').toLowerCase().includes(needle)
    );
  });
}

/**
 * Every ENTRY-LEVEL job in the interest areas the reader picked.
 *
 * "Entry level" means a path a person can actually walk in off the street:
 * enlisted, no commission, no prior service. Officer and warrant routes are real
 * and the site covers them — but they are not entry level, and quietly mixing a
 * Naval Aviator in with jobs a 17-year-old can enlist into is exactly the kind of
 * silent misinformation this site exists to prevent.
 *
 * This returns the FULL set, deep records and catalogue entries alike. The
 * recommender can only score the deep ones — it needs salary, pipeline and injury
 * data the catalogue entries do not carry — but a job the reader cannot even SEE
 * is a job that, to them, does not exist. So the tool shows every one of them, and
 * says plainly which ones it has researched and which it has not.
 */
export function entryLevelJobs(interests: string[]): Job[] {
  const pool = interests.length
    ? allJobs.filter((j) => j.clusters.some((c) => interests.includes(c)))
    : allJobs;

  return pool
    .filter((j) => j.track === 'enlisted')
    // Same fail-closed gate as the recommender. A job listed here as something the
    // reader "can walk into" had better be one he can actually walk into.
    .filter((j) => (classifiedCount > 0 ? isEntryLevel(j.id) : true))
    .sort((a, b) => a.name.localeCompare(b.name));
}
