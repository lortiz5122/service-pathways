import manifest from '../research/logo-manifest.json';
import { Emblem } from './Emblem';
import type { BranchId } from '../lib/types';

/**
 * Renders the official branch LOGO where a safe one exists, and falls back to
 * the original SVG emblem where one does not.
 *
 * Logos are MEDIUM risk under the asset policy: not copyrighted (17 U.S.C. §105
 * — works of federal employees) but trademark-protected, so informational use is
 * permitted with a prominent non-endorsement disclaimer and no commercial framing.
 *
 * SEALS ARE NEVER RENDERED. They are filtered out in sync-data.mjs at the build
 * boundary, so a seal file cannot physically reach this component.
 */

type LogoRecord = {
  slug: string;
  kind: 'branch' | 'component' | 'joint' | 'alt';
  label: string;
  src: string;
};

const LOGOS: LogoRecord[] = (manifest as { logos: LogoRecord[] }).logos;

const bySlug = new Map(LOGOS.map((l) => [l.slug, l]));

export const hasLogo = (slug: string) => bySlug.has(slug);

export const componentLogos = LOGOS.filter((l) => l.kind === 'component');

/** Branch identity: real logo if we have one, original SVG emblem otherwise. */
export function BranchLogo({
  branch,
  size = 64,
  title,
}: {
  branch: BranchId;
  size?: number;
  title?: string;
}) {
  const logo = bySlug.get(branch);

  if (!logo) {
    // No safe non-seal logo exists for this branch — fall back to original art.
    return <Emblem branch={branch} size={size} title={title} />;
  }

  return (
    <img
      className="logo"
      src={logo.src}
      alt={`${logo.label} logo`}
      /* Height-driven, width auto. These marks have wildly different aspect
         ratios — the Air Force Symbol is a wide wordmark lockup, the EGA is
         near-square. Forcing them all into a square box (and worse, a circular
         one) clipped the wide ones. Let the natural aspect ratio stand. */
      style={{ height: size, maxWidth: size * 2.3 }}
      loading="lazy"
      decoding="async"
    />
  );
}

/** Guard / Reserve component logos. */
export function ComponentLogo({
  slug,
  size = 56,
}: {
  slug: string;
  size?: number;
}) {
  const logo = bySlug.get(slug);
  if (!logo) return null;
  return (
    <img
      className="logo"
      src={logo.src}
      alt={`${logo.label} logo`}
      style={{ height: size, maxWidth: size * 2.3 }}
      loading="lazy"
      decoding="async"
    />
  );
}
