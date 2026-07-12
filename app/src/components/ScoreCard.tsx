import { useState } from 'react';
import { OFFICIAL_PRACTICE, PRACTICE_TEST, useProfile } from '../lib/profile';
import { afqtCategory } from '../data/content';
import { evaluate, type Tier } from '../data/eligibility';
import { BranchLogo } from '../branding/Logo';
import { BRANCH_THEME, sortByBranchOrder } from '../lib/types';
import { Note } from './Bits';

/**
 * Take a practice test, come back, save your score.
 *
 * The single most useful thing a 16-year-old can do before speaking to anyone is
 * find out their real AFQT. It costs nothing and it changes the entire
 * conversation. This makes that a two-click loop, and remembers the answer.
 */
export function ScoreCard({ compact = false }: { compact?: boolean }) {
  const { profile, save, clear } = useProfile();
  const [draft, setDraft] = useState<number>(profile.afqt ?? 50);
  const [editing, setEditing] = useState(false);

  const has = profile.afqt !== null;
  const cat = has ? afqtCategory(profile.afqt!) : null;
  const results = has ? evaluate(profile.afqt!, profile.tier) : [];
  const clears = results.filter((r) => r.verdict === 'pass').length;

  return (
    <div className="scorecard">
      <div className="scorecard-head">
        <div>
          <h3>Your ASVAB score</h3>
          <p className="srcline">
            Saved on this device only. Nothing is sent anywhere, and there is no
            account.
          </p>
        </div>
        {has && !editing ? (
          <div className="score-badge">
            <div className="n">{profile.afqt}</div>
            <div className="c">Cat {cat?.cat}</div>
          </div>
        ) : null}
      </div>

      {!has || editing ? (
        <>
          <div className="score-entry">
            <div className="field" style={{ flex: 1, minWidth: 220 }}>
              <label htmlFor="sc-afqt">
                Your AFQT percentile <b>{draft}</b>
              </label>
              <input
                id="sc-afqt"
                type="range"
                min={1}
                max={99}
                value={draft}
                onChange={(e) => setDraft(Number(e.target.value))}
              />
            </div>
            <div className="field" style={{ minWidth: 190 }}>
              <label htmlFor="sc-tier">Education</label>
              <select
                id="sc-tier"
                value={profile.tier}
                onChange={(e) => save({ tier: e.target.value as Tier })}
              >
                <option value="diploma">High school diploma</option>
                <option value="ged">GED</option>
              </select>
            </div>
            <button
              className="btn"
              onClick={() => {
                save({ afqt: draft, practiceTaken: true });
                setEditing(false);
              }}
            >
              Save my score
            </button>
          </div>

          <Note tone="warn">
            <div>
              <b>Don't guess.</b> A made-up number here produces a useless answer.
              Take a free practice test first — it takes under an hour and it is the
              cheapest thing you will ever do to improve your options.
            </div>
          </Note>
        </>
      ) : (
        <>
          <div className="score-summary">
            <p>
              <b>
                Category {cat?.cat} — {cat?.note}
              </b>
            </p>
            <div className="score-branches">
              {sortByBranchOrder(results, (r) => r.branch).map((r) => {
                const t = BRANCH_THEME[r.branch];
                const cls =
                  r.verdict === 'pass'
                    ? 'pass'
                    : r.verdict === 'fail'
                      ? 'fail'
                      : 'unknown';
                return (
                  <div key={r.branch} className={`score-branch ${cls}`} title={r.detail}>
                    <BranchLogo branch={r.branch} size={26} />
                    <span>{t.short}</span>
                    <em>{r.label}</em>
                  </div>
                );
              })}
            </div>
            <p className="srcline">
              You clear {clears} of 6 branches at this score. Saved{' '}
              {profile.savedAt ? new Date(profile.savedAt).toLocaleDateString() : ''}.
            </p>
          </div>

          {profile.afqt! < 50 ? (
            <Note tone="warn">
              <div>
                <b>A 50 opens all six branches and most jobs.</b> You are{' '}
                {50 - profile.afqt!} points away. That gap is closable with a few
                weeks of focused study on the four AFQT subtests — Arithmetic
                Reasoning, Mathematics Knowledge, Word Knowledge and Paragraph
                Comprehension. Nothing else on this site will move your options as
                much as that will.
              </div>
            </Note>
          ) : null}

          <div className="score-actions">
            <button
              className="btn ghost sm"
              onClick={() => {
                setDraft(profile.afqt!);
                setEditing(true);
              }}
            >
              Update my score
            </button>
            <button className="btn ghost sm" onClick={clear}>
              Forget it
            </button>
          </div>
        </>
      )}

      {!compact ? (
        <div className="practice">
          <h4 className="minihead">Take a practice test</h4>
          <div className="practice-links">
            <a
              className="practice-link"
              href={PRACTICE_TEST.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <strong>{PRACTICE_TEST.name} ↗</strong>
              <span>{PRACTICE_TEST.note}</span>
            </a>
            <a
              className="practice-link"
              href={OFFICIAL_PRACTICE.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <strong>{OFFICIAL_PRACTICE.name} ↗</strong>
              <span>{OFFICIAL_PRACTICE.note}</span>
            </a>
          </div>
          <p className="srcline">
            Come back and enter your score — this site will remember it and use it
            everywhere.
          </p>
        </div>
      ) : null}
    </div>
  );
}
