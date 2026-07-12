import { Link } from 'react-router-dom';
import pkg from '../research/benefits-package.json';
import { Chip, Note, SectionHead } from './Bits';

type Benefit = {
  id: string;
  name: string;
  headline: string;
  detail: string;
  why_it_matters?: string;
  civilian_comparison?: string;
  conditions?: string;
  catch?: string;
  tier?: string;
  unverified?: string;
  /** Big enough in dollar terms to warrant the full width. */
  hero?: boolean;
  you_can_use_it_while_serving?: string;
  eligibility?: string[];
  the_numbers?: string[];
  source?: string;
};

const P = pkg as unknown as {
  thesis: string;
  pay_2026: { raise_pct: number; junior_enlisted_extra_pct: number; note: string };
  benefits: Benefit[];
  unverified: string[];
};

/**
 * The benefits package.
 *
 * This is the site's whole thesis in one section: the things other career sources
 * omit, or leave you to find out too late. Every one of these is invisible in a
 * salary comparison, which is why salary comparisons mislead people in BOTH
 * directions — they undersell the military, and they oversell it, depending on
 * what got left out.
 *
 * Sourced primarily to Military OneSource, an official DoD source.
 */
export function BenefitsPackage() {
  return (
    <>
      <SectionHead
        title="What it's actually worth"
        lede={P.thesis}
      />

      <Note tone="ok">
        <div>
          <b>Before you read an old pay table.</b> {P.pay_2026.note}
        </div>
      </Note>

      {/* The VA loan is one of the two largest benefits in pure dollar terms and
          is routinely misunderstood as something you collect AFTER you get out.
          It gets the full width. */}
      {P.benefits.filter((b) => b.hero).map((b) => (
        <div key={b.id} className="card benefit hero" style={{ marginTop: 16 }}>
          <div className="benefit-head">
            <div>
              <h3>{b.name}</h3>
              <Chip tone="ok">Official — va.gov</Chip>
            </div>
            <span className="benefit-figure big">{b.headline}</span>
          </div>

          <p className="hero-lede">{b.detail}</p>

          {b.why_it_matters ? (
            <p className="benefit-why">
              <b>Why it matters.</b> {b.why_it_matters}
            </p>
          ) : null}

          {b.you_can_use_it_while_serving ? (
            <Note tone="ok">
              <div>
                <b>You do not have to wait until you get out.</b>{' '}
                {b.you_can_use_it_while_serving}
              </div>
            </Note>
          ) : null}

          <div className="grid g2" style={{ marginTop: 14 }}>
            {b.eligibility?.length ? (
              <div>
                <h4 className="minihead">Who qualifies</h4>
                <ul className="ticklist">
                  {b.eligibility.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {b.the_numbers?.length ? (
              <div>
                <h4 className="minihead">The numbers</h4>
                <ul className="ticklist">
                  {b.the_numbers.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {b.conditions ? (
            <Note tone="warn">
              <div>
                <b>The catch.</b> {b.conditions}
              </div>
            </Note>
          ) : null}

          {b.source ? <p className="srcline">{b.source}</p> : null}
        </div>
      ))}

      <div className="grid g2" style={{ marginTop: 16 }}>
        {P.benefits.filter((b) => !b.hero).map((b) => (
          <div key={b.id} className="card benefit">
            <div className="benefit-head">
              <div>
                <h3>{b.name}</h3>
                {b.tier === 'OFFICIAL' ? (
                  <Chip tone="ok">Official source</Chip>
                ) : null}
              </div>
              <span className="benefit-figure">{b.headline}</span>
            </div>

            <p>{b.detail}</p>

            {b.why_it_matters ? (
              <p className="benefit-why">
                <b>Why it matters.</b> {b.why_it_matters}
              </p>
            ) : null}

            {b.civilian_comparison ? (
              <p className="srcline">Civilian benchmark: {b.civilian_comparison}</p>
            ) : null}

            {b.conditions ? (
              <Note tone="warn">
                <div>
                  <b>The catch.</b> {b.conditions}
                </div>
              </Note>
            ) : null}

            {b.catch ? (
              <Note tone="alert">
                <div>
                  <b>The catch.</b> {b.catch}
                </div>
              </Note>
            ) : null}
          </div>
        ))}
      </div>

      <Note tone="warn">
        <div>
          <b>Both columns are true at once.</b> Everything above is real. So is the
          credential gap, the 20-year pension cliff, the hearing loss, and the fact
          that you cannot quit. A good decision needs both in front of it — which is
          the entire reason this site exists.{' '}
          <Link to="/lifecycle">Read the costs →</Link>
        </div>
      </Note>

      <p className="srcline">
        Sourced primarily to Military OneSource, an official Department of Defense
        source. Military OneSource does not publish a total dollar value for the
        package, and neither does this site — any total here is computed and labelled
        as such.
      </p>
    </>
  );
}
