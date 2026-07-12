import type { ReactElement } from 'react';

/**
 * Original career-specialty badges. Like the branch emblems, these are authored
 * from scratch in the heraldic idiom of U.S. occupational insignia (shields,
 * wings, wreaths, crossed arms) rather than copied from official artwork.
 *
 * They are NOT official badges. The asset research confirmed no official
 * downloadable specialty-badge set exists (every .mil asset URL tested returned
 * 403), which is why every SpecialtyRecord carries specialty_badge_id: null.
 *
 * Badges are attached to interest clusters only where the art genuinely fits
 * the work. Clusters with no matching badge render none — art is not forced on.
 */

export type BadgeId =
  | 'infantry'
  | 'intel'
  | 'satcom'
  | 'pararescue'
  | 'cyber'
  | 'nuclear'
  | 'specialforces'
  | 'combatarms';

export const CLUSTER_BADGE: Record<string, BadgeId> = {
  'technology-cyber': 'cyber',
  'intelligence-analysis': 'intel',
  'combat-arms': 'infantry',
  'space-satellite': 'satcom',
  'maritime-nautical': 'nuclear',
  aviation: 'pararescue',
};

type Props = {
  badge: BadgeId;
  size?: number;
  title?: string;
};

export function Badge({ badge, size = 56, title }: Props) {
  return (
    <svg
      className="badge"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={title ?? `${badge} badge`}
    >
      {marks[badge]}
    </svg>
  );
}

const SILVER = '#C9D3DB';
const SILVER_DK = '#7D8B98';
const GOLD = '#D9B45B';

/** Outstretched wings used by the flight-qualified badges. */
function wings(fill: string, stroke: string) {
  return (
    <g>
      <path
        d="M46 50 C34 44 20 44 6 52 c14 2 24 5 32 10 z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
      />
      <path
        d="M54 50 C66 44 80 44 94 52 c-14 2-24 5-32 10 z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
      />
      <path
        d="M42 58 C32 56 22 58 12 64 c10 0 18 1 26 4 z"
        fill={stroke}
        opacity=".55"
      />
      <path
        d="M58 58 C68 56 78 58 88 64 c-10 0-18 1-26 4 z"
        fill={stroke}
        opacity=".55"
      />
    </g>
  );
}

/** Laurel half-wreath used under the technical badges. */
function wreath(stroke: string) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="2" opacity=".85">
      <path d="M26 62 C24 76 34 86 50 90" />
      <path d="M74 62 C76 76 66 86 50 90" />
      <path d="M27 68 l-6 -3 M29 75 l-6 -2 M33 82 l-6 -1" />
      <path d="M73 68 l6 -3 M71 75 l6 -2 M67 82 l6 -1" />
    </g>
  );
}

const marks: Record<BadgeId, ReactElement> = {
  /* Crossed rifles on a bar — infantry. */
  infantry: (
    <g>
      <rect x="8" y="34" width="84" height="32" rx="5" fill="#1d3a5c" />
      <rect
        x="8"
        y="34"
        width="84"
        height="32"
        rx="5"
        fill="none"
        stroke={SILVER}
        strokeWidth="2"
      />
      <g stroke={SILVER} strokeWidth="3.2" strokeLinecap="round">
        <path d="M22 62 L70 38" />
        <path d="M30 38 L78 62" />
      </g>
      <g fill={SILVER}>
        <rect x="18" y="58" width="9" height="6" rx="2" />
        <rect x="73" y="58" width="9" height="6" rx="2" />
      </g>
      <circle cx="50" cy="50" r="4" fill={SILVER} />
    </g>
  ),

  /* Eye over a key — intelligence analyst. */
  intel: (
    <g>
      <path
        d="M50 6 L86 20 v30 c0 22-16 36-36 44 C30 86 14 72 14 50 V20 Z"
        fill="#12243d"
        stroke={GOLD}
        strokeWidth="2"
      />
      <ellipse
        cx="50"
        cy="40"
        rx="22"
        ry="13"
        fill="none"
        stroke={GOLD}
        strokeWidth="2.4"
      />
      <circle cx="50" cy="40" r="7" fill={GOLD} />
      <circle cx="50" cy="40" r="2.6" fill="#12243d" />
      {/* key shaft */}
      <rect x="48" y="56" width="4" height="22" rx="2" fill={GOLD} />
      <rect x="52" y="70" width="7" height="3.4" fill={GOLD} />
      <rect x="52" y="76" width="5" height="3.4" fill={GOLD} />
    </g>
  ),

  /* Dish with signal arcs — satellite communications. */
  satcom: (
    <g>
      <circle cx="50" cy="50" r="44" fill="#0f2f45" />
      <circle
        cx="50"
        cy="50"
        r="41"
        fill="none"
        stroke={SILVER}
        strokeWidth="1.6"
        opacity=".7"
      />
      <g
        fill="none"
        stroke={SILVER}
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".9"
      >
        <path d="M60 34 a20 20 0 0 1 14 14" />
        <path d="M58 24 a30 30 0 0 1 22 22" />
      </g>
      {/* dish */}
      <ellipse
        cx="42"
        cy="54"
        rx="20"
        ry="13"
        fill={SILVER}
        transform="rotate(-30 42 54)"
      />
      <ellipse
        cx="42"
        cy="54"
        rx="12"
        ry="7"
        fill="#0f2f45"
        transform="rotate(-30 42 54)"
        opacity=".55"
      />
      <rect x="40" y="60" width="4" height="20" rx="2" fill={SILVER_DK} />
      <rect x="30" y="78" width="24" height="4" rx="2" fill={SILVER_DK} />
    </g>
  ),

  /* Winged parachute canopy — pararescue. */
  pararescue: (
    <g>
      {wings(SILVER, SILVER_DK)}
      {/* canopy */}
      <path
        d="M28 46 a22 22 0 0 1 44 0 z"
        fill={GOLD}
        stroke="#8a6d2a"
        strokeWidth="1"
      />
      <g stroke="#8a6d2a" strokeWidth="1" opacity=".7">
        <path d="M43 46 a22 22 0 0 1 0 -20" fill="none" />
        <path d="M57 46 a22 22 0 0 0 0 -20" fill="none" />
      </g>
      {/* rigging + jumper */}
      <g stroke={SILVER_DK} strokeWidth="1.4" fill="none">
        <path d="M30 46 L48 62" />
        <path d="M70 46 L52 62" />
        <path d="M50 46 L50 60" />
      </g>
      <circle cx="50" cy="66" r="5" fill="#B01B2E" />
      <rect x="46" y="70" width="8" height="12" rx="3" fill="#B01B2E" />
      {/* rescue cross */}
      <rect x="48.6" y="62" width="2.8" height="10" fill="#FFFFFF" />
      <rect x="45" y="65.6" width="10" height="2.8" fill="#FFFFFF" />
    </g>
  ),

  /* Shield over a circuit lattice — cyber. */
  cyber: (
    <g>
      <path
        d="M50 6 L86 20 v30 c0 22-16 36-36 44 C30 86 14 72 14 50 V20 Z"
        fill="#08202e"
        stroke="#3FD3C6"
        strokeWidth="2"
      />
      <g stroke="#3FD3C6" strokeWidth="1.6" fill="none" opacity=".85">
        <path d="M28 36 h12 v-10" />
        <path d="M72 36 h-12 v-10" />
        <path d="M28 60 h10 v12" />
        <path d="M72 60 h-10 v12" />
        <path d="M50 30 v14" />
        <path d="M50 56 v16" />
      </g>
      <g fill="#3FD3C6">
        <circle cx="40" cy="26" r="2.4" />
        <circle cx="60" cy="26" r="2.4" />
        <circle cx="38" cy="72" r="2.4" />
        <circle cx="62" cy="72" r="2.4" />
        <circle cx="28" cy="36" r="2.4" />
        <circle cx="72" cy="36" r="2.4" />
      </g>
      {/* core */}
      <rect
        x="40"
        y="40"
        width="20"
        height="20"
        rx="3"
        fill="#0d3b4d"
        stroke="#3FD3C6"
        strokeWidth="2"
      />
      <path
        d="M46 50 l3 4 6 -8"
        fill="none"
        stroke="#EAF7F5"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  ),

  /* Atom over a fouled anchor — Navy nuclear field. */
  nuclear: (
    <g>
      <circle cx="50" cy="50" r="44" fill="#00205B" />
      <circle
        cx="50"
        cy="50"
        r="41"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.6"
        opacity=".75"
      />
      {/* anchor */}
      <rect x="48" y="30" width="4" height="44" rx="2" fill={GOLD} opacity=".9" />
      <rect x="36" y="40" width="28" height="3.4" rx="1.7" fill={GOLD} opacity=".9" />
      <path
        d="M32 62c0 10 8 16 18 16s18-6 18-16c0 0-3 7-8 8 2-4 2-6 2-6-4 5-8 7-12 7s-8-2-12-7c0 0 0 2 2 6-5-1-8-8-8-8z"
        fill={GOLD}
        opacity=".9"
      />
      {/* atom */}
      <g
        fill="none"
        stroke="#7FD4F5"
        strokeWidth="2.2"
        transform="translate(0,-4)"
      >
        <ellipse cx="50" cy="46" rx="24" ry="9" />
        <ellipse cx="50" cy="46" rx="24" ry="9" transform="rotate(60 50 46)" />
        <ellipse cx="50" cy="46" rx="24" ry="9" transform="rotate(-60 50 46)" />
      </g>
      <circle cx="50" cy="42" r="5" fill="#7FD4F5" />
    </g>
  ),

  /* Arrowhead with an upright dagger — Special Forces. */
  specialforces: (
    <g>
      <path
        d="M50 8 L84 78 C72 88 28 88 16 78 Z"
        fill="#123320"
        stroke={GOLD}
        strokeWidth="2"
      />
      {/* dagger */}
      <path d="M50 20 L54 34 L54 62 L46 62 L46 34 Z" fill={SILVER} />
      <rect x="38" y="62" width="24" height="4.5" rx="2" fill={GOLD} />
      <rect x="47" y="66" width="6" height="12" rx="2" fill={GOLD} />
      <circle cx="50" cy="80" r="3.4" fill={GOLD} />
      {/* lightning flashes */}
      <path d="M30 46 l8 6 -5 3 7 7" fill="none" stroke={GOLD} strokeWidth="2" />
      <path d="M70 46 l-8 6 5 3 -7 7" fill="none" stroke={GOLD} strokeWidth="2" />
    </g>
  ),

  /* Crossed rifles over a wreath — Marine combat arms. */
  combatarms: (
    <g>
      <circle cx="50" cy="48" r="40" fill="#8f0a20" />
      <circle
        cx="50"
        cy="48"
        r="37"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.8"
        opacity=".8"
      />
      <g stroke={GOLD} strokeWidth="3.4" strokeLinecap="round">
        <path d="M26 66 L74 30" />
        <path d="M26 30 L74 66" />
      </g>
      <g fill={GOLD}>
        <rect x="22" y="62" width="9" height="6" rx="2" />
        <rect x="69" y="62" width="9" height="6" rx="2" />
      </g>
      <circle cx="50" cy="48" r="5" fill={GOLD} />
      {wreath(GOLD)}
    </g>
  ),
};
