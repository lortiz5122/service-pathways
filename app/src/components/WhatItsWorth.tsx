import { Link } from 'react-router-dom';
import { education, veteran } from '../lib/data';
import { HEALTHCARE } from '../lib/paycalc';
import { Note, SectionHead } from './Bits';

type Dict = Record<string, unknown>;

const gi = (education as Dict).post_911_gi_bill as Dict | undefined;
const tuition = (gi?.tuition_coverage ?? {}) as Dict;
const loan = (veteran as Dict).va_home_loan as Dict | undefined;

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

/**
 * What service is actually worth — stated as fact, not as a pitch.
 *
 * This site spends most of its length on the costs: the credential gap, the
 * 20-year pension cliff, the weak crosswalks, the disability claims. That is
 * deliberate, because nobody else tells you those things.
 *
 * But a reference that ONLY shows costs is just as dishonest as one that only
 * shows upside. The upside here is real and large, and it is stated in the same
 * register as everything else — sourced, specific, no adjectives. The reader
 * does the judging.
 */
export function WhatItsWorth() {
  const health = HEALTHCARE.singlePremium || 0;
  const family = HEALTHCARE.familyPremium || 0;
  const seen = HEALTHCARE.singleEmployee || 0;
  const deduct = HEALTHCARE.singleDeductible || 0;

  return (
    <>
      <SectionHead
        title="What it's actually worth"
        lede="This site spends most of its length on what service costs you, because nobody else will tell you that. Here is the other side, stated the same way — sourced, specific, and without the adjectives."
      />

      <div className="grid g2">
        <div className="card worth-card">
          <h3>Your education, paid for</h3>
          <p>
            The Post-9/11 GI Bill at the 100% tier pays{' '}
            <b>{String(tuition.public ?? 'full in-state public tuition')}</b> — with{' '}
            <b>no cap</b> at a public school, at the in-state rate regardless of where
            you actually live. Plus a monthly housing allowance while you study, and{' '}
            <b>{usd(Number(gi?.book_stipend_annual_usd) || 1000)}</b> a year for books.
          </p>
          <p>
            A civilian your age is choosing between debt and no degree. You would be
            choosing neither. This is, in pure dollar terms, the single largest thing
            the military gives you — and it is transferable to a spouse or child if
            you serve long enough.
          </p>
          <Link to="/lifecycle" className="inline-link">
            The tiers, and what does not count →
          </Link>
        </div>

        <div className="card worth-card">
          <h3>Healthcare that costs you nothing</h3>
          <p>
            You pay <b>$0</b> in premiums and effectively <b>$0</b> in copays. The
            same coverage costs <b>{usd(health)}</b> a year for a single person and{' '}
            <b>{usd(family)}</b> for a family.
          </p>
          <p>
            A civilian only <em>sees</em> {usd(seen)} of that on their payslip — their
            employer pays the rest. But that money is still part of what they earn.
            And they still owe a <b>{usd(deduct)}</b> deductible before the insurance
            pays for anything.
          </p>
          <p>
            <b>
              For a service member with a family, healthcare alone is worth about{' '}
              {usd(family)} a year.
            </b>{' '}
            For a junior enlisted member that can approach the value of their entire
            base salary — and it is completely invisible in a salary comparison,
            which is exactly why salary comparisons mislead people.
          </p>
          <p className="srcline">
            Kaiser Family Foundation {HEALTHCARE.kffYear} Employer Health Benefits
            Survey: average annual premium {usd(health)} single / {usd(family)}{' '}
            family; average worker contribution {usd(seen)} single; average
            single-coverage deductible {usd(deduct)}.
          </p>
        </div>

        <div className="card worth-card">
          <h3>A house with no down payment</h3>
          <p>
            {String(loan?.down_payment_reality ?? '')} The VA home loan is a benefit
            civilians simply cannot buy at any price — no private lender offers it.
          </p>
          <p>
            For most people, the down payment is the wall that keeps them renting into
            their thirties. This removes the wall.
          </p>
        </div>

        <div className="card worth-card">
          <h3>Responsibility a decade early</h3>
          <p>
            At 22 you can be accountable for equipment worth millions and for the
            safety of people who report to you. There is no civilian job that hands a
            22-year-old that, and no way to buy the experience.
          </p>
          <p>
            It is also why the transferable thing is often not the trade — it is the
            fact that you have already been trusted, already led, and already
            performed when it was not optional.
          </p>
        </div>

        <div className="card worth-card">
          <h3>A security clearance</h3>
          <p>
            If your specialty requires one, the clearance itself has real
            labour-market value — the cleared-contractor world pays a premium for it,
            and a civilian cannot obtain one without an employer sponsoring them.
          </p>
          <p>
            Be honest with yourself about the catch: it lapses after you separate, and
            much of the work cannot be described on a résumé.
          </p>
        </div>

        <div className="card worth-card">
          <h3>No degree, no debt, no experience required</h3>
          <p>
            You can walk in at 18 with a high-school diploma and walk out with a
            trade, a clearance, a funded degree, a mortgage you can actually get, and
            a decade of responsibility on your record.
          </p>
          <p>
            There is no other institution in American life that will do that for
            someone with no money and no connections. That is a plain statement of
            fact, and it is why the decision deserves the seriousness this site is
            trying to give it.
          </p>
        </div>
      </div>

      <Note tone="warn">
        <div>
          <b>Both things are true at once.</b> Everything on this page is real. So is
          the credential gap, the 20-year pension cliff, the hearing loss, and the
          fact that you cannot quit. A good decision needs both columns in front of
          it — which is the entire reason this site exists.{' '}
          <Link to="/lifecycle">Read the costs →</Link>
        </div>
      </Note>
    </>
  );
}
