import type { ReactElement } from 'react';
import type { BranchId } from '../lib/types';

/**
 * Original heraldic emblems authored for this project.
 *
 * These are NOT the official service seals. Official U.S. military insignia are
 * protected under 18 U.S.C. sec. 701 and each service's trademark licensing
 * program, and stock-library renderings of them are royalty-licensed. Each mark
 * below is drawn from scratch using the service's official color palette and
 * generic heraldic vocabulary (star, anchor, globe, wings, delta, racing stripe)
 * so the app can be shipped and modified freely.
 */

type Props = {
  branch: BranchId;
  size?: number;
  title?: string;
};

const RING = 'rgba(255,255,255,.28)';

export function Emblem({ branch, size = 72, title }: Props) {
  const label = title ?? `${branch} emblem`;
  return (
    <svg
      className="emblem"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={label}
    >
      {shapes[branch]}
    </svg>
  );
}

/** Five-pointed star centered at (cx,cy) with circumradius r. */
function star(cx: number, cy: number, r: number, fill: string) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.382;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`);
  }
  return <polygon points={pts.join(' ')} fill={fill} />;
}

/** Scatter of small stars used in the Space Force field. */
function starfield(fill: string) {
  const seeds: Array<[number, number, number]> = [
    [24, 26, 1.6],
    [72, 22, 1.2],
    [18, 62, 1.1],
    [82, 58, 1.5],
    [34, 78, 1.2],
    [66, 80, 1],
    [50, 16, 1.3],
    [88, 40, 1],
  ];
  return (
    <g opacity="0.85">
      {seeds.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={fill} />
      ))}
    </g>
  );
}

/** Fouled anchor (anchor wrapped in rope) — shared by Navy and Coast Guard. */
function anchor(fill: string, rope: string) {
  return (
    <g>
      {/* rope wrap */}
      <path
        d="M32 52c8-6 28-6 36 0"
        fill="none"
        stroke={rope}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity=".75"
      />
      <path
        d="M34 60c8 5 24 5 32 0"
        fill="none"
        stroke={rope}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity=".75"
      />
      {/* stock */}
      <rect x="33" y="36" width="34" height="4" rx="2" fill={fill} />
      {/* shank */}
      <rect x="47.6" y="26" width="4.8" height="42" rx="2.4" fill={fill} />
      {/* ring */}
      <circle
        cx="50"
        cy="24"
        r="5.5"
        fill="none"
        stroke={fill}
        strokeWidth="3.2"
      />
      {/* arms / flukes */}
      <path
        d="M27 56c0 12 10 20 23 20s23-8 23-20c0 0-4 8-9 10 3-5 3-9 3-9-5 7-11 9-17 9s-12-2-17-9c0 0 0 4 3 9-5-2-9-10-9-10z"
        fill={fill}
      />
    </g>
  );
}

const shapes: Record<BranchId, ReactElement> = {
  /* ARMY — gold star and crossed sabers on black. Army colors: black & gold. */
  army: (
    <g>
      <defs>
        <linearGradient id="e-army" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2c2c" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#e-army)" />
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="#FFD700"
        strokeWidth="1.6"
        opacity=".55"
      />
      {/* crossed sabers */}
      <g stroke="#FFD700" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M26 74 L74 28" />
        <path d="M74 74 L26 28" />
        <path d="M70 24 l8 -2 -2 8" />
        <path d="M30 24 l-8 -2 2 8" />
      </g>
      {star(50, 50, 22, '#FFD700')}
      {star(50, 50, 9, '#000000')}
    </g>
  ),

  /* NAVY — fouled anchor, gold on navy blue. */
  navy: (
    <g>
      <defs>
        <linearGradient id="e-navy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a2f6b" />
          <stop offset="1" stopColor="#00205B" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#e-navy)" />
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="#C5B358"
        strokeWidth="1.6"
        opacity=".6"
      />
      {anchor('#E3C767', '#FFFFFF')}
    </g>
  ),

  /* MARINE CORPS — globe, anchor and eagle-chevron, gold on scarlet. */
  'marine-corps': (
    <g>
      <defs>
        <linearGradient id="e-usmc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8102e" />
          <stop offset="1" stopColor="#8f0a20" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#e-usmc)" />
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="#C8A951"
        strokeWidth="1.6"
        opacity=".65"
      />
      {/* eagle rendered as a stylized chevron of wings */}
      <path
        d="M22 34 L50 20 L78 34 L64 32 L50 27 L36 32 Z"
        fill="#E0BE6C"
      />
      {/* anchor behind the globe */}
      <rect x="47.8" y="34" width="4.4" height="40" rx="2.2" fill="#C8A951" />
      <path
        d="M30 62c0 10 9 16 20 16s20-6 20-16c0 0-4 7-9 8 3-4 2-7 2-7-4 6-9 8-13 8s-9-2-13-8c0 0-1 3 2 7-5-1-9-8-9-8z"
        fill="#C8A951"
      />
      <rect x="35" y="40" width="30" height="3.4" rx="1.7" fill="#C8A951" />
      {/* globe */}
      <circle
        cx="50"
        cy="54"
        r="17"
        fill="#8f0a20"
        stroke="#E0BE6C"
        strokeWidth="2.4"
      />
      <ellipse
        cx="50"
        cy="54"
        rx="7"
        ry="17"
        fill="none"
        stroke="#E0BE6C"
        strokeWidth="1.4"
        opacity=".8"
      />
      <path
        d="M33 54h34M36 45h28M36 63h28"
        stroke="#E0BE6C"
        strokeWidth="1.4"
        opacity=".8"
        fill="none"
      />
      {/* landmass hint */}
      <path
        d="M41 48c4-2 8 1 6 4s-8 1-9 5 5 6 9 4"
        fill="none"
        stroke="#E0BE6C"
        strokeWidth="1.8"
        opacity=".9"
      />
    </g>
  ),

  /* AIR FORCE — winged star, silver and gold on Air Force blue. */
  'air-force': (
    <g>
      <defs>
        <linearGradient id="e-af" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a4a9e" />
          <stop offset="1" stopColor="#00308F" />
        </linearGradient>
        <linearGradient id="e-af-wing" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D9E1E8" />
          <stop offset="1" stopColor="#9FB1BF" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#e-af)" />
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="#C0CCD6"
        strokeWidth="1.6"
        opacity=".55"
      />
      {/* stylized wings sweeping up from a central star */}
      <path
        d="M50 40 C36 40 22 46 10 60 c14-6 24-7 32-5 z"
        fill="url(#e-af-wing)"
      />
      <path
        d="M50 40 C64 40 78 46 90 60 c-14-6-24-7-32-5 z"
        fill="url(#e-af-wing)"
      />
      <path
        d="M50 52 C40 52 30 57 22 68 c10-5 18-6 24-4 z"
        fill="#8CA0B3"
        opacity=".85"
      />
      <path
        d="M50 52 C60 52 70 57 78 68 c-10-5-18-6-24-4 z"
        fill="#8CA0B3"
        opacity=".85"
      />
      {star(50, 36, 16, '#FFD700')}
      {star(50, 36, 6.5, '#00308F')}
    </g>
  ),

  /* SPACE FORCE — delta over an orbital ring in a star field. */
  'space-force': (
    <g>
      <defs>
        <radialGradient id="e-sf" cx="0.5" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#1d3a63" />
          <stop offset="1" stopColor="#0a1628" />
        </radialGradient>
        <linearGradient id="e-sf-delta" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#8FD3F4" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#e-sf)" />
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="#6EC1E4"
        strokeWidth="1.4"
        opacity=".5"
      />
      {starfield('#DCEBF5')}
      {/* orbit */}
      <ellipse
        cx="50"
        cy="56"
        rx="38"
        ry="14"
        fill="none"
        stroke="#6EC1E4"
        strokeWidth="2"
        opacity=".75"
        transform="rotate(-18 50 56)"
      />
      {/* delta */}
      <path d="M50 16 L74 78 L50 66 L26 78 Z" fill="url(#e-sf-delta)" />
      <path d="M50 30 L50 62" stroke="#0a1628" strokeWidth="2" opacity=".35" />
      <circle cx="50" cy="24" r="2.6" fill="#0a1628" opacity=".45" />
    </g>
  ),

  /* COAST GUARD — shield with the racing stripe and a fouled anchor. */
  'coast-guard': (
    <g>
      <defs>
        <linearGradient id="e-cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b4d8c" />
          <stop offset="1" stopColor="#003366" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#e-cg)" />
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        opacity=".5"
      />
      {/* racing stripe: narrow blue bar behind a broad red canted bar */}
      <g transform="rotate(-64 50 50)">
        <rect x="10" y="60" width="80" height="7" fill="#003366" />
        <rect x="10" y="30" width="80" height="22" fill="#E4002B" />
      </g>
      <circle cx="50" cy="50" r="30" fill="#FFFFFF" opacity=".93" />
      <g transform="translate(0,4) scale(0.78) translate(14,10)">
        {anchor('#003366', '#E4002B')}
      </g>
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke="#003366"
        strokeWidth="2"
      />
    </g>
  ),
};

/** Small monochrome delta/star used as the app's own wordmark glyph. */
export function AppMark({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="none" stroke={RING} strokeWidth="3" />
      <path d="M50 14 L78 84 L50 70 L22 84 Z" fill="currentColor" />
      {star(50, 44, 11, '#0d1117')}
    </svg>
  );
}
