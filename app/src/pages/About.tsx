import { assets, taxonomy, specialtyFiles, allSpecialties, clusters } from '../lib/data';
import { UNVERIFIED_ITEMS } from '../data/content';
import { Note, SectionHead, TickList } from '../components/Bits';
import { SITE_DISCLAIMER, PLACEHOLDER_NOTICE } from '../components/Disclaimer';

type Dict = Record<string, unknown>;

const dvids = (assets as Dict).dvids_pipeline as Dict | undefined;
const hardRules = (assets as Dict).hard_rules as string[] | undefined;

export default function About() {
  const researched = clusters.filter((c) =>
    specialtyFiles.some((f) => f.cluster_id === c.id),
  );
  const clusterUnverified = specialtyFiles.flatMap((f) => f.unverified ?? []);

  return (
    <div className="wrap">
      <SectionHead
        title="Methodology, sources and limits"
        lede="What this site knows, how it knows it, and — more importantly — what it does not know."
      />

      <div className="grid g3">
        <div className="card stat">
          <div className="n">{allSpecialties.length}</div>
          <div className="l">Specialties researched</div>
        </div>
        <div className="card stat">
          <div className="n">
            {researched.length}/{clusters.length}
          </div>
          <div className="l">Interest areas with data</div>
        </div>
        <div className="card stat">
          <div className="n">
            {clusterUnverified.length + (taxonomy.unverified?.length ?? 0)}
          </div>
          <div className="l">Items flagged UNVERIFIED</div>
        </div>
      </div>

      <SectionHead title="The rules this data was built under" />
      <div className="card">
        <TickList
          items={[
            'Every dollar figure, training length, score and bonus carries a named source and a retrieval date, or is marked UNVERIFIED. Nothing is invented.',
            'Official .mil and .gov sources outrank aggregators. Recruiting copy, forums and "best MOS" listicles were treated as data to cross-check, never as authority.',
            'No recruiter marketing language. This is a neutral reference, not recruiting material.',
            'Guard and Reserve figures are labeled and never summed as if equivalent to active duty.',
            'The Coast Guard (Homeland Security, not the Department of War) and the Space Force (no reserve component, no academy) are never padded to false parity with the larger branches.',
            'Every specialty resolves the full lifecycle through retirement, transition and veteran benefits — and names the civilian credential gap rather than implying seamless transfer.',
          ]}
        />
      </div>

      {/* --------------------------------------------------- the assets */}
      <SectionHead
        title="Why the insignia here are not the real ones"
        lede="This is the most visible compromise in the build, and it was not a stylistic choice."
      />
      <div className="card">
        <Note tone="alert">{PLACEHOLDER_NOTICE}</Note>

        <p style={{ marginTop: 14 }}>
          The asset research identified official sources for branch emblems and rank
          insignia. Every one of those URLs was then tested, and{' '}
          <strong>
            all of them returned HTTP 403 — including the Department of War's own
            trademark guide and every branch's .mil portal.
          </strong>{' '}
          No official emblem, badge or insignia file could be verified as reachable.
          The governing asset policy is explicit that a URL which cannot be verified
          must be omitted rather than guessed, because a hallucinated asset URL breaks
          a build silently.
        </p>

        <p style={{ marginTop: 12 }}>
          Rather than ship broken images or scrape an aggregator with no licensing
          chain, every emblem and badge on this site was drawn from scratch. They
          carry each service's official colors and heraldic vocabulary, and nothing
          else.
        </p>

        <h3 style={{ marginTop: 20 }}>Hard rules the build follows</h3>
        <TickList items={hardRules ?? []} />

        <h3 style={{ marginTop: 20 }}>Official photography is blocked, not refused</h3>
        <p>
          DVIDS — the Department of Defense public media library, and genuinely public
          domain under 17 U.S.C. § 105 — is the correct source for photography of
          service members actually doing these jobs. Its API is live and documented.
          It is not wired up here for one reason:{' '}
          <strong>{String(dvids?.status ?? 'blocked')}</strong>
        </p>
        <p style={{ marginTop: 10 }}>
          <b>To unblock it:</b> {String(dvids?.what_is_needed_to_unblock ?? '')}
        </p>
      </div>

      {/* ------------------------------------------------- unverified */}
      <SectionHead
        title="What this site does not know"
        lede="Published deliberately. A flagged gap is worth more than a confident wrong answer."
      />

      <div className="card">
        <h3>From the qualification research</h3>
        <TickList items={UNVERIFIED_ITEMS} />
      </div>

      {taxonomy.unverified?.length ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>From the interest taxonomy</h3>
          <TickList items={taxonomy.unverified} />
        </div>
      ) : null}

      {clusterUnverified.length ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>From the specialty research ({clusterUnverified.length})</h3>
          <TickList items={clusterUnverified} />
        </div>
      ) : null}

      {/* ----------------------------------------------------- legal */}
      <SectionHead title="Legal" />
      <div className="card">
        <p>{SITE_DISCLAIMER}</p>
        <p className="srcline" style={{ marginTop: 14 }}>
          Disclaimer language follows the safe-harbor model at 32 CFR § 765.14.
          Relevant authorities: 17 U.S.C. § 105 (no copyright in U.S. Government
          works); 18 U.S.C. § 701 (official insignia); 10 U.S.C. § 8921 (Marine Corps
          marks); 14 U.S.C. § 934 (Coast Guard marks).
        </p>
        <Note tone="warn">
          <div>
            <b>If this site ever becomes commercial</b> — paid placement, merchandise,
            sponsored content, donations, or lead generation for paid services — the
            trademark posture flips to high risk and a written license from each
            service becomes mandatory. This build assumes non-commercial, informational
            use.
          </div>
        </Note>
      </div>

      <Note tone="alert">
        <div>
          <b>This is not advice, and it is not current forever.</b> Policy across all
          six branches is in active flux through 2025–2026 — fitness tests, medical
          waivers, and pay all changed recently. Reconfirm any number here against the
          current official publication before it drives a decision about your life.
        </div>
      </Note>
    </div>
  );
}
