import { Link } from 'react-router-dom';
import { clusters, specialtiesForCluster, allSpecialties, RESEARCH_DATE } from '../lib/data';
import { BranchLogo } from '../branding/Logo';
import { branchOrder, BRANCH_NAME_TO_ID, type BranchId } from '../lib/types';
import { MarkDisclaimer } from '../components/Disclaimer';
import { Note } from '../components/Bits';
import { HEALTHCARE } from '../lib/paycalc';

/** Branches that actually have a researched specialty in this cluster. */
function branchesIn(clusterId: string): BranchId[] {
  const set = new Set<BranchId>();
  for (const s of specialtiesForCluster(clusterId)) {
    const b = BRANCH_NAME_TO_ID[s.branch];
    if (b) set.add(b);
  }
  return branchOrder().filter((b) => set.has(b));
}

export default function Home() {
  const researched = clusters.filter((c) => specialtiesForCluster(c.id).length > 0);

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow">Neutral reference · not recruiting material</div>
          <h1>
            Start from what you're <em>good at</em>. Not from a branch.
          </h1>
          <p className="lede">
            Pick an interest and this maps it to real military specialties across
            all six services — what it takes to qualify, what the training
            pipeline is, what it pays, what retirement and transition look like,
            and honestly what it does <em>not</em> give you on the way out.
          </p>

          <div className="hero-emblems" aria-hidden="true">
            {branchOrder().map((b) => (
              <BranchLogo key={b} branch={b} size={46} />
            ))}
          </div>
          <MarkDisclaimer />

          <div className="tldr">
            <div>
              <strong>The ASVAB gates you twice</strong>
              Your AFQT percentile decides <em>whether</em> you can enlist. Separate
              line scores decide <em>which job</em> you can hold. A high AFQT alone
              never guarantees a specialty.
            </div>
            <div>
              <strong>The 20-year cliff is real</strong>
              Under the Blended Retirement System the pension requires 20 years and
              is otherwise forfeited entirely — no proration. Your TSP is yours
              either way.
            </div>
            <div>
              <strong>Training is not a licence</strong>
              A combat medic is not a paramedic. An MP is not a police officer. Every
              specialty here names the credential gap instead of hiding it.
            </div>
          </div>
        </div>
      </section>

      <div className="wrap">
        {/* A COMPACT trust strip, not the full essay. The provenance matters, but a
            17-year-old should not have to scroll five paragraphs about the site
            before reaching a single job. The full story is one click away, in the
            nav, at /about. */}
        <Link to="/about" className="truststrip">
          <div className="ts-main">
            <b>This is not an official military recruitment site.</b> It was compiled
            by <b>a veteran and a father</b> who recently helped his own son navigate
            these careers. Nobody here is trying to enlist you — no sign-up, no account,
            nothing sent to a recruiter.
          </div>
          <span className="ts-link">Who made this, and why →</span>
        </Link>

        {/* --------------------------------- not sure where to start? */}
        <div className="card startcard">
          <h3>Not sure which service, or which job?</h3>
          <p>
            That is the normal starting position, and it is the right one. Almost
            nobody knows at seventeen. Do this instead of guessing:
          </p>

          <ol className="startsteps">
            <li>
              <b>Don't start with a branch.</b> Choosing the Army or the Navy first
              and then hunting for a job inside it is backwards — it locks you out of
              the same work in a service that might suit you better. The same job
              often exists in four of them. Start with the work.
            </li>
            <li>
              <b>Open anything below that sounds even vaguely like you.</b> You are
              not committing to anything. You are opening a door to look. Open three.
            </li>
            <li>
              <b>Take a free practice ASVAB before you talk to anyone.</b> It costs
              nothing, takes about an hour, and it changes every conversation you have
              afterwards. It is the highest-value hour on this entire site.{' '}
              <Link to="/prep">Start here →</Link>
            </li>
            <li>
              <b>If you would rather be asked than browse</b>, answer four questions
              and the site will show you what fits — and what each option would cost
              you. <Link to="/explore">Find what fits →</Link>
            </li>
          </ol>

          <p className="startnote">
            Nothing here signs you up for anything. No account, no sign-up, nothing
            sent to a recruiter.
          </p>
        </div>

        <div className="section-head" style={{ marginTop: 30 }}>
          <h2>Choose an interest</h2>
          <p>
            {researched.length} of {clusters.length} interest areas have researched
            specialty data behind them, covering {allSpecialties.length} specialties
            across the six branches. Figures were retrieved {RESEARCH_DATE} and each
            one carries its source.
          </p>
        </div>

        <div className="grid g3">
          {clusters.map((c) => {
            const specs = specialtiesForCluster(c.id);
            const bs = branchesIn(c.id);
            const empty = specs.length === 0;
            return (
              <Link
                key={c.id}
                to={`/interest/${c.id}`}
                className={`cluster-card${empty ? ' is-empty' : ''}`}
              >
                <h3>{c.name}</h3>
                <p>{c.description}</p>

                <div className="cluster-emblems">
                  {bs.map((b) => (
                    <BranchLogo key={b} branch={b} size={26} />
                  ))}
                  {empty ? (
                    <span className="chip warn">Data pending</span>
                  ) : (
                    <span className="cluster-count">
                      {specs.length} {specs.length === 1 ? 'specialty' : 'specialties'}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* ------------------------------------------- the other door
            Someone who scrolls the whole grid without picking anything has
            just told you they don't know where to start. Give them the tool
            instead of a dead end at the bottom of the page. */}
        <div className="findfits">
          <div className="ff-body">
            <div className="eyebrow">Still not sure?</div>
            <h2>Let the site match you instead</h2>
            <p>
              If none of the interest areas above jumped out at you — or if too many
              did — use this tool. Answer four questions about what you're drawn to,
              where you actually stand on the ASVAB, and what you want out of it, and
              it will match your interests to{' '}
              <b>real military careers across all six branches</b>.
            </p>

            <ul className="ff-steps">
              <li>
                <span>1</span> What actually interests you
              </li>
              <li>
                <span>2</span> Where you stand on the ASVAB
              </li>
              <li>
                <span>3</span> What matters most to you
              </li>
              <li>
                <span>4</span> Your matches — and what each one costs you
              </li>
            </ul>

            <Link to="/explore" className="btn ff-btn">
              Find what fits →
            </Link>

            <p className="ff-note">
              It takes about two minutes. It shows you the downsides of every match,
              not just the upside. Nothing is sent to a recruiter, and it doesn't
              score or rank the branches against each other — no service is better
              than another.
            </p>
          </div>
        </div>

        {/* The money caveat belongs HERE — after the reader has seen what the
            site offers, not before they have seen a single number. */}
        <Note tone="warn">
          <div>
            <b>About the pay figures and the military-vs-civilian comparisons.</b>{' '}
            They are <b>for comparison only</b>. Real pay <b>varies enormously</b> by
            duty station, paygrade and whether you have dependents — the same rank
            draws roughly <b>4× the housing allowance</b> in San Francisco that it
            draws in rural Alabama, and if you live in the barracks you get almost
            none of it.
            <br />
            <br />
            They exist for one reason: to surface the parts of military compensation
            that other career sources routinely <b>omit, or leave you to find out too
            late</b> — that the housing and food allowances are <b>not taxed</b>, that
            healthcare costs you <b>nothing</b> where a civilian pays about{' '}
            <b>${HEALTHCARE.singlePremium.toLocaleString()}</b> a year for the same
            cover (<b>${HEALTHCARE.familyPremium.toLocaleString()}</b> for a family),
            and that a job may carry special pays nobody mentioned. None of that shows
            up in a salary comparison, which is exactly why salary comparisons mislead
            people — in both directions.{' '}
            <Link to="/pay">See how the number is actually built →</Link>
          </div>
        </Note>

      </div>
    </>
  );
}
