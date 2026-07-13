import { Link, useParams } from 'react-router-dom';
import {
  clusterById,
  specialtiesForCluster,
  fileForCluster,
  branchIdOf,
} from '../lib/data';
import { BranchLogo } from '../branding/Logo';
import { BRANCH_THEME } from '../lib/types';
import { Chip, DataPending, Note, SectionHead } from '../components/Bits';
import { shortClearance, shortCode, shortLineScore, trainingWeeks } from '../lib/format';
import { entryPath } from '../lib/entry';
import { MarkDisclaimer } from '../components/Disclaimer';

export default function Cluster() {
  const { id = '' } = useParams();
  const cluster = clusterById(id);

  if (!cluster) {
    return (
      <div className="wrap">
        <SectionHead title="Unknown interest area" />
        <Link to="/">Back to all interests</Link>
      </div>
    );
  }

  const specs = specialtiesForCluster(cluster.id);
  const file = fileForCluster(cluster.id);
  const absent = file?.branches_with_no_presence ?? [];

  return (
    <div className="wrap">
      <Link to="/" className="back">
        ← All interests
      </Link>

      <SectionHead title={cluster.name} lede={cluster.description} />

      <div className="grid g2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3>Does this sound like you?</h3>
          <ul className="ticklist">
            {cluster.aptitude_signals.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>ASVAB scores this work asks for</h3>
          <div className="chiprow">
            {cluster.related_asvab_composites.map((c, i) => (
              <Chip key={i} tone="brand">
                {c}
              </Chip>
            ))}
          </div>
          <p style={{ marginTop: 12 }}>
            These decide which <em>job</em> you can have. They are separate from
            the AFQT percentile, which only decides whether you can enlist at all.
          </p>
          <Link to="/prep" className="inline-link">
            See how the ASVAB actually works →
          </Link>
        </div>
      </div>

      {cluster.notes ? <Note tone="warn">{cluster.notes}</Note> : null}

      <div className="section-head" style={{ marginTop: 30 }}>
        <h2>Specialties</h2>
        <p>
          {specs.length
            ? `${specs.length} researched ${specs.length === 1 ? 'specialty' : 'specialties'} in this area.`
            : 'This interest area has not been researched yet.'}
        </p>
      </div>

      {specs.length === 0 ? (
        <DataPending
          what={cluster.name}
          why="RUN SPECIALTIES has not been executed for this cluster. Rather than invent specialty records, pay figures or training lengths, the app shows nothing here."
        />
      ) : (
        <>
          <MarkDisclaimer />

          {/* Split by ENTRY PATH, not just chipped. A 17-year-old scanning this
              list must not read "Naval Aviator" as something they can sign up
              for. A chip is easy to miss; a heading is not. */}
          {(() => {
            const open = specs.filter((x) => entryPath(x).openToHighSchool);
            const gated = specs.filter((x) => !entryPath(x).openToHighSchool);

            const Card = ({ x }: { x: (typeof specs)[number] }) => {
              const b = branchIdOf(x);
              const theme = b ? BRANCH_THEME[b] : undefined;
              const gate = shortLineScore(x.entry_requirements?.asvab_line_score);
              const clearance = shortClearance(
                x.entry_requirements?.security_clearance,
              );
              const tw = trainingWeeks(x.training_pipeline);
              const ep = entryPath(x);
              return (
                <Link
                  key={x.id}
                  to={`/specialty/${x.id}`}
                  className="spec-card"
                  style={
                    theme
                      ? ({
                          '--bc': theme.primary,
                          '--bc-accent': theme.accent,
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  {b ? <BranchLogo branch={b} size={44} /> : null}
                  <div className="spec-body">
                    <div className="spec-code">
                      {x.branch} · {shortCode(x.code) ?? '—'} · {x.track}
                    </div>
                    <h3>{x.name}</h3>
                    <div className="spec-tags">
                      {!ep.openToHighSchool ? (
                        <Chip tone="alert">
                          {ep.kind === 'warrant'
                            ? 'Warrant Officer'
                            : ep.kind === 'in-service'
                              ? 'Not entry-level'
                              : 'Degree required'}
                        </Chip>
                      ) : null}
                      {ep.usesAsvab && gate ? (
                        <span
                          className="spec-gate"
                          title={String(x.entry_requirements.asvab_line_score)}
                        >
                          {gate}
                        </span>
                      ) : null}
                      {clearance ? <Chip tone="warn">{clearance}</Chip> : null}
                      {tw.weeks > 0 ? (
                        <Chip>
                          {tw.label} wk pipeline
                        </Chip>
                      ) : null}
                    </div>
                  </div>
                </Link>
              );
            };

            return (
              <>
                {open.length ? (
                  <>
                    <h3 className="grouphead">
                      You can enter these straight from high school
                    </h3>
                    <div className="grid g2">
                      {open.map((x) => (
                        <Card key={x.id} x={x} />
                      ))}
                    </div>
                  </>
                ) : null}

                {gated.length ? (
                  <>
                    <h3 className="grouphead gated">
                      You cannot enter these from high school
                    </h3>
                    <Note tone="alert">
                      <div>
                        <b>These are not enlistment options.</b> They require a
                        degree and a commission (officer), a selection board from
                        within the ranks (warrant officer), or reclassification once
                        you are already serving. There is no ASVAB score that opens
                        them. They are listed because they are real careers in this
                        field — and because you should know now that the route to
                        them starts with a degree or with enlisting into something
                        else first.
                      </div>
                    </Note>
                    <div className="grid g2">
                      {gated.map((x) => (
                        <Card key={x.id} x={x} />
                      ))}
                    </div>
                  </>
                ) : null}
              </>
            );
          })()}
        </>
      )}

      {absent.length ? (
        <>
          <div className="section-head" style={{ marginTop: 34 }}>
            <h2>Branches with no presence here</h2>
            <p>
              Stated explicitly rather than padded. A branch missing from this list
              is a real absence, not an omission.
            </p>
          </div>
          <div className="grid g2">
            {absent.map((a, i) => (
              <div key={i} className="card">
                <h3>{a.branch}</h3>
                <p>{a.why}</p>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {file?.unverified?.length ? (
        <div style={{ marginTop: 30 }}>
          <Note tone="warn">
            <div>
              <b>Unverified in this cluster ({file.unverified.length})</b>
              <ul className="ticklist" style={{ marginTop: 8 }}>
                {file.unverified.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          </Note>
        </div>
      ) : null}
    </div>
  );
}
