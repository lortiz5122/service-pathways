import { useState } from 'react';
import {
  BAH_RANGE,
  BAH_EXAMPLES,
  ENLISTED_GRADES,
  HEALTHCARE,
  OFFICER_GRADES,
  SPECIAL_PAYS,
  TAX_ASSUMPTION,
  YEAR_COLS,
  computePay,
  specialPayAmount,
  type Housing,
} from '../lib/paycalc';
import { Chip, Note } from './Bits';

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const usd0 = (n: number | null) => (n === null ? '—' : usd(n));

/**
 * The package calculator, inline.
 *
 * It used to live only on /pay behind a link. That is a dead end: someone reading
 * about a specific job should be able to model that job's pay right there, with
 * their grade and their special pays already filled in — not go hunting.
 */
export function PackageCalculator({
  defaultGrade = 'E-4',
  defaultSpecials = [],
  compact = false,
}: {
  defaultGrade?: string;
  defaultSpecials?: string[];
  compact?: boolean;
}) {
  const grades = [...ENLISTED_GRADES, ...OFFICER_GRADES];
  const initial = grades.includes(defaultGrade) ? defaultGrade : 'E-4';

  const [grade, setGrade] = useState(initial);
  const [years, setYears] = useState('<2');
  const [housing, setHousing] = useState<Housing>('barracks');
  const [dependents, setDependents] = useState(false);
  const [bahMonthly, setBahMonthly] = useState(
    BAH_EXAMPLES[0]?.monthly_usd ?? 1800,
  );
  const [specials, setSpecials] = useState<string[]>(defaultSpecials);

  const r = computePay({ grade, years, housing, dependents, bahMonthly, specials });

  const bahLow = Number(BAH_RANGE?.low?.monthly_usd) || 900;
  const bahHigh = Number(BAH_RANGE?.high?.monthly_usd) || 5200;

  const toggle = (name: string) =>
    setSpecials((s) =>
      s.includes(name) ? s.filter((x) => x !== name) : [...s, name],
    );

  return (
    <div className="card calcbox">
      <h3>Model your actual package</h3>
      <p>
        Change any of these and watch the number move. This is the figure a
        recruiter will not build for you, because it includes the parts that make
        it smaller.
      </p>

      <div className="calc-grid">
        <div>
          <div className="field2">
            <div className="field">
              <label htmlFor={`g-${grade}`}>Paygrade</label>
              <select
                id={`g-${grade}`}
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                {grades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="yrs">Years in</label>
              <select
                id="yrs"
                value={years}
                onChange={(e) => setYears(e.target.value)}
              >
                {YEAR_COLS.map((y) => (
                  <option key={y} value={y}>
                    {y === '<2' ? 'Under 2' : `${y} years`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="hous">Where do you sleep?</label>
            <select
              id="hous"
              value={housing}
              onChange={(e) => setHousing(e.target.value as Housing)}
            >
              <option value="barracks">Barracks / dorm — government quarters</option>
              <option value="ship">Aboard ship (Navy / Coast Guard)</option>
              <option value="off-base">Off base, my own place</option>
            </select>
          </div>

          {housing === 'off-base' ? (
            <div className="field">
              <label htmlFor="bah">
                BAH at your duty station <b>{usd(bahMonthly)}/mo</b>
              </label>
              <input
                id="bah"
                type="range"
                min={bahLow}
                max={bahHigh}
                step={25}
                value={bahMonthly}
                onChange={(e) => setBahMonthly(Number(e.target.value))}
              />
              <p className="srcline">
                {usd(bahLow)} ({String(BAH_RANGE?.low?.where ?? '')}) to {usd(bahHigh)}{' '}
                ({String(BAH_RANGE?.high?.where ?? '')}). You do not choose which.
              </p>
            </div>
          ) : null}

          <div className="field">
            <label className="chk">
              <input
                type="checkbox"
                checked={dependents}
                onChange={(e) => setDependents(e.target.checked)}
              />
              I have dependents (spouse / children)
            </label>
          </div>

          {SPECIAL_PAYS.length ? (
            <div className="field">
              <label>Special pays — tick any you'd actually draw</label>
              <div className="chiprow">
                {SPECIAL_PAYS.map((p) => {
                  const amt = specialPayAmount(p);
                  const on = specials.includes(p.pay);
                  return (
                    <button
                      key={p.pay}
                      className={`toggle${on ? ' on' : ''}`}
                      onClick={() => toggle(p.pay)}
                      title={p.eligibility}
                      disabled={amt === null}
                    >
                      {p.pay.length > 26 ? `${p.pay.slice(0, 24)}…` : p.pay}
                      {amt !== null ? ` +${usd(amt)}` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* --------------------------------------------------- readout */}
        <div>
          <div className="readout">
            <div className="big">{usd(r.packageAnnual)}</div>
            <div className="cat">Your package, per year</div>
            <div className="formula">
              {usd(r.cashAnnual)} cash + {usd(r.healthcareAnnual)} healthcare
            </div>
          </div>

          <table className="paybreak">
            <tbody>
              <tr>
                <td>Basic pay</td>
                <td>
                  {usd0(r.basic)}
                  <span>/mo</span>
                </td>
              </tr>
              <tr>
                <td>
                  BAS — food <Chip tone="ok">untaxed</Chip>
                </td>
                <td>
                  {usd(r.bas)}
                  <span>/mo</span>
                </td>
              </tr>
              <tr className={r.bah === 0 ? 'zero' : ''}>
                <td>
                  BAH — housing <Chip tone="ok">untaxed</Chip>
                </td>
                <td>
                  {usd(r.bah)}
                  <span>/mo</span>
                </td>
              </tr>
              {r.specials.map((sp) => (
                <tr key={sp.name}>
                  <td>{sp.name}</td>
                  <td>
                    {usd(sp.monthly)}
                    <span>/mo</span>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  Healthcare <Chip tone="ok">$0 to you</Chip>
                </td>
                <td>
                  {usd(r.healthcareAnnual / 12)}
                  <span>/mo value</span>
                </td>
              </tr>
              <tr className="tot">
                <td>Cash in hand</td>
                <td>
                  {usd(r.cashMonthly)}
                  <span>/mo</span>
                </td>
              </tr>
            </tbody>
          </table>

          {r.civilianEquivalent ? (
            <div className="civeq">
              <div className="k">A civilian job would have to pay</div>
              <div className="n">{usd(r.civilianEquivalent)}</div>
              <div className="s">
                to leave you in the same place — after tax, and after they buy their
                own health insurance. {usd(r.untaxedAnnual)} of your package is
                non-taxable.
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Note tone={r.bah === 0 ? 'alert' : 'warn'}>
        <div>
          <b>Housing.</b> {r.bahNote}
        </div>
      </Note>

      {!compact ? (
        <p className="srcline">
          Basic pay, BAS and special pays: official DFAS rates. Healthcare valued at
          full replacement cost — {usd(HEALTHCARE.singlePremium)} single /{' '}
          {usd(HEALTHCARE.familyPremium)} family (KFF {HEALTHCARE.kffYear}), because a
          civilian's employer premium share is part of what they earn even though they
          never see it. Civilian-equivalent assumes a flat{' '}
          {Math.round(TAX_ASSUMPTION * 100)}% marginal rate — an illustration, not a
          tax calculation. BAH is estimated. It does not price deployment, moving every
          few years, or not being able to quit.
        </p>
      ) : null}
    </div>
  );
}
