/**
 * Non-endorsement disclaimer system.
 *
 * ASSET POLICY (master-prompt-v2.md) makes this a HARD DEPENDENCY: "Every page
 * rendering a service mark carries the non-endorsement disclaimer (model
 * language derived from 32 CFR 765.14)."
 *
 * 32 CFR 765.14 sets the safe-harbor standard: the disclaimer must be on the
 * same page as first use, prominent, and in letters at least half the size and
 * density of the insignia. `MarkDisclaimer` is what satisfies that; render it
 * on any page that shows an emblem or badge.
 */

export const SITE_DISCLAIMER =
  'This website is an independent informational and career-guidance resource. It is not affiliated with, endorsed by, or authorized by the U.S. Department of War, the Department of Homeland Security, or any branch of the U.S. Armed Forces (Army, Marine Corps, Navy, Air Force, Space Force, or Coast Guard). All service names, emblems, and insignia are the property of their respective services and are referenced here for informational and identification purposes only.';

export const PLACEHOLDER_NOTICE =
  'The emblems and badges shown on this site are original illustrations created for this project. They are NOT official U.S. military insignia and are not reproductions of any official seal, emblem, or badge.';

/** Short form, rendered at first insignia use on a page. Required by the policy. */
export function MarkDisclaimer() {
  return (
    <p className="mark-disclaimer">
      Emblems shown are <b>original illustrations, not official insignia</b>.
      Neither the U.S. Department of War nor any component of the U.S. Armed
      Forces has approved, endorsed, or authorized this site.
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
