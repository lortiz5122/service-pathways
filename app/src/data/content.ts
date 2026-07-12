/**
 * All content is transcribed from prep-pathway.md (retrieved 2026-07-12).
 * Every figure keeps its named source. Items the source document could not
 * confirm are carried through with `unverified: true` and must render as such —
 * the app is a neutral reference, not recruiting material.
 */

export const RETRIEVED = '2026-07-12';

export type { BranchId } from '../lib/types';
import type { BranchId } from '../lib/types';

export type Branch = {
  id: BranchId;
  name: string;
  short: string;
  department: string;
  /** Official-palette colors used for this branch's theming. */
  primary: string;
  accent: string;
  /** Text color that sits legibly on `primary`. */
  onPrimary: string;
  tagline: string;
  afqtTier1: string;
  afqtTier2: string;
  afqtNote: string;
  afqtConflict?: boolean;
  fitnessTest: string;
  fitnessCadence: string;
  lineScoreSystem: string;
};

export const BRANCHES: Branch[] = [
  {
    id: 'army',
    name: 'U.S. Army',
    short: 'Army',
    department: 'Dept. of Defense',
    primary: '#111111',
    accent: '#FFD700',
    onPrimary: '#FFFFFF',
    tagline: 'Largest force; 10 ASVAB composites gate the widest MOS catalog.',
    afqtTier1: '31',
    afqtTier2: '50',
    afqtNote:
      'goarmy.com (official). The Future Soldier Prep Course exists for applicants scoring 21–49.',
    fitnessTest: 'Army Fitness Test (AFT) — 5 events',
    fitnessCadence: 'Twice/year active; once/year Guard & Reserve',
    lineScoreSystem: '10 composites (GT, CL, EL, MM, GM, FA, OF, SC, ST, CO)',
  },
  {
    id: 'navy',
    name: 'U.S. Navy',
    short: 'Navy',
    department: 'Dept. of Defense',
    primary: '#00205B',
    accent: '#C5B358',
    onPrimary: '#FFFFFF',
    tagline: 'No line scores — ratings sum raw subtest standard scores.',
    afqtTier1: '31',
    afqtTier2: '50',
    afqtNote:
      'navycs.com citing COMNAVCRUITCOMINST 1130.8. The widely-cited "35" is outdated — do not use it as current.',
    fitnessTest: 'Physical Fitness Assessment (BCA + PRT)',
    fitnessCadence: 'Twice/year as of 2026 (Jan–Jun, Jul–Dec)',
    lineScoreSystem: 'No line scores; per-rating subtest sums',
  },
  {
    id: 'marine-corps',
    name: 'U.S. Marine Corps',
    short: 'Marines',
    department: 'Dept. of Defense',
    primary: '#AF1E2D',
    accent: '#C8A951',
    onPrimary: '#FFFFFF',
    tagline: 'Two separate 300-point tests a year; GT gates combat MOSs.',
    afqtTier1: '31',
    afqtTier2: '50',
    afqtNote:
      'Official marines.com says 31; "32" is widely repeated by secondary sources. GED is capped near 5% of accessions.',
    fitnessTest: 'PFT (Jan–Jun) and CFT (Jul–Dec)',
    fitnessCadence: 'Both, annually',
    lineScoreSystem: '3 composites (GT, EL, MM)',
  },
  {
    id: 'air-force',
    name: 'U.S. Air Force',
    short: 'Air Force',
    department: 'Dept. of Defense',
    primary: '#00308F',
    accent: '#B2BEB5',
    onPrimary: '#FFFFFF',
    tagline: 'MAGE composites; often a "dream sheet" rather than a guaranteed job.',
    afqtTier1: '31 (official page) / 36 (operational)',
    afqtTier2: '50 (official page) / 65 (operational)',
    afqtNote:
      'CONFLICT: airforce.com’s ASVAB page says 31/50, while its how-to-join page and recruiting affiliates say 36/65. No authoritative reconciliation was found.',
    afqtConflict: true,
    fitnessTest: 'Physical Fitness Assessment (cardio, push, core, WHtR)',
    fitnessCadence: 'Twice/year under the model activating Sept 1, 2026',
    lineScoreSystem: 'MAGE (Mechanical, Administrative, General, Electronic)',
  },
  {
    id: 'space-force',
    name: 'U.S. Space Force',
    short: 'Space Force',
    department: 'Dept. of Defense',
    primary: '#0F2A4A',
    accent: '#6EC1E4',
    onPrimary: '#FFFFFF',
    tagline: 'No reserve component, no academy of its own, highly selective.',
    afqtTier1: 'Not published',
    afqtTier2: 'Not published',
    afqtNote:
      'spaceforce.com states only "a qualifying ASVAB score." Inherits the Air Force pipeline and figures. Highly selective in practice.',
    afqtConflict: true,
    fitnessTest: 'Human Performance Assessment (HPA)',
    fitnessCadence: 'Twice/year beginning Jan 1, 2026',
    lineScoreSystem: 'MAGE (shared with the Air Force)',
  },
  {
    id: 'coast-guard',
    name: 'U.S. Coast Guard',
    short: 'Coast Guard',
    department: 'Dept. of Homeland Security',
    primary: '#003366',
    accent: '#E4002B',
    onPrimary: '#FFFFFF',
    tagline: 'Under DHS, not DoD — separate process, benefits and fitness program.',
    afqtTier1: '32',
    afqtTier2: '50',
    afqtNote:
      'GAO-25-107224: the Nov 2023 recruiting instruction cut the diploma minimum to 32 (from 36, previously 40) and raised the max enlistment age to 41. Average score for 2024 active-duty enlisted recruits was 64. Reserve minimum reportedly still 40 (UNVERIFIED).',
    fitnessTest: 'Physical Fitness Test (PFT) — service-wide from July 1, 2026',
    fitnessCadence: 'Entrance PFT in week 1 of Cape May boot camp',
    lineScoreSystem: 'No line scores; per-rating subtest sums',
  },
];

export const branchById = (id: BranchId): Branch =>
  BRANCHES.find((b) => b.id === id)!;

/* ------------------------------------------------------------------ ASVAB */

export const ASVAB_FORMATS = [
  {
    format: 'CAT-ASVAB',
    where: 'MEPS',
    questions: '~135',
    adaptive: 'Yes — cannot change prior answers',
    verification: 'None',
    retake: '1 month to a 2nd try',
  },
  {
    format: 'P&P-ASVAB',
    where: 'MET sites, high schools',
    questions: '225',
    adaptive: 'No — may skip and return within a subtest',
    verification: 'None',
    retake: '1 month to a 2nd try',
  },
  {
    format: 'PiCAT',
    where: 'Unproctored, at home',
    questions: '~145',
    adaptive: 'Yes',
    verification: 'In-person Vtest at MEPS within 45 days',
    retake: 'Cannot be retaken; only for first-time testers',
  },
];

export const SUBTESTS = [
  { code: 'GS', name: 'General Science' },
  { code: 'AR', name: 'Arithmetic Reasoning', afqt: true },
  { code: 'WK', name: 'Word Knowledge', afqt: true },
  { code: 'PC', name: 'Paragraph Comprehension', afqt: true },
  { code: 'MK', name: 'Mathematics Knowledge', afqt: true },
  { code: 'EI', name: 'Electronics Information' },
  { code: 'AI', name: 'Auto Information' },
  { code: 'SI', name: 'Shop Information' },
  { code: 'MC', name: 'Mechanical Comprehension' },
  { code: 'AO', name: 'Assembling Objects' },
];

/** DoD AFQT categories. Source: cogn-iq.org citing DoD norming. */
export const AFQT_CATEGORIES = [
  { cat: 'I', min: 93, max: 99, note: 'Highest' },
  { cat: 'II', min: 65, max: 92, note: 'Opens most jobs and bonuses' },
  { cat: 'IIIA', min: 50, max: 64, note: 'Opens all six branches' },
  { cat: 'IIIB', min: 31, max: 49, note: 'Diploma-holder minimum band' },
  { cat: 'IV', min: 10, max: 30, note: 'Capped at a small share of accessions' },
  { cat: 'V', min: 1, max: 9, note: 'Barred from enlistment by law' },
];

export function afqtCategory(score: number) {
  return AFQT_CATEGORIES.find((c) => score >= c.min && score <= c.max);
}

export const COMPOSITE_SYSTEMS = [
  {
    branch: 'Army',
    body: '10 composites: GT (General Technical = VE+AR), CL, EL, MM, GM, FA, OF, SC, ST (Skilled Technical), CO. GT gates intelligence, Special Forces selection and officer programs.',
    examples: [
      '35F Intelligence Analyst needs ST 101',
      '25S SATCOM Operator needs EL 117',
    ],
  },
  {
    branch: 'Air Force & Space Force',
    body: 'MAGE composites (percentiles): M = AR + 2(VE) + MC + AS; A = VE + MK; G = VE + AR; E = AR + MK + EI + GS. Each AFSC/SFSC sets its own minimums.',
    examples: [
      'Pararescue: G around 44 with M 60',
      'Cyber Systems needs high G and E',
      'Older sites list an obsolete A = NO+CS+VE formula — those subtests were removed decades ago',
    ],
  },
  {
    branch: 'Marine Corps',
    body: 'Three composites: GT (VE+AR), EL (GS+AR+MK+EI), MM (GS+AS+MK+EI).',
    examples: ['GT still gates infantry and combat MOSs'],
  },
  {
    branch: 'Navy & Coast Guard',
    body: 'No line scores. Each rating sums raw subtest standard scores, e.g. "VE+AR+MK+MC >= X".',
    examples: ['Navy Nuclear Field is among the highest composites'],
  },
];

export const STUDY_RESOURCES = [
  {
    name: 'officialasvab.com',
    what: 'Official test information and practice materials',
    href: 'https://www.officialasvab.com',
  },
  {
    name: 'March2Success',
    what: 'Army-sponsored free study site',
    href: 'https://www.march2success.com',
  },
  {
    name: 'ASVAB CEP',
    what: 'Career Exploration Program used in high schools',
    href: 'https://www.asvabprogram.com',
  },
];

/* ---------------------------------------------------------------- FITNESS */

export type FitnessDetail = {
  branch: BranchId;
  test: string;
  source: string;
  events: string[];
  standards: { label: string; value: string; unverified?: boolean }[];
  change2026: string;
};

export const FITNESS: FitnessDetail[] = [
  {
    branch: 'army',
    test: 'Army Fitness Test (AFT)',
    source: 'army.mil/aft and army.mil/article/284799',
    events: [
      '3-Rep-Max Deadlift (MDL)',
      'Hand-Release Push-Up (HRP)',
      'Sprint-Drag-Carry (SDC)',
      'Plank (PLK)',
      'Two-Mile Run (2MR)',
    ],
    standards: [
      { label: 'General standard', value: '>=60 per event and >=300 total, age- and sex-normed' },
      {
        label: 'Combat standard (21 designated combat MOS/AOCs)',
        value: '>=60 per event and >=350 total, sex-neutral, age-normed',
      },
      {
        label: 'Representative combat minimums, ages 17–21',
        value:
          '150 lb deadlift · 15 HRP · 2:28 SDC · 1:30 plank · 19:57 two-mile run (aftcalculatorscore.com summarizing official tables)',
      },
      {
        label: 'Combat Field Test (CFT), 7 events',
        value: 'Being introduced for combat specialties',
        unverified: true,
      },
    ],
    change2026:
      'Effective June 1, 2025 the AFT replaced the ACFT and the Standing Power Throw was removed. Combat standards become enforceable Jan 1, 2026 (active) and June 1, 2026 (Guard/Reserve).',
  },
  {
    branch: 'navy',
    test: 'Physical Fitness Assessment (PFA)',
    source: 'OPNAVINST 6110.1L (29 Dec 2025), NAVADMIN 242/24, USNI News',
    events: [
      'Body Composition Assessment (BCA)',
      'Push-ups',
      'Forearm plank',
      '1.5-mile run (bike, treadmill, row or 500-yd swim alternates at CO discretion)',
    ],
    standards: [
      { label: 'Cycles per year', value: 'Two as of 2026 (Jan–Jun and Jul–Dec) — up from one' },
      {
        label: 'Failure policy',
        value: 'Three PFA failures within four years now triggers administrative separation (previously two consecutive)',
      },
      {
        label: 'BCA high-performance exception',
        value:
          'For 2026, exceeding BCA still passes only with an Outstanding-Low overall plus Excellent-Medium or better in all three PRT categories',
      },
      {
        label: 'Combat-arms billets',
        value: 'One PFA plus a Combat Fitness Assessment: 800m swim with fins, push-ups, pull-ups, 1-mile run weighted with 20 lb',
      },
    ],
    change2026: 'Moved from one to two PFA cycles per year, and tightened the failure policy.',
  },
  {
    branch: 'marine-corps',
    test: 'PFT and CFT',
    source: 'fitness.marines.mil, MCO 6100.13A, MARADMIN 613/25',
    events: [
      'PFT: pull-ups or push-ups (push-ups cap at 70 pts), plank, 3-mile run',
      'CFT: Movement to Contact (880-yd sprint), Ammunition Lift (30-lb can, 2 min), Maneuver Under Fire (300-yd course)',
    ],
    standards: [
      { label: 'Scoring', value: 'Each test is 300 points max; >=40 per event and 135 to pass' },
      { label: 'First Class', value: 'Roughly 225–235+' },
      {
        label: 'Combat-arms, effective Jan 1, 2026',
        value:
          'Per MARADMIN 613/25, a sex-neutral PFT scored on the male age-normed scale, needing >=210 points (70%). Non-combat-arms Marines keep sex- and age-normed scoring.',
      },
    ],
    change2026:
      'Sex-neutral combat-arms PFT scoring begins Jan 1, 2026; full systems implementation projected within a year.',
  },
  {
    branch: 'air-force',
    test: 'Physical Fitness Assessment (PFA)',
    source: 'DAFMAN 36-2905, af.mil, airandspaceforces.com',
    events: [
      'Cardio: 1.5-mile run or 20m HAMR shuttle (2-km walk for medical profiles)',
      'Push: traditional or hand-release push-ups',
      'Core: sit-ups, cross-leg reverse crunch, or forearm plank',
      'Body composition: Waist-to-Height Ratio (WHtR)',
    ],
    standards: [
      { label: 'WHtR', value: 'Pass/fail: <=0.55 to pass, <=0.46 for full points — replaced the old tape test' },
      {
        label: 'Rebalanced points (2026 model)',
        value: 'Cardio 50 · Body composition 20 · Strength 15 · Core 15. Pass >=75, Excellent >=90 (afptcalculator.com summarizing the DAFMAN update dated 2025-09-23)',
      },
    ],
    change2026:
      'Official scoring under the updated model activates September 1, 2026: the two-mile run replaces the 1.5-mile run as primary cardio and testing becomes twice yearly. Alternate-component availability is being narrowed at BMT.',
  },
  {
    branch: 'space-force',
    test: 'Human Performance Assessment (HPA)',
    source: 'SPFMAN 36-2905 (26 Sep 2025), spaceforce.mil, clearancejobs.com',
    events: [
      'Cardio: 2-mile run or 20m HAMR (at least one of the two annual tests must be the run)',
      'Strength: tempo or hand-release push-ups',
      'Endurance: sit-ups, cross-leg reverse crunch, or plank',
      'Body composition: WHtR',
    ],
    standards: [
      {
        label: 'Cadence',
        value:
          'All Guardians take two physical fitness tests per year beginning January 1, 2026 (Dec 8, 2025 interim change plus Jan 6, 2026 guidance)',
      },
      {
        label: 'History',
        value:
          'The Space Force first replaced the annual PT test with a Holistic Health Approach and a voluntary wearable Continuous Fitness Assessment (now "CFA PRIME"), then reversed course.',
      },
    ],
    change2026:
      'SPFMAN 36-2905 established the service’s first fitness-for-duty standards. The program is deliberately narrower and newer than the other services’.',
  },
  {
    branch: 'coast-guard',
    test: 'Physical Fitness Test (PFT)',
    source: 'gocoastguard.com, dcms.uscg.mil (Boat Crew Fitness Test)',
    events: [
      'Push-ups',
      'Sit-ups (planks in updated standards)',
      '1.5-mile run (roughly 10:30–13:30 by age and sex)',
      'Swim and tread-water tasks',
    ],
    standards: [
      {
        label: 'Entrance',
        value: 'Recruits must pass an entrance PFT in week one of the 8-week Cape May boot camp; failure can mean recycling or separation',
      },
      {
        label: 'Recruit body-fat caps',
        value: '22% (men) / 33% (women) — commonly cited, not confirmed current on uscg.mil',
        unverified: true,
      },
      {
        label: 'New Physical Readiness Program (PRP)',
        value:
          'A formal service-wide PFT effective July 1, 2026 using Boat Crew standards: push-ups, timed forearm plank, and a choice of 1.5-mile run, 12-minute swim, or 2000-m row. Preceded by an anonymous baseline PFA in 2025.',
      },
    ],
    change2026:
      'Because the Coast Guard sits under DHS rather than DoD, its fitness program is administered separately.',
  },
];

/* --------------------------------------------------------------- PROCESS */

export const PROCESS_STEPS = [
  {
    n: 1,
    title: 'Initial contact',
    body: 'A 15–30 minute overview with a recruiter.',
  },
  {
    n: 2,
    title: 'Recruiter pre-screening',
    body: 'Marital status, health history, education, drug use and arrest record. The medical pre-screen form is reviewed by the MEPS Chief Medical Officer before you can process — normally within 3 working days unless records are requested.',
  },
  {
    n: 3,
    title: 'ASVAB',
    body: 'Taken at a MEPS or MET site, or at home via PiCAT with an in-person Vtest.',
  },
  {
    n: 4,
    title: 'MEPS',
    body: 'Medical exam, aptitude verification, job counseling, contract and oath. Typically 1–2 days.',
  },
  {
    n: 5,
    title: 'Job / specialty selection',
    body: 'With a service liaison or guidance counselor.',
  },
  {
    n: 6,
    title: 'Contract signing + Oath of Enlistment',
    body: 'The DD Form 4 and its annexes. If a guarantee is not written here, it does not exist.',
  },
  {
    n: 7,
    title: 'Delayed Entry Program',
    body: 'Most enlistees wait here until a ship date — up to 365 days.',
  },
  {
    n: 8,
    title: 'Ship to Basic Training',
    body: 'A shortened medical re-verification happens on ship day.',
  },
];

export const MEPS_DAY = [
  'Check-in and fingerprinting',
  'ASVAB, if not already taken',
  'Head-to-toe medical exam: vision including color perception, hearing/audiogram, blood pressure',
  'Blood and urine labs, plus a drug and alcohol test',
  'Orthopedic range-of-motion evaluation (the "duckwalk")',
  'Pregnancy test for women, with a female attendant',
  'Pre-enlistment interview',
  'Job selection with a counselor',
  'Contract signing and the Oath of Enlistment',
];

export const MEPS_BRING = [
  'Social Security card',
  'Photo ID',
  'Birth certificate (long form)',
  'All relevant medical and legal records',
];

export const MEPS_FACTS = [
  { label: 'MEPS locations nationwide', value: '65' },
  { label: 'Typical processing', value: '1–2 days' },
  { label: 'Report time', value: '~04:00 wake-up, ~05:00 report' },
  { label: 'Physical valid for', value: '2 years' },
];

/* ------------------------------------------------------------------- DEP */

export const DEP_FACTS = [
  {
    label: 'What it is',
    body: 'After enlisting, most recruits enter the DEP — the Army calls it the Future Soldier Program, the Marines call members "poolees." DEP members are enlisted into the inactive, non-drilling Reserve: unpaid, no benefits, and not subject to the UCMJ. Time in DEP counts toward the 8-year Military Service Obligation.',
  },
  {
    label: 'Length',
    body: 'Up to 365 days (the regulatory limit). How long depends on when your job, school and qualifications align.',
  },
  {
    label: 'Obligations',
    body: 'Stay out of legal trouble, maintain fitness and weight, keep the recruiter informed, and do not use drugs. A positive drug test or an arrest can cancel the contract.',
  },
  {
    label: 'Changing your mind',
    body: 'DEP is the easiest phase to exit. Per DoDI 1332.14 a member may request separation in writing to the recruiting station commander — an entry-level separation with no discharge characterization, generally with an RE code allowing later re-entry. Recruiters cannot lawfully threaten or coerce you, or claim you will be jailed or "dishonorably discharged."',
  },
  {
    label: 'The real consequence',
    body: 'Re-enlisting in the same branch later may require a waiver, and you may lose your prior job and ship-date guarantee.',
  },
  {
    label: 'Bonuses',
    body: 'The DEP itself pays nothing. Enlistment bonuses, referral incentives and advanced rank are written into the contract and paid after entering active duty. Advanced pay grade (up to E-2/E-3/E-4) is available for college credits, JROTC, Eagle Scout / Gold Award, or referrals depending on branch.',
  },
];

/* --------------------------------------------------------------- WAIVERS */

export const WAIVER_CATEGORIES = [
  'Medical',
  'Moral / criminal conduct',
  'Drug and alcohol history',
  'Tattoos',
  'Dependents (single parents, or more than two dependents)',
  'Age',
  'Education tier',
  'Prior service',
  'Weight',
];

/** 2023 DoD IG review of 2022 waiver requests, per Military.com (Apr 29, 2025). */
export const WAIVER_APPROVAL = [
  { branch: 'Marine Corps', rate: 98, detail: '7,955 of 8,124 approved' },
  { branch: 'Navy', rate: 84, detail: '' },
  { branch: 'Army', rate: 69, detail: '' },
  { branch: 'Air Force', rate: 65, detail: '' },
];

export const WAIVER_STATS = [
  {
    stat: '~77%',
    label: 'of youth aged 17–24 need some type of waiver to qualify',
    source:
      'Dr. Katie Helland, DoD director of military accession policy, Pentagon briefing Oct 31, 2024 — meaning only about 23% qualify without one',
  },
  {
    stat: '17%',
    label: 'of 2022 recruits received a waiver, up from 12% in 2013',
    source: '2023 DoD Inspector General review',
  },
  {
    stat: '77%',
    label: 'of the 54,206 waiver requests in 2022 were granted',
    source: '2023 DoD Inspector General review',
  },
];

export const WAIVER_NO_GO = [
  'Current congestive heart failure',
  'Current schizophrenia treatment',
  'History of paraphilic disorders',
  'Multiple sclerosis',
  'Prior organ transplant',
  'History of cystic fibrosis',
  'A suicide attempt within 12 months',
];

/* -------------------------------------------------------- GUARD & RESERVE */

export const RESERVE_COMPONENTS = [
  { name: 'Army National Guard', under: 'DoD' },
  { name: 'Air National Guard', under: 'DoD' },
  { name: 'Army Reserve', under: 'DoD' },
  { name: 'Navy Reserve', under: 'DoD' },
  { name: 'Marine Corps Reserve', under: 'DoD' },
  { name: 'Air Force Reserve', under: 'DoD' },
  { name: 'Coast Guard Reserve', under: 'DHS — affects some benefit administration' },
];

export const DRILL_PAY = [
  { rank: 'E-4, <2 years', weekend: '~$419', note: 'Four-drill weekend' },
  { rank: 'E-6, <2 years', weekend: '~$453', note: 'Four-drill weekend' },
  { rank: 'Typical range', weekend: '$230–$540', note: 'By rank and longevity' },
];

export const BENEFIT_COMPARISON = [
  {
    row: 'Health care',
    active: 'TRICARE Prime at no premium',
    reserve:
      'TRICARE Reserve Select — a premium plan, ~$50/mo individual and ~$240/mo family (verify current rates on tricare.mil). Activated 30+ days converts to full active TRICARE, with 180 days of TAMP coverage after a qualifying separation.',
    unverified: true,
  },
  {
    row: 'GI Bill',
    active:
      'Post-9/11 (Chapter 33) requires qualifying Title 10 active duty of 90+ aggregate days and scales by cumulative service up to 100%: full public in-state tuition, a housing allowance, and up to $1,000/yr for books.',
    reserve:
      'Montgomery GI Bill–Selected Reserve (Chapter 1606) pays a flat $493.00/month for full-time enrollment (Oct 1, 2025–Sep 30, 2026 per VA.gov; $369.00 at 3/4 time, $246.00 at 1/2 time) and requires a 6-year Selected Reserve obligation with no deployment needed. Drills, annual training and initial skills training do NOT count toward Post-9/11. You must pick one benefit.',
  },
  {
    row: 'Retirement',
    active: 'Collect immediately at 20 years.',
    reserve:
      'Earn points (1 per drill, 1 per active-duty day). A "good year" needs >=50 points; a pension requires 20 qualifying years and normally cannot be collected until age 60 — reducible by 90 days per 90 consecutive activation days, with a floor of age 50.',
  },
  {
    row: 'Pay',
    active: 'Full base pay and allowances.',
    reserve:
      'Drill pay uses the 1/30th rule: one drill period equals 1/30 of the equivalent active-duty monthly base pay. Not a living wage — it is supplemental. When mobilized, members receive full active-duty pay and allowances.',
  },
];

/* -------------------------------------------------------------- OFFICER */

export const ACADEMIES = [
  {
    academy: 'USMA West Point',
    location: 'NY',
    commissions: 'Army',
    nomination: 'Yes — Congressional / VP / Presidential / service-connected',
  },
  {
    academy: 'USNA Annapolis',
    location: 'MD',
    commissions: 'Navy, Marine Corps',
    nomination: 'Yes',
  },
  {
    academy: 'USAFA',
    location: 'Colorado Springs, CO',
    commissions: 'Air Force and Space Force',
    nomination: 'Yes',
  },
  {
    academy: 'USMMA Kings Point',
    location: 'NY',
    commissions: 'Merchant Marine / all services (reserve commission)',
    nomination: 'Yes — by state apportionment',
  },
  {
    academy: 'USCGA New London',
    location: 'CT',
    commissions: 'Coast Guard',
    nomination: 'No — direct competitive admission',
  },
];

export const ACADEMY_TIMELINE = [
  { when: 'Spring of junior year', what: 'Open a pre-candidate file' },
  { when: 'Junior–senior year', what: 'Take the SAT/ACT and the Candidate Fitness Assessment (CFA)' },
  { when: 'By winter of senior year', what: 'Complete the DoDMERB medical exam' },
  { when: 'October–November of senior year', what: 'Congressional nomination deadlines' },
  { when: 'January 31', what: 'Academy application and nomination paperwork due' },
  { when: '~April 15', what: 'Appointments notified' },
  { when: 'Late June / early July', what: 'Report for induction' },
];

export const OFFICER_ROUTES = [
  {
    route: 'ROTC',
    body: 'Army ROTC is the largest (270+ host programs). Navy ROTC includes a Marine option. Air Force ROTC also commissions into the Space Force. Offered at 1,000–1,700+ schools. Scholarships come in 4-year (high-school applicants) and 2- and 3-year (in-college) forms, covering full tuition and fees OR room and board, plus a monthly stipend and book allowance.',
    obligation:
      'Commonly 8 years total, mixing active duty and Selected Reserve/Guard. Non-scholarship cadets can typically exit before the end of sophomore year without obligation. Army ROTC eligibility: U.S. citizen, at least 17 and under 31 in the year of commissioning.',
  },
  {
    route: 'OCS / OTS',
    body: 'For those who already hold a bachelor’s degree and did not do ROTC. Officer Candidate School (Army, Navy, Marine Corps, Coast Guard) or Officer Training School (Air Force, and Space Force via the DAF). Length varies from about 9 to 17 weeks. The Marine Corps Platoon Leaders Course (PLC) commissions officers via summer training during college. Direct commissions exist for medicine, law and chaplaincy.',
    obligation:
      'Boards weigh GPA (recommended >=3.0, competitive 3.2–3.5+), a fitness test, leadership history, letters and a personal statement.',
  },
  {
    route: 'Coast Guard-specific',
    body: 'The Coast Guard has NO ROTC. Its routes are the Coast Guard Academy (no nomination required), OCS, and the College Student Pre-Commissioning Initiative (CSPI) — a scholarship under which you enlist while in college, receive pay and tuition, and attend OCS on graduation.',
    obligation:
      'Additional fast tracks include the Direct Commission Selected School (DCSS — VMI, The Citadel, Norwich, Texas A&M and similar) and Maritime Academy Graduate programs.',
  },
];

/* -------------------------------------------------------- PRIOR SERVICE */

export const PRIOR_SERVICE_ROUTES = [
  {
    route: 'Inter-Service Transfer (IST)',
    body: 'Moving branches while still under contract. Requires a DD Form 368 "Request for Conditional Release" approved by your current branch. Keeps service continuity — pay, rank and retirement credit.',
  },
  {
    route: 'Prior-Service Enlistment',
    body: 'Finish your contract, separate (DD 214), then re-enlist in another branch as a prior-service applicant. Simpler, because no permission is needed.',
  },
];

export const PRIOR_SERVICE_NOTES = [
  {
    label: 'Re-entry gates',
    body: 'Your RE (reenlistment) code and discharge characterization govern eligibility. RE-1 plus Honorable is cleanest. Less-than-honorable discharges typically require waivers and command clearance.',
  },
  {
    label: 'Rank and pay protection',
    body: 'Under DoDI 1300.04, transfers generally preserve grade and date of rank and credit accrued service. The Army IST program (formerly "Blue to Green") keeps E-1 through E-5 grade and date of rank.',
  },
  {
    label: 'Air Force',
    body: 'The general officer IST program is currently SUSPENDED due to force management.',
  },
  {
    label: 'Space Force',
    body: 'Actively uses IST, but with narrowly defined eligibility — specific space, intel and cyber AFSCs, or demonstrated space experience.',
  },
  {
    label: 'Navy',
    body: 'Brings prior-service from other branches mainly via the OSVET (Other Service Veteran) program, and will not release out of shortage specialties.',
  },
  {
    label: 'Basic training',
    body: 'Prior-service applicants who never completed Army or USMC basic must attend Army BCT within 365 days of enlisting into the Guard or Reserve.',
  },
];

/* ------------------------------------------------------- RECOMMENDATIONS */

export const STAGES = [
  {
    stage: 'Stage 1',
    title: 'Before contacting a recruiter',
    items: [
      'Take a free full-length practice ASVAB to get a baseline AFQT and identify weak subtests. Threshold: if your practice AFQT is below 50, budget 4–8 weeks of focused study on the four AFQT subtests (AR, MK, WK, PC) before scheduling. A 50+ opens all six branches and most jobs; below 31 you are ineligible for any branch until you improve.',
      'Decide the branch by mission and job, not marketing. If you want a specific technical MOS/rating/AFSC, work backward to the composite it requires and target those subtests — AFQT alone will not get you the job.',
      'Gather medical and legal records now: immunizations, surgeries, ADHD/asthma history, any arrests. Given the July 2025 tightening of medical waivers, honest early documentation is the single biggest determinant of whether you clear MEPS without delay.',
    ],
  },
  {
    stage: 'Stage 2',
    title: 'Choosing a path',
    items: [
      'Want college paid plus an officer commission? Apply to service academies AND ROTC scholarships in parallel in the spring of junior year — they are free options with the earliest deadlines (Oct–Jan of senior year). Coast Guard aspirants: the CGA needs no nomination, so apply directly.',
      'Want to serve part-time while keeping civilian life or school? Compare National Guard vs. Reserve on state tuition benefits (Guard) and unit location / MOS availability. Threshold: if your state offers a full Guard tuition waiver, the Guard is usually the stronger student deal; if not, weigh the Reserve’s federal benefits.',
      'Space Force interest: there is no part-time entry pipeline for new civilians yet — the single-component part-time model is currently filled by Air Force Reserve transfers. Plan on active ("sustained") duty or an AFROTC/USAFA officer route.',
    ],
  },
  {
    stage: 'Stage 3',
    title: 'At MEPS and signing',
    items: [
      'Get everything — job, bonus, training seat, ship date — written into the DD Form 4 and its annexes. If it is not in the contract, it does not exist. If your qualified job is not available in your window, DEP is preferable to accepting an open-needs contract you do not want.',
      'If you have second thoughts during DEP, you may separate in writing with minimal consequence. Do it early and in writing to the station commander, not verbally to the recruiter.',
    ],
  },
];

export const BENCHMARKS = [
  'An AFQT jump across a category line (49 to 50, or into 65+) materially expands job and bonus options and is usually worth a retake.',
  'A disqualifying medical finding should trigger a waiver conversation with the recruiter AND consideration of a different branch — waivers are branch-specific and are not portable.',
  'Any recruiter pressure to sign an unwritten promise is a signal to slow down.',
];

export const CAVEATS = [
  'Policy is changing fast in 2025–2026. Fitness tests (Army AFT, Air Force / Space Force twice-yearly and the 2-mile-run transition, Navy dual cycles, the Marine sex-neutral combat PFT, the new Coast Guard PFT) and medical-waiver rules are all mid-transition. Reconfirm every number against the current official publication before it drives a decision.',
  'The Coast Guard and Space Force are structurally different and were not forced into parity here: the Coast Guard is under DHS, and the Space Force has no reserve component and a genuinely narrower, newer program set.',
  'Guard/Reserve compensation is not active-duty compensation. The figures are labeled and should not be summed as if equivalent.',
  'State-specific and specialty-specific figures vary and are not reducible to a single national number.',
  'Secondary and test-prep sites were used only to corroborate or to surface conflicts, never as the sole source for a standard.',
];

export const UNVERIFIED_ITEMS = [
  'Air Force / Space Force enlistment AFQT minimum — airforce.com’s own pages conflict (31/50 vs 36/65); no single authoritative reconciliation was found.',
  'Coast Guard Reserve AFQT minimum (reportedly still 40) — not confirmed on an official page.',
  'Coast Guard recruit body-fat caps (22% / 33%) — from secondary sources, not confirmed current on uscg.mil.',
  'Army Combat Field Test (CFT) full fielding status — announced, but not confirmed as fully implemented.',
  'Per-branch tattoo specifics — a general loosening trend is stated; exact 2026 rules were not verified per branch.',
  'TRICARE Reserve Select exact 2026 premium dollars, and state-by-state Guard tuition figures — these vary and must be checked on tricare.mil and with each state office.',
  'Which states impose consequences for Guard DEP no-shows — not enumerated.',
];

export const RETAKE_POLICY = [
  'Wait 1 month after the first test to retest.',
  'Wait another 1 month for a third attempt.',
  'Wait 6 months before any further retakes.',
  'A retake REPLACES the prior score — the most recent test is the score of record, even if it is lower.',
  'Scores are valid for 2 years. The PiCAT itself cannot be retaken.',
];
