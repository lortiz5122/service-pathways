import type { BranchId } from '../lib/types';

/**
 * Official recruiting sites. Every URL below was verified to return HTTP 200
 * on 2026-07-12, and each is named in the master prompt's own TOOL POLICY as an
 * official branch career site. None is constructed or guessed.
 *
 * We link OUT to the recruiter. We do not collect a lead, and we do not act as
 * one. The site is a neutral reference; the recruiter's interests are not the
 * reader's interests, and the app says so at the point of handoff.
 */

export type Recruiter = {
  branch: BranchId;
  name: string;
  url: string;
  /** What this branch's process actually looks like at first contact. */
  note: string;
};

export const RECRUITERS: Record<BranchId, Recruiter> = {
  army: {
    branch: 'army',
    name: 'goarmy.com',
    url: 'https://www.goarmy.com',
    note: 'The Army publishes its enlistment steps and job catalogue openly. It also runs the Future Soldier Prep Course for applicants scoring 21–49 on the AFQT.',
  },
  navy: {
    branch: 'navy',
    name: 'navy.com',
    url: 'https://www.navy.com',
    note: 'The Navy has no ASVAB line scores — each rating sums raw subtest standard scores, so ask specifically which subtests your target rating needs.',
  },
  'marine-corps': {
    branch: 'marine-corps',
    name: 'marines.com',
    url: 'https://www.marines.com',
    note: 'Marines are assigned to an occupational field, not always a specific MOS, at contract. Ask exactly what is guaranteed in writing.',
  },
  'air-force': {
    branch: 'air-force',
    name: 'airforce.com',
    url: 'https://www.airforce.com',
    note: 'The Air Force frequently uses a "dream sheet" preference list rather than a guaranteed job at signing. Confirm whether your job is guaranteed before you sign.',
  },
  'space-force': {
    branch: 'space-force',
    name: 'spaceforce.com',
    url: 'https://www.spaceforce.com',
    note: 'Highly selective, with a narrow enlisted specialty list. There is currently no part-time entry pipeline for new civilians.',
  },
  'coast-guard': {
    branch: 'coast-guard',
    name: 'gocoastguard.com',
    url: 'https://www.gocoastguard.com',
    note: 'Under Homeland Security, not the Department of War. Its process, fitness programme and some benefits are administered separately.',
  },
};

export const GUARD_RESERVE = {
  name: 'nationalguard.com',
  url: 'https://www.nationalguard.com',
  note: 'Part-time service. Drill pay is not active-duty pay, and Guard/Reserve units deploy — do not assume part-time means no deployment.',
};

export const ASVAB_OFFICIAL = {
  name: 'officialasvab.com',
  url: 'https://www.officialasvab.com',
  note: 'Official test information and free practice materials. Take a full-length practice test before you talk to anyone.',
};

/** What a recruiter can and cannot do. Shown at every handoff. */
export const RECRUITER_TRUTH = {
  can: [
    'Schedule your ASVAB and your MEPS appointment.',
    'Explain programmes, and help you assemble waiver documentation.',
    'Tell you what jobs are actually open in your shipping window.',
  ],
  cannot: [
    'Promise you a job, a bonus, a duty station or a ship date that is not written into the enlistment contract (DD Form 4) and its annexes.',
    'Lawfully threaten or coerce you if you change your mind during the Delayed Entry Program.',
  ],
};
