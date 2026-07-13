import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { allJobs, jobCounts, searchJobs, type Job } from '../lib/catalog';
import { clusters } from '../lib/data';
import { BranchLogo } from '../branding/Logo';
import { branchOrder, BRANCH_THEME, type BranchId } from '../lib/types';
import { shortClearance, shortCode, shortLineScore } from '../lib/format';
import { entryLevelReason } from '../lib/entrylevel';
import { Chip, Note, SectionHead } from '../components/Bits';
import { MarkDisclaimer } from '../components/Disclaimer';

/**
 * Every job, searchable.
 *
 * The site holds deep records for a fraction of the ~600 military specialties.
 * A job that is simply absent, with no explanation, reads as a job that does not
 * exist — the same silent-absence failure the site fixes everywhere else, just at
 * a bigger scale. So every job is listed. The ones we researched in depth link to
 * a full record; the rest are labelled honestly as catalogue entries and carry
 * only what is actually known about them. Nothing is invented to fill a gap.
 */
export default function Jobs() {
  const [q, setQ] = useState('');
  const [branch, setBranch] = useState<BranchId | 'all'>('all');
  const [cluster, setCluster] = useState<string>('all');

  const results = useMemo(
    () => searchJobs(q, { branch, cluster }),
    [q, branch, cluster],
  );

  const byBranch = useMemo(() => {
    const m = new Map<BranchId, Job[]>();
    for (const j of results) {
      if (!j.branchId) continue;
      m.set(j.branchId, [...(m.get(j.branchId) ?? []), j]);
    }
    return m;
  }, [results]);

  const order = branchOrder();

  return (
    <div className="wrap">
      <SectionHead
        title="Every job"
        lede={`All ${jobCounts.total} specialties across the six branches. ${jobCounts.deep} are researched in depth — pay, training pipeline, retirement, transition, and what the training does NOT qualify you for. The rest are catalogued so you can at least find them, and they are labelled as such rather than padded with invented figures.`}
      />
      <MarkDisclaimer />

      {/* ------------------------------------------------------ search */}
      <div className="card jobsearch">
        <div className="field">
          <label htmlFor="q">Search by job title, code, or what it does</label>
          <input
            id="q"
            className="searchbox"
            type="search"
            placeholder="e.g. medic, cyber, 11B, mechanic, rescue…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="jobfilters">
          <div className="field">
            <label htmlFor="fb">Branch</label>
            <select
              id="fb"
              value={branch}
              onChange={(e) => setBranch(e.target.value as BranchId | 'all')}
            >
              <option value="all">All six branches</option>
              {order.map((b) => (
                <option key={b} value={b}>
                  {BRANCH_THEME[b].name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="fc">Interest area</label>
            <select
              id="fc"
              value={cluster}
              onChange={(e) => setCluster(e.target.value)}
            >
              <option value="all">Any interest</option>
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="srcline">
          {results.length === allJobs.length
            ? `Showing all ${results.length} jobs.`
            : `${results.length} of ${allJobs.length} jobs match.`}
        </p>
      </div>

      {results.length === 0 ? (
        <Note tone="warn">
          Nothing matched. Try a broader term, or clear the filters.
        </Note>
      ) : null}

      {/* ----------------------------------------------------- results */}
      {order
        .filter((b) => byBranch.has(b))
        .map((b) => {
          const t = BRANCH_THEME[b];
          const list = byBranch.get(b) ?? [];
          if (!list.length) return null;
          const deep = list.filter((j) => j.depth === 'deep');
          const cat = list.filter((j) => j.depth === 'catalog');

          return (
            <div key={b} className="jobbranch">
              <header className="jobbranch-head">
                <BranchLogo branch={b} size={40} />
                <h3>{t.name}</h3>
                <span className="jobcount">
                  {list.length} {list.length === 1 ? 'job' : 'jobs'}
                </span>
              </header>

              {deep.length ? (
                <>
                  <h4 className="minihead">Researched in depth</h4>
                  <div className="joblist">
                    {deep.map((j) => (
                      <JobRow key={j.id} job={j} />
                    ))}
                  </div>
                </>
              ) : null}

              {cat.length ? (
                <>
                  <h4 className="minihead" style={{ marginTop: 16 }}>
                    Catalogued — not yet researched in depth
                  </h4>
                  <div className="joblist">
                    {cat.map((j) => (
                      <JobRow key={j.id} job={j} />
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          );
        })}

      <Note tone="warn">
        <div>
          <b>What "catalogued" means, honestly.</b> It means we have confirmed the job
          exists and what it broadly does, but we have <b>not</b> researched its pay,
          training pipeline, retirement, transition or civilian crosswalk. Those
          sections are <b>absent rather than invented</b>. If you are seriously
          considering one of them, ask a recruiter directly — and treat anything you
          are told the same way this site treats everything: get it in writing.
        </div>
      </Note>
    </div>
  );
}

function JobRow({ job }: { job: Job }) {
  const gate = shortLineScore(job.asvab);
  const clr = shortClearance(job.clearance);
  const deep = job.depth === 'deep';

  // NEVER render job.code raw. Several records carry a whole prose paragraph in
  // the code field ("UNVERIFIED — the official crosswalk PDF returned 403…").
  // shortCode() extracts a real code or returns null; a job with no known code
  // says so in two characters instead of dumping an essay into a 60px slot.
  const code = shortCode(job.code);

  // Real job, real career — but you cannot enlist into it off the street. Say so
  // where the reader is looking, not in a footnote.
  const closed = entryLevelReason(job.id);

  const inner = (
    <>
      <span className={`job-code${code ? '' : ' unknown'}`}>{code ?? 'no code'}</span>
      <span className="job-name">{job.name}</span>
      <span className="job-tags">
        {gate ? <Chip tone="brand">{gate}</Chip> : null}
        {clr ? <Chip tone="warn">{clr}</Chip> : null}
        {job.track === 'officer' ? <Chip tone="alert">Officer</Chip> : null}
        {job.notOpenYet ? <Chip tone="warn">Not open yet</Chip> : null}
        {closed ? <Chip tone="alert">In-service only</Chip> : null}
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
      to={`/specialty/${job.id}`}
      className="jobrow deep"
      title={closed ?? undefined}
    >
      {inner}
    </Link>
  ) : (
    <div className="jobrow" title={closed ?? job.notOpenYet ?? job.what ?? undefined}>
      {inner}
    </div>
  );
}
