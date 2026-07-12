/**
 * Types mirroring the OUTPUT SPEC schema in master-prompt-v2.md.
 * The research JSON in src/research/ is the source of truth; these types
 * describe it, they do not define it.
 */

export type BranchId =
  | 'army'
  | 'navy'
  | 'air-force'
  | 'marine-corps'
  | 'space-force'
  | 'coast-guard';

export const BRANCH_IDS: BranchId[] = [
  'army',
  'navy',
  'air-force',
  'marine-corps',
  'space-force',
  'coast-guard',
];

/** The branch names as they appear in SpecialtyRecord.branch (title case). */
export type BranchName =
  | 'Army'
  | 'Navy'
  | 'Air Force'
  | 'Marine Corps'
  | 'Space Force'
  | 'Coast Guard';

export const BRANCH_NAME_TO_ID: Record<string, BranchId> = {
  Army: 'army',
  Navy: 'navy',
  'Air Force': 'air-force',
  'Marine Corps': 'marine-corps',
  'Space Force': 'space-force',
  'Coast Guard': 'coast-guard',
};

/** Per-branch visual identity. Colors are each service's official palette. */
export const BRANCH_THEME: Record<
  BranchId,
  { name: string; short: string; primary: string; accent: string }
> = {
  army: { name: 'U.S. Army', short: 'Army', primary: '#1a1a1a', accent: '#FFD700' },
  navy: { name: 'U.S. Navy', short: 'Navy', primary: '#00205B', accent: '#C5B358' },
  'air-force': {
    name: 'U.S. Air Force',
    short: 'Air Force',
    primary: '#00308F',
    accent: '#B9C6D2',
  },
  'marine-corps': {
    name: 'U.S. Marine Corps',
    short: 'Marines',
    primary: '#AF1E2D',
    accent: '#C8A951',
  },
  'space-force': {
    name: 'U.S. Space Force',
    short: 'Space Force',
    primary: '#0F2A4A',
    accent: '#6EC1E4',
  },
  'coast-guard': {
    name: 'U.S. Coast Guard',
    short: 'Coast Guard',
    primary: '#003366',
    accent: '#E4002B',
  },
};

export type Source = {
  title: string;
  url: string;
  retrieved_date: string;
};

export type InterestCluster = {
  id: string;
  name: string;
  description: string;
  aptitude_signals: string[];
  related_asvab_composites: string[];
  hero_image_query: string;
  example_specialties_by_branch: Record<string, string[]>;
  notes: string;
};

export type BranchProfile = {
  id: BranchId;
  name: string;
  department: string;
  mission: string;
  culture: string;
  size_active_duty: string | number;
  entry_paths: {
    enlisted: string;
    rotc: string;
    ocs_ots: string;
    academy: string;
  };
  basic_training: {
    name: string;
    location: string;
    length_weeks: number;
    notes: string;
  };
  general_eligibility: {
    age_range: string;
    citizenship: string;
    education: string;
  };
  structural_notes: string;
  sources: Source[];
};

export type TrainingStage = {
  stage: string;
  location: string;
  length_weeks: number;
  description: string;
};

export type SpecialtyRecord = {
  id: string;
  name: string;
  branch: string;
  track: 'enlisted' | 'officer';
  code: string;
  interest_cluster_ids: string[];

  entry_requirements: {
    asvab_line_score: string | null;
    education: string;
    age_range: string;
    physical: string;
    security_clearance: string | null;
    other: string | null;
  };

  training_pipeline: TrainingStage[];

  pay_and_compensation: {
    paygrade_entry: string;
    base_pay_monthly_usd: number | string;
    bah_estimate_monthly_usd: number | string;
    bas_monthly_usd: number | string;
    total_compensation_estimate_annual_usd: number | string;
    methodology_note: string;
    source: string;
    retrieved_date: string;
  };

  bonuses: {
    enlistment_bonus_range_usd: [number, number] | null | string;
    reenlistment_bonus_range_usd: [number, number] | null | string;
    conditions: string;
    source: string;
    retrieved_date: string;
  };

  career_progression: {
    typical_promotion_timeline: string;
    reenlistment_decision_points: string[];
    advanced_schools_or_certs: string[];
    officer_conversion_path: string | null;
    source: string;
    retrieved_date: string;
  };

  retirement: Record<string, unknown> & {
    twenty_year_cliff_note?: string;
    source?: string;
  };

  transition: Record<string, unknown> & {
    skillbridge_eligible?: boolean | string;
    va_disability_common_claims?: string[];
    source?: string;
  };

  civilian_crosswalk: {
    onet_codes: string[];
    example_civilian_titles: string[];
    relevant_certifications: string[];
    estimated_civilian_salary_range_usd: [number, number] | string;
    credential_gap_note: string;
    source: string;
    retrieved_date: string;
  };

  veteran_benefits: Record<string, unknown> & { source?: string };

  education_benefits?: Record<string, unknown>;

  deployment_and_lifestyle?: {
    typical_tempo: string;
    family_considerations: string;
  };

  visual_assets?: {
    branch_logo_id: string;
    specialty_badge_id: string | null;
    dvids_search_terms: string[];
    risk_tier: 'LOW' | 'MEDIUM' | 'HIGH';
  };

  sources: Source[];
};

export type SpecialtyFile = {
  command: string;
  cluster_id: string;
  retrieved_date: string;
  specialties: SpecialtyRecord[];
  branches_with_no_presence?: { branch: string; why: string }[];
  sources?: Source[];
  unverified?: string[];
  completion_accountability?: string;
};

/** True when a value is the literal UNVERIFIED sentinel used across the data. */
export function isUnverified(v: unknown): boolean {
  return typeof v === 'string' && /unverified/i.test(v);
}

export function money(v: number | string | null | undefined): string {
  if (v === null || v === undefined) return 'Not published';
  if (typeof v === 'string') return v;
  if (!Number.isFinite(v)) return 'Not published';
  return `$${v.toLocaleString('en-US')}`;
}
