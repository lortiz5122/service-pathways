import raw from '../research/pay-officer-bonuses.json';
import { Note, SectionHead } from './Bits';

/**
 * Officer bonuses and special pays.
 *
 * bonuses.json was enlisted-only. The site listed hundreds of officer jobs and said
 * nothing about the money attached to them — including the two largest financial
 * packages in the entire military: the health-professions scholarship, and aviation.
 *
 * All figures: DFAS, current tables. Where the source says "N/A" the figure is absent,
 * not zero — those are different claims.
 */

type Data = {
  source: { publisher: string; base: string };
  aviation_incentive_pay: {
    what: string;
    note: string;
    rates: { years_of_aviation_service: string; monthly_usd: number | null }[];
  };
  health_professions_scholarship: {
    what: string;
    note: string;
    effective?: string;
    monthly_stipend_usd?: number;
    annual_grant_usd?: number;
  };
  nurse_corps_accession_bonus: {
    what: string;
    by_specialty: { specialty: string; three_year_usd: number | null; four_year_usd: number | null }[];
  };
  submarine_duty_pay: { by_grade: Record<string, { min_monthly_usd: number; max_monthly_usd: number }> };
  dive_duty_pay: { rates: { role: string; monthly_usd: number }[] };
  unverified: string[];
};

const d = raw as unknown as Data;

const usd = (n: number | null | undefined) =>
  n === null || n === undefined ? '—' : `$${Math.round(n).toLocaleString()}`;

export function OfficerBonuses() {
  const hp = d.health_professions_scholarship;

  // Biggest first — a reader deciding a career should see the ceiling, not an alphabet.
  const nurses = [...d.nurse_corps_accession_bonus.by_specialty]
    .sort((a, b) => (b.four_year_usd ?? 0) - (a.four_year_usd ?? 0))
    .slice(0, 8);

  // The dive table repeats a role across services; show each qualification once.
  const dives = Object.values(
    Object.fromEntries(d.dive_duty_pay.rates.map((r) => [r.role.toLowerCase(), r])),
  )
    .sort((a, b) => b.monthly_usd - a.monthly_usd)
    .slice(0, 6);

  const subGrades = ['O-3', 'O-4', 'O-5', 'W-3', 'E-6'].filter(
    (g) => d.submarine_duty_pay.by_grade[g],
  );

  return (
    <section id="officer-bonuses">
      <SectionHead
        title="Officer bonuses and special pays"
        lede="On top of basic pay. These are the numbers that decide whether an officer career is financially serious, and they are almost never shown next to the job."
      />

      {/* ---------------------------------------------------------- HPSP */}
      <div className="card hero-card">
        <h3>Medical, dental or nursing school — paid for, in full</h3>
        <p>{hp.what}</p>

        <div className="bonusgrid">
          <div className="bonusfig">
            <strong>Tuition</strong>
            <span>Paid in full</span>
            <em>Not a loan. Not a reimbursement.</em>
          </div>
          <div className="bonusfig">
            <strong>{usd(hp.monthly_stipend_usd)}</strong>
            <span>Monthly living stipend</span>
            <em>while you are a student</em>
          </div>
          <div className="bonusfig">
            <strong>{usd(hp.annual_grant_usd)}</strong>
            <span>Annual grant, on top</span>
            <em>{hp.effective}</em>
          </div>
        </div>

        <p className="srcline">{hp.note}</p>
      </div>

      {/* -------------------------------------------------- nurse accession */}
      <div className="card">
        <h3>Nurse Corps — accession bonus, by specialty</h3>
        <p className="paylede">{d.nurse_corps_accession_bonus.what}</p>

        <div className="tablewrap">
          <table className="paytable">
            <thead>
              <tr>
                <th>Specialty</th>
                <th>3-year obligation</th>
                <th>4-year obligation</th>
              </tr>
            </thead>
            <tbody>
              {nurses.map((n) => (
                <tr key={n.specialty}>
                  <th scope="row" className="wrapcell">
                    {n.specialty}
                  </th>
                  <td className={n.three_year_usd ? undefined : 'na'}>
                    {n.three_year_usd ? (
                      <b>{usd(n.three_year_usd)}</b>
                    ) : (
                      <span title="The source says N/A — this specialty has no 3-year option, which is not the same as $0.">
                        not offered
                      </span>
                    )}
                  </td>
                  <td className="win">
                    <b>{usd(n.four_year_usd)}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="srcline">
          A <b>Certified Registered Nurse Anesthetist</b> commissioning on a four-year
          obligation draws <b>$250,000</b>. That is the largest single accession bonus in
          this table, and it is paid <em>on top of</em> officer basic pay.
        </p>
      </div>

      {/* --------------------------------------------------------- aviation */}
      <div className="card">
        <h3>Aviation Incentive Pay — flying, monthly, for as long as you fly</h3>
        <p className="paylede">{d.aviation_incentive_pay.what}</p>

        <div className="tablewrap">
          <table className="paytable">
            <thead>
              <tr>
                <th>Years of aviation service</th>
                {d.aviation_incentive_pay.rates.map((r) => (
                  <th key={r.years_of_aviation_service}>{r.years_of_aviation_service}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Monthly, on top of basic pay</th>
                {d.aviation_incentive_pay.rates.map((r) => (
                  <td key={r.years_of_aviation_service} className="win">
                    <b>{usd(r.monthly_usd)}</b>
                    <em>{r.monthly_usd ? `${usd(r.monthly_usd * 12)}/yr` : ''}</em>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="srcline">{d.aviation_incentive_pay.note}</p>
      </div>

      {/* ------------------------------------------------- sub & dive duty */}
      <div className="grid g2">
        <div className="card">
          <h3>Submarine duty pay</h3>
          <ul className="paylist">
            {subGrades.map((g) => {
              const v = d.submarine_duty_pay.by_grade[g];
              return (
                <li key={g}>
                  <span>{g}</span>
                  <b>
                    {usd(v.min_monthly_usd)}
                    {v.max_monthly_usd !== v.min_monthly_usd
                      ? ` – ${usd(v.max_monthly_usd)}`
                      : ''}
                    /mo
                  </b>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="card">
          <h3>Dive duty pay</h3>
          <ul className="paylist">
            {dives.map((r) => (
              <li key={r.role}>
                <span>{r.role.slice(0, 40)}</span>
                <b>{usd(r.monthly_usd)}/mo</b>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Note tone="warn">
        <div>
          <b>What is missing here, and why.</b>
          <ul className="tight">
            {d.unverified.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
          These are real, large bonuses. They are not listed because <b>DFAS does not
          publish them as a table</b> and each service sets them annually — so a number
          here would be a guess, and a guess about a six-figure bonus is worse than a
          gap. Ask a recruiter for the <em>current year's</em> figure, and get it in your
          contract.
        </div>
      </Note>

      <p className="srcline">
        Source: <b>{d.source.publisher}</b> — {d.source.base}. Retrieved 2026-07-12.
      </p>
    </section>
  );
}
