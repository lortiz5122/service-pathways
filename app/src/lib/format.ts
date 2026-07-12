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

/**
 * What each ASVAB composite code actually means. "GT 110" is meaningless to a
 * 16-year-old, and "OF 40" is worse than meaningless.
 */
export const COMPOSITE_NAMES: Record<string, string> = {
  GT: 'General Technical',
  ST: 'Skilled Technical',
  EL: 'Electronics',
  MM: 'Mechanical Maintenance',
  GM: 'General Maintenance',
  FA: 'Field Artillery',
  OF: 'Operators & Food',
  SC: 'Surveillance & Communications',
  CO: 'Combat',
  CL: 'Clerical',
  'VE+AR': 'Verbal Expression + Arithmetic Reasoning',
  VE: 'Verbal Expression',
  AR: 'Arithmetic Reasoning',
  MK: 'Mathematics Knowledge',
  MC: 'Mechanical Comprehension',
  AFQT: 'AFQT percentile',
};

/**
 * Composite codes, matched CASE-SENSITIVELY.
 *
 * This is not a style choice. A case-insensitive version matched the English
 * word "of" in "...a minimum composite score of 41..." as the Army's OF
 * (Operators & Food) composite, and rendered "Job needs OF 40" on the card —
 * confident, official-looking, and complete nonsense. Lowercase "of" must never
 * match. Single MAGE letters (M/A/G/E) are excluded entirely for the same reason:
 * a bare "A" or "G" in prose is not a score.
 */
const COMPOSITE_RE =
  /\b(VE\+AR|AFQT|GT|ST|EL|MM|GM|FA|OF|SC|CO|CL)\b[^0-9A-Za-z]{0,18}?(\d{2,3})\b/g;

/** MAGE letters only when explicitly named, e.g. "General (G) score of 55". */
const MAGE_RE =
  /\b(?:Mechanical|Administrative|General|Electronic\w*)\s*\(([MAGE])\)[^0-9A-Za-z]{0,18}?(\d{2,3})\b/g;

export type Gate = { code: string; score: number; name: string };

/** Every composite/score pair the text actually states. */
export function lineScoreGates(v: unknown): Gate[] {
  if (!v) return [];
  const raw = String(v);
  const out: Gate[] = [];
  const seen = new Set<string>();

  const push = (code: string, n: string) => {
    if (seen.has(code)) return;
    seen.add(code);
    out.push({
      code,
      score: Number(n),
      name: COMPOSITE_NAMES[code] ?? code,
    });
  };

  let m: RegExpExecArray | null;
  COMPOSITE_RE.lastIndex = 0;
  while ((m = COMPOSITE_RE.exec(raw)) !== null) push(m[1], m[2]);

  MAGE_RE.lastIndex = 0;
  while ((m = MAGE_RE.exec(raw)) !== null) push(m[1], m[2]);

  return out.slice(0, 3);
}

/**
 * The score gate as a short card label.
 *
 * Does NOT truncate prose — truncation destroyed the number (an early version
 * turned "MM (Mechanical Maintenance) >= 104" into just "MM"). It EXTRACTS
 * composite/score pairs. If it can't find a real score, it returns null and the
 * card shows no gate chip, rather than a mangled fragment.
 */
export function shortLineScore(v: unknown): string | null {
  if (!v) return null;
  const raw = String(v).trim();
  if (!raw || /^null$/i.test(raw)) return null;

  // Navy and Coast Guard genuinely have no line scores.
  if (/no (single |navy |coast guard )*['"]?line[- ]?score/i.test(raw)) {
    return 'No line score — rating sums subtests';
  }
  if (/not applicable|^n\/a/i.test(raw.slice(0, 20))) return null;

  const gates = lineScoreGates(raw);
  if (gates.length) {
    return gates.map((g) => `${g.code} ${g.score}`).join(' · ');
  }

  if (/conflict/i.test(raw)) return 'Sources conflict';
  if (/unverified/i.test(raw)) return 'Score unverified';
  return null;
}

/**
 * The specialty code. Some records carry a full explanatory paragraph here
 * (e.g. "UNVERIFIED code — commonly cited as 153A ..."), which would blow out
 * the card header exactly the way the score field did.
 */
/**
 * A real specialty code, or null when we do not have one.
 *
 * Returns NULL for a placeholder rather than the words "Code unverified". A code
 * slot is a code slot: two to six characters, monospaced, sitting in a 60px chip.
 * "Code unverified" is a sentence about our research, not an identifier, and it
 * has no business being rendered where a reader expects to see 11B. The CALLER
 * decides how to say "we don't know this one" — in its own words, in its own
 * space.
 */
export function shortCode(v: unknown): string | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;
  if (/^unverified|^unknown|^none$|^n\/a$/i.test(s)) return null;
  // A real code is short. Anything long is prose.
  if (s.length <= 22) return s;
  const first = s.split(/[;,(]|\s[–—-]\s/)[0].trim();
  return first.length <= 22 && !/unverified/i.test(first) ? first : null;
}

/** First sentence of a longer note, for a card-level preview. */
export function firstSentence(v: unknown, max = 150): string | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;
  const cut = s.split(/(?<=\.)\s/)[0];
  return cut.length > max ? `${cut.slice(0, max - 1).trimEnd()}…` : cut;
}

/**
 * The entry paygrade, as a TOKEN — "E-1", "O-2", "E-4/E-5".
 *
 * The research data routinely puts explanatory PROSE in this field ("E-1 (E-3
 * possible via the Coast Guard advanced-paygrade programme — college credits,
 * JROTC/ROTC, scouting...)"). Piping that straight into a 60px display tile
 * rendered a 200-character sentence in headline type. Same class of bug as the
 * chip that became an ellipse, and the "OF 40" that was the word "of".
 *
 * The lesson, applied here permanently: a UI slot sized for a token must EXTRACT
 * a token. It must never trust the field to be short — not even when I am the one
 * who wrote the field.
 */
export function shortPaygrade(v: unknown): string | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;
  const m = s.match(/\b([EWO]-\d)\b(?:\s*\/\s*([EWO]-\d))?/);
  if (m) return m[2] ? `${m[1]}/${m[2]}` : m[1];
  return s.length <= 10 ? s : null;
}

/**
 * Total training weeks — and whether that total can be trusted.
 *
 * A stage with an unknown length contributes 0, which silently produces a
 * confident-looking wrong number. The Coast Guard rescue-swimmer pipeline showed
 * "8 weeks of training" — one of the most punishing courses in the U.S. military
 * — because its 'A' School length was unverified and counted as zero. A confident
 * number computed from an unknown is worse than no number.
 */
export function trainingWeeks(stages: { length_weeks?: number | string }[] | undefined): {
  weeks: number;
  complete: boolean;
  unknownStages: number;
  label: string;
} {
  const list = stages ?? [];
  let weeks = 0;
  let unknown = 0;
  for (const st of list) {
    const n = Number(st?.length_weeks);
    if (Number.isFinite(n) && n > 0) weeks += n;
    else unknown++;
  }
  const complete = list.length > 0 && unknown === 0;
  const label =
    list.length === 0
      ? 'Not published'
      : complete
        ? `${weeks}`
        : weeks > 0
          ? `${weeks}+`
          : '—';
  return { weeks, complete, unknownStages: unknown, label };
}
