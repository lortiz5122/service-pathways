import { Link } from 'react-router-dom';
import {
  BAH_RANGE,
  BAS_ENLISTED,
  BAS_OFFICER,
  HEALTHCARE,
  basicPay,
  specialPayAmount,
  type SpecialPay,
} from '../lib/paycalc';
import { Chip, Note } from './Bits';
import type { SpecialtyRecord } from '../lib/types';

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

/**
 * The comparison a recruiter will never draw for you.
 *
 * Every figure here is an ESTIMATE and the component says so, loudly. The point
 * is not precision — it is that the two columns are not comparable until you
 * adjust for three things nobody mentions:
 *
 *   1. BAH and BAS are NON-TAXABLE, so they are worth more than the same amount
 *      of civilian salary.
 *   2. BAH is a huge range, and if you're in the barracks you get almost none.
 *   3. Military healthcare has real cash value, because a civilian pays a premium
 *      for the equivalent — and that never shows up in a salary comparison.
 */
export function MilitaryVsCivilian({
  s,
  grade,
  specials,
}: {
  s: SpecialtyRecord;
  grade: string | null;
  specials: SpecialPay[];
}) {
  const isOfficer = grade?.startsWith('O') ?? false;

  const basic = grade ? basicPay(grade, '<2') : null;
  const bas = isOfficer ? BAS_OFFICER : BAS_ENLISTED;

  const specialsMonthly = specials.reduce(
    (n, p) => n + (specialPayAmount(p) ?? 0),
    0,
  );

  const bahLow = Number(BAH_RANGE?.low?.monthly_usd) || 0;
  const bahHigh = Number(BAH_RANGE?.high?.monthly_usd) || 0;

  // Healthcare is valued at what a civilian ACTUALLY pays out of pocket — the
  // employee contribution — not the full premium, most of which an employer
  // covers and a worker never sees on a payslip.
  const health = HEALTHCARE.singleEmployee || 0;

  const cashLow = ((basic ?? 0) + bas + specialsMonthly) * 12;
  const packLow = cashLow + bahLow * 12 + health;
  const packHigh = cashLow + bahHigh * 12 + health;
  const barracks = cashLow + health; // barracks: little or no BAH

  const untaxedLow = (bas + bahLow) * 12;

  // The civilian side comes from this specialty's own crosswalk.
  const range = s.civilian_crosswalk?.estimated_civilian_salary_range_usd;
  const civLow = Array.isArray(range) ? Number(range[0]) : null;
  const civHigh = Array.isArray(range) ? Number(range[1]) : null;
  const hasCiv = civLow !== null && Number.isFinite(civLow);

  if (!basic) return null;

  return (
    <div className="card mvc">
      <h3>This job vs. the civilian version of it</h3>
      <p>
        Everything below is an <b>estimate</b>. It is here to show you the shape of
        the comparison, not to predict your payslip.
      </p>

      <div className="mvc-grid">
        {/* -------------------------------------------------- military */}
        <div className="mvc-col mil">
          <div className="mvc-head">
            <span>Military — {grade}, entry</span>
            <Chip tone="brand">Estimated</Chip>
          </div>

          <table className="paybreak">
            <tbody>
              <tr>
                <td>Basic pay</td>
                <td>
                  {usd(basic * 12)}
                  <span>/yr</span>
                </td>
              </tr>
              <tr>
                <td>
                  BAS — food <Chip tone="ok">untaxed</Chip>
                </td>
                <td>
                  {usd(bas * 12)}
                  <span>/yr</span>
                </td>
              </tr>
              <tr>
                <td>
                  BAH — housing <Chip tone="ok">untaxed</Chip>
                </td>
                <td>
                  {usd(bahLow * 12)}–{usd(bahHigh * 12)}
                  <span>/yr</span>
                </td>
              </tr>
              {specialsMonthly > 0 ? (
                <tr>
                  <td>Special pays for this job</td>
                  <td>
                    {usd(specialsMonthly * 12)}
                    <span>/yr</span>
                  </td>
                </tr>
              ) : null}
              <tr>
                <td>
                  Healthcare <Chip tone="ok">$0 premium</Chip>
                </td>
                <td>
                  {usd(health)}
                  <span>value</span>
                </td>
              </tr>
              <tr className="tot">
                <td>Estimated package</td>
                <td>
                  {usd(packLow)}–{usd(packHigh)}
                  <span>/yr</span>
                </td>
              </tr>
            </tbody>
          </table>

          <p className="mvc-note">
            <b>{usd(untaxedLow)}+ of that is non-taxable.</b> A dollar of BAH or BAS
            is worth more than a dollar of salary.
          </p>
        </div>

        {/* -------------------------------------------------- civilian */}
        <div className="mvc-col civ">
          <div className="mvc-head">
            <span>Civilian equivalent</span>
            <Chip tone="brand">Estimated</Chip>
          </div>

          {hasCiv ? (
            <table className="paybreak">
              <tbody>
                <tr>
                  <td>Salary — fully taxable</td>
                  <td>
                    {usd(civLow!)}
                    {civHigh ? `–${usd(civHigh)}` : ''}
                    <span>/yr</span>
                  </td>
                </tr>
                <tr>
                  <td>Housing</td>
                  <td>
                    $0<span>you pay rent</span>
                  </td>
                </tr>
                <tr>
                  <td>Food</td>
                  <td>
                    $0<span>you pay</span>
                  </td>
                </tr>
                <tr className="minus">
                  <td>
                    Health insurance <Chip tone="alert">you pay this</Chip>
                  </td>
                  <td>
                    −{usd(health)}
                    <span>/yr</span>
                  </td>
                </tr>
                <tr className="tot">
                  <td>After the premium</td>
                  <td>
                    {usd(Math.max(0, civLow! - health))}
                    {civHigh ? `–${usd(civHigh - health)}` : ''}
                    <span>/yr</span>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <Note tone="warn">
              No civilian salary range was verified for this specialty, so no
              comparison is drawn. It is left blank rather than invented.
            </Note>
          )}

          <p className="mvc-note">
            Civilian salary is <b>taxed in full</b>, and the health premium comes out
            of it. The employer covers most of the premium — the{' '}
            {usd(health)} above is only what the <em>worker</em> pays.
          </p>
        </div>
      </div>

      {/* -------------------------------------------------- barracks */}
      <Note tone="alert">
        <div>
          <b>
            If you live in the barracks, your real number is about {usd(barracks)}, not{' '}
            {usd(packHigh)}.
          </b>{' '}
          Most junior enlisted do. In government quarters — a barracks, a dormitory,
          or a berth aboard ship — you do not receive full BAH, because the
          government is housing you instead. Every "total package" figure that
          includes full BAH quietly assumes you are renting your own place.
        </div>
      </Note>

      <Note tone="warn">
        <div>
          <b>These are estimates, and the BAH range is the reason.</b> BAH runs from
          about {usd(bahLow)}/month at{' '}
          {String(BAH_RANGE?.low?.where ?? '')} to {usd(bahHigh)}/month in{' '}
          {String(BAH_RANGE?.high?.where ?? '')} —{' '}
          <b>4× the money for the same rank</b>, decided entirely by where you get
          posted. You do not choose that. Look up your actual duty station before you
          trust any total.{' '}
          <Link to="/pay">Model your own package →</Link>
        </div>
      </Note>

      <p className="srcline">
        Basic pay and BAS: official DFAS rates. Healthcare value: Kaiser Family
        Foundation {HEALTHCARE.kffYear} average employee contribution for single
        coverage. BAH range and civilian salary: estimated, secondary-sourced. This
        comparison does not price the things that have no price — deployment, moving
        every few years, or not being able to quit.
      </p>
    </div>
  );
}
