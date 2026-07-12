import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Job } from '../lib/catalog';
import { BranchLogo } from '../branding/Logo';
import { branchOrder, BRANCH_THEME, type BranchId } from '../lib/types';
import { shortCode, shortLineScore } from '../lib/format';
import { Chip } from './Bits';

/**
 * Every entry-level job in the areas the reader picked.
 *
 * The recommender can only score the specialties we researched in depth — it needs
 * pay, pipeline and injury data that a catalogue entry simply does not carry, and
 * inventing that data to make a job scoreable would be a lie dressed as a match.
 *
 * But a reader shown twelve jobs and not the other seven hundred has been quietly
 * told the other seven hundred do not exist. That is the same silent-absence
 * failure as any other, and at the worst possible moment: the moment they are
 * deciding.
 *
 * So every entry-level job is here. The deeply-researched ones link to a full
 * record. The rest say, in as many words, that we have confirmed the job exists and
 * nothing more. An honest gap beats a fabricated match.
 */
export function EntryLevelList({
  jobs,
  shownAbove,
}: {
  jobs: Job[];
  shownAbove: string[];
}) {
  const [open, setOpen] = useState(false);
  const above = useMemo(() => new Set(shownAbove), [shownAbove]);

  const byBranch = useMemo(() => {
    const m = new Map<BranchId, Job[]>();
    for (const j of jobs) {
      if (!j.branchId) continue;
      m.set(j.branchId, [...(m.get(j.branchId) ?? []), j]);
    }
    return m;
  }, [jobs]);

  if (!jobs.length) return null;

  const order = branchOrder().filter((b) => byBranch.has(b));

  return (
    <section className="card entrylevel">
      <header className="el-head">
        <div>
          <h3>Every entry-level job in the areas you picked</h3>
          <p>
            All <b>{jobs.length}</b> of them, across{' '}
            {order.length === 1 ? 'one branch' : `${order.length} branches`}. These
            are <b>enlisted</b> jobs — the ones you can walk into without a degree
            and without a commission. Officer and warrant routes exist for a lot of
            this work too, but they are not entry level, and this site will not blur
            the two.
          </p>
        </div>
        <button className="btn" onClick={() => setOpen((v) => !v)}>
          {open ? 'Hide the list' : `Show all ${jobs.length}`}
        </button>
      </header>

      {open ? (
        <>
          <p className="el-note">
            The ones marked <b>Full record</b> are researched in depth — pay,
            training pipeline, retirement, transition, and what the training does{' '}
            <em>not</em> qualify you for. The rest are <b>catalogued</b>: we have
            confirmed the job exists and what it broadly does, and we have{' '}
            <b>not</b> researched the rest. Those sections are missing rather than
            invented.
          </p>

          {order.map((b) => {
            const t = BRANCH_THEME[b];
            const list = byBranch.get(b) ?? [];
            return (
              <div key={b} className="el-branch">
                <header className="el-branch-head">
                  <BranchLogo branch={b} size={30} />
                  <h4>{t.name}</h4>
                  <span className="jobcount">{list.length}</span>
                </header>

                <div className="joblist">
                  {list.map((j) => {
                    const code = shortCode(j.code);
                    const gate = shortLineScore(j.asvab);
                    const deep = j.depth === 'deep';
                    const inner = (
                      <>
                        <span className={`job-code${code ? '' : ' unknown'}`}>
                          {code ?? 'no code'}
                        </span>
                        <span className="job-name">{j.name}</span>
                        <span className="job-tags">
                          {above.has(j.id) ? (
                            <Chip tone="ok">Matched above</Chip>
                          ) : null}
                          {gate ? <Chip tone="brand">{gate}</Chip> : null}
                          {j.notOpenYet ? (
                            <Chip tone="warn">Not open yet</Chip>
                          ) : null}
                          {deep ? (
                            <Chip tone="ok">Full record</Chip>
                          ) : (
                            <Chip>Catalogue only</Chip>
                          )}
                        </span>
                      </>
                    );
                    return deep ? (
                      <Link
                        key={j.id}
                        to={`/specialty/${j.id}`}
                        className="jobrow deep"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div
                        key={j.id}
                        className="jobrow"
                        title={j.notOpenYet ?? j.what ?? undefined}
                      >
                        {inner}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </section>
  );
}
