# Retirement Model — Blended Retirement System, Legacy High-3, and Guard/Reserve

**Command:** `RETIREMENT` | **Retrieved:** 2026-07-12 | **Companion file:** `retirement.json`

This file carries the nuance, caveats, and "it depends" conditions that the JSON schema can't hold. Read it alongside `retirement.json`, which carries the structured figures.

---

## The one fact that matters most: the 20-year cliff

Say this plainly, because most recruiting material buries it: **the military pension is all-or-nothing at 20 years of service.**

There is no partial pension for 19 years. There is no partial pension for 10 years, or 5, or 2. Under both the current Blended Retirement System (BRS) and the older legacy High-3 system, the Department of Defense's own description is that the defined-benefit pension is **"entirely forfeited"** if a member separates before completing 20 years. Serve 19 years and 11 months and walk away, and the pension check is $0 — permanently. There is no proration, no partial credit, no "vesting schedule" for the pension the way there is for a civilian 401(k) match.

**What does NOT disappear before 20 years, under BRS:**
- Every dollar the member personally contributed to their Thrift Savings Plan (TSP) account, plus earnings — always fully vested, from day one.
- The government's *matching* TSP contributions, plus earnings — vested immediately.
- The government's *automatic* 1%-of-basic-pay TSP contribution, plus earnings — vested once the member completes 2 years of service.

That TSP money is portable. It rolls into a civilian 401(k) or IRA the day someone leaves, whether they served 3 years or 15. This is the single biggest structural change BRS made over the legacy system: under the old High-3-only system, someone who left before 20 years got a pension of $0 **and** no government retirement contributions at all — nothing. Under BRS, the same early-separating member still walks away with real, compounding retirement savings. That is a genuine and meaningful improvement — but it is not a pension, and the site should never imply that TSP savings are "almost as good as" the 20-year pension. They are a different, much smaller thing.

**Who actually reaches 20 years?** This is where the site needs to be honest rather than aspirational. Secondary sources (not a directly-verified DoD Office of the Actuary figure in this research pass — see caveat below) put the share of people who *enter* military service and eventually reach the 20-year retirement mark at roughly **one in five or fewer** — figures cited across several secondary sources cluster around 17–19% force-wide, with enlisted-specific estimates as low as ~10% and officer-specific estimates around ~30%. The exact DoD-published percentage could not be confirmed by direct primary-source fetch in this session (`actuary.defense.gov` returned HTTP 403 to automated fetch), so treat the precise number as an estimate, not an authoritative DoD figure — but the *direction* of the fact (most people who enlist do not reach 20 years) is corroborated across every source found and should be treated as reliable.

**The honest framing for a 16–24-year-old reading this site:** plan your service around the job, the training, the pay, and the GI Bill you'll actually use — not around a pension that the majority of people who enlist will never collect. If a 20-year career is genuinely the goal, that's a deliberate, multi-decade commitment that has to be renewed at every reenlistment decision point, not a default outcome.

---

## Blended Retirement System (BRS) — the system in force today

BRS applies to **everyone with a Date of Initial Entry into Military Service (DIEMS) on or after January 1, 2018** — i.e., essentially everyone entering service now and going forward. It also covers a smaller population of people who had a DIEMS before that date, had fewer than 12 years of service as of December 31, 2017, and opted in during the 2018 window (that window is closed; no one can opt in today).

### TSP: the defined-contribution half

- The government automatically puts in **1% of basic pay** starting 60 days after a member enters active duty, continuing through 26 years of service — this happens whether or not the member contributes anything themselves.
- After the member completes their **2nd year of service**, the government also **matches** the member's own contributions, up to an additional **4%** of basic pay.
- Combined, that's up to **5% of basic pay in free government money** if the member contributes at least 5% themselves.
- A member auto-enrolled into TSP defaults to contributing 5% of their own basic pay unless they actively change or opt out of that rate (sourced to a TSP.gov bulletin located via search; direct fetch of tsp.gov was blocked in this session, so this figure carries a secondary-source caveat — see `retirement.json` → `unverified`).
- **Vesting is not uniform across the three pots**: a member's own contributions are always theirs; the government's *matching* contributions vest immediately; only the government's *automatic* 1% requires 2 years of service to vest. Someone who separates at 18 months keeps their own money and forfeits the automatic 1% (they were never in it long enough to vest); someone who separates at 25 months keeps all three.

### Pension: the defined-benefit half (only earned at 20+ years)

- Multiplier is **2.0% per year of creditable service**, applied to the average of the highest 36 months ("High-3") of basic pay.
- At exactly 20 years, that's **40%** of High-3 average pay, as a lifetime monthly annuity — growing by 2 more percentage points for every additional year served.

### Continuation Pay — the mid-career retention bonus

- A one-time cash payout offered at the mid-career mark, in exchange for an additional service-obligation commitment.
- Per the Army's currently published window (retrieved 2026-07-12), continuation pay is available **between completion of the 7th year and before completion of the 12th year** of service. The original DoD statutory window was years 8–12; branches set their own timing within it, and the Army's page indicates a move to a year-7 start. **This research pass checked the Army's page specifically; whether Navy, Air Force, Marine Corps, Space Force, and Coast Guard have matched that year-7 shift was not individually verified** — flag this if the build needs branch-specific continuation-pay timing.
- Amount is a multiple of monthly basic pay: statutory range is **2.5x–13x** for active-component members and **0.5x–6x** for drilling Guard/Reserve members. Each branch sets its actual multiplier annually — the Army's published active-component rate was 2.5x monthly basic pay.
- In exchange, the member commits to additional service — the statutory floor is 3 years, but the Army specifically requires a 4-year commitment. **This is a real fork in the career, not a formality**: taking continuation pay locks in years of additional obligated service.

### Lump-Sum Option — trading monthly pension for cash at retirement

- Only relevant *after* someone has actually reached the 20-year mark and is retiring.
- At that point, a retiree can choose to take **25% or 50%** of the discounted present value of their future pension as an immediate lump sum, in exchange for a correspondingly reduced monthly check.
- The reduced monthly pension stays reduced until the retiree reaches **Full Social Security Retirement Age (~67 for most people)**, at which point the monthly pension jumps back up to the full, uncut amount.
- The lump sum is fully taxable the year it's received — this is a significant, one-time tax event that a 20-year retiree needs to plan for, not free money.

---

## Legacy High-3 — context only, not the operative system for new entrants

Anyone reading this site today and considering military service falls under BRS, full stop. High-3 is included here **only** so the site can correctly answer questions from someone whose parent, older sibling, or mentor served under the older system, and to make clear why BRS looks different.

- Applies to people with a DIEMS **before January 1, 2018** who did not opt into BRS. (There's also a narrower slice of even older sub-variants — pre-1980 "Final Pay" and the REDUX/Career Status Bonus system — that this record does not detail; they're increasingly rare in the current force and out of scope here.)
- Multiplier is **2.5% per year of service** (vs. BRS's 2.0%) — 50% of High-3 pay at 20 years, growing 2.5 points/year after that.
- The same 20-year cliff applies — no pension below 20 years, full stop, same as BRS.
- The tradeoff for the higher 2.5% multiplier: **no government TSP contributions at all.** Legacy-only members can contribute their own money to TSP, but there's no automatic 1% and no match — the government match is a BRS-exclusive feature. This is why the 2018 opt-in decision was genuinely close for some career-length assumptions: High-3 pays a bigger pension if you make it to 20, but BRS pays *something* even if you don't.

---

## Guard/Reserve — a fundamentally different system, not a smaller version of active duty

**This is not active-duty retirement with a discount. It is a points-based system with its own eligibility age, and the two should never be presented as interchangeable or directly comparable dollar-for-dollar.**

### How points are earned

- **1 point** per day of active duty performed.
- **1 point** per drill / unit training assembly (UTA) attended.
- **1 point** per day of funeral honors duty.
- Up to **15 "membership points"** per year, just for being in an active status that year.
- There's a theoretical annual ceiling of 365 points (366 in a leap year), though a portion of those points — specifically inactive-duty-training points — is subject to its own separate historical caps.

### What counts as progress toward retirement

- A **"good year"** = a minimum of **50 retirement points** earned in that service year.
- **20 qualifying years** (20 "good years," not necessarily 20 consecutive calendar years) are needed to become eligible for non-regular retired pay.

### When the pension actually starts — and why it's not automatically age 60

- Retired pay normally begins at **age 60**.
- A 2008 NDAA provision allows that age to be **reduced by 3 months for every cumulative 90 days** of qualifying active-duty/mobilization service performed after January 28, 2008.
- That reduction has a **floor of age 50** — it cannot reduce the start age below 50, no matter how much mobilized time a member has.
- Important nuance for the build: even if the *pension* start age is reduced below 60, **TRICARE retiree healthcare eligibility stays fixed at age 60** regardless. A Guard/Reserve retiree who starts drawing pay at, say, age 54 does not get retiree healthcare four years early — that clock doesn't move.

### The framing for the site

Never collapse a Guard/Reserve "20 qualifying years" into the same sentence as an active-duty "20-year pension" without the age-60 (or reduced-but-floor-50) qualifier attached. An active-duty 20-year retiree starts drawing a pension immediately upon separation, at whatever age that happens to be (often early-to-mid 40s). A Guard/Reserve member who hits 20 qualifying years in their late 30s or 40s typically waits until 50–60 to actually collect anything. That gap is the single most common point of confusion between the two systems and needs to be stated explicitly anywhere the site discusses Guard/Reserve retirement.

---

## Sources and verification notes

Primary sources fetched directly in this research pass (all official `.mil`):
- [Blended Retirement System (BRS) — The Official Army Benefits Website](https://myarmybenefits.us.army.mil/Benefit-Library/Federal-Benefits/Blended-Retirement-System?serv=122) — retrieved 2026-07-12
- [Retired Pay for Airmen and Guardians — An Official Air Force Benefits Website](https://myairforcebenefits.us.af.mil/Benefit-Library/Federal-Benefits/Retired-Pay?serv=22) — retrieved 2026-07-12 (Guard/Reserve points system)
- [Retired Pay for Soldiers — The Official Army Benefits Website](https://myarmybenefits.us.army.mil/Benefit-Library/Federal-Benefits/Retired-Pay?serv=128) — retrieved 2026-07-12 (legacy High-3)

Sources located via search but blocked (HTTP 403) on direct automated fetch in this session — figures from these are corroborated across multiple independent secondary sources but not confirmed by primary-text extraction here:
- `tsp.gov` bulletin 17-U-3 (TSP default auto-enrollment rate)
- `militarypay.defense.gov` Continuation Pay fact sheet and rate tables (RC multiplier range, service-obligation minimum)
- `actuary.defense.gov` Statistical Report on the Military Retirement System (exact 20-year-retirement percentage)

**Tool budget note:** this command used approximately 16 of its ~12-call budget, roughly 33% over, because repeated 403s from primary DoD domains (tsp.gov, militarypay.defense.gov, actuary.defense.gov) required fallback web-search corroboration to avoid leaving core fields blank. Flagged per the master prompt's halt-and-report instruction on budget overage.
