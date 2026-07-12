import taxonomyJson from '../research/interest-taxonomy.json';
import branchesJson from '../research/branch-profiles.json';
import payJson from '../research/pay-tables.json';
import retirementJson from '../research/retirement.json';
import educationJson from '../research/education-benefits.json';
import veteranJson from '../research/veteran-benefits.json';
import transitionJson from '../research/transition.json';
import assetJson from '../research/asset-manifest.json';

import {
  BRANCH_NAME_TO_ID,
  type BranchId,
  type BranchProfile,
  type InterestCluster,
  type SpecialtyFile,
  type SpecialtyRecord,
} from './types';

export const taxonomy = taxonomyJson as unknown as {
  retrieved_date: string;
  clusters: InterestCluster[];
  unverified: string[];
};

export const branches = (
  branchesJson as unknown as { branches: BranchProfile[] }
).branches;

export const pay = payJson as Record<string, unknown>;
export const retirement = retirementJson as Record<string, unknown>;
export const education = educationJson as Record<string, unknown>;
export const veteran = veteranJson as Record<string, unknown>;
export const transition = transitionJson as Record<string, unknown>;
export const assets = assetJson as Record<string, unknown>;

/**
 * Specialty files are produced one-per-cluster by the research phase. Globbing
 * them means a newly-researched cluster appears in the app with no code change,
 * and a cluster that was never researched simply has no specialties — which the
 * UI reports honestly rather than hiding.
 */
const specialtyModules = import.meta.glob<{ default: SpecialtyFile }>(
  '../research/specialties-*.json',
  { eager: true },
);

export const specialtyFiles: SpecialtyFile[] = Object.values(specialtyModules)
  .map((m) => m.default)
  .filter((f): f is SpecialtyFile => Boolean(f?.specialties));

export const clusters: InterestCluster[] = taxonomy.clusters;

export const allSpecialties: SpecialtyRecord[] = specialtyFiles.flatMap(
  (f) => f.specialties ?? [],
);

export const clusterById = (id: string) => clusters.find((c) => c.id === id);

export const branchById = (id: BranchId) => branches.find((b) => b.id === id);

export const specialtyById = (id: string) =>
  allSpecialties.find((s) => s.id === id);

export const fileForCluster = (clusterId: string) =>
  specialtyFiles.find((f) => f.cluster_id === clusterId);

/** Specialties belonging to a cluster — by explicit FK, falling back to the file. */
export function specialtiesForCluster(clusterId: string): SpecialtyRecord[] {
  const byFk = allSpecialties.filter((s) =>
    (s.interest_cluster_ids ?? []).includes(clusterId),
  );
  if (byFk.length) return byFk;
  return fileForCluster(clusterId)?.specialties ?? [];
}

export function specialtiesForBranch(branch: BranchId): SpecialtyRecord[] {
  return allSpecialties.filter(
    (s) => BRANCH_NAME_TO_ID[s.branch] === branch,
  );
}

export function branchIdOf(s: SpecialtyRecord): BranchId | undefined {
  return BRANCH_NAME_TO_ID[s.branch];
}

/** Which clusters actually have researched specialty data behind them. */
export function clusterHasData(clusterId: string): boolean {
  return specialtiesForCluster(clusterId).length > 0;
}

export const RESEARCH_DATE = taxonomy.retrieved_date ?? '2026-07-12';
