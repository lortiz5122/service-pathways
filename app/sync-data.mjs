import { readdirSync, copyFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, '..', 'data');
const DST = join(here, 'src', 'research');

mkdirSync(DST, { recursive: true });

let n = 0;
for (const f of readdirSync(SRC)) {
  if (f.endsWith('.json')) {
    copyFileSync(join(SRC, f), join(DST, f));
    n++;
  }
}
console.log(`synced ${n} research JSON files -> src/research/`);
