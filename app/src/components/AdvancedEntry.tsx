import { ADVANCED_ENTRY, basicPay } from '../lib/paycalc';
import { Chip, Note, SectionHead } from './Bits';

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

/** The extra money an advanced entry grade is worth, vs starting at E-1. */
function worth(grants: string): { grade: string; monthly: number; annual: number } | null {
  const m = grants.match(/\bE-(\d)\b/);
  if (!m) return null;
  const grade = `E-${m[1]}`;
  const e1 = basicPay('E-1', '<2');
  const g = basicPay(grade, '<2');
  if (e1 === null || g === null || g <= e1) return null;
  return { grade, monthly: g - e1, annual: (g - e1) * 12 };
}

/**
 * How to enlist above E-1.
 *
 * The most actionable thing on this site. "E-3 instead of E-1" is meaningless to
 * a 16-year-old until you show the money — so every card does.
 */
export function AdvancedEntry() {
  const programs = ADVANCED_ENTRY.programs ?? [];
  const rule = (ADVANCED_ENTRY as Record<string, unknown>)
    .the_rule_nobody_mentions as
    | { headline: string; detail: string }
    | undefined;
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
          const w = worth(String(p.grants ?? ''));
          const rec = p as unknown as {
            plain?: string;
            verbatim?: string;
            tier?: string;
            typical_time?: string;
            corroboration?: { branch: string; tier: string; quote: string; source: string }[];
          };
          const official = rec.tier === 'OFFICIAL';

          return (
            <div key={i} className="card adv">
              <div className="adv-head">
                <div>
                  <h3>{p.program}</h3>
                  <div className="chiprow" style={{ marginTop: 6 }}>
                    {(p.branches ?? []).map((b) => (
                      <Chip key={b}>{b}</Chip>
                    ))}
                    <Chip tone={official ? 'ok' : 'warn'}>
                      {official ? 'Official' : 'Secondary'}
                    </Chip>
                  </div>
                </div>
                <span className="adv-grade">{p.grants}</span>
              </div>

              {rec.plain ? <p className="adv-plain">{rec.plain}</p> : null}

              {/* The money. This is the argument. */}
              {w ? (
                <div className="adv-worth">
                  <div className="k">You'd start at {w.grade}, not E-1</div>
                  <div className="n">+{usd(w.annual)}</div>
                  <div className="s">
                    in your first year alone (+{usd(w.monthly)}/month in basic pay).
                    And you start your whole career a step up the ladder — every
                    promotion after this one comes sooner.
                  </div>
                </div>
              ) : null}

              <details className="adv-more">
                <summary>What it takes</summary>
                <p>{p.requirement}</p>
                {rec.typical_time ? (
                  <p>
                    <b>Typical time:</b> {rec.typical_time}
                  </p>
                ) : null}
                {rec.verbatim ? (
                  <blockquote className="verbatim">"{rec.verbatim}"</blockquote>
                ) : null}
                {p.notes ? <p>{p.notes}</p> : null}
                {rec.corroboration?.length ? (
                  <div className="corrob">
                    {rec.corroboration.map((c, j) => (
                      <div key={j}>
                        <Chip tone={c.tier === 'OFFICIAL' ? 'ok' : 'warn'}>
                          {c.branch} · {c.tier}
                        </Chip>
                        <p>"{c.quote}"</p>
                        <p className="srcline">{c.source}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
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
