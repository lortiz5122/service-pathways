import { useState } from 'react';
import {
  BAH,
  BAH_EXAMPLES,
  BAS,
  BAS_ENLISTED,
  COMPARISON_CAVEATS,
  ENLISTED_GRADES,
  HEALTHCARE,
  OFFICER_GRADES,
  PARTIAL_BAH,
  PAY_UNVERIFIED,
  PAY_YEAR,
  PROMOTION,
  SPECIAL_PAYS,
  SOURCE_NOTE,
  YEAR_COLS,
  basicPay,
  specialPayAmount,
} from '../lib/paycalc';
import { Note, SectionHead, TickList } from '../components/Bits';
import { AdvancedEntry } from '../components/AdvancedEntry';
import { PackageCalculator } from '../components/PackageCalculator';
import { BenefitsPackage } from '../components/BenefitsPackage';

const usd = (n: number) =>
  `$${Math.round(n).toLocaleString('en-US')}`;


/* ------------------------------------------------------------------ page */

export default function Pay() {
  const [track, setTrack] = useState<'enlisted' | 'officer'>('enlisted');
  const grades = track === 'enlisted' ? ENLISTED_GRADES : OFFICER_GRADES;
  const promo = PROMOTION.enlisted ?? [];

  return (
    <div className="wrap">
      <SectionHead
        title="What you'll actually be paid"
        lede={`Entry pay is the number recruiting material leads with, and it is the least interesting one. This shows how pay moves over a career, how to enlist above E-1 before you ever sign, and the allowances that change the total by thousands — including the one nobody mentions: if you sleep in the barracks, you do not get a housing allowance.`}
      />

      {/* ------------------------------------------- 1. progression */}
      <SectionHead title="1 · How pay moves over a career" />
      <div className="card">
        <div className="chiprow" style={{ marginBottom: 14 }}>
          <button
            className={`toggle${track === 'enlisted' ? ' on' : ''}`}
            onClick={() => setTrack('enlisted')}
          >
            Enlisted
          </button>
          <button
            className={`toggle${track === 'officer' ? ' on' : ''}`}
            onClick={() => setTrack('officer')}
          >
            Officer
          </button>
        </div>

        {grades.length ? (
          <>
            <div className="tablewrap">
              <table className="paygrid">
                <thead>
                  <tr>
                    <th>Grade</th>
                    {YEAR_COLS.map((y) => (
                      <th key={y}>{y === '<2' ? '<2 yr' : `${y} yr`}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g) => (
                    <tr key={g}>
                      <td>
                        <strong>{g}</strong>
                      </td>
                      {YEAR_COLS.map((y) => {
                        const v = basicPay(g, y);
                        return (
                          <td key={y} className={v === null ? 'na' : ''}>
                            {v === null ? '—' : usd(v)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="srcline">
              Monthly basic pay, {PAY_YEAR}. A dash means that cell could not be
              verified — it is left empty rather than interpolated. Basic pay is{' '}
              <b>taxable</b>; allowances below are not.
            </p>
          </>
        ) : (
          <Note tone="warn">Longevity pay table not yet researched.</Note>
        )}
      </div>

      {/* ------------------------------------- 2. advanced entry grade */}
      <AdvancedEntry />

      {/* ------------------------------------------ 3. promotion speed */}
      <SectionHead
        title="3 · How fast it changes"
        lede="You do not stay at entry pay. The early grades move on a near-automatic schedule; the later ones are competitive."
      />
      <div className="grid g2">
        <div className="card">
          {promo.length ? (
            <div className="timeline">
              {promo.map((p, i) => (
                <div key={i} className="tl-item">
                  <div className="n">
                    {p.typical_time} · {p.how}
                  </div>
                  <h4>Promotion to {p.to_grade}</h4>
                </div>
              ))}
            </div>
          ) : (
            <Note tone="warn">Promotion timeline not yet researched.</Note>
          )}
        </div>
        <div className="stack">
          {PROMOTION.specialty_school_note ? (
            <div className="card">
              <h3>Finishing your specialty school</h3>
              <p>{PROMOTION.specialty_school_note}</p>
            </div>
          ) : null}
          {PROMOTION.competitive_threshold_note ? (
            <Note tone="warn">
              <div>
                <b>Where it stops being automatic.</b>{' '}
                {PROMOTION.competitive_threshold_note}
              </div>
            </Note>
          ) : null}
        </div>
      </div>

      {/* ----------------------------------------------- 4. allowances */}
      <SectionHead
        title="4 · The allowances — and when you don't get them"
        lede="BAH and BAS are non-taxable, which makes them worth more than the same amount of salary. But they are conditional, and the conditions are where recruiting material goes quiet."
      />

      <div className="grid g2">
        <div className="card">
          <h3>BAH — Basic Allowance for Housing</h3>
          <p>{String(BAH.how_determined ?? '')}</p>

          <Note tone="alert">
            <div>
              <b>If you live in the barracks or aboard ship, you do not get full
              BAH.</b>{' '}
              {String(BAH.government_quarters_rule ?? '')}{' '}
              {PARTIAL_BAH > 0
                ? `A single member in government quarters receives only a partial BAH — about ${usd(PARTIAL_BAH)}/month.`
                : ''}
            </div>
          </Note>

          <p style={{ marginTop: 10 }}>
            This matters enormously. Most junior enlisted members live in the
            barracks. A "total package" figure that includes full BAH may simply not
            apply to you in your first years.
          </p>

          {BAH_EXAMPLES.length ? (
            <>
              <h4 className="minihead" style={{ marginTop: 16 }}>
                Real examples
              </h4>
              <div className="tablewrap">
                <table>
                  <thead>
                    <tr>
                      <th>Duty station</th>
                      <th>Grade</th>
                      <th>Dependents</th>
                      <th>Monthly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BAH_EXAMPLES.map((e, i) => (
                      <tr key={i}>
                        <td>{e.location}</td>
                        <td>{e.paygrade}</td>
                        <td>{e.dependents ? 'With' : 'Without'}</td>
                        <td>
                          <strong>{usd(e.monthly_usd)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}

          <Note tone="warn">{String(BAH.national_number_warning ?? '')}</Note>
        </div>

        <div className="card">
          <h3>BAS — Basic Allowance for Subsistence (food)</h3>
          <div className="grid g2" style={{ marginBottom: 12 }}>
            <div>
              <div className="k">Enlisted</div>
              <div className="v">{usd(BAS_ENLISTED)}/mo</div>
            </div>
            <div>
              <div className="k">Officer</div>
              <div className="v">
                {usd(Number(BAS.officer_monthly_usd) || 0)}/mo
              </div>
            </div>
          </div>

          {BAS.essential_station_messing_note ? (
            <Note tone="alert">
              <div>
                <b>You may not keep all of it.</b>{' '}
                {String(BAS.essential_station_messing_note)}
              </div>
            </Note>
          ) : null}

          <p style={{ marginTop: 12 }}>
            BAS is a flat rate. It does not change with your paygrade or how many
            children you have — it is meant to feed <em>you</em>, not your family.
          </p>

          <Note tone="ok">
            <div>
              <b>Both BAH and BAS are non-taxable.</b> That is why a military package
              cannot be compared to a civilian gross salary without adjusting for it
              — the calculator below does that adjustment.
            </div>
          </Note>
        </div>
      </div>

      {/* ------------------------------------------- 5. special pays */}
      {SPECIAL_PAYS.length ? (
        <>
          <SectionHead
            title="5 · Special and incentive pays"
            lede="What the job itself pays extra for. Some of these are substantial, and some carry obvious reasons they exist."
          />
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Pay</th>
                  <th>Monthly</th>
                  <th>Who gets it</th>
                  <th>Taxable</th>
                </tr>
              </thead>
              <tbody>
                {SPECIAL_PAYS.map((p, i) => {
                  const amt = specialPayAmount(p);
                  return (
                    <tr key={i}>
                      <td>
                        <strong>{p.pay}</strong>
                      </td>
                      <td>
                        {amt !== null ? (
                          <strong>{usd(amt)}</strong>
                        ) : (
                          <span className="unverified">UNVERIFIED</span>
                        )}
                      </td>
                      <td>{p.eligibility}</td>
                      <td>{p.taxable === false ? 'No' : 'Yes'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      {/* ------------------------------------------- 6. calculator */}
      <SectionHead
        title="6 · Military vs civilian — the honest comparison"
        lede="Add up basic pay, allowances, special pays and the cash value of healthcare — then work out what a civilian job would have to pay to match it."
      />
      <PackageCalculator />

      {/* --------------------------------------------- healthcare */}
      {HEALTHCARE.singleEmployee ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Putting a number on "free" healthcare</h3>
          <p>{HEALTHCARE.howToValue}</p>
          <div className="grid g2" style={{ marginTop: 14 }}>
            <div className="stat">
              <div className="n">{usd(HEALTHCARE.singleEmployee)}</div>
              <div className="l">What a civilian pays per year for single coverage</div>
              <div className="s">
                Employee contribution — KFF {HEALTHCARE.kffYear}
              </div>
            </div>
            <div className="stat">
              <div className="n">{usd(HEALTHCARE.familyEmployee)}</div>
              <div className="l">What a civilian pays per year for family coverage</div>
              <div className="s">
                Employee contribution — KFF {HEALTHCARE.kffYear}
              </div>
            </div>
          </div>
          <p className="srcline">
            This values healthcare at what a civilian actually pays out of pocket —
            the employee contribution — not the full premium, most of which an
            employer covers and a worker never sees. Source: {HEALTHCARE.source}
          </p>
        </div>
      ) : null}

      {/* --------------------------------------- what it's worth */}
      <BenefitsPackage />

      {/* ----------------------------------------------- caveats */}
      {COMPARISON_CAVEATS.length ? (
        <>
          <SectionHead title="Before you use any of these numbers" />
          <div className="card">
            <TickList items={COMPARISON_CAVEATS} />
          </div>
        </>
      ) : null}

      {SOURCE_NOTE ? <p className="srcline">{SOURCE_NOTE}</p> : null}

      {PAY_UNVERIFIED.length ? (
        <Note tone="warn">
          <div>
            <b>Unverified in this section ({PAY_UNVERIFIED.length})</b>
            <ul className="ticklist" style={{ marginTop: 8 }}>
              {PAY_UNVERIFIED.map((u, i) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
          </div>
        </Note>
      ) : null}
    </div>
  );
}
