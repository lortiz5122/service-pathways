import { ADVANCED_ENTRY, basicPay } from '../lib/paycalc';
import { Chip, Note, SectionHead } from './Bits';

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

/** What an entry grade is worth per year, versus starting at E-1. */
function worth(grade: string): { monthly: number; annual: number } | null {
  const e1 = basicPay('E-1', '<2');
  const g = basicPay(grade, '<2');
  if (e1 === null || g === null || g <= e1) return null;
  return { monthly: g - e1, annual: (g - e1) * 12 };
}

type Program = {
  program: string;
  plain?: string;
  grants: string;
  /** The grade DIFFERS BY BRANCH — and so does the money. */
  grants_by_branch?: Record<string, string>;
  branches: string[];
  requirement: string;
  typical_time?: string;
  verbatim?: string;
  notes?: string;
  source?: string;
  tier?: string;
};

/**
 * How to enlist above E-1.
 *
 * Two bugs are fixed here permanently, and both were the same bug wearing
 * different clothes:
 *
 *  1. The grade badge held the PROSE "E-3 (E-2 in the Air Force)" and rendered
 *     clipped mid-word as "E-3 (E-2 in the A". A badge sized for a token must
 *     hold a token. This is the fourth time that class of bug has shipped.
 *
 *  2. Worse, and invisible: the money box showed ONE figure (+$5,158, the E-3
 *     value) for a route that grants E-2 in the Air Force — where it is actually
 *     +$3,490. The tile quoted a number that was flatly wrong for one of the
 *     branches it listed. Grades now render PER BRANCH, each with its own money.
 */
export function AdvancedEntry() {
  const programs = (ADVANCED_ENTRY.programs ?? []) as unknown as Program[];
  const rule = (ADVANCED_ENTRY as Record<string, unknown>)
    .the_rule_nobody_mentions as { headline: string; detail: string } | undefined;
  const askEvery = String(
    (ADVANCED_ENTRY as Record<string, unknown>).ask_every_branch ?? '',
  );

  if (!programs.length) return null;

  return (
    <>
      <SectionHead
        title="How to enlist above E-1"
        lede={String(ADVANCED_ENTRY.summary ?? '')}
      />

      {rule ? (
        <Note tone="alert">
          <div>
            <b>{rule.headline}</b> {rule.detail}
          </div>
        </Note>
      ) : null}

      <div className="grid g2" style={{ marginTop: 16 }}>
        {programs.map((p, i) => {
          const byBranch = p.grants_by_branch ?? {};
          const grades = Object.entries(byBranch);
          // Group branches by the grade they grant, so the split is obvious.
          const byGrade = new Map<string, string[]>();
          for (const [branch, grade] of grades) {
            byGrade.set(grade, [...(byGrade.get(grade) ?? []), branch]);
          }
          const gradeRows = [...byGrade.entries()].sort((a, b) =>
            b[0].localeCompare(a[0]),
          );
          const official = p.tier === 'OFFICIAL';
          const badge =
            gradeRows.length === 1 ? gradeRows[0][0] : `${gradeRows[0][0]}*`;

          return (
            <div key={i} className="card adv">
              <div className="adv-head">
                <div>
                  <h3>{p.program}</h3>
                  <div className="chiprow" style={{ marginTop: 6 }}>
                    <Chip tone={official ? 'ok' : 'warn'}>
                      {official ? 'Official' : 'Secondary'}
                    </Chip>
                  </div>
                </div>
                {/* A TOKEN. Never prose. */}
                <span className="adv-grade">{badge}</span>
              </div>

              {p.plain ? <p className="adv-plain">{p.plain}</p> : null}

              {/* Per branch: the grade AND the money it is actually worth. */}
              <div className="adv-grades">
                {gradeRows.map(([grade, branches]) => {
                  const w = worth(grade);
                  return (
                    <div key={grade} className="adv-row">
                      <div className="adv-row-head">
                        <span className="adv-row-grade">{grade}</span>
                        <div className="chiprow">
                          {branches.map((b) => (
                            <Chip key={b}>{b}</Chip>
                          ))}
                        </div>
                      </div>
                      {w ? (
                        <div className="adv-row-money">
                          <b>+{usd(w.annual)}</b> in your first year
                          <span> (+{usd(w.monthly)}/month in basic pay)</span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {gradeRows.length > 1 ? (
                <Note tone="warn">
                  <div>
                    <b>The grade is not the same in every service.</b> Read the rows
                    above before you choose a branch — the same achievement is worth
                    more in some services than others, and the difference compounds
                    for your whole career.
                  </div>
                </Note>
              ) : null}

              <p className="adv-ladder">
                Whatever grade you enter at, you start the promotion ladder a rung
                higher — every promotion after this one comes sooner too.
              </p>

              <details className="adv-more">
                <summary>What it takes</summary>
                <p>{p.requirement}</p>
                {p.typical_time ? (
                  <p>
                    <b>Typical time:</b> {p.typical_time}
                  </p>
                ) : null}
                {p.verbatim ? (
                  <blockquote className="verbatim">"{p.verbatim}"</blockquote>
                ) : null}
                {p.notes ? <p>{p.notes}</p> : null}
                <p className="srcline">{p.source}</p>
              </details>
            </div>
          );
        })}
      </div>

      {askEvery ? (
        <Note tone="warn">
          <div>
            <b>Ask every branch — silence is not refusal.</b> {askEvery}
          </div>
        </Note>
      ) : null}

      <Note tone="alert">
        <div>
          <b>{String(ADVANCED_ENTRY.caveat ?? '')}</b>
        </div>
      </Note>
    </>
  );
}
