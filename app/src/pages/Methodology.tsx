import { assets, taxonomy, specialtyFiles, allSpecialties, clusters } from '../lib/data';
import { UNVERIFIED_ITEMS } from '../data/content';
import { Note, SectionHead, TickList } from '../components/Bits';
import { SITE_DISCLAIMER, PLACEHOLDER_NOTICE } from '../components/Disclaimer';
import logoManifest from '../research/logo-manifest.json';
import { branchOrder, BRANCH_THEME } from '../lib/types';
import { hasLogo } from '../branding/Logo';

type Dict = Record<string, unknown>;

const rejected = (logoManifest as { rejected: { file: string; why: string }[] })
  .rejected;
const shipped = (logoManifest as { logos: { slug: string; label: string }[] }).logos;

/** What is real artwork, what was refused, and what falls back to original art. */
function AssetLedger() {
  const fallbacks = branchOrder().filter((b) => !hasLogo(b));

  return (
    <div className="card">
      <h3>What is actually on this page</h3>

      <div className="grid g3" style={{ marginBottom: 18 }}>
        <div className="stat">
          <div className="n">{shipped.length}</div>
          <div className="l">Official logos in use</div>
          <div className="s">MEDIUM risk — disclaimed, non-commercial</div>
        </div>
        <div className="stat">
          <div className="n">{rejected.length}</div>
          <div className="l">Files rejected</div>
          <div className="s">Seals — HIGH risk, never used</div>
        </div>
        <div className="stat">
          <div className="n">{fallbacks.length}</div>
          <div className="l">Branches on original art</div>
          <div className="s">No safe logo could be sourced</div>
        </div>
      </div>

      {rejected.length ? (
        <>
          <h4 className="minihead">Rejected at the build boundary</h4>
          <div className="tablewrap" style={{ marginBottom: 16 }}>
            <table>
              <thead>
                <tr>
                  <th>File</th>
                  <th>Why it was refused</th>
                </tr>
              </thead>
              <tbody>
                {rejected.map((r) => (
                  <tr key={r.file}>
                    <td>
                      <strong>{r.file}</strong>
                    </td>
                    <td className="gap-no">{r.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="srcline" style={{ marginBottom: 16 }}>
            This filter runs in the build script, not in a developer's head. A seal
            file cannot physically reach the bundle.
          </p>
        </>
      ) : null}

      {fallbacks.length ? (
        <Note tone="warn">
          <div>
            <b>
              {fallbacks.map((b) => BRANCH_THEME[b].short).join(', ')} —{' '}
              {fallbacks.length === 1 ? 'shown' : 'shown'} with original artwork.
            </b>{' '}
            No official non-seal logo could be sourced for{' '}
            {fallbacks.length === 1 ? 'this service' : 'these services'}. The only
            file available was a seal, which this site does not use under any
            circumstances. An original illustration stands in until a real logo can
            be sourced.
          </div>
        </Note>
      ) : null}
    </div>
  );
}

const dvids = (assets as Dict).dvids_pipeline as Dict | undefined;
const hardRules = (assets as Dict).hard_rules as string[] | undefined;

export default function Methodology() {
  const researched = clusters.filter((c) =>
    specialtyFiles.some((f) => f.cluster_id === c.id),
  );
  /**
   * The UNVERIFIED register.
   *
   * Different research passes recorded a gap differently — some as a sentence, some
   * as {id, code, field, reason}. Both are legitimate; a React child is not. Flatten
   * to readable lines rather than dropping the structured ones, because the whole
   * point of this page is that the gaps get PUBLISHED, not quietly swallowed.
   */
  const clusterUnverified: string[] = specialtyFiles
    .flatMap((f) => f.unverified ?? [])
    .map((u: unknown) => {
      if (typeof u === 'string') return u;
      if (u && typeof u === 'object') {
        const o = u as Record<string, unknown>;
        const who = [o.code, o.id].find(Boolean);
        const what = [o.field, o.reason, o.note, o.why].filter(Boolean).join(' — ');
        return [who, what].filter(Boolean).join(': ') || JSON.stringify(o);
      }
      return String(u);
    })
    .filter(Boolean);

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
        title="The insignia on this site"
        lede="Which marks are real, which were refused, and why."
      />

      <AssetLedger />

      <div className="card" style={{ marginTop: 16 }}>
        <h3>The rule that governs all of it</h3>
        <p>
          Two separate bodies of law apply at once. Copyright does not protect works
          of the U.S. Government (17 U.S.C. § 105), so these marks are not
          copyrighted. But trademark and insignia law restricts their{' '}
          <em>use</em> independently — and the operative question is never copyright,
          it is <strong>endorsement</strong>. A neutral, clearly-disclaimed,
          non-commercial display is the lowest-risk posture there is. A commercial or
          promotional one requires a written licence.
        </p>
        <p style={{ marginTop: 12 }}>
          That is why branch <strong>logos and emblems</strong> appear here and branch{' '}
          <strong>seals never do</strong>. Seals are reserved to official government
          use — the Coast Guard's own rule is that its seal "shall not be reproduced
          outside of the United States Coast Guard."
        </p>

        <Note tone="alert">{PLACEHOLDER_NOTICE}</Note>

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
