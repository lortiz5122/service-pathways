import { Link } from 'react-router-dom';
import { branches, specialtiesForBranch } from '../lib/data';
import { BranchLogo, ComponentLogo, componentLogos } from '../branding/Logo';
import { BRANCH_THEME, type BranchId } from '../lib/types';
import { Note, SectionHead } from '../components/Bits';
import { MarkDisclaimer } from '../components/Disclaimer';

/**
 * Guard and Reserve. Drill pay and part-time benefits are NOT interchangeable
 * with active-duty compensation — the master prompt names conflating them as an
 * explicit anti-pattern, so the warning is part of the section, not a footnote.
 */
function GuardReserve() {
  if (!componentLogos.length) return null;
  return (
    <>
      <SectionHead
        title="Guard and Reserve"
        lede="The part-time path. One weekend a month and two weeks a year is the slogan; schools, deployments and mobilisations mean the real commitment is frequently higher. Guard and Reserve units have deployed extensively since 9/11 — do not assume part-time means no deployment."
      />

      <Note tone="alert">
        <div>
          <b>Drill pay is not active-duty pay.</b> One drill period pays 1/30th of
          the equivalent active-duty monthly base pay, so a four-drill weekend is
          roughly 4/30ths. It is supplemental income, not a living wage. When
          mobilised, members receive full active-duty pay and allowances.
        </div>
      </Note>

      <div className="grid g3" style={{ marginTop: 16 }}>
        {componentLogos.map((c) => (
          <div key={c.slug} className="card component-card">
            <ComponentLogo slug={c.slug} size={64} />
            <h3>{c.label}</h3>
          </div>
        ))}
      </div>

      <Note tone="warn">
        <div>
          <b>The Space Force has no reserve component at all.</b> Under the Space
          Force Personnel Management Act it runs a single combined component —
          Guardians serve on "sustained duty" (full-time) or "not on sustained
          duty" (part-time). There is no Space National Guard, and there is
          currently no part-time entry pipeline for new civilians.
        </div>
      </Note>

      <p className="srcline">
        Some component logos could not be sourced without using a seal, which this
        site never does. Those are absent rather than substituted. See{' '}
        <Link to="/about">Sources</Link>.
      </p>
    </>
  );
}

export default function Branches() {
  return (
    <div className="wrap">
      <SectionHead
        title="The six branches"
        lede="Pick a branch by mission and job, not by marketing. Two of the six are structurally different and are not padded to false parity here: the Coast Guard sits under Homeland Security rather than the Department of War, and the Space Force has no reserve component and no academy of its own."
      />
      <MarkDisclaimer />

      <div className="stack">
        {branches.map((b) => {
          const t = BRANCH_THEME[b.id as BranchId];
          const specs = specialtiesForBranch(b.id as BranchId);
          return (
            <div
              key={b.id}
              className="card branch-themed"
              style={
                {
                  '--bc': t.primary,
                  '--bc-accent': t.accent,
                } as React.CSSProperties
              }
            >
              <header className="branch-head">
                <BranchLogo branch={b.id as BranchId} size={64} />
                <div>
                  <h3>{b.name}</h3>
                  <div className="spec-code">{b.department}</div>
                </div>
                <div className="branch-size">
                  <div className="k">Active duty</div>
                  <div className="v">{String(b.size_active_duty)}</div>
                </div>
              </header>

              <p style={{ marginTop: 14 }}>{b.mission}</p>
              <p style={{ marginTop: 10, color: 'var(--ink-3)' }}>{b.culture}</p>

              <div className="grid g2" style={{ marginTop: 16 }}>
                <div>
                  <h4 className="minihead">Entry paths</h4>
                  <dl className="deflist">
                    <div>
                      <dt>enlisted</dt>
                      <dd>{b.entry_paths?.enlisted}</dd>
                    </div>
                    <div>
                      <dt>rotc</dt>
                      <dd>{b.entry_paths?.rotc}</dd>
                    </div>
                    <div>
                      <dt>ocs / ots</dt>
                      <dd>{b.entry_paths?.ocs_ots}</dd>
                    </div>
                    <div>
                      <dt>academy</dt>
                      <dd>{b.entry_paths?.academy}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="minihead">Basic training</h4>
                  <p>
                    <strong>{b.basic_training?.name}</strong> ·{' '}
                    {b.basic_training?.location} · {b.basic_training?.length_weeks}{' '}
                    weeks
                  </p>
                  <p style={{ marginTop: 6 }}>{b.basic_training?.notes}</p>

                  <h4 className="minihead" style={{ marginTop: 14 }}>
                    Eligibility
                  </h4>
                  <p>
                    {b.general_eligibility?.age_range} ·{' '}
                    {b.general_eligibility?.citizenship}
                  </p>
                  <p style={{ marginTop: 4 }}>{b.general_eligibility?.education}</p>
                </div>
              </div>

              {b.structural_notes ? (
                <Note tone="warn">
                  <div>
                    <b>Structurally different.</b> {b.structural_notes}
                  </div>
                </Note>
              ) : null}

              {specs.length ? (
                <p className="srcline" style={{ marginTop: 12 }}>
                  {specs.length} researched{' '}
                  {specs.length === 1 ? 'specialty' : 'specialties'} in this app.{' '}
                  <Link to="/">Browse by interest →</Link>
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 40 }}>
        <GuardReserve />
      </div>
    </div>
  );
}
