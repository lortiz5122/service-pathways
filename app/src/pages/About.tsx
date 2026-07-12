import { Link } from 'react-router-dom';
import { Feedback } from '../components/Feedback';
import { WhoMadeThis } from '../components/WhoMadeThis';
import { allSpecialties, clusters, specialtyFiles, taxonomy } from '../lib/data';
import { jobCounts } from '../lib/catalog';
import { Note, SectionHead, TickList } from '../components/Bits';

/**
 * About — the human page.
 *
 * Who made this, why, and what it will and won't do for you. This is the trust
 * page and it is IN THE NAV, because a reader deciding whether to believe any of
 * this deserves a straight answer about who is talking.
 *
 * The methodology register — every UNVERIFIED item, the asset-licensing posture,
 * the legal notices — lives at /methodology. That is a working document, not
 * something a sixteen-year-old needs in their top bar.
 */
export default function About() {
  const clusterUnverified = specialtyFiles.flatMap((f) => f.unverified ?? []);
  const unverifiedCount =
    clusterUnverified.length + (taxonomy.unverified?.length ?? 0);

  return (
    <div className="wrap">
      <WhoMadeThis />

      <SectionHead
        title="What this site does, and what it will not do"
        lede="Plainly, so you know what you are holding."
      />

      <div className="grid g2">
        <div className="card">
          <h3>What it does</h3>
          <TickList
            items={[
              'Starts from what you are interested in, not from a branch — because the same job often exists in four services, and picking the logo first locks you out of the better fit.',
              'Shows what a job ACTUALLY pays, including the parts other sources leave out: untaxed allowances, the real value of healthcare, special pays, and the housing allowance you do NOT get in the barracks.',
              'Tells you what the training does NOT qualify you for. A combat medic is not a paramedic. An MP is not a police officer. Nobody else says this out loud.',
              'Shows what you can do RIGHT NOW to enlist above E-1 — JROTC, Civil Air Patrol, Eagle Scout, college credits — and exactly what each is worth in dollars.',
              'States the 20-year retirement cliff plainly: the pension is all-or-nothing, and most people who enlist never reach it.',
            ]}
          />
        </div>

        <div className="card">
          <h3>What it will not do</h3>
          <TickList
            items={[
              'It will not sign you up. No account, nothing sent to a recruiter, ever. The feedback box below reaches me and nobody else.',
              'It will not tell you that one branch is better than another. They are different. The order things appear in on this site is deliberately rotated so no service is permanently listed first or last.',
              'It will not give you a score, a rank, or a "match percentage" for a job. A number next to a career reads as a grade, and nothing here supports grading them.',
              'It will not invent a figure. Where something could not be verified, it says UNVERIFIED — and there are ' + unverifiedCount + ' such items on record.',
              'It will not replace a recruiter, a contract, or your own judgement.',
            ]}
          />
        </div>
      </div>

      <SectionHead title="What is actually in here" />
      <div className="grid g3">
        <div className="card stat">
          <div className="n">{jobCounts.total}</div>
          <div className="l">Jobs listed</div>
          <div className="s">Across all six branches</div>
        </div>
        <div className="card stat">
          <div className="n">{allSpecialties.length}</div>
          <div className="l">Researched in depth</div>
          <div className="s">Full pay, pipeline, retirement, transition</div>
        </div>
        <div className="card stat">
          <div className="n">{clusters.length}</div>
          <div className="l">Interest areas</div>
          <div className="s">The way in, instead of by branch</div>
        </div>
      </div>

      <Note tone="warn">
        <div>
          <b>The honest limit.</b> {jobCounts.catalog} of the jobs listed are
          catalogued but not yet researched in depth — we have confirmed they exist
          and what they broadly do, but not their pay or pipeline. That is stated on
          every one of them rather than filled in with guesses.{' '}
          <Link to="/jobs">See every job →</Link>
        </div>
      </Note>

      <Note tone="alert">
        <div>
          <b>This is not advice, and it does not stay current on its own.</b> Policy
          across all six branches is in active flux — fitness tests, medical waivers,
          bonuses and pay all changed recently. Reconfirm anything here against the
          official source before it drives a decision about your life.
        </div>
      </Note>

      <p className="footlinks" style={{ marginTop: 22 }}>
        <Link to="/methodology">
          Methodology, sources, the full UNVERIFIED register &amp; legal notice →
        </Link>
      </p>
      <Feedback />
    </div>
  );
}
