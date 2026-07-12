import { allSpecialties } from './data';
import { BRANCH_NAME_TO_ID, type BranchId, type SpecialtyRecord } from './types';

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

/** A stable id for a catalogue entry. */
const catId = (e: CatalogEntry) =>
  `${(BRANCH_NAME_TO_ID[e.branch] ?? e.branch).toString()}-${e.code}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Match a catalogue entry to an existing deep record, so we never list both. */
function deepMatch(e: CatalogEntry): SpecialtyRecord | undefined {
  const code = e.code.trim().toUpperCase();
  return allSpecialties.find(
    (s) =>
      s.branch === e.branch &&
      String(s.code).trim().toUpperCase().startsWith(code) &&
      code.length >= 2,
  );
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

const deepKeys = new Set(
  deepJobs.map((j) => `${j.branch}|${j.code.trim().toUpperCase()}`),
);

const catalogJobs: Job[] = catalogEntries
  // A deep record always wins. Never show the same job twice at two depths.
  .filter((e) => {
    const key = `${e.branch}|${e.code.trim().toUpperCase()}`;
    if (deepKeys.has(key)) return false;
    return !deepMatch(e);
  })
  .map((e) => ({
    id: catId(e),
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
