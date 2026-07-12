import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { clusters, specialtiesForCluster, branchIdOf } from '../lib/data';
import { PRIORITIES, recommend, type Priority } from '../lib/recommend';
import { entryLevelJobs } from '../lib/catalog';
import { EntryLevelList } from '../components/EntryLevelList';
import { afqtCategory } from '../data/content';
import type { Tier } from '../data/eligibility';
import { BranchLogo } from '../branding/Logo';
import { BRANCH_THEME } from '../lib/types';
import { Chip, Note, SectionHead } from '../components/Bits';
import { MarkDisclaimer } from '../components/Disclaimer';
import { SpecialtyModal } from '../components/SpecialtyModal';
import { ScoreCard } from '../components/ScoreCard';
import { useProfile } from '../lib/profile';
import { shortLineScore } from '../lib/format';
import { entryPath } from '../lib/entry';
import type { SpecialtyRecord } from '../lib/types';

const STEPS = ['Interests', 'Your scores', 'What matters', 'Matches'];

export default function Explore() {
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const { profile } = useProfile();
  const [afqt, setAfqt] = useState(50);
  const [tier, setTier] = useState<Tier>('diploma');

  // If they already saved a score, use it rather than making them re-enter it.
  useEffect(() => {
    if (profile.afqt !== null) setAfqt(profile.afqt);
    setTier(profile.tier);
  }, [profile.afqt, profile.tier]);
  // Opening a match must not cost the reader their place in the results.
  const [openSpec, setOpenSpec] = useState<SpecialtyRecord | null>(null);

  const [showAllDeep, setShowAllDeep] = useState(false);

  // Every entry-level job in the chosen areas — not just the deeply-researched
  // ones. A job the reader cannot see is, to them, a job that does not exist.
  const everyEntryLevel = useMemo(() => entryLevelJobs(interests), [interests]);

  const results = useMemo(
    () => recommend(interests, priorities, afqt, tier),
    [interests, priorities, afqt, tier],
  );

  const toggle = <T,>(arr: T[], v: T, set: (x: T[]) => void, max?: number) => {
    if (arr.includes(v)) set(arr.filter((x) => x !== v));
    else if (!max || arr.length < max) set([...arr, v]);
  };

  const cat = afqtCategory(afqt);
  const canAdvance =
    (step === 0 && interests.length > 0) || step === 1 || step === 2 || step === 3;

  return (
    <div className="wrap">
      <SectionHead
        title="Find what fits"
        lede="Four questions. It will show you what matches, why it matched, and — just as importantly — what each one costs you. Nothing here is a sales pitch."
      />

      {/* ------------------------------------------------------ stepper */}
      <ol className="stepper">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={i === step ? 'on' : i < step ? 'done' : ''}
            onClick={() => i < step && setStep(i)}
          >
            <span className="dot">{i < step ? '✓' : i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      {/* ---------------------------------------------- 1. interests */}
      {step === 0 && (
        <>
          <div className="card">
            <h3>What actually interests you?</h3>
            <p>
              Pick as many as you like. Start from what you're drawn to — not from
              a branch, and not from what sounds impressive.
            </p>
            <div className="pickgrid">
              {clusters.map((c) => {
                const on = interests.includes(c.id);
                const n = specialtiesForCluster(c.id).length;
                return (
                  <button
                    key={c.id}
                    className={`pick${on ? ' on' : ''}`}
                    onClick={() => toggle(interests, c.id, setInterests)}
                    aria-pressed={on}
                  >
                    <strong>{c.name}</strong>
                    <span>{c.description}</span>
                    <em>{n} specialties</em>
                  </button>
                );
              })}
            </div>
          </div>
          {interests.length === 0 ? (
            <Note>Pick at least one to continue.</Note>
          ) : null}
        </>
      )}

      {/* ------------------------------------------------ 2. scores */}
      {step === 1 && (
        <>
          <ScoreCard />
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Where are you on the ASVAB?</h3>
          <p>
            If you haven't taken it, take a free practice test and come back — a
            guess here produces a useless answer. This only affects{' '}
            <em>which branches</em> will take you, not which job you can hold.
          </p>

          <div className="calc" style={{ marginTop: 18 }}>
            <div>
              <div className="field">
                <label htmlFor="e-afqt">
                  AFQT percentile <b>{afqt}</b>
                </label>
                <input
                  id="e-afqt"
                  type="range"
                  min={1}
                  max={99}
                  value={afqt}
                  onChange={(e) => setAfqt(Number(e.target.value))}
                />
              </div>
              <div className="field">
                <label htmlFor="e-tier">Education</label>
                <select
                  id="e-tier"
                  value={tier}
                  onChange={(e) => setTier(e.target.value as Tier)}
                >
                  <option value="diploma">High school diploma</option>
                  <option value="ged">GED</option>
                </select>
              </div>
            </div>
            <div className="readout">
              <div className="big">{afqt}</div>
              <div className="cat">
                Category {cat?.cat} — {cat?.note}
              </div>
              <div className="formula">
                {afqt < 31
                  ? 'Below every branch minimum. This is fixable — study and retake.'
                  : afqt < 50
                    ? 'Clears the diploma minimum for most branches. 50+ opens all six and most jobs.'
                    : 'Clears all six branches.'}
              </div>
            </div>
          </div>

          <Note tone="warn">
            Your AFQT decides <b>whether</b> you can enlist. Separate line scores
            decide <b>which job</b> you can hold. A high AFQT guarantees you
            nothing on its own. <Link to="/prep">How the ASVAB really works →</Link>
          </Note>
        </div>
        </>
      )}

      {/* -------------------------------------------- 3. priorities */}
      {step === 2 && (
        <div className="card">
          <h3>What matters most to you?</h3>
          <p>
            Pick up to three. This changes which matches surface first — it does not
            score them, and it does not make any of them better.
          </p>
          <div className="pickgrid">
            {PRIORITIES.map((p) => {
              const on = priorities.includes(p.id);
              return (
                <button
                  key={p.id}
                  className={`pick${on ? ' on' : ''}`}
                  onClick={() => toggle(priorities, p.id, setPriorities, 3)}
                  aria-pressed={on}
                  disabled={!on && priorities.length >= 3}
                >
                  <strong>{p.label}</strong>
                  <span>{p.blurb}</span>
                </button>
              );
            })}
          </div>
          <Note>
            Skip this and you'll just get everything in your interest areas, which
            is a fine place to start.
          </Note>
        </div>
      )}

      {/* ---------------------------------------------- 4. results */}
      {step === 3 && (
        <>
          <MarkDisclaimer />
          <div className="section-head" style={{ marginTop: 8 }}>
            <h2>{results.length} matches</h2>
            <p>
              Every match shows why it appeared, and the things about it you would
              not hear from a recruiter.
            </p>
          </div>

          <Note tone="warn">
            <div>
              <b>These are not scored, ranked, or graded.</b> No branch is better
              than another and no job here is better than another job — they are
              different, and which one is right depends entirely on you. Each match
              simply shows <em>which of the things you asked for it actually has</em>,
              and which it does not. Read the checklist, not the position.
            </div>
          </Note>

          {results.length === 0 ? (
            <Note tone="warn">
              Nothing matched. Go back and widen your interests.
            </Note>
          ) : (
            <div className="stack">
              {(showAllDeep ? results : results.slice(0, 12)).map((r) => {
                const s = r.specialty;
                const b = branchIdOf(s);
                const t = b ? BRANCH_THEME[b] : undefined;
                const gate = shortLineScore(s.entry_requirements?.asvab_line_score);
                const ep = entryPath(s);
                return (
                  <div
                    key={s.id}
                    className="card rec"
                    style={
                      t
                        ? ({
                            '--bc': t.primary,
                            '--bc-accent': t.accent,
                          } as React.CSSProperties)
                        : undefined
                    }
                  >
                    <header className="rec-head">
                      {b ? <BranchLogo branch={b} size={42} /> : null}
                      <div style={{ flex: 1 }}>
                        <div className="spec-code">
                          {s.branch} · {s.code} · {s.track}
                        </div>
                        <h3>{s.name}</h3>
                      </div>
                      <div className="gates">
                        {/* An officer job must NEVER sit next to "your AFQT
                            qualifies you" — officers are commissioned, do not take
                            the ASVAB, and cannot be entered from high school. That
                            pairing was a lie made of two true statements. */}
                        {!ep.usesAsvab ? (
                          <Chip tone="alert">
                            {ep.kind === 'warrant'
                              ? 'Warrant Officer — not an enlistment'
                              : 'Officer — degree required'}
                          </Chip>
                        ) : r.branchGate === 'fail' ? (
                          <Chip tone="alert">AFQT below this branch</Chip>
                        ) : r.branchGate === 'conflict' ? (
                          <Chip tone="warn">AFQT borderline</Chip>
                        ) : r.branchGate === 'unknown' ? (
                          <Chip tone="warn">No published AFQT minimum</Chip>
                        ) : (
                          <Chip tone="ok">Your AFQT qualifies you to enlist</Chip>
                        )}
                        {ep.usesAsvab && gate ? (
                          <Chip tone="brand">Job needs {gate}</Chip>
                        ) : null}
                      </div>
                    </header>

                    {r.criteria.length ? (
                      <div className="rec-why">
                        <h4 className="minihead">
                          What you asked for — and what this has
                        </h4>
                        <ul className="critlist">
                          {r.criteria.map((c, j) => (
                            <li key={j} className={c.met ? 'yes' : 'no'}>
                              <span className="mark">{c.met ? '✓' : '✕'}</span>
                              {c.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {r.reasons.length ? (
                      <div className="rec-why">
                        <h4 className="minihead">Detail</h4>
                        <ul className="ticklist">
                          {r.reasons.map((x, j) => (
                            <li key={j}>{x}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {!ep.openToHighSchool ? (
                      <Note tone="alert">
                        <div>
                          <b>You cannot enter this from high school.</b> {ep.reality}
                        </div>
                      </Note>
                    ) : null}

                    {r.cautions.length ? (
                      <div className="rec-cost">
                        <h4 className="minihead">What it costs you</h4>
                        {r.cautions.map((x, j) => (
                          <p key={j}>{x}</p>
                        ))}
                      </div>
                    ) : null}

                    <div className="rec-actions">
                      <button
                        className="btn sm"
                        onClick={() => setOpenSpec(s)}
                      >
                        The job, the service &amp; bonuses
                      </button>
                      <Link to={`/specialty/${s.id}`} className="btn ghost sm">
                        Full record
                      </Link>
                    </div>
                  </div>
                );
              })}

              {results.length > 12 ? (
                <button
                  className="btn ghost"
                  onClick={() => setShowAllDeep((v) => !v)}
                >
                  {showAllDeep
                    ? 'Show fewer'
                    : `Show the other ${results.length - 12} researched matches`}
                </button>
              ) : null}
            </div>
          )}

          {/* Everything else you could actually enlist into. The recommender can
              only score the jobs we researched in depth — it needs pay, pipeline
              and injury data the catalogue entries do not carry. But a reader who
              is shown 12 jobs and not the other 700 has been quietly told the other
              700 do not exist. So they are all here, labelled honestly. */}
          <EntryLevelList jobs={everyEntryLevel} shownAbove={results.map((r) => r.specialty.id)} />

          <Note tone="alert">
            <div>
              <b>This is a starting point, not advice.</b> Nothing here is a
              prediction that you will get a given job. Jobs are assigned by needs
              of the service × your qualification × an open slot — and a recruiter's
              verbal promise is worth nothing unless it is written into your
              contract.
            </div>
          </Note>
        </>
      )}

      <SpecialtyModal
        specialty={openSpec}
        open={openSpec !== null}
        onClose={() => setOpenSpec(null)}
      />

      {/* ------------------------------------------------------ nav */}
      <div className="wizard-nav">
        <button
          className="btn ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </button>
        {step < 3 ? (
          <button
            className="btn"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance}
          >
            {step === 2 ? `See my matches` : 'Next'}
          </button>
        ) : (
          <button
            className="btn ghost"
            onClick={() => {
              setStep(0);
              setInterests([]);
              setPriorities([]);
            }}
          >
            Start over
          </button>
        )}
      </div>
    </div>
  );
}
