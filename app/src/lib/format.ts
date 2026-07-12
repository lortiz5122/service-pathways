/**
 * Card-level label extraction.
 *
 * The research data deliberately puts full, sourced prose into fields like
 * `asvab_line_score` and `security_clearance` — e.g. "GT (General Technical)
 * >= 110 and ST (Skilled Technical) >= 112. Cross-corroborated across secondary
 * sources (battalionduty.com, military-ranks.org); NOT independently confirmed
 * against a primary Army document (DA Pam 611-21) this session."
 *
 * That is the right thing for the data to do, and the WRONG thing to paste into
 * a chip. These helpers pull a short label for card UI. The full text always
 * remains on the specialty detail page — nothing is hidden, only summarised.
 */

/** "TS/SCI", "SECRET", etc. — the clearance tier, not the whole paragraph. */
export function shortClearance(v: unknown): string | null {
  if (!v) return null;
  const s = String(v);
  if (/none|not required|n\/a/i.test(s.slice(0, 40))) return null;

  if (/top secret\s*\/\s*sci|ts\s*\/\s*sci/i.test(s)) return 'TS/SCI';
  if (/top secret/i.test(s)) return 'Top Secret';
  if (/\bsecret\b/i.test(s)) return 'Secret';
  if (/confidential/i.test(s)) return 'Confidential';
  if (/public trust/i.test(s)) return 'Public Trust';
  return 'Clearance required';
}

/** Army/USMC/Air Force composite names. Used to pull the real score out of prose. */
const COMPOSITES =
  /\b(GT|ST|EL|MM|GM|FA|OF|SC|CO|CL|MAGE|AFQT|VE\+AR|E|G|M|A)\b/gi;

/**
 * The score gate, reduced to the actual requirement.
 *
 * Does NOT truncate prose — truncation destroyed the number (an early version
 * turned "MM (Mechanical Maintenance) >= 104" into just "MM"). Instead it
 * EXTRACTS composite/score pairs. If it can't find a real score, it returns
 * null and the card simply shows no gate chip, rather than a mangled fragment.
 */
export function shortLineScore(v: unknown): string | null {
  if (!v) return null;
  const raw = String(v).trim();
  if (!raw || /^null$/i.test(raw)) return null;

  // Navy and Coast Guard genuinely have no line scores.
  if (/no (single |navy |coast guard )*['"]?line[- ]?score/i.test(raw)) {
    return 'No line score — subtest sums';
  }
  if (/not applicable|^n\/a/i.test(raw.slice(0, 20))) return null;

  // Drop parenthetical expansions — "(Skilled Technical)" is noise on a card.
  const cleaned = raw.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ');

  // Pull COMPOSITE ... NUMBER pairs, e.g. "GT >= 110", "ST 101", "E composite ≥ 70".
  const pairs: string[] = [];
  const seen = new Set<string>();
  const re = new RegExp(
    `${COMPOSITES.source}[^0-9A-Za-z]{0,16}?(\\d{2,3})\\b`,
    'gi',
  );
  let m: RegExpExecArray | null;
  while ((m = re.exec(cleaned)) !== null) {
    const key = m[1].toUpperCase();
    if (seen.has(key)) continue;
    seen.add(key);
    pairs.push(`${key} ${m[2]}`);
    if (pairs.length === 3) break;
  }

  if (pairs.length) return pairs.join(' · ');

  // No parseable score. Say so honestly rather than showing a prose fragment.
  if (/conflict/i.test(raw)) return 'Sources conflict';
  if (/unverified/i.test(raw)) return 'Score unverified';
  return null;
}

/**
 * The specialty code. Some records carry a full explanatory paragraph here
 * (e.g. "UNVERIFIED code — commonly cited as 153A ..."), which would blow out
 * the card header exactly the way the score field did.
 */
export function shortCode(v: unknown): string | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;
  if (/^unverified/i.test(s)) return 'Code unverified';
  // A real code is short. Anything long is prose.
  if (s.length <= 22) return s;
  const first = s.split(/[;,(]|\s[–—-]\s/)[0].trim();
  return first.length <= 22 ? first : 'Code unverified';
}

/** First sentence of a longer note, for a card-level preview. */
export function firstSentence(v: unknown, max = 150): string | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;
  const cut = s.split(/(?<=\.)\s/)[0];
  return cut.length > max ? `${cut.slice(0, max - 1).trimEnd()}…` : cut;
}
