import { retirement, transition, veteran, education, pay } from '../lib/data';
import { Note, SectionHead, TickList } from '../components/Bits';

type Dict = Record<string, unknown>;

const brs = (retirement as Dict).brs as Dict | undefined;
const gr = (retirement as Dict).guard_reserve as Dict | undefined;
const cliff = brs?.twenty_year_cliff as Dict | undefined;

const gap = (transition as Dict).credential_gap as Dict | undefined;
const skillbridge = (transition as Dict).skillbridge as Dict | undefined;
const dd214 = (transition as Dict).dd214 as Dict | undefined;
const disability = (transition as Dict).va_disability as Dict | undefined;

const gi = (education as Dict).post_911_gi_bill as Dict | undefined;
const transfer = (veteran as Dict).gi_bill_transferability as Dict | undefined;
const stateVar = (veteran as Dict).state_benefit_variance as Dict | undefined;
const homeLoan = (veteran as Dict).va_home_loan as Dict | undefined;

const bah = (pay as Dict).bah as Dict | undefined;

function s(v: unknown): string {
  if (v === null || v === undefined) return 'Not published';
  return String(v);
}

export default function Lifecycle() {
  const gapExamples =
    (gap?.examples as Array<Record<string, string>> | undefined) ?? [];
  const claims =
    (disability?.specialty_linked_common_claims as
      | Array<Record<string, unknown>>
      | undefined) ?? [];

  return (
    <div className="wrap">
      <SectionHead
        title="The rest of your life"
        lede="Most military career sites stop at the job. This is the part that actually determines what you walk away with: retirement, getting out, and what your training is and is not worth on the outside."
      />

      {/* --------------------------------------------------- the cliff */}
      <SectionHead title="1 · The 20-year cliff" />
      <div className="card cliff-card">
        <p className="cliff-lede">{s(cliff?.plain_statement)}</p>

        <div className="grid g2" style={{ marginTop: 18 }}>
          <div>
            <h4 className="minihead">What you keep before 20 years</h4>
            <p>{s(cliff?.what_you_keep_before_20)}</p>
          </div>
          <div>
            <h4 className="minihead">What you forfeit before 20 years</h4>
            <p>{s(cliff?.what_you_forfeit_before_20)}</p>
          </div>
        </div>

        <div className="grid g3" style={{ marginTop: 20 }}>
          <div className="stat">
            <div className="n">{s(brs?.pension_multiplier_pct)}%</div>
            <div className="l">Pension multiplier, per year served</div>
            <div className="s">Blended Retirement System</div>
          </div>
          <div className="stat">
            <div className="n">{s(brs?.tsp_match_max_pct)}%</div>
            <div className="l">Max government TSP match</div>
            <div className="s">Yours, and portable</div>
          </div>
          <div className="stat">
            <div className="n">{s(brs?.vesting_years)} yr</div>
            <div className="l">TSP vesting</div>
            <div className="s">Long before the pension</div>
          </div>
        </div>

        <Note tone="alert">
          <div>
            <b>Read that again.</b> The pension is all-or-nothing at 20 years — there
            is no proration. Your TSP is the only retirement money you are
            guaranteed to walk away with if you serve less, and the large majority of
            people who enlist do not reach 20 years.
          </div>
        </Note>
        <p className="srcline">Source: {s(brs?.source)}</p>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Guard and Reserve retirement — different, and not interchangeable</h3>
        <Note tone="warn">{s(gr?.label_warning)}</Note>
        <p style={{ marginTop: 10 }}>{s(gr?.points_system)}</p>
        <p style={{ marginTop: 8 }}>
          A "good year" needs at least {s(gr?.good_year_threshold)} points. A pension
          requires {s(gr?.qualifying_years)} qualifying years and normally cannot be
          collected until {s(gr?.pension_age)}. {s(gr?.age_reduction_rule)}
        </p>
      </div>

      {/* ---------------------------------------------- credential gap */}
      <SectionHead
        title="2 · The credential gap"
        lede="The single most consequential thing this site can tell you, and the thing recruiting material never will."
      />
      <div className="card">
        <p className="cliff-lede">{s(gap?.plain_statement)}</p>
        <p className="srcline" style={{ marginBottom: 18 }}>
          {s(gap?.cool_program_note)}
        </p>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Military role</th>
                <th>What it gives you</th>
                <th>What it does NOT give you</th>
                <th>How to close it</th>
              </tr>
            </thead>
            <tbody>
              {gapExamples.map((g, i) => (
                <tr key={i}>
                  <td>
                    <strong>{g.military_role}</strong>
                    <br />
                    <span className="srcline">→ {g.civilian_license_needed}</span>
                  </td>
                  <td>{g.what_the_military_gives_you}</td>
                  <td className="gap-no">{g.what_it_does_not_give_you}</td>
                  <td>{g.how_to_close_it}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------- getting out */}
      <SectionHead title="3 · Getting out" />
      <div className="grid g2">
        <div className="card">
          <h3>SkillBridge</h3>
          <p>{s(skillbridge?.description)}</p>
          <Note tone="warn">
            <div>
              <b>The real gate.</b> {s(skillbridge?.approval_reality)}
            </div>
          </Note>
        </div>
        <div className="card">
          <h3>The DD-214</h3>
          <p>{s(dd214?.significance)}</p>
          {Array.isArray(dd214?.what_it_governs) ? (
            <TickList items={(dd214.what_it_governs as string[]).slice(0, 6)} />
          ) : null}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>VA disability — what the job does to your body</h3>
        <p>{s(disability?.how_ratings_work)}</p>
        <div className="grid g2" style={{ marginTop: 14 }}>
          {claims.map((c, i) => (
            <div key={i} className="claim">
              <div className="k">{String(c.specialty_family)}</div>
              <div className="chiprow" style={{ margin: '6px 0' }}>
                {((c.common_claims as string[]) ?? []).map((x, j) => (
                  <span key={j} className="chip alert">
                    {x}
                  </span>
                ))}
              </div>
              <p className="srcline">{String(c.why)}</p>
            </div>
          ))}
        </div>
        <Note tone="warn">{s(disability?.file_before_separation_note)}</Note>
      </div>

      {/* --------------------------------------------------- education */}
      <SectionHead title="4 · What it pays for" />
      <div className="grid g2">
        <div className="card">
          <h3>Post-9/11 GI Bill</h3>
          <p>
            Tuition:{' '}
            {s((gi?.tuition_coverage as Dict | undefined)?.public)}. Private and
            foreign schools are capped at{' '}
            {s(
              (gi?.tuition_coverage as Dict | undefined)
                ?.private_annual_cap_usd,
            )}
            /year. Books: {s(gi?.book_stipend_annual_usd)}/year.
          </p>
          <p style={{ marginTop: 8 }}>
            Housing allowance basis: {s(gi?.housing_allowance_basis)}
          </p>
          <Note tone="alert">
            <div>
              <b>What does not count:</b> {s(gi?.what_does_not_count)}. Guard and
              Reserve service alone does not build Post-9/11 eligibility.
            </div>
          </Note>
        </div>
        <div className="card">
          <h3>Transferring it to your family</h3>
          <p>{s(transfer?.who_can_transfer)}</p>
          <Note tone="warn">
            <div>
              <b>It costs you time.</b> {s(transfer?.additional_service_obligation)}
            </div>
          </Note>
          <p style={{ marginTop: 8 }}>{s(transfer?.caveats)}</p>
        </div>
      </div>

      <div className="grid g2" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>VA home loan</h3>
          <p>{s(homeLoan?.entitlement)}</p>
          <p style={{ marginTop: 8 }}>{s(homeLoan?.down_payment_reality)}</p>
          <Note tone="warn">{s(homeLoan?.limits_and_caveats)}</Note>
        </div>
        <div className="card">
          <h3>State benefits vary enormously</h3>
          <Note tone="alert">{s(stateVar?.warning)}</Note>
          <p style={{ marginTop: 10 }}>{s(stateVar?.range_description)}</p>
          <p style={{ marginTop: 8 }}>
            <b>How to check yours:</b> {s(stateVar?.verification_methodology)}
          </p>
        </div>
      </div>

      {/* --------------------------------------------------------- BAH */}
      <Note tone="warn">
        <div>
          <b>On any pay figure you see anywhere.</b>{' '}
          {s(bah?.national_number_warning)} {s(bah?.methodology)}
        </div>
      </Note>
    </div>
  );
}
