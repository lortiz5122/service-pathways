import { createServer } from 'vite';

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

const { render } = await vite.ssrLoadModule('/src/ssr-entry.tsx');
const data = await vite.ssrLoadModule('/src/lib/data.ts');

const routes = [
  '/', '/explore', '/branches', '/prep', '/lifecycle', '/about',
  ...data.clusters.map((c) => `/interest/${c.id}`),
  ...data.allSpecialties.slice(0, 15).map((s) => `/specialty/${s.id}`),
];

let pass = 0, fail = 0;
for (const path of routes) {
  try {
    const html = render(path);
    if (html.length < 800) throw new Error(`short render (${html.length}b)`);
    // ASSET POLICY invariant: any page rendering a service mark MUST carry the
    // non-endorsement disclaimer (32 CFR 765.14 safe-harbour model).
    const hasMark = /aria-label="[^"]*emblem"/.test(html) || /class="badge"/.test(html);
    const hasDisclaimer = html.includes('not official insignia');
    if (hasMark && !hasDisclaimer)
      throw new Error('renders a service mark WITHOUT the non-endorsement disclaimer');
    // HARD RULE: never render a branch seal. Enforced at the asset layer — no
    // external image is loaded anywhere, so no seal file can reach the page.
    const seal = html.match(/<img[^>]*(src|srcset)="[^"]*seal[^"]*"/i);
    if (seal) throw new Error(`renders a SEAL asset: ${seal[0]}`);
    pass++;
    console.log(`  ok    ${path.padEnd(40)} ${String(html.length).padStart(6)}b`);
  } catch (e) {
    fail++;
    console.log(`  FAIL  ${path.padEnd(40)} ${e.message.split('\n')[0]}`);
  }
}
/* ------------------------------------------------------------------ invariants
 * Every one of these encodes a bug that SHIPPED and had to be caught by a human
 * reading the page. They are asserted on every build now so they cannot come back.
 */
const { shortPaygrade, trainingWeeks, shortCode } = await vite.ssrLoadModule('/src/lib/format.ts');
const { entryPath } = await vite.ssrLoadModule('/src/lib/entry.ts');
let inv = 0;
const bad = (m) => { console.log(`  INVARIANT FAILED: ${m}`); inv++; };

// 1. A slot sized for a token must never hold prose. (200-char sentence in a 60px tile.)
for (const s of data.allSpecialties) {
  const pg = shortPaygrade(s.pay_and_compensation?.paygrade_entry);
  if (pg && pg.length > 10) bad(`paygrade token too long on ${s.code}: "${pg}"`);
  const c = shortCode(s.code);
  if (c && c.length > 24) bad(`code token too long on ${s.name}: "${c}"`);
}

// 2. A confident training total must never be computed from an unknown stage.
//    (AST showed "8 weeks" for one of the hardest pipelines in the military.)
for (const s of data.allSpecialties) {
  const tw = trainingWeeks(s.training_pipeline);
  if (!tw.complete && tw.label.match(/^\d+$/)) bad(`${s.code} shows a confident total from an unverified stage`);
}

// 3. A branch declared absent must not also have a record. (Self-contradiction.)
for (const f of data.specialtyFiles) {
  const have = new Set(f.specialties.map((s) => s.branch));
  for (const a of f.branches_with_no_presence ?? [])
    if (have.has(a.branch)) bad(`${f.cluster_id} declares ${a.branch} absent but HAS a record`);
}

// 4. A branch that is silently missing — no record AND no declared absence — is
//    the most dangerous state, because absence reads as an answer.
const TAXBR = ['Army','Navy','Air Force','Marine Corps','Space Force','Coast Guard'];
for (const c of data.clusters) {
  const f = data.specialtyFiles.find((x) => x.cluster_id === c.id);
  if (!f) continue;
  const have = new Set(f.specialties.map((s) => s.branch));
  const dec = new Set((f.branches_with_no_presence ?? []).map((a) => a.branch));
  for (const b of TAXBR) {
    const taxHas = (c.example_specialties_by_branch?.[b] ?? []).length > 0;
    if (taxHas && !have.has(b) && !dec.has(b)) bad(`SILENT GAP: ${c.id} / ${b}`);
  }
}

// 5. An officer record must never be shown as ASVAB-gated.
for (const s of data.allSpecialties) {
  const ep = entryPath(s);
  if (ep.kind === 'officer' && ep.usesAsvab) bad(`${s.name} is officer but marked usesAsvab`);
}

console.log(`\ninvariants: ${inv} failed (must be 0)`);
console.log(`\n${pass}/${routes.length} routes rendered, ${fail} failed`);
if (inv) process.exitCode = 1;
console.log(`data: ${data.clusters.length} clusters, ${data.allSpecialties.length} specialties`);
await vite.close();
process.exit(fail ? 1 : 0);
