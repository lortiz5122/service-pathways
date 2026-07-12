import { Link } from 'react-router-dom';
import {
  BAH_RANGE,
  BAS_ENLISTED,
  BAS_OFFICER,
  BAS_II,
  PARTIAL_BAH,
  PAY_YEAR,
  SPECIAL_PAYS,
  YEAR_COLS,
  basicPay,
  specialPayAmount,
} from '../lib/paycalc';
import { bonusForSpecialty, BONUS_SOURCE } from '../lib/bonuses';
import { MilitaryVsCivilian } from './MilitaryVsCivilian';
import { PackageCalculator } from './PackageCalculator';
import { Chip, Note, SectionHead } from './Bits';
import { money, type SpecialtyRecord } from '../lib/types';

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

/** "E-3" out of anything the research put in paygrade_entry. */
function entryGrade(s: SpecialtyRecord): string | null {
  const raw = String(s.pay_and_compensation?.paygrade_entry ?? '');
  const m = raw.match(/\b([EWO]-\d)\b/i);
  return m ? m[1].toUpperCase() : null;
}

/** Special pays this specialty plausibly touches — matched on its own text. */
function relevantSpecialPays(s: SpecialtyRecord) {
  const hay = `${s.name} ${s.code} ${JSON.stringify(s.entry_requirements ?? {})} ${JSON.stringify(
    s.deployment_and_lifestyle ?? {},
  )}`.toLowerCase();

  const rules: { match: RegExp; pay: RegExp }[] = [
    { match: /airborne|parachute|jump|ranger|special forces|18[a-z]/, pay: /parachute/i },
    { match: /aviation|aircraft|helicopter|pilot|aircrew|flight/, pay: /aerial flight/i },
    { match: /flight deck|carrier|aviation boatswain/, pay: /flight deck/i },
    { match: /explosive|eod|demolition|combat engineer|12b|1371/, pay: /demolition/i },
    { match: /maritime enforcement|boarding|vbss/, pay: /visit, board/i },
    { match: /chemical|cbrn|74d/, pay: /chemical munitions/i },
  ];

  const wanted = rules.filter((r) => r.match.test(hay)).map((r) => r.pay);
  if (!wanted.length) return [];
  return SPECIAL_PAYS.filter((p) => wanted.some((w) => w.test(p.pay)));
}

/**
 * Pay, progression and bonuses — on the specialty page itself.
 *
 * Previously this page showed entry pay only, and read bonuses from the
 * per-specialty research field, which is null for 91 of the 94 records. So it
 * said "None published" even where the branch publishes a real figure. It now
 * uses the same official DFAS rates and bonus data as the rest of the app.
 */
export function PayForSpecialty({ s }: { s: SpecialtyRecord }) {
  const grade = entryGrade(s);
  const isOfficer = grade?.startsWith('O') ?? false;
  const bas = isOfficer ? BAS_OFFICER : BAS_ENLISTED;

  // Show the reader's own entry grade climbing, plus the two grades above it.
  const ladder: string[] = [];
  if (grade) {
    const [L, n] = [grade[0], Number(grade.slice(2))];
    for (let i = 0; i < 3; i++) ladder.push(`${L}-${n + i}`);
  }

  const { branch, matched } = bonusForSpecialty(s);
  const specials = relevantSpecialPays(s);
  const bahLow = Number(BAH_RANGE.low?.monthly_usd) || 0;
  const bahHigh = Number(BAH_RANGE.high?.monthly_usd) || 0;
  const official = branch?.source_tier === 'OFFICIAL';

  return (
    <>
      <SectionHead
        title="Pay"
        lede="Entry pay is where you start, not where you stay. Basic pay is taxable; the allowances below are not."
      />

      {/* ------------------------------------------------- progression */}
      {ladder.length ? (
        <div className="card">
          <h3>What this pays as you're promoted</h3>
          <p>
            Monthly basic pay, {PAY_YEAR}. Your entry grade is{' '}
            <b>{grade}</b> — the rows below it are where you go next.
          </p>
          <div className="tablewrap" style={{ marginTop: 12 }}>
            <table className="paygrid">
              <thead>
                <tr>
                  <th>Grade</th>
                  {YEAR_COLS.slice(0, 8).map((y) => (
                    <th key={y}>{y === '<2' ? '<2 yr' : `${y} yr`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ladder.map((g) => (
                  <tr key={g} className={g === grade ? 'hit' : ''}>
                    <td>
                      <strong>{g}</strong>
                      {g === grade ? <Chip tone="brand">You start here</Chip> : null}
                    </td>
                    {YEAR_COLS.slice(0, 8).map((y) => {
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
            A dash means that cell could not be verified — it is left empty rather
            than interpolated. <Link to="/pay">Full table, E-1 to E-9 →</Link>
          </p>
        </div>
      ) : null}

      {/* -------------------------------------------------- allowances */}
      <div className="grid g3" style={{ marginTop: 16 }}>
        <div className="card stat">
          <div className="n">{usd(bas)}</div>
          <div className="l">
            BAS — food, per month <Chip tone="ok">untaxed</Chip>
          </div>
          <div className="s">Flat rate. Official DFAS.</div>
        </div>
        <div className="card stat">
          <div className="n">
            {bahLow && bahHigh ? `${usd(bahLow)}–${usd(bahHigh)}` : 'Varies'}
          </div>
          <div className="l">
            BAH — housing, per month <Chip tone="brand">estimated</Chip>
          </div>
          <div className="s">
            Depending on your assignment locality and paygrade. There is no national
            figure.
          </div>
        </div>
        <div className="card stat">
          <div className="n">
            {PARTIAL_BAH > 0 ? usd(PARTIAL_BAH) : '$0'}
          </div>
          <div className="l">BAH if you're in the barracks</div>
          <div className="s">Government quarters means little or no BAH.</div>
        </div>
      </div>

      {bahLow && bahHigh ? (
        <Note tone="warn">
          <div>
            <b>
              The same rank gets {usd(bahLow)} in {String(BAH_RANGE.low?.where ?? '')}{' '}
              and {usd(bahHigh)} in {String(BAH_RANGE.high?.where ?? '')}.
            </b>{' '}
            That is roughly <b>4× the money for the identical person</b>, decided
            entirely by where you are posted — which you do not choose. This is why
            no honest site quotes a single BAH number. Estimated;{' '}
            <a
              href={String(BAH_RANGE.official_lookup ?? '')}
              target="_blank"
              rel="noreferrer noopener"
            >
              look up a real duty station ↗
            </a>{' '}
            — then put that figure into the calculator below.
          </div>
        </Note>
      ) : null}

      <Note tone="alert">
        <div>
          <b>The housing allowance is the biggest variable, and the most oversold.</b>{' '}
          If you live in the barracks — which most junior enlisted do — or you are
          berthed aboard ship, you do <b>not</b> receive full BAH. A "total package"
          figure that assumes full BAH does not describe your first years.{' '}
          {BAS_II > 0 ? (
            <>
              BAS can also be reduced by a meal-card deduction if you eat in a
              government dining facility.
            </>
          ) : null}{' '}
          Set it yourself in the calculator below and watch what it does to the
          total.
        </div>
      </Note>

      {/* ---------------------------------------------- special pays */}
      {specials.length ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Special pays this job can attract</h3>
          <p>
            Official DFAS rates, paid monthly on top of basic pay. These are taxable,
            and they depend on actually performing the duty.
          </p>
          <div className="tablewrap" style={{ marginTop: 12 }}>
            <table>
              <thead>
                <tr>
                  <th>Pay</th>
                  <th>Per month</th>
                </tr>
              </thead>
              <tbody>
                {specials.map((p) => {
                  const amt = specialPayAmount(p);
                  return (
                    <tr key={p.pay}>
                      <td>{p.pay}</td>
                      <td>
                        <strong>{amt !== null ? usd(amt) : '—'}</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="srcline">
            Source: Defense Finance and Accounting Service (DFAS) — the DoD's paying
            agent. <Link to="/pay">All special and incentive pays →</Link>
          </p>
        </div>
      ) : null}

      {/* -------------------------------------- inline calculator */}
      {/* Inline, prefilled with THIS job's grade and special pays. It used to be a
          link to /pay — which meant hunting. Nobody hunts. */}
      <div style={{ marginTop: 16 }}>
        <PackageCalculator
          defaultGrade={grade ?? 'E-1'}
          defaultSpecials={specials.map((sp) => sp.pay)}
        />
      </div>

      {/* ------------------------------------ military vs civilian */}
      <div style={{ marginTop: 16 }}>
        <MilitaryVsCivilian s={s} grade={grade} specials={specials} />
      </div>

      {/* -------------------------------------------------- bonuses */}
      <SectionHead title="Bonuses" />

      {!branch || branch.max_bonus_usd === null ? (
        <Note tone="warn">
          <div>
            <b>No enlistment-bonus data exists for {s.branch}.</b> Neither the
            official service page nor the secondary source published a figure. This
            is a real gap — it is not filled in with another branch's number.
          </div>
        </Note>
      ) : (
        <>
          {matched ? (
            <div className="bonus-hero">
              <div className="k">
                Bonus named for this specialty
                <Chip tone={official ? 'ok' : 'warn'}>
                  {official ? 'Official source' : 'Secondary source'}
                </Chip>
              </div>
              <div className="n">
                {matched.display ?? money(matched.amount_usd ?? 0)}
              </div>
              <div className="s">
                <b>{matched.name}</b>
                {matched.conditions ? ` — ${matched.conditions}` : ''}
              </div>
            </div>
          ) : (
            <Note tone="warn">
              <div>
                <b>No bonus is published for this specific job.</b> {branch.name} runs
                the bonus programs below, but no source names a figure for {s.name}.
                Do not assume one exists — ask, and get the answer in writing.
              </div>
            </Note>
          )}

          <div className="card" style={{ marginTop: 14 }}>
            <div className="k">{branch.name} — maximum advertised bonus</div>
            <div className="v" style={{ fontSize: 30 }}>
              {money(branch.max_bonus_usd)}
            </div>
            <p className="srcline">{branch.max_note}</p>

            <Note tone="alert">
              <div>
                <b>A maximum is not an offer.</b> That is the ceiling for the single
                most in-demand specialty on the longest contract. It is not what a
                typical enlistee is offered, and it may have nothing to do with this
                job.
              </div>
            </Note>

            {branch.conflict ? (
              <Note tone="warn">
                <div>
                  <b>Sources disagree on this number.</b> {branch.conflict.note}
                </div>
              </Note>
            ) : null}

            {branch.accuracy_warning ? (
              <Note tone="warn">
                <div>
                  <b>Accuracy warning.</b> {branch.accuracy_warning}
                </div>
              </Note>
            ) : null}

            {branch.stacking ? (
              <Note tone="ok">
                <div>
                  <b>These bonuses stack.</b> {branch.stacking.rule}
                  {branch.stacking.stackable?.length ? (
                    <>
                      {' '}
                      Explicitly stackable:{' '}
                      <b>{branch.stacking.stackable.join(', ')}</b>.
                    </>
                  ) : null}
                  {branch.stacking.restriction ? (
                    <>
                      <br />
                      <br />
                      <b>One catch:</b> {branch.stacking.restriction}
                    </>
                  ) : null}
                </div>
              </Note>
            ) : null}

            {branch.payment_terms ? (
              <Note tone="warn">
                <div>
                  <b>When you actually get the money.</b> {branch.payment_terms}
                </div>
              </Note>
            ) : null}

            <div className="tablewrap" style={{ marginTop: 14 }}>
              <table>
                <thead>
                  <tr>
                    <th>Every bonus program this branch publishes</th>
                    <th>Up to</th>
                    <th>Conditions</th>
                  </tr>
                </thead>
                <tbody>
                  {branch.programs.map((p, i) => (
                    <tr key={i} className={matched?.name === p.name ? 'hit' : ''}>
                      <td>
                        <strong>{p.name}</strong>
                      </td>
                      <td>
                        {p.amount_usd !== null ? (
                          <strong>{money(p.amount_usd)}</strong>
                        ) : (
                          <span className="unverified">No figure published</span>
                        )}
                      </td>
                      <td>{p.conditions || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {branch.non_cash_incentives?.length ? (
            <div className="card" style={{ marginTop: 12 }}>
              <h3>Incentives that aren't cash</h3>
              <p>
                Frequently worth more than a bonus. An advanced entry paygrade
                compounds across your entire career.
              </p>
              <dl className="deflist">
                {branch.non_cash_incentives.map((n, i) => (
                  <div key={i}>
                    <dt>{n.name}</dt>
                    <dd>{n.detail}</dd>
                  </div>
                ))}
              </dl>
              <Link to="/pay" className="inline-link">
                How to enlist above E-1 — JROTC, Civil Air Patrol, Eagle Scout →
              </Link>
            </div>
          ) : null}

          <Note tone="alert">
            <div>
              <b>The only bonus that exists is the one in your contract.</b> If it is
              not written into your DD Form 4 and its annexes before you sign, you
              will not get it. Bonuses are normally paid in instalments after
              training, not as a lump sum at signing.
            </div>
          </Note>

          <p className="srcline">
            {official
              ? `Official source: ${branch.source_url} · retrieved 2026-07-12.`
              : `Secondary source: ${BONUS_SOURCE.publisher}, published ${BONUS_SOURCE.published_date} · retrieved 2026-07-12. Not primary-fetched from a .mil source.`}
          </p>
        </>
      )}
    </>
  );
}
