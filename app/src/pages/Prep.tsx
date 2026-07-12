import { useState } from 'react';
import {
  AFQT_CATEGORIES,
  ASVAB_FORMATS,
  BRANCHES,
  CAVEATS,
  COMPOSITE_SYSTEMS,
  DEP_FACTS,
  FITNESS,
  MEPS_BRING,
  MEPS_DAY,
  MEPS_FACTS,
  PROCESS_STEPS,
  RETAKE_POLICY,
  STUDY_RESOURCES,
  SUBTESTS,
  WAIVER_APPROVAL,
  WAIVER_CATEGORIES,
  WAIVER_NO_GO,
  WAIVER_STATS,
  afqtCategory,
  branchById,
} from '../data/content';
import { evaluate, type Tier } from '../data/eligibility';
import { Emblem } from '../branding/Emblem';
import { BRANCH_THEME } from '../lib/types';
import { Chip, Note, SectionHead, TickList } from '../components/Bits';
import { MarkDisclaimer } from '../components/Disclaimer';

function Screener() {
  const [afqt, setAfqt] = useState(50);
  const [tier, setTier] = useState<Tier>('diploma');
  const cat = afqtCategory(afqt);
  const results = evaluate(afqt, tier);

  return (
    <div className="card">
      <div className="calc">
        <div>
          <div className="field">
            <label htmlFor="afqt">
              AFQT percentile <b>{afqt}</b>
            </label>
            <input
              id="afqt"
              type="range"
              min={1}
              max={99}
              value={afqt}
              onChange={(e) => setAfqt(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label htmlFor="tier">Education tier</label>
            <select
              id="tier"
              value={tier}
              onChange={(e) => setTier(e.target.value as Tier)}
            >
              <option value="diploma">Tier 1 — high school diploma</option>
              <option value="ged">Tier 2 — GED</option>
            </select>
          </div>

          <Note>
            Earning about 15 college credits reclassifies a GED holder as Tier 1,
            dropping you to the lower diploma minimum.
          </Note>
        </div>

        <div>
          <div className="readout">
            <div className="big">{afqt}</div>
            <div className="cat">
              Category {cat?.cat} — {cat?.note}
            </div>
            <div className="formula">AFQT = 2 × VE + AR + MK</div>
          </div>

          <div className="eligbars">
            {results.map((r) => {
              const t = BRANCH_THEME[r.branch];
              const cls =
                r.verdict === 'pass'
                  ? 'pass'
                  : r.verdict === 'fail'
                    ? 'fail'
                    : 'unknown';
              return (
                <div key={r.branch} className={`eligrow ${cls}`} title={r.detail}>
                  <Emblem branch={r.branch} size={22} />
                  <span className="nm">{t.short}</span>
                  <span className="st">{r.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Note tone="warn">
        <div>
          <b>Why this takes a percentile, not subtest scores.</b> The AFQT formula
          is public, but the DoD norm tables that convert a raw composite into a
          1–99 percentile are not. Rather than fake that curve, this asks for the
          percentile directly. Take a free practice test to get yours.
        </div>
      </Note>
    </div>
  );
}

export default function Prep() {
  return (
    <div className="wrap">
      <SectionHead
        title="Qualifying"
        lede="How the ASVAB, fitness standards, MEPS, the Delayed Entry Program and waivers actually gate entry. Policy is in active flux across all six branches in 2025–2026 — reconfirm every number against the current official publication before it drives a decision."
      />
      <MarkDisclaimer />

      {/* ------------------------------------------------------- ASVAB */}
      <SectionHead
        title="1 · The ASVAB gates you twice"
        lede="Your AFQT percentile decides whether you can enlist. Separate line scores decide which job you can hold. These are different tests of the same exam and people conflate them constantly."
      />

      <Screener />

      <div className="grid g2" style={{ marginTop: 18 }}>
        <div className="card">
          <h3>The three formats</h3>
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Format</th>
                  <th>Where</th>
                  <th>Adaptive</th>
                  <th>Retake</th>
                </tr>
              </thead>
              <tbody>
                {ASVAB_FORMATS.map((f) => (
                  <tr key={f.format}>
                    <td>
                      <strong>{f.format}</strong>
                      <br />
                      <span className="srcline">{f.questions} questions</span>
                    </td>
                    <td>{f.where}</td>
                    <td>{f.adaptive}</td>
                    <td>{f.retake}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3>The ten subtests</h3>
          <p>The four marked in gold are the only ones that feed the AFQT.</p>
          <div className="chiprow" style={{ marginTop: 12 }}>
            {SUBTESTS.map((s) => (
              <Chip key={s.code} tone={s.afqt ? 'brand' : 'neutral'}>
                {s.code} — {s.name}
              </Chip>
            ))}
          </div>

          <h3 style={{ marginTop: 18 }}>Categories</h3>
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Cat</th>
                  <th>Range</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody>
                {AFQT_CATEGORIES.map((c) => (
                  <tr key={c.cat}>
                    <td>
                      <strong>{c.cat}</strong>
                    </td>
                    <td>
                      {c.min}–{c.max}
                    </td>
                    <td>{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <SectionHead
        title="Line scores — the job gate"
        lede="Each specialty sets its own composite minimum. You also need an open slot, clearance eligibility, and medical qualification. A high AFQT alone gets you none of that."
      />
      <div className="grid g2">
        {COMPOSITE_SYSTEMS.map((c) => (
          <div key={c.branch} className="card">
            <h3>{c.branch}</h3>
            <p>{c.body}</p>
            <ul className="ticklist" style={{ marginTop: 10 }}>
              {c.examples.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid g2" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Retake policy</h3>
          <TickList items={RETAKE_POLICY} />
        </div>
        <div className="card">
          <h3>Free official study resources</h3>
          <ul className="ticklist">
            {STUDY_RESOURCES.map((r) => (
              <li key={r.name}>
                <a href={r.href} target="_blank" rel="noreferrer">
                  {r.name}
                </a>{' '}
                — {r.what}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ----------------------------------------------------- fitness */}
      <SectionHead
        title="2 · Fitness standards"
        lede="All six branches changed their fitness test in 2025–2026. Anything you read that predates that is wrong."
      />
      <div className="grid g2">
        {FITNESS.map((f) => {
          const b = branchById(f.branch);
          const t = BRANCH_THEME[f.branch];
          return (
            <div
              key={f.branch}
              className="card branch-themed"
              style={
                {
                  '--bc': t.primary,
                  '--bc-accent': t.accent,
                } as React.CSSProperties
              }
            >
              <header className="branch-head">
                <Emblem branch={f.branch} size={44} />
                <div>
                  <h3>{b.name}</h3>
                  <div className="spec-code">{f.test}</div>
                </div>
              </header>

              <ul className="ticklist" style={{ marginTop: 12 }}>
                {f.events.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>

              <div className="stdlist">
                {f.standards.map((s, i) => (
                  <div key={i}>
                    <div className="k">
                      {s.label}{' '}
                      {s.unverified ? <Chip tone="warn">Unverified</Chip> : null}
                    </div>
                    <div className="d">{s.value}</div>
                  </div>
                ))}
              </div>

              <Note tone="warn">
                <div>
                  <b>2026 change.</b> {f.change2026}
                </div>
              </Note>
              <p className="srcline">Source: {f.source}</p>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------- MEPS */}
      <SectionHead
        title="3 · Recruiter → MEPS → DEP → ship"
        lede="From first contact to a ship date commonly runs one to three months at the short end, and frequently much longer — up to the full 365-day DEP limit. Medical or legal review is the most common delay."
      />
      <div className="grid g2">
        <div className="card">
          <h3>The eight steps</h3>
          <div className="timeline">
            {PROCESS_STEPS.map((s) => (
              <div key={s.n} className="tl-item">
                <div className="n">Step {s.n}</div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <h3>The MEPS day</h3>
            <div className="grid g2" style={{ marginBottom: 12 }}>
              {MEPS_FACTS.map((f) => (
                <div key={f.label}>
                  <div className="k">{f.label}</div>
                  <div className="v">{f.value}</div>
                </div>
              ))}
            </div>
            <TickList items={MEPS_DAY} />
          </div>
          <div className="card">
            <h3>Bring</h3>
            <TickList items={MEPS_BRING} />
          </div>
          <Note tone="alert">
            <div>
              <b>What a recruiter cannot promise.</b> A job, bonus, duty station or
              ship date that is not written into the enlistment contract (DD Form 4)
              and its annexes. Verbal assurances are unenforceable. Get every
              guarantee in writing before you sign.
            </div>
          </Note>
        </div>
      </div>

      {/* -------------------------------------------------------- DEP */}
      <SectionHead
        title="4 · The Delayed Entry Program"
        lede="You have already enlisted, but you are unpaid, receive no benefits, and are not subject to the UCMJ. It is also the easiest phase to leave."
      />
      <div className="grid g2">
        {DEP_FACTS.map((d) => (
          <div key={d.label} className="card">
            <h3>{d.label}</h3>
            <p>{d.body}</p>
          </div>
        ))}
      </div>

      {/* ---------------------------------------------------- waivers */}
      <SectionHead
        title="5 · Waivers"
        lede="Most young people need one. The posture tightened sharply in July 2025."
      />
      <div className="grid g3">
        {WAIVER_STATS.map((w) => (
          <div key={w.stat} className="card stat">
            <div className="n">{w.stat}</div>
            <div className="l">{w.label}</div>
            <div className="s">{w.source}</div>
          </div>
        ))}
      </div>

      <div className="grid g2" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Approval rate by branch (2022 requests)</h3>
          {WAIVER_APPROVAL.map((w) => (
            <div key={w.branch} className="bar">
              <span className="nm">{w.branch}</span>
              <span className="track">
                <span className="fill" style={{ width: `${w.rate}%` }} />
              </span>
              <span className="pct">{w.rate}%</span>
            </div>
          ))}
          <p className="srcline">
            2023 DoD Inspector General review, via Military.com (Apr 29, 2025).
            Waivers are not portable — a denial by one service can be re-attempted
            at another.
          </p>
        </div>

        <div className="stack">
          <div className="card">
            <h3>Categories</h3>
            <div className="chiprow">
              {WAIVER_CATEGORIES.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
          </div>
          <div className="card">
            <h3>No longer waiverable</h3>
            <p>
              On July 22, 2025 the Secretary of Defense issued "Medical Conditions
              Disqualifying for Accession," making these ineligible for any waiver:
            </p>
            <TickList items={WAIVER_NO_GO} />
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- caveats */}
      <SectionHead title="Caveats" />
      <div className="card">
        <TickList items={CAVEATS} />
      </div>

      <div className="branch-strip" style={{ marginTop: 24 }}>
        {BRANCHES.map((b) => (
          <div key={b.id} className="branch-mini">
            <Emblem branch={b.id} size={34} />
            <div>
              <div className="k">{b.short}</div>
              <div className="d">
                AFQT {b.afqtTier1} / {b.afqtTier2}
                {b.afqtConflict ? <Chip tone="warn">Conflict</Chip> : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
