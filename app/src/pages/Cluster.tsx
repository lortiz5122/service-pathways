import { Link, useParams } from 'react-router-dom';
import {
  clusterById,
  specialtiesForCluster,
  fileForCluster,
  branchIdOf,
} from '../lib/data';
import { Emblem } from '../branding/Emblem';
import { BRANCH_THEME } from '../lib/types';
import { Chip, DataPending, Note, SectionHead } from '../components/Bits';
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
          <h3>ASVAB composites that gate this work</h3>
          <div className="chiprow">
            {cluster.related_asvab_composites.map((c, i) => (
              <Chip key={i} tone="brand">
                {c}
              </Chip>
            ))}
          </div>
          <p style={{ marginTop: 12 }}>
            These are the <em>job</em> gates. They are separate from the AFQT
            percentile, which only decides whether you can enlist at all.
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
          <div className="grid g2">
            {specs.map((s) => {
              const b = branchIdOf(s);
              const theme = b ? BRANCH_THEME[b] : undefined;
              return (
                <Link
                  key={s.id}
                  to={`/specialty/${s.id}`}
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
                  {b ? <Emblem branch={b} size={54} /> : null}
                  <div>
                    <div className="spec-code">
                      {s.branch} · {s.code} · {s.track}
                    </div>
                    <h3>{s.name}</h3>
                    {s.entry_requirements?.asvab_line_score ? (
                      <span className="spec-gate">
                        {s.entry_requirements.asvab_line_score}
                      </span>
                    ) : null}
                    {s.entry_requirements?.security_clearance ? (
                      <div style={{ marginTop: 6 }}>
                        <Chip tone="warn">
                          Clearance: {s.entry_requirements.security_clearance}
                        </Chip>
                      </div>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
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
