import type { SpecialtyRecord } from './types';

/**
 * Who can actually apply for this job, straight out of high school.
 *
 * This exists because the app was showing "Naval Aviator" and "Air Force Pilot"
 * to a 17-year-old alongside a green "Your AFQT qualifies you to enlist" chip.
 * Both statements were individually true and together they were a lie: officers
 * are COMMISSIONED, not enlisted. They do not take the ASVAB, and you cannot
 * walk into the job with a diploma. Showing an AFQT gate on an officer record
 * implies an enlistment path that does not exist.
 */

export type EntryKind = 'enlisted' | 'officer' | 'warrant' | 'in-service';

export type EntryPath = {
  kind: EntryKind;
  /** Can a high-school graduate enter this directly? */
  openToHighSchool: boolean;
  label: string;
  /** The one-line truth about how you actually get in. */
  reality: string;
  /** Show ASVAB/AFQT gating for this record at all? */
  usesAsvab: boolean;
};

const DEGREE = /bachelor|baccalaureate|\bJD\b|law school|BSN|master'?s|degree required|four-year/i;
const WARRANT = /warrant/i;

/** A high-school diploma or GED is explicitly named as an entry route. */
const HS_ENTRY = /high[- ]school diploma|HS diploma|\bGED\b|high school graduate/i;

/**
 * You must already be serving. Reclassification, lateral moves, and "secondary"
 * MOSs are not open to someone walking in off the street with a diploma.
 */
const IN_SERVICE =
  /in-service|reclassif|already serving|prior[- ]service|lateral|secondary MOS|from the ranks|must be a (?:serving|current)/i;

export function entryPath(s: SpecialtyRecord): EntryPath {
  const edu = String(s.entry_requirements?.education ?? '');
  const other = String(s.entry_requirements?.other ?? '');
  const haystack = `${edu} ${other}`;
  const name = `${s.name} ${s.code}`;
  const track = s.track;

  // Army Warrant Officer Flight Training is the genuine exception — the Army's
  // "High School to Flight School" route lets a civilian with a diploma compete
  // for a warrant-officer aviator slot without a degree. It is still not an
  // enlistment: it is a selection board, and it is brutally competitive.
  if (WARRANT.test(name) || WARRANT.test(track ?? '')) {
    const hsOk = /high school|GED/i.test(edu);
    return {
      kind: 'warrant',
      openToHighSchool: hsOk,
      label: 'Warrant Officer',
      reality: hsOk
        ? 'This is the one real exception. The Army\'s "High School to Flight School" route lets a civilian with a diploma compete for a warrant-officer aviator slot without a degree — but it is a selection board, not an enlistment, and it is extremely competitive. Most other services require you to serve and reach a paygrade first.'
        : 'Warrant officers are technical specialists selected from the ranks. In most services you must already be serving, and have reached a certain paygrade and time in service, before you can apply.',
      usesAsvab: false,
    };
  }

  // Officer is decided by the TRACK field, not by a keyword. An enlisted record
  // that merely mentions a degree somewhere in its prose is not an officer job —
  // an early version of this matched "bachelor's degree" inside the Army CID
  // record and told readers that an enlisted MOS was closed to them.
  if (track === 'officer') {
    return {
      kind: 'officer',
      openToHighSchool: false,
      label: 'Officer — not an enlistment',
      reality:
        "You cannot enter this job from high school. Officers are COMMISSIONED, which requires a bachelor's degree (or a JD, or a BSN) plus a commissioning source — a service academy, ROTC, or Officer Candidate/Training School. There is no ASVAB score that opens this door. The realistic path from where you are now: get the degree first, ideally on an ROTC scholarship or at an academy, and commission on graduation.",
      usesAsvab: false,
    };
  }

  // Enlisted, but NOT an entry-level accession. You have to already be in, or
  // already hold a degree. Real, and routinely missed.
  const hsNamed = HS_ENTRY.test(haystack);
  if (!hsNamed && (IN_SERVICE.test(haystack) || DEGREE.test(haystack))) {
    return {
      kind: 'in-service',
      openToHighSchool: false,
      label: 'Not an entry-level job',
      reality:
        'This is an enlisted job, but it is not one you can pick at MEPS on your way out of high school. It is normally filled by reclassifying people who are ALREADY SERVING — and it may also require college credit or a degree. Read the entry requirements below carefully: the realistic route is to enlist into something else first, then move across once you qualify.',
      usesAsvab: true,
    };
  }

  return {
    kind: 'enlisted',
    openToHighSchool: true,
    label: 'Enlisted',
    reality:
      'You can enter this directly from high school. Your AFQT decides whether a branch will take you; a separate line score decides whether you can hold this job.',
    usesAsvab: true,
  };
}

export const isOfficerOnly = (s: SpecialtyRecord) =>
  !entryPath(s).openToHighSchool;
