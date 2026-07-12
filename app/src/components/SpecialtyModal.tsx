import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from './Modal';
import { Chip, Note } from './Bits';
import { BranchLogo } from '../branding/Logo';
import { branchById, branchIdOf } from '../lib/data';
import { BRANCH_THEME, money, type SpecialtyRecord } from '../lib/types';
import { RECRUITERS, RECRUITER_TRUTH, ASVAB_OFFICIAL } from '../data/recruiters';
import { BONUS_SOURCE, bonusForSpecialty } from '../lib/bonuses';

type Tab = 'job' | 'service' | 'bonuses' | 'recruiter';

const TABS: { id: Tab; label: string }[] = [
  { id: 'job', label: 'The job' },
  { id: 'service', label: 'The service' },
  { id: 'bonuses', label: 'Bonuses' },
  { id: 'recruiter', label: 'Talk to a recruiter' },
];

function Bonuses({ s }: { s: SpecialtyRecord }) {
  const { branch, matched } = bonusForSpecialty(s);

  if (!branch || branch.max_bonus_usd === null) {
    return (
      <>
        <Note tone="warn">
          <div>
            <b>No enlistment-bonus data exists for {s.branch}.</b> Neither the
            official service page nor the secondary source published a figure. This
            is a genuine gap — it is not filled in with another branch's number.
          </div>
        </Note>
        <Note tone="alert">
          <div>
            <b>The only bonus that exists is the one in your contract.</b> Ask the
            recruiter directly, and get the figure written into the DD Form 4.
          </div>
        </Note>
      </>
    );
  }

  const official = branch.source_tier === 'OFFICIAL';

  return (
    <>
      {matched ? (
        <div className="bonus-hero">
          <div className="k">
            Named bonus for this specialty
            <Chip tone={official ? 'ok' : 'warn'}>
              {official ? 'Official source' : 'Secondary source'}
            </Chip>
          </div>
          <div className="n">{matched.display ?? money(matched.amount_usd ?? 0)}</div>
          <div className="s">
            <b>{matched.name}</b>
            {matched.conditions ? ` — ${matched.conditions}` : ''}
          </div>
        </div>
      ) : (
        <Note tone="warn">
          <div>
            <b>No bonus is published for this specific specialty.</b> The branch runs
            bonus programs (below), but neither source names a figure for{' '}
            {s.name}. Do not assume one exists — ask.
          </div>
        </Note>
      )}

      <div className="card" style={{ marginTop: 14 }}>
        <div className="k">{branch.name} — maximum advertised bonus</div>
        <div className="v" style={{ fontSize: 30 }}>
          {money(branch.max_bonus_usd)}
        </div>
        <p className="srcline">{branch.max_note}</p>

        <Note tone="alert">
          <div>
            <b>A maximum is not an offer.</b> That headline number is the ceiling
            for the single most in-demand specialty on the longest contract. It is
            not what a typical enlistee gets, and it is not what you will be
            offered.
          </div>
        </Note>

        {branch.conflict ? (
          <Note tone="warn">
            <div>
              <b>Sources disagree on this number.</b> {branch.conflict.note}
            </div>
          </Note>
        ) : null}

        {branch.accuracy_warning ? (
          <Note tone="warn">
            <div>
              <b>Accuracy warning.</b> {branch.accuracy_warning}
            </div>
          </Note>
        ) : null}

        {branch.no_per_afsc_figures ? (
          <Note tone="warn">{branch.no_per_afsc_figures}</Note>
        ) : null}
      </div>

      {branch.programs.length ? (
        <div className="card" style={{ marginTop: 12 }}>
          <h3>Every bonus program this branch publishes</h3>
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Up to</th>
                  <th>Conditions</th>
                </tr>
              </thead>
              <tbody>
                {branch.programs.map((p, i) => (
                  <tr key={i} className={matched?.name === p.name ? 'hit' : ''}>
                    <td>
                      <strong>{p.name}</strong>
                    </td>
                    <td>
                      {p.amount_usd !== null ? (
                        <strong>{money(p.amount_usd)}</strong>
                      ) : (
                        <span className="unverified">No figure published</span>
                      )}
                    </td>
                    <td>{p.conditions || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {branch.non_cash_incentives?.length ? (
        <div className="card" style={{ marginTop: 12 }}>
          <h3>Incentives that aren't cash</h3>
          <p>
            Often worth more than a bonus. An advanced paygrade compounds for your
            entire career.
          </p>
          <dl className="deflist">
            {branch.non_cash_incentives.map((n, i) => (
              <div key={i}>
                <dt>{n.name}</dt>
                <dd>{n.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      <Note tone="alert">
        <div>
          <b>The only bonus that exists is the one in your contract.</b> A figure on
          a recruiting site, on a forum, or on this page is not a promise. If it is
          not written into your DD Form 4 and its annexes before you sign, you will
          not get it. Bonuses are also normally paid in instalments after training,
          not as a lump sum at signing.
        </div>
      </Note>

      <p className="srcline">
        {official
          ? `Official source: ${branch.source_url} · retrieved 2026-07-12.`
          : `Secondary source: ${BONUS_SOURCE.publisher}, "${BONUS_SOURCE.title}", published ${BONUS_SOURCE.published_date} · retrieved 2026-07-12. Not primary-fetched from a .mil source.`}
      </p>
    </>
  );
}

export function SpecialtyModal({
  specialty,
  open,
  onClose,
}: {
  specialty: SpecialtyRecord | null;
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>('job');

  if (!specialty) return null;
  const s = specialty;
  const bid = branchIdOf(s);
  const theme = bid ? BRANCH_THEME[bid] : undefined;
  const profile = bid ? branchById(bid) : undefined;
  const rec = bid ? RECRUITERS[bid] : undefined;

  const pipeline = s.training_pipeline ?? [];
  const weeks = pipeline.reduce((n, st) => n + (Number(st.length_weeks) || 0), 0);

  return (
    <Modal open={open} onClose={onClose} labelledBy="spec-modal-title">
      <div
        style={
          theme
            ? ({
                '--brand': theme.primary,
                '--brand-accent': theme.accent,
              } as React.CSSProperties)
            : undefined
        }
      >
        <header className="modal-head">
          {bid ? <BranchLogo branch={bid} size={48} /> : null}
          <div>
            <div className="spec-code">
              {s.branch} · {s.code} · {s.track}
            </div>
            <h2 id="spec-modal-title">{s.name}</h2>
          </div>
        </header>

        <p className="mark-disclaimer" style={{ marginTop: 0 }}>
          Service logo shown for <b>identification only</b> — not an endorsement.
        </p>

        <nav className="modal-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`modal-tab${tab === t.id ? ' on' : ''}`}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="modal-body">
          {/* ------------------------------------------------ the job */}
          {tab === 'job' && (
            <>
              <div className="grid g3">
                <div className="card stat">
                  <div className="n">{s.pay_and_compensation?.paygrade_entry ?? '—'}</div>
                  <div className="l">Entry paygrade</div>
                </div>
                <div className="card stat">
                  <div className="n">{weeks || '—'}</div>
                  <div className="l">Weeks of training</div>
                </div>
                <div className="card stat">
                  <div className="n">
                    {money(s.pay_and_compensation?.base_pay_monthly_usd)}
                  </div>
                  <div className="l">Base pay / month</div>
                </div>
              </div>

              <h3 className="minihead" style={{ marginTop: 18 }}>
                What it takes to get in
              </h3>
              <dl className="deflist">
                <div>
                  <dt>ASVAB</dt>
                  <dd>{s.entry_requirements?.asvab_line_score ?? 'Not published'}</dd>
                </div>
                <div>
                  <dt>Clearance</dt>
                  <dd>
                    {s.entry_requirements?.security_clearance ?? 'None specified'}
                  </dd>
                </div>
                <div>
                  <dt>Education</dt>
                  <dd>{s.entry_requirements?.education ?? 'Not published'}</dd>
                </div>
                <div>
                  <dt>Physical</dt>
                  <dd>{s.entry_requirements?.physical ?? 'Not published'}</dd>
                </div>
              </dl>

              {pipeline.length ? (
                <>
                  <h3 className="minihead" style={{ marginTop: 18 }}>
                    Training pipeline
                  </h3>
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
                </>
              ) : null}

              {s.civilian_crosswalk?.credential_gap_note ? (
                <Note tone="alert">
                  <div>
                    <b>What this does NOT give you.</b>{' '}
                    {s.civilian_crosswalk.credential_gap_note}
                  </div>
                </Note>
              ) : null}

              <Link to={`/specialty/${s.id}`} className="btn" style={{ marginTop: 14, display: 'inline-block', textDecoration: 'none' }}>
                Full record — pay, retirement, transition
              </Link>
            </>
          )}

          {/* -------------------------------------------- the service */}
          {tab === 'service' && profile && (
            <>
              <div className="card">
                <h3>{profile.name}</h3>
                <div className="spec-code" style={{ marginBottom: 10 }}>
                  {profile.department}
                </div>
                <p>{profile.mission}</p>
                <p style={{ marginTop: 10, color: 'var(--ink-3)' }}>
                  {profile.culture}
                </p>
              </div>

              <div className="grid g2" style={{ marginTop: 12 }}>
                <div className="card">
                  <h3>Basic training</h3>
                  <p>
                    <strong>{profile.basic_training?.name}</strong>
                    <br />
                    {profile.basic_training?.location} ·{' '}
                    {profile.basic_training?.length_weeks} weeks
                  </p>
                  <p style={{ marginTop: 8 }}>{profile.basic_training?.notes}</p>
                </div>
                <div className="card">
                  <h3>Who they take</h3>
                  <p>{profile.general_eligibility?.age_range}</p>
                  <p style={{ marginTop: 6 }}>
                    {profile.general_eligibility?.citizenship}
                  </p>
                  <p style={{ marginTop: 6 }}>
                    {profile.general_eligibility?.education}
                  </p>
                </div>
              </div>

              {profile.structural_notes ? (
                <Note tone="warn">
                  <div>
                    <b>Structurally different.</b> {profile.structural_notes}
                  </div>
                </Note>
              ) : null}

              <Link to="/branches" className="inline-link">
                Compare all six branches →
              </Link>
            </>
          )}

          {/* ----------------------------------------------- bonuses */}
          {tab === 'bonuses' && <Bonuses s={s} />}

          {/* --------------------------------------------- recruiter */}
          {tab === 'recruiter' && rec && (
            <>
              <div className="card">
                <h3>Before you make contact</h3>
                <p>
                  A recruiter's job performance is measured in accessions. That does
                  not make them dishonest — it does mean their interests and yours
                  are not identical. Go in knowing what they can and cannot do.
                </p>

                <h4 className="minihead" style={{ marginTop: 16 }}>
                  What a recruiter can do
                </h4>
                <ul className="ticklist">
                  {RECRUITER_TRUTH.can.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>

                <div className="rec-cost" style={{ marginTop: 16 }}>
                  <h4 className="minihead">What a recruiter cannot do</h4>
                  {RECRUITER_TRUTH.cannot.map((x, i) => (
                    <p key={i}>{x}</p>
                  ))}
                </div>
              </div>

              <div className="card handoff" style={{ marginTop: 12 }}>
                <div className="handoff-head">
                  {bid ? <BranchLogo branch={bid} size={40} /> : null}
                  <div>
                    <h3>{profile?.name ?? s.branch}</h3>
                    <div className="spec-code">Official recruiting site</div>
                  </div>
                </div>
                <p style={{ marginTop: 10 }}>{rec.note}</p>
                <a
                  className="btn"
                  href={rec.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{ marginTop: 14, display: 'inline-block', textDecoration: 'none' }}
                >
                  Go to {rec.name} ↗
                </a>
                <p className="srcline" style={{ marginTop: 10 }}>
                  This is the branch's own recruiting site. It is marketing, and it
                  is not this site. We do not collect your details and we are not a
                  lead generator.
                </p>
              </div>

              <div className="card" style={{ marginTop: 12 }}>
                <h3>Do this first</h3>
                <p>
                  Take a free full-length practice ASVAB before you talk to anyone. A
                  baseline AFQT changes the entire conversation, and it is the single
                  cheapest thing you can do to improve your options.
                </p>
                <a
                  className="inline-link"
                  href={ASVAB_OFFICIAL.url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {ASVAB_OFFICIAL.name} — official practice materials ↗
                </a>
              </div>

              <Note tone="alert">
                <div>
                  <b>Get every guarantee in writing.</b> Job, bonus, training seat,
                  ship date — into the DD Form 4 and its annexes, before you sign. A
                  verbal promise is unenforceable. If your qualified job is not
                  available in your window, the Delayed Entry Program is preferable
                  to accepting an open-needs contract you do not want.
                </div>
              </Note>
            </>
          )}
        </div>

        <footer className="modal-foot">
          <Chip tone="brand">{s.branch}</Chip>
          <button className="btn ghost" onClick={onClose}>
            Back to results
          </button>
        </footer>
      </div>
    </Modal>
  );
}
