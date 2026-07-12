import { Link } from 'react-router-dom';
import { clusters, specialtiesForCluster, allSpecialties, RESEARCH_DATE } from '../lib/data';
import { Emblem } from '../branding/Emblem';
import { BRANCH_IDS, BRANCH_NAME_TO_ID, type BranchId } from '../lib/types';
import { MarkDisclaimer } from '../components/Disclaimer';

/** Branches that actually have a researched specialty in this cluster. */
function branchesIn(clusterId: string): BranchId[] {
  const set = new Set<BranchId>();
  for (const s of specialtiesForCluster(clusterId)) {
    const b = BRANCH_NAME_TO_ID[s.branch];
    if (b) set.add(b);
  }
  return BRANCH_IDS.filter((b) => set.has(b));
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
            {BRANCH_IDS.map((b) => (
              <Emblem key={b} branch={b} size={46} />
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
        <div className="section-head">
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
                    <Emblem key={b} branch={b} size={26} />
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
      </div>
    </>
  );
}
