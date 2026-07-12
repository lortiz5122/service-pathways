import { Link } from 'react-router-dom';
import { entryPath } from '../lib/entry';
import { Chip } from './Bits';
import type { SpecialtyRecord } from '../lib/types';

/**
 * How you actually get into this job — rendered before anything else.
 *
 * ONE component, used by BOTH the specialty page and the results popup. They had
 * diverged: the page carried an officer warning and the popup carried none, so a
 * reader who clicked a match from their results saw "Naval Aviator" with no
 * indication that it requires a degree and a commission. Whichever surface the
 * reader lands on, they get the same truth.
 */

/** The aptitude test that actually gates this job — which is often NOT the ASVAB. */
function qualifyingTest(s: SpecialtyRecord): { name: string; note: string } | null {
  const hay = `${s.entry_requirements?.other ?? ''} ${s.entry_requirements?.education ?? ''} ${s.name}`;

  // SIFT first. The Army warrant-officer flight test is the SIFT, and an early
  // version matched ASTB on a passing mention in the Army record's comparison
  // prose — telling an Army applicant to sit the Navy's test.
  if (/\bSIFT\b/i.test(hay) || (/Army/i.test(s.branch) && /warrant/i.test(hay)))
    return {
      name: 'SIFT',
      note: 'Selection Instrument for Flight Training — the ARMY warrant-officer flight test. Not the ASVAB, and not the Navy\'s ASTB.',
    };
  if (/ASTB/i.test(hay))
    return {
      name: 'ASTB-E',
      note: 'Aviation Selection Test Battery — the officer aviation test. NOT the ASVAB. Your ASVAB score is irrelevant to this job.',
    };
  if (/AFOQT/i.test(hay))
    return {
      name: 'AFOQT',
      note: 'Air Force Officer Qualifying Test — plus the TBAS and a Pilot Candidate Selection Method score. NOT the ASVAB.',
    };
  if (/bar of the highest court|admission to the bar|admission to practice/i.test(hay))
    return {
      name: 'Bar admission',
      note: 'You must be admitted to the bar of a U.S. state or federal court. There is no test score that substitutes for this.',
    };
  if (/\bRN license|Registered Nurse/i.test(hay))
    return {
      name: 'RN licence',
      note: 'You must already hold a current, unrestricted Registered Nurse licence BEFORE you can be commissioned.',
    };
  return null;
}

/** Commissioning routes named in the record, e.g. "USNA", "NROTC", "OCS". */
function commissioningRoutes(s: SpecialtyRecord): string[] {
  const hay = `${s.entry_requirements?.education ?? ''} ${s.entry_requirements?.other ?? ''}`;
  const found: string[] = [];
  const add = (re: RegExp, label: string) => {
    if (re.test(hay) && !found.includes(label)) found.push(label);
  };
  add(/USNA|Naval Academy/i, 'U.S. Naval Academy');
  add(/USAFA|Air Force Academy/i, 'U.S. Air Force Academy');
  add(/West Point|USMA/i, 'West Point');
  add(/Coast Guard Academy|USCGA/i, 'Coast Guard Academy');
  add(/NROTC/i, 'NROTC');
  add(/AFROTC/i, 'AFROTC');
  add(/\bROTC\b/i, 'ROTC');
  add(/\bOCS\b|Officer Candidate School/i, 'Officer Candidate School (OCS)');
  add(/\bOTS\b|Officer Training School/i, 'Officer Training School (OTS)');
  add(/\bPLC\b|Platoon Leaders Course/i, 'Platoon Leaders Course (PLC)');
  add(/direct commission|Direct Appointment/i, 'Direct commission');
  add(/WOFT|Warrant Officer Flight Training|High School to Flight School/i, 'Warrant Officer Flight Training (WOFT)');
  return found;
}

export function EntryGate({ s }: { s: SpecialtyRecord }) {
  const ep = entryPath(s);
  if (ep.openToHighSchool && ep.kind === 'enlisted') return null;

  const test = qualifyingTest(s);
  const routes = commissioningRoutes(s);
  const edu = String(s.entry_requirements?.education ?? '');

  return (
    <div className={`entrybanner ${ep.kind}`}>
      <div className="eb-tag">{ep.label}</div>
      <p>{ep.reality}</p>

      <div className="eb-quals">
        {edu ? (
          <div className="eb-qual">
            <div className="k">You must have</div>
            <div className="v">{edu.split(/(?<=\.)\s/)[0]}</div>
          </div>
        ) : null}

        {test ? (
          <div className="eb-qual">
            <div className="k">
              The test that actually gates it <Chip tone="alert">not the ASVAB</Chip>
            </div>
            <div className="v">
              <b>{test.name}</b> — {test.note}
            </div>
          </div>
        ) : null}

        {routes.length ? (
          <div className="eb-qual">
            <div className="k">How you get commissioned</div>
            <div className="v">
              <div className="chiprow">
                {routes.map((r) => (
                  <Chip key={r} tone="brand">
                    {r}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {ep.kind === 'officer' ? (
        <p className="eb-path">
          <b>The realistic route from where you are now:</b> get the degree first —
          ideally on an <b>ROTC scholarship</b> or at a <b>service academy</b>, both
          of which pay for it — then commission on graduation and compete for a
          flight slot. Applying to academies and ROTC scholarships in parallel, in the
          spring of your junior year of high school, costs nothing and has the
          earliest deadlines of anything on this site.{' '}
          <Link to="/prep">Officer pathways, in detail →</Link>
        </p>
      ) : null}
    </div>
  );
}
