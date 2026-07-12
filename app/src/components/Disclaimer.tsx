/**
 * Non-endorsement disclaimer system.
 *
 * ASSET POLICY (master-prompt-v2.md) makes this a HARD DEPENDENCY: "Every page
 * rendering a service mark carries the non-endorsement disclaimer (model
 * language derived from 32 CFR 765.14)."
 *
 * 32 CFR 765.14 sets the safe-harbor standard: the disclaimer must be on the
 * same page as first use, prominent, and in letters at least half the size and
 * density of the insignia. `MarkDisclaimer` satisfies that; render it on any
 * page that shows a service mark.
 *
 * Posture: branch LOGOS/EMBLEMS are MEDIUM risk — not copyrighted (17 U.S.C.
 * §105, works of federal employees) but trademark-protected, so informational
 * use is permitted with this disclaimer and no commercial framing.
 *
 * Branch SEALS are HIGH risk and are NEVER rendered. That is enforced in
 * sync-data.mjs, which filters any filename matching /seal/i at the build
 * boundary — a seal cannot physically reach the bundle.
 */

export const SITE_DISCLAIMER =
  'THIS IS NOT AN OFFICIAL MILITARY RECRUITMENT SITE. It is an independent informational and career-guidance resource, compiled by a veteran and father who recently helped his own son navigate military specialty careers. It is not affiliated with, endorsed by, or authorized by the U.S. Department of War, the Department of Homeland Security, or any branch of the U.S. Armed Forces (Army, Marine Corps, Navy, Air Force, Space Force, or Coast Guard). Nobody here is trying to enlist you: there is no sign-up, no account, and nothing you do here is sent to a recruiter or to any branch of the military. The one form on this site is an optional feedback and contact box on the About page; it goes to the person who built the site and nowhere else. Every effort has been made to keep this information accurate and sourced — but policy changes constantly, this site will contain errors, and anything that will drive a real decision should be confirmed against the official source. Get every promise in writing, in your contract, before you sign. All service names, emblems, logos, and insignia are the property of their respective services and are reproduced here for informational and identification purposes only. No branch seal is used anywhere on this site.';

export const PLACEHOLDER_NOTICE =
  'Where no official non-seal logo could be sourced for a service or component, an original illustration created for this project is shown in its place. Those illustrations are not official insignia and are not reproductions of any official seal, emblem, or badge. Career-specialty badges shown are likewise original illustrations — no official downloadable specialty-badge set exists.';

/** Short form, rendered at first mark use on a page. Required by the policy. */
export function MarkDisclaimer() {
  return (
    <p className="mark-disclaimer">
      Service logos are shown for <b>identification only</b>. Neither the U.S.
      Department of War, the Department of Homeland Security, nor any branch of
      the U.S. Armed Forces has approved, endorsed, or authorized this site. No
      branch seal is used. Where no official logo could be sourced, an{' '}
      <b>original illustration — not official insignia</b> — is shown instead.
    </p>
  );
}

export function SiteDisclaimer() {
  return (
    <div className="disclaimer">
      <h4>Legal notice</h4>
      <p>{SITE_DISCLAIMER}</p>
      <p style={{ marginTop: 10 }}>{PLACEHOLDER_NOTICE}</p>
    </div>
  );
}
