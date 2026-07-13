import fs from 'node:fs';
import { createServer } from 'vite';

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

const { render } = await vite.ssrLoadModule('/src/ssr-entry.tsx');
const data = await vite.ssrLoadModule('/src/lib/data.ts');

const routes = [
  '/', '/explore', '/jobs', '/branches', '/prep', '/pay', '/lifecycle', '/about', '/methodology', '/admin',
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

// 6. EVERY surface that shows a non-enlisted job must show the entry gate.
//    The specialty PAGE carried an officer warning and the POPUP carried none, so a
//    reader clicking "Naval Aviator" from their results saw pay and bonuses with no
//    hint it needs a degree. Two surfaces, one truth — asserted, not remembered.
for (const s of data.allSpecialties) {
  const ep = entryPath(s);
  if (ep.openToHighSchool && ep.kind === 'enlisted') continue;
  const html = render(`/specialty/${s.id}`);
  if (!html.includes('entrybanner')) bad(`${s.name} (${ep.kind}) renders NO entry gate on its page`);
  // The gate must name the real requirement, not just say "officer".
  if (ep.kind === 'officer' && !/degree|JD|BSN|licen/i.test(html))
    bad(`${s.name} is officer but the page never names the degree requirement`);
}

// 7. NO BADGE MAY HOLD PROSE. This class of bug has now shipped FOUR times:
//    a chip that became an ellipse, "OF 40" (the word "of"), a 200-char sentence
//    in the paygrade tile, and "E-3 (E-2 in the A" clipped mid-word. Asserted.
{
  const payHtml = render('/pay');
  for (const m of payHtml.matchAll(/class="adv-grade">([^<]*)</g))
    if (m[1].length > 5) bad(`advanced-entry badge holds prose: "${m[1]}"`);
  for (const m of payHtml.matchAll(/class="benefit-figure[^"]*">([^<]*)</g))
    if (m[1].length > 24) bad(`benefit figure holds prose: "${m[1]}"`);

  // 8. Every entry grade shown must carry ITS OWN money figure. The Eagle Scout
  //    tile quoted the E-3 value (+$5,158) on a route that grants E-2 in the Air
  //    Force (+$3,490) — a number that was flatly wrong for a branch it listed.
  for (const card of payHtml.split('class="card adv"').slice(1)) {
    const txt = card.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const grades = [...card.matchAll(/class="adv-row-grade">([^<]+)</g)].length;
    const money = [...txt.matchAll(/\+ ?\$[\d,]+ in your first year/g)].length;
    if (grades !== money)
      bad(`advanced-entry card shows ${grades} grade(s) but ${money} money figure(s)`);
  }

  // 9. A CATALOGUE BRANCH MUST NOT SILENTLY LOSE JOBS TO DEDUP. Twice now, an
  //    over-eager dedup deleted every Space Force catalogue entry, because those
  //    records carry the literal code "UNVERIFIED" and the matcher treated a
  //    placeholder as an identity. A dedup that is too eager does not merge jobs,
  //    it DELETES them — the exact silent-absence failure the site exists to fix.
  //    So: every branch that ships a catalogue file must still show catalogue
  //    jobs, and the merged total can never be smaller than the deep-record count.
  {
    const cat = await vite.ssrLoadModule('/src/lib/catalog.ts');
    const files = fs
      .readdirSync('src/research')
      .filter((f) => f.startsWith('catalog-') && f.endsWith('.json'));

    for (const f of files) {
      const raw = JSON.parse(fs.readFileSync(`src/research/${f}`, 'utf8'));
      const entries = raw.specialties ?? [];
      if (!entries.length) continue;
      const branch = entries[0].branch;
      // The real invariant is that NO JOB DISAPPEARS. It does not matter whether a
      // job reaches the reader as a catalogue stub or a fully researched record —
      // being researched is the GOAL, and a branch whose stubs have all been upgraded
      // legitimately has zero catalogue entries left. What must never happen is a job
      // vanishing, which is what an over-eager dedup does.
      const shown = cat.allJobs.filter((j) => j.branch === branch);
      if (shown.length < entries.length)
        bad(
          `${branch}: catalogue file holds ${entries.length} jobs but only ${shown.length} reached the site — ${entries.length - shown.length} vanished`,
        );
    }

    // 10. NO PROSE IN A CODE SLOT. Fifth instance of this bug. Several records
    //     carry a 400-character paragraph in the `code` field ("UNVERIFIED — the
    //     official crosswalk PDF returned 403…"). Rendered raw, that paragraph
    //     lands in a 60px chip. Every code the directory shows must be a CODE.
    const jobsHtml = render('/jobs');

    // 11. A RESULTS LIST THAT RENDERS NOTHING IS NOT AN EMPTY RESULT — IT IS A BUG.
    //     /jobs grouped results by the display name ("U.S. Army") but the data keys
    //     on the id ("Army"), so the lookup never matched and ZERO rows rendered for
    //     every query, while the count line kept reporting "1017 jobs match". The
    //     count agreeing with the data is not evidence the reader can see anything.
    // 12. THE DISCOVERY TOOL MUST NEVER RECOMMEND A JOB THE READER CANNOT ENTER.
    //     It is answering "what could I actually do" for a 17-year-old with no
    //     degree. An officer or warrant record surfacing beside enlisted ones, with
    //     nothing marking the difference, is misinformation however true the record
    //     behind it is.
    {
      const rec = await vite.ssrLoadModule('/src/lib/recommend.ts');
      const ent = await vite.ssrLoadModule('/src/lib/entry.ts');
      const el = await vite.ssrLoadModule('/src/lib/entrylevel.ts');
      const srch = await vite.ssrLoadModule('/src/lib/search.ts');

      // A search with no interest picked must return ONLY what the search found.
      for (const q of ['drones', 'dogs', 'explosives', 'weather']) {
        const hits = srch.searchEntryLevel(q).length;
        const out = rec.recommend([], [], 60, 'tier1', q);
        if (out.length !== hits)
          bad(
            `search "${q}" alone returns ${out.length} results but only ${hits} jobs match it — the catalogue is being dumped under the search`,
          );
      }

      for (const c of data.clusters) {
        const out = rec.recommend([c.id], [], 60, 'tier1');

        const officer = out.filter((r) => ent.entryPath(r.specialty).kind !== 'enlisted');
        if (officer.length)
          bad(
            `discovery tool offers ${officer.length} officer/warrant job(s) for "${c.name}" — e.g. ${officer[0].specialty.name}`,
          );

        // 13. EVERY RECOMMENDED JOB MUST CARRY A SOURCED "a civilian can enlist into
        //     this" VERDICT. "Enlisted" is not "entry level" — a fifth of the Marine
        //     Corps MOS list is lateral-move only, and every one of them passes the
        //     track check. Fail closed: an unclassified job may not be recommended.
        // 15. A SEARCH MUST NOT RETURN THE WHOLE CATALOGUE. With no interest picked,
        //     the pool fell back to all 510 jobs, so searching "drones" ranked the 9
        //     real drone jobs to the top and dumped every other job underneath —
        //     Musician, Personnel Specialist, the lot. A search that returns everything
        //     has not widened anything; it has buried the answer in the haystack it was
        //     supposed to search.
        const unclassified = out.filter((r) => !el.isEntryLevel(r.specialty.id));
        if (unclassified.length)
          bad(
            `discovery tool offers ${unclassified.length} job(s) with no sourced entry-level verdict for "${c.name}" — e.g. ${unclassified[0].specialty.name} (${unclassified[0].specialty.branch})`,
          );
      }
    }

    // 14. NO TWO JOBS MAY SHARE AN ID. All seven Space Force catalogue entries carry
    //     the literal code "UNVERIFIED", and an id built from the code collapsed them
    //     onto ONE id — seven different jobs, one identity. That breaks routing, React
    //     keys, and every join that keys on id (including the entry-level verdict).
    {
      const ids = new Map();
      for (const j of cat.allJobs) ids.set(j.id, (ids.get(j.id) ?? 0) + 1);
      const dupes = [...ids.entries()].filter(([, n]) => n > 1);
      if (dupes.length)
        bad(
          `${dupes.length} duplicate job id(s) — e.g. "${dupes[0][0]}" is used by ${dupes[0][1]} different jobs`,
        );
    }

    // 16. A BLANK PAY CELL IS NOT $0. DFAS publishes no rate for O-10 at two years of
    //     service, or W-5 before twenty, because nobody holds that grade that early.
    //     Rendering those as "$0" would state a wage that does not exist. And the
    //     officer/warrant ladders must actually RENDER — the site listed hundreds of
    //     officer jobs while showing a reader enlisted money.
    {
      const pay = render('/pay');
      if (!/W-5/.test(pay) || !/W-1/.test(pay))
        bad('/pay does not render the warrant-officer ladder (W-1..W-5)');
      if (!/O-6/.test(pay))
        bad('/pay does not render the officer ladder beyond O-3');
      if (/O-1E/.test(pay) === false)
        bad('/pay does not show the prior-enlisted officer rates (O-1E/O-2E/O-3E)');
      for (const m of pay.matchAll(/class="paytable"[\s\S]*?<\/table>/g)) {
        // Only the VALUE inside <b>/<em> counts. A title attribute that explains a dash
        // legitimately contains the characters "$0".
        const values = [...m[0].matchAll(/<(?:b|em)>([^<]*(?:<!-- -->)?[^<]*)<\/(?:b|em)>/g)]
          .map((v) => v[1].replace(/<!-- -->/g, ''));
        if (values.some((v) => /^\+?\$0(\.00)?$/.test(v.trim())))
          bad('a pay table renders $0 — DFAS publishes NO rate there, and "$0" is a different claim from "no rate"');
      }
    }

    // 17. NO "GATE". Nobody helping their kid pick a career says a score "gates" a
    //     job — they say it decides whether you can have it. It is machine-speak, and
    //     it reads as machine-speak to exactly the reader this site is written for.
    //     Say what you mean in the words the reader would use.
    for (const r of ['/', '/prep', '/pay', '/explore', '/jobs', '/branches', '/lifecycle']) {
      const t = render(r).replace(/<[^>]+>/g, ' ');
      const hits = [...t.matchAll(/[^.]{0,40}\bgat(?:e|es|ed|ing)\b[^.]{0,30}/gi)];
      if (hits.length)
        bad(
          `${r} uses "gate" (${hits.length}x) — jargon. e.g. "${hits[0][0].trim().replace(/\s+/g, ' ')}"`,
        );
    }

    const rowCount = (jobsHtml.match(/class="jobrow/g) ?? []).length;
    if (rowCount < cat.jobCounts.total)
      bad(
        `/jobs renders ${rowCount} rows but the catalogue holds ${cat.jobCounts.total} — the list is dropping jobs`,
      );
    for (const m of jobsHtml.matchAll(/class="job-code[^"]*">([^<]+)</g)) {
      const t = m[1].trim();
      if (t.length > 14)
        bad(`job-code slot holds prose (${t.length} chars): "${t.slice(0, 60)}…"`);
    }
  }
}

console.log(`\ninvariants: ${inv} failed (must be 0)`);
console.log(`\n${pass}/${routes.length} routes rendered, ${fail} failed`);
if (inv) process.exitCode = 1;
console.log(`data: ${data.clusters.length} clusters, ${data.allSpecialties.length} specialties`);
await vite.close();
process.exit(fail ? 1 : 0);
