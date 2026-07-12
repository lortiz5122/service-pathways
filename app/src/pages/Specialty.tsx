import { Link, useParams } from 'react-router-dom';
import { specialtyById, branchIdOf, clusterById } from '../lib/data';
import { BranchLogo } from '../branding/Logo';
import { BRANCH_THEME, money, type SpecialtyRecord } from '../lib/types';
import { Chip, Note, SectionHead, SourceNote, Value } from '../components/Bits';
import { MarkDisclaimer } from '../components/Disclaimer';

/** Renders any of the loosely-typed lifecycle blocks as a definition list. */
function Block({ obj }: { obj: Record<string, unknown> }) {
  const rows = Object.entries(obj).filter(
    ([k, v]) =>
      !['source', 'retrieved_date'].includes(k) &&
      v !== null &&
      v !== undefined &&
      v !== '',
  );
  if (!rows.length) return null;
  return (
    <dl className="deflist">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k.replace(/_/g, ' ')}</dt>
          <dd>
            {Array.isArray(v) ? (
              <ul className="ticklist">
                {v.map((x, i) => (
                  <li key={i}>
                    {typeof x === 'object' ? JSON.stringify(x) : String(x)}
                  </li>
                ))}
              </ul>
            ) : typeof v === 'object' ? (
              <Block obj={v as Record<string, unknown>} />
            ) : (
              <Value v={v} />
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function bonusRange(v: SpecialtyRecord['bonuses']['enlistment_bonus_range_usd']) {
  if (v === null || v === undefined) return 'None published';
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return `${money(v[0])} – ${money(v[1])}`;
  return String(v);
}

export default function Specialty() {
  const { id = '' } = useParams();
  const s = specialtyById(id);

  if (!s) {
    return (
      <div className="wrap">
        <SectionHead title="Unknown specialty" />
        <Link to="/">Back to all interests</Link>
      </div>
    );
  }

  const b = branchIdOf(s);
  const theme = b ? BRANCH_THEME[b] : undefined;
  const pipeline = s.training_pipeline ?? [];
  const totalWeeks = pipeline.reduce(
    (n, st) => n + (Number(st.length_weeks) || 0),
    0,
  );

  return (
    <div
      className="wrap"
      style={
        theme
          ? ({
              '--brand': theme.primary,
              '--brand-accent': theme.accent,
            } as React.CSSProperties)
          : undefined
      }
    >
      <Link to={`/interest/${s.interest_cluster_ids?.[0] ?? ''}`} className="back">
        ← Back
      </Link>

      <header className="spec-hero">
        {b ? <BranchLogo branch={b} size={82} /> : null}
        <div>
          <div className="spec-code">
            {s.branch} · {s.code} · {s.track}
          </div>
          <h1>{s.name}</h1>
          <div className="chiprow" style={{ marginTop: 10 }}>
            {(s.interest_cluster_ids ?? []).map((cid) => {
              const c = clusterById(cid);
              return c ? (
                <Link key={cid} to={`/interest/${cid}`}>
                  <Chip tone="brand">{c.name}</Chip>
                </Link>
              ) : null;
            })}
          </div>
        </div>
      </header>
      <MarkDisclaimer />

      {/* ---------------------------------------------------- qualify */}
      <SectionHead title="What it takes to qualify" />
      <div className="grid g2">
        <div className="card">
          <h3>Entry requirements</h3>
          <Block obj={s.entry_requirements as unknown as Record<string, unknown>} />
        </div>
        <div className="card">
          <h3>Training pipeline</h3>
          {pipeline.length ? (
            <>
              <div className="timeline">
                {pipeline.map((st, i) => (
                  <div key={i} className="tl-item">
                    <div className="n">
                      {st.location} · {st.length_weeks} weeks
                    </div>
                    <h4>{st.stage}</h4>
                    <p>{st.description}</p>
                  </div>
                ))}
              </div>
              <p className="srcline">
                Total pipeline: about {totalWeeks} weeks before you are working the
                job.
              </p>
            </>
          ) : (
            <p>Not published.</p>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------- pay */}
      <SectionHead
        title="Pay and compensation"
        lede="Entry figures. BAH varies by duty station and cannot be reduced to one national number — treat any single figure with suspicion."
      />
      <div className="grid g3">
        <div className="card stat">
          <div className="n">{s.pay_and_compensation?.paygrade_entry ?? '—'}</div>
          <div className="l">Entry paygrade</div>
        </div>
        <div className="card stat">
          <div className="n">
            {money(s.pay_and_compensation?.base_pay_monthly_usd)}
          </div>
          <div className="l">Base pay / month</div>
        </div>
        <div className="card stat">
          <div className="n">
            {money(s.pay_and_compensation?.total_compensation_estimate_annual_usd)}
          </div>
          <div className="l">Est. total comp / year</div>
          <div className="s">See methodology below</div>
        </div>
      </div>
      <Note tone="warn">
        <div>
          <b>Methodology.</b> {s.pay_and_compensation?.methodology_note}
        </div>
      </Note>
      <SourceNote
        source={s.pay_and_compensation?.source}
        date={s.pay_and_compensation?.retrieved_date}
      />

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Bonuses</h3>
        <div className="grid g2">
          <div>
            <div className="k">Enlistment</div>
            <div className="v">
              {bonusRange(s.bonuses?.enlistment_bonus_range_usd)}
            </div>
          </div>
          <div>
            <div className="k">Reenlistment</div>
            <div className="v">
              {bonusRange(s.bonuses?.reenlistment_bonus_range_usd)}
            </div>
          </div>
        </div>
        <p style={{ marginTop: 12 }}>{s.bonuses?.conditions}</p>
        <Note tone="alert">
          Bonus amounts change quarterly and are written into your contract or they
          do not exist. Never rely on a figure on any website — including this one.
        </Note>
        <SourceNote source={s.bonuses?.source} date={s.bonuses?.retrieved_date} />
      </div>

      {/* --------------------------------------------------- career */}
      <SectionHead title="The service career" />
      <div className="card">
        <Block obj={s.career_progression as unknown as Record<string, unknown>} />
        <SourceNote
          source={s.career_progression?.source}
          date={s.career_progression?.retrieved_date}
        />
      </div>

      {s.deployment_and_lifestyle ? (
        <div className="grid g2" style={{ marginTop: 16 }}>
          <div className="card">
            <h3>Tempo</h3>
            <p>{s.deployment_and_lifestyle.typical_tempo}</p>
          </div>
          <div className="card">
            <h3>Family considerations</h3>
            <p>{s.deployment_and_lifestyle.family_considerations}</p>
          </div>
        </div>
      ) : null}

      {/* ------------------------------------------------ retirement */}
      <SectionHead
        title="Retirement"
        lede="The pension requires 20 years and is otherwise forfeited entirely. Most people who enlist do not reach it."
      />
      <div className="card">
        <Block obj={s.retirement ?? {}} />
        <SourceNote source={s.retirement?.source as string} />
      </div>

      {/* ------------------------------------------------ transition */}
      <SectionHead title="Getting out" />
      <div className="card">
        <Block obj={s.transition ?? {}} />
        <SourceNote source={s.transition?.source as string} />
      </div>

      {/* ------------------------------------------------- crosswalk */}
      <SectionHead
        title="The civilian career"
        lede="Including, specifically, what the military does NOT give you."
      />
      <div className="card">
        <div className="grid g2">
          <div>
            <h3>Example civilian titles</h3>
            <ul className="ticklist">
              {(s.civilian_crosswalk?.example_civilian_titles ?? []).map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Certifications that matter</h3>
            <ul className="ticklist">
              {(s.civilian_crosswalk?.relevant_certifications ?? []).map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="salary">
          <span className="k">Estimated civilian salary</span>
          <span className="v">
            {Array.isArray(s.civilian_crosswalk?.estimated_civilian_salary_range_usd)
              ? `${money(s.civilian_crosswalk.estimated_civilian_salary_range_usd[0])} – ${money(
                  s.civilian_crosswalk.estimated_civilian_salary_range_usd[1],
                )}`
              : String(
                  s.civilian_crosswalk?.estimated_civilian_salary_range_usd ?? '—',
                )}
          </span>
        </div>

        <Note tone="alert">
          <div>
            <b>The credential gap.</b> {s.civilian_crosswalk?.credential_gap_note}
          </div>
        </Note>

        <div className="chiprow" style={{ marginTop: 12 }}>
          {(s.civilian_crosswalk?.onet_codes ?? []).map((c, i) => (
            <Chip key={i}>O*NET {c}</Chip>
          ))}
        </div>
        <SourceNote
          source={s.civilian_crosswalk?.source}
          date={s.civilian_crosswalk?.retrieved_date}
        />
      </div>

      {/* ------------------------------------------ veteran benefits */}
      <SectionHead title="Veteran benefits" />
      <div className="card">
        <Block obj={s.veteran_benefits ?? {}} />
        <SourceNote source={s.veteran_benefits?.source as string} />
      </div>

      {/* --------------------------------------------------- sources */}
      {s.sources?.length ? (
        <>
          <SectionHead title="Sources" />
          <div className="card">
            <ul className="ticklist">
              {s.sources.map((src, i) => (
                <li key={i}>
                  {src.url ? (
                    <a href={src.url} target="_blank" rel="noreferrer">
                      {src.title || src.url}
                    </a>
                  ) : (
                    src.title
                  )}
                  {src.retrieved_date ? ` · retrieved ${src.retrieved_date}` : ''}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
