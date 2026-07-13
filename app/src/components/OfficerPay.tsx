import {
  OFFICER_GRADES,
  OFFICER_PAY,
  OFFICER_PAY_EFFECTIVE,
  OFFICER_PAY_SOURCE,
  WARRANT_GRADES,
  WARRANT_PAY,
  YOS_SHOWN,
  annual,
  monthly,
  priorEnlistedBonus,
} from '../lib/officerpay';
import { Note, SectionHead } from './Bits';

/**
 * Officer and warrant pay — the half of the pay story the site was missing.
 *
 * It listed 163 officer-track jobs and then showed a reader enlisted money. It told
 * them Army Aviator (Warrant Officer) is how you fly without a degree, and then showed
 * them nothing at all about what a warrant officer earns.
 */

const usd = (n: number | null) =>
  n === null ? '—' : `$${Math.round(n).toLocaleString()}`;

function Ladder({
  title,
  grades,
  table,
  lede,
}: {
  title: string;
  grades: string[];
  table: Record<string, Record<string, number | null>>;
  lede: string;
}) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p className="paylede">{lede}</p>

      <div className="tablewrap">
        <table className="paytable">
          <thead>
            <tr>
              <th>Grade</th>
              {YOS_SHOWN.map((y) => (
                <th key={y}>{y === '2 or less' ? 'Entry' : y.replace('Over ', '')} </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g}>
                <th scope="row">{g}</th>
                {YOS_SHOWN.map((y) => {
                  const m = monthly(table, g, y);
                  return (
                    <td key={y} className={m === null ? 'na' : undefined}>
                      {m === null ? (
                        <span title="No published rate — nobody holds this grade at this seniority. This is not $0.">
                          —
                        </span>
                      ) : (
                        <>
                          <b>{usd(m)}</b>
                          <em>{usd(annual(m))}/yr</em>
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="srcline">
        Columns are <b>years of service</b>. Figures are <b>monthly basic pay</b>, before
        housing, food, special pays and tax. A dash means <b>no published rate</b> at that
        seniority — it is not $0.
      </p>
    </div>
  );
}

export function OfficerPay() {
  /**
   * The prior-enlisted advantage is a CURVE, not a number, and picking one column lies
   * in one direction or the other.
   *
   * At four years the two scales are identical — quote that and the whole point looks
   * like nothing. O-3E does not separate from O-3 until FOURTEEN years — quote ten and
   * that row renders "+$0", which reads as "this is worthless" rather than "this has not
   * started paying yet". So: show the progression, and say plainly when it kicks in.
   */
  const YEARS = ['Over 8', 'Over 14', 'Over 20'] as const;
  const rows = (['O-1E', 'O-2E', 'O-3E'] as const).map((g) => ({
    grade: g,
    cells: YEARS.map((y) => priorEnlistedBonus(g, y)),
  }));

  return (
    <section id="officer-pay">
      <SectionHead
        title="Officer and warrant officer pay"
        lede="The site lists hundreds of officer and warrant jobs. This is what they actually pay — including the warrant-officer route, which is how you fly without a degree."
      />

      <Ladder
        title="Warrant officer — W-1 to W-5"
        grades={WARRANT_GRADES}
        table={WARRANT_PAY}
        lede="The technical-expert track, and the one route to the cockpit that does not require a college degree. You reach it from the enlisted ranks, not off the street — but a W-1 out-earns an E-6 from day one."
      />

      <Ladder
        title="Commissioned officer — O-1 to O-6"
        grades={OFFICER_GRADES}
        table={OFFICER_PAY}
        lede="Requires a bachelor's degree and a commission (ROTC, a service academy, OCS/OTS, or an enlisted-to-officer programme). O-7 and above exist and are in the data, but almost nobody reading this will plan a career around them."
      />

      <div className="card hero-card">
        <h3>Enlisting first can pay you more as an officer. Permanently.</h3>
        <p>
          Serve at least <b>four years enlisted</b>, then commission, and you are paid on
          a different scale — <b>O-1E, O-2E, O-3E</b> — for the <em>same rank</em>, doing
          the <em>same job</em>, as an officer who went straight in.
        </p>

        <div className="tablewrap">
          <table className="paytable">
            <thead>
              <tr>
                <th>Extra pay for having served enlisted</th>
                {YEARS.map((y) => (
                  <th key={y}>at {y.replace('Over ', '')} yrs</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.grade}>
                  <th scope="row">
                    <b>{r.grade}</b> vs {r.grade.slice(0, -1)}
                  </th>
                  {r.cells.map((c, i) => (
                    <td key={i} className={c.extraMonthly ? 'win' : 'na'}>
                      {c.extraMonthly ? (
                        <>
                          <b>+{usd(c.extraMonthly)}</b>
                          <em>+{usd(c.extraAnnual)}/yr</em>
                        </>
                      ) : (
                        <span title="The two scales are still identical at this point. The advantage has not started yet — it is not zero forever.">
                          not yet
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="srcline">
          <b>It builds.</b> The two scales start out <b>identical</b> — at four years
          there is no difference at all, and an O-3E does not separate from an O-3 until{' '}
          <b>fourteen</b> years. Then it compounds: by year 14 an <b>O-1E earns $1,262 a
          month more</b> than an O-1 of the same rank and seniority. Over a 20-year career
          that is a large amount of money for a decision made at seventeen — and it appears
          on essentially no recruiting pay chart. It is the strongest argument on this site
          for not treating "enlist" and "become an officer" as a single, one-way choice.
        </p>
      </div>

      <Note tone="warn">
        <div>
          <b>What this table is not.</b> It is <b>basic pay only</b>. It excludes the
          housing allowance, the food allowance, and every special and incentive pay —
          flight pay, sea pay, hazardous-duty pay — which together are a large share of
          what actually lands in the account. It also cannot tell you whether you will{' '}
          <em>get</em> a commission: officer selection is competitive, and a degree is a
          floor, not a ticket.
        </div>
      </Note>

      <p className="srcline">
        Source: <b>{OFFICER_PAY_SOURCE.publisher}</b> — {OFFICER_PAY_EFFECTIVE}{' '}
        {OFFICER_PAY_SOURCE.authority ? `(${OFFICER_PAY_SOURCE.authority})` : null}.
        Retrieved 2026-07-12.
      </p>
    </section>
  );
}
