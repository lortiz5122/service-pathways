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
console.log(`\n${pass}/${routes.length} routes rendered, ${fail} failed`);
console.log(`data: ${data.clusters.length} clusters, ${data.allSpecialties.length} specialties`);
await vite.close();
process.exit(fail ? 1 : 0);
