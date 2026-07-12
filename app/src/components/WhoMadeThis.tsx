/**
 * Who made this, and why.
 *
 * This is not decoration and it is not a legal footnote. It is the single most
 * important thing on the site, because it answers the question a sixteen-year-old
 * and their parent are actually asking before they read a word of the rest:
 * "who is telling me this, and what do they want from me?"
 *
 * The answer — a veteran and a father who just did this for his own son, and who
 * is not trying to enlist anybody — is the reason any of the other content is
 * worth trusting. It goes near the top, not buried in a footer.
 */
export function WhoMadeThis({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`whomade${compact ? ' compact' : ''}`}>
      <div className="wm-tag">Who made this, and why</div>

      <p className="wm-lede">
        <b>This is not an official military recruitment site.</b> It is not
        affiliated with, endorsed by, or authorised by the Department of War, the
        Department of Homeland Security, or any branch of the U.S. Armed Forces.{' '}
        <b>Nobody here is trying to enlist you.</b> There is no form, no account, and
        nothing you do here is sent to a recruiter.
      </p>

      <p>
        It was put together by <b>a veteran and a father</b>, who recently sat down
        with his own son to work out which military careers were actually worth
        considering — and found that what a family genuinely needs to know is
        scattered across a hundred pages, buried in regulations, or written to sell
        you something.
      </p>

      <p>
        The things that mattered most were the hardest to find: what a job{' '}
        <b>actually pays</b> once you count the parts nobody mentions, what it{' '}
        <b>does and does not qualify you for</b> when you get out, what you can do{' '}
        <b>right now</b> to walk in at a higher rank, and{' '}
        <b>what it will cost you</b>. So this is the reference we wished had existed
        when we started.
      </p>

      <p className="wm-honest">
        Every figure here carries its source and the date it was retrieved. Where
        something could not be verified, it says so plainly instead of guessing —
        and there is a lot of that, because military policy changes constantly and
        no website can outrun it. <b>Real care has gone into getting this right</b>,
        and it will still contain mistakes.
      </p>

      <p className="wm-final">
        So use it the way it is meant to be used: as a place to get your bearings and
        to learn which questions to ask. Then confirm anything that will drive a real
        decision against the official source or a recruiter — and{' '}
        <b>get every promise in writing, in your contract, before you sign.</b>
      </p>
    </section>
  );
}
