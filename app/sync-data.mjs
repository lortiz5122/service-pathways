/**
 * Sync research JSON + logo assets into the app.
 *
 * HARD RULE (master-prompt-v2.md, ASSET POLICY): "Never use a branch seal.
 * Filter programmatically on filenames containing `seal`."
 *
 * That filter is enforced HERE, at the build boundary, rather than trusted to
 * a developer's memory. A seal file physically cannot reach the bundle.
 */
import { readdirSync, copyFileSync, mkdirSync, writeFileSync, statSync, readFileSync, rmSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');

/* ---------------------------------------------------------- research JSON */
const RSRC = join(ROOT, 'data');
const RDST = join(here, 'src', 'research');
mkdirSync(RDST, { recursive: true });
let nJson = 0;
const badJson = [];
// Research files are written by long-running agents. A killed agent can leave a
// truncated file behind. Validate before shipping — a malformed file must never
// break the build, and must never silently ship as empty either.
for (const f of readdirSync(RDST)) if (f.endsWith('.json')) rmSync(join(RDST, f));
for (const f of readdirSync(RSRC)) {
  if (!f.endsWith('.json')) continue;
  try {
    JSON.parse(readFileSync(join(RSRC, f), 'utf8'));
  } catch (e) {
    badJson.push(`${f}: ${e.message}`);
    continue;
  }
  copyFileSync(join(RSRC, f), join(RDST, f));
  nJson++;
}

/* ---------------------------------------------------------------- logos */
const LSRC = join(ROOT, 'logos');
const LDST = join(here, 'public', 'logos');
// PURGE FIRST. Without this, a logo that gets re-classified as a seal stays on
// disk from an earlier sync and Vite happily copies it into dist/ — which is
// exactly how four seals reached production once already.
rmSync(LDST, { recursive: true, force: true });
mkdirSync(LDST, { recursive: true });

const SEAL = /seal/i;

/**
 * Files that ARE seals despite an innocuous filename. Every one of these was
 * opened and visually inspected — the filename filter alone let them through.
 * A seal is identified by the official device ring: a circular border carrying
 * the service name, a founding date and/or a Latin motto (e.g. "SEMPER PARATUS
 * 1790", "DEPARTMENT OF THE AIR FORCE MMXIX", "DEPARTMENT OF THE NAVY").
 *
 * CAUTION, learned the hard way: a founding date alone is NOT a seal signature.
 * The Coast Guard EMBLEM legitimately carries a "UNITED STATES COAST GUARD /
 * 1790" ring and is permitted (MEDIUM risk). What makes the Coast Guard SEAL a
 * seal is the rope border, the blue disc, and the SEMPER PARATUS motto.
 *
 * And note: grepping an SVG for seal text finds nothing when the lettering has
 * been outlined into paths. Rendering and LOOKING is the only reliable check.
 */
const CONFIRMED_SEALS = new Set([
  'Marine-logo.jpg',   // "DEPARTMENT OF THE NAVY / UNITED STATES MARINE CORPS" + rope border
  'USAF logo.png',     // "UNITED STATES AIR FORCE" ring + coat of arms + rope border
  'USCG logo.jpeg',    // "SEMPER PARATUS / 1790" + rope border — the most restricted mark of all
  'USSF logo.jpeg',    // "UNITED STATES SPACE FORCE / DEPARTMENT OF THE AIR FORCE / MMXIX"
]);
const RECRUITING = /army strong|americas navy|america's navy|aim high|few.*proud/i;

/** source filename -> { slug, kind, label }. Anything not listed is reported, not shipped. */
const MAP = {
  'army logo.jpg':                    { slug: 'army',                 kind: 'branch',    label: 'U.S. Army' },
  'Mark_of_the_United_States_Army.svg.webp': { slug: 'army-mark',     kind: 'alt',       label: 'U.S. Army (mark)' },
  // NOTE: Marine-logo.jpg / USAF logo.png / USSF logo.jpeg / USCG logo.jpeg are
  // all SEALS despite their filenames — see CONFIRMED_SEALS above. Not mapped.
  'navy-logo.svg':                    { slug: 'navy',                 kind: 'branch',    label: 'U.S. Navy' },
  'space-force-delta-logo.svg':       { slug: 'space-force',          kind: 'branch',    label: 'U.S. Space Force' },
  'marine-corps-logo.svg':            { slug: 'marine-corps',         kind: 'branch',    label: 'U.S. Marine Corps' },
  'marine-corps-logo.png':            { slug: 'marine-corps',         kind: 'branch',    label: 'U.S. Marine Corps' },
  'air-force-logo.svg':               { slug: 'air-force',            kind: 'branch',    label: 'U.S. Air Force' },
  'air-force-logo.png':               { slug: 'air-force',            kind: 'branch',    label: 'U.S. Air Force' },
  'coast-guard-logo.svg':             { slug: 'coast-guard',          kind: 'branch',    label: 'U.S. Coast Guard' },
  'coast-guard-logo.png':             { slug: 'coast-guard',          kind: 'branch',    label: 'U.S. Coast Guard' },
  'army national guard logo.jpg':     { slug: 'army-national-guard',  kind: 'component', label: 'Army National Guard' },
  'Air National Guard Logo.avif':     { slug: 'air-national-guard',   kind: 'component', label: 'Air National Guard' },
  'Marine_Forces_Reserve_insignia_(transparent_background).png':
                                      { slug: 'marine-forces-reserve', kind: 'component', label: 'Marine Forces Reserve' },
  'army-reserve-logo.svg':            { slug: 'army-reserve',         kind: 'component', label: 'U.S. Army Reserve' },
  'navy-reserve-logo.jpg':            { slug: 'navy-reserve',         kind: 'component', label: 'U.S. Navy Reserve' },
  'air-force-reserve-logo.svg':       { slug: 'air-force-reserve',    kind: 'component', label: 'Air Force Reserve' },
  // Coast Guard Reserve: NO non-seal logo exists. Commons has only the seal.
  // Correctly absent rather than substituted.
  'DOW-Logo-Stacked-1-Color.png':     { slug: 'dow',                  kind: 'joint',     label: 'Department of War' },
};

const manifest = [];
const rejected = [];
const unmapped = [];

for (const f of readdirSync(LSRC)) {
  if (f.startsWith('.') || f === 'SOURCES.md') continue;
  if (!statSync(join(LSRC, f)).isFile()) continue;

  if (SEAL.test(f))       { rejected.push({ file: f, why: 'SEAL — forbidden by asset policy (HIGH risk)' }); continue; }
  if (CONFIRMED_SEALS.has(f)) {
    rejected.push({ file: f, why: 'SEAL — named "logo" but visually confirmed to be the official seal (HIGH risk)' });
    continue;
  }
  if (RECRUITING.test(f)) { rejected.push({ file: f, why: 'recruiting mark — actively enforced trademark (HIGH risk)' }); continue; }

  const m = MAP[f];
  if (!m) { unmapped.push(f); continue; }

  const out = `${m.slug}${extname(f).toLowerCase()}`;
  copyFileSync(join(LSRC, f), join(LDST, out));
  manifest.push({ ...m, src: `/logos/${out}`, origin: f });
}

// De-dup by slug, preferring the first mapped hit.
const bySlug = {};
for (const m of manifest) if (!bySlug[m.slug]) bySlug[m.slug] = m;

writeFileSync(
  join(here, 'src', 'research', 'logo-manifest.json'),
  JSON.stringify({ logos: Object.values(bySlug), rejected, unmapped, generated_from: 'logos/' }, null, 2) + '\n',
);

console.log(`synced ${nJson} research JSON`);
if (badJson.length) {
  console.log(`SKIPPED ${badJson.length} MALFORMED research file(s) — not shipped:`);
  for (const b of badJson) console.log(`   ✗ ${b}`);
}
console.log(`shipped ${Object.keys(bySlug).length} logos: ${Object.keys(bySlug).join(', ')}`);
if (rejected.length) {
  console.log(`REJECTED ${rejected.length}:`);
  for (const r of rejected) console.log(`   ✗ ${r.file}  — ${r.why}`);
}
if (unmapped.length) console.log(`unmapped (not shipped): ${unmapped.join(', ')}`);
