# Education Benefits — Narrative Notes

**Command**: `RUN EDU-BENEFITS` | **Retrieved**: 2026-07-12 | **Companion file**: `education-benefits.json`

This file covers the "it depends" conditions the JSON schema can't carry. Read it alongside the structured data before building any UI copy — several of these benefits are frequently confused with each other by recruits and even by recruiters, and the site should not repeat those conflations.

---

## 1. The single most important distinction: what counts as "active duty" for Chapter 33

The Post-9/11 GI Bill (Chapter 33) eligibility percentage is driven entirely by **cumulative qualifying active-duty days under Title 10 orders**. It is **not** driven by total time in service.

**Drills, annual training (AT), and initial skills training (including basic training/boot camp and initial MOS/rating school when performed in a training-duty status rather than under qualifying active-duty orders) do NOT count toward the Chapter 33 day count.** This is stated plainly because it's the most common point of confusion for Guard/Reserve members: someone can serve for years in the Selected Reserve, attend drill every month, and still have zero or very few qualifying days toward Chapter 33 — because Chapter 33 is keyed to Title 10 active-duty mobilization/activation, not to Selected Reserve service itself. That population's GI Bill option is Chapter 1606 (MGIB-SR), a separate, much smaller flat-rate benefit, unless/until they're activated on qualifying active-duty orders long enough to earn Chapter 33 eligibility.

Practical read for the site's copy: **"Are you Guard/Reserve who has never activated?" → point to Chapter 1606, not Chapter 33.** "Have you been activated 90+ aggregate days?" → they may have partial Chapter 33 eligibility layered on top of/instead of Chapter 1606, and should verify their day count directly with VA (eBenefits/VA.gov "GI Bill" statement of benefits), not estimate it themselves.

Source: va.gov/education/benefit-rates/post-9-11-gi-bill-rates/, retrieved 2026-07-12.

---

## 2. Two different "fiscal calendars" are in play — don't blend them

- **Post-9/11 GI Bill (Ch. 33) rates** run on an **academic-year cycle: August 1 – July 31**. The figures in this file (private-school cap $29,920.95, book stipend $1,000/year, online MHA $1,169/month) are the 2025-2026 AY rates, current as of today (2026-07-12). VA's published "future rates" page already shows the 2026-2027 AY increase (private cap $30,908.34, effective Aug 1, 2026) — that's three weeks away from today's date and should be treated as the *upcoming* rate, not yet in effect.
- **Montgomery GI Bill (both Ch. 30 and Ch. 1606) and Tuition Assistance** run on the **federal fiscal year: October 1 – September 30**. The rates in this file for both MGIB chapters are the FY2026 rates (Oct 1, 2025 – Sep 30, 2026) and are current.

If the build surfaces a "current rate" banner, it needs two separate effective-date labels, not one, or it will misstate one of the two programs depending on the time of year.

---

## 3. Tuition coverage: public has no cap, private/foreign does — and Yellow Ribbon exists specifically to bridge that gap

At a public (state) school, Chapter 33 pays net tuition and mandatory fees in full, with **no dollar ceiling**, and the student gets the **in-state rate even without residency** (a Forever GI Bill protection). At a private or foreign school, the same benefit is capped at **$29,920.95/year** (2025-2026 AY). Anything above that cap — which is common at private universities, especially for graduate programs — is where **Yellow Ribbon** applies, but only for students at the **100% eligibility tier**, and only at schools that have opted in and have not exhausted their annual slot allocation for that year. This means two students at the same 100%-tier private school can have different outcomes depending on whether they got one of the school's Yellow Ribbon slots — it is first-come, first-served, not an entitlement. The site should not present Yellow Ribbon as automatic.

Source: va.gov Post-9/11 GI Bill rates page and Yellow Ribbon Program page, both retrieved 2026-07-12.

---

## 4. Housing allowance: keyed to school location, not the student's home, and different for online/foreign

The Monthly Housing Allowance (MHA) uses the **DoD BAH rate for an E-5 with dependents**, at the **zip code of the school**, not the student's residence and not the student's own rank/dependency status. A single E-3 attending school in a high-cost-of-living city gets the same MHA as a married E-7 would, because it's a fixed proxy rate, not tied to the individual. Fully online students get a flat, much lower national rate ($1,169/month, 2025-2026 AY) instead of a location-based rate, and students at foreign schools get a different flat rate ($2,338/month, 2025-2026 AY). All of it is prorated by both the eligibility percentage tier (e.g., a 70%-tier student gets 70% of the calculated MHA) and by rate of pursuit (full-time vs. part-time course load).

**Flagged for verification, not confirmed this session**: the general rule (well established in prior GI Bill guidance, but not re-confirmed via direct VA.gov fetch in this pass) is that **MHA is not paid to students who are still on active duty**, because they're already drawing BAH through their regular military pay — GI Bill MHA is meant for veterans/separated members and Guard/Reserve members not on full-time orders. This matters a great deal for any UI that shows "total GI Bill value" to an active-duty user taking classes while serving — showing them a housing-allowance number they won't actually receive would be a material error. This needs to be confirmed against va.gov before the build ships that calculation.

---

## 5. Montgomery GI Bill (Ch. 30) is a shrinking, opt-in legacy program — and you can't stack it with Chapter 33

MGIB-AD (Chapter 30) requires the member to have affirmatively elected it (and paid a $100/month buy-in for the first 12 months of service — non-refundable if they later don't use the benefit) and holds a high school diploma or GED. It predates Chapter 33 and has been largely superseded by it for anyone who entered service after mid-2001, but some longer-tenured members still carry it, either because they elected it before Chapter 33 existed, or chose not to make the one-time, generally irrevocable switch. **A member draws down only one GI Bill program for a given enrollment period** — this is a real fork in the road for the small population that still has both available, and switching to Chapter 33 forfeits the ability to switch back.

MGIB-AD rate ($2,518.00/month full-time for 3+ years active duty, or $2,043.00/month for 2-3 years) is a flat stipend the student manages directly — unlike Chapter 33, VA does not pay the school directly under Chapter 30, and there is no separate housing/book stipend layered on top; the flat monthly rate is meant to cover everything.

Source: va.gov/education/benefit-rates/montgomery-active-duty-rates, retrieved 2026-07-12.

---

## 6. Chapter 1606 (MGIB-SR): the Guard/Reserve benefit, and why it must never be visually merged with Chapter 33 in the UI

**Label discipline**: Chapter 1606 is the Montgomery GI Bill – **Selected Reserve**. It is a Guard/Reserve-specific, DoD-administered program, structurally and financially a completely different benefit from Chapter 33 (Post-9/11 GI Bill), even though both are colloquially called "the GI Bill." The site must never show a single blended "GI Bill" number that could be either.

- **Rate**: $493.00/month full-time (3/4-time $369.00, 1/2-time $246.00), FY2026 (Oct 1, 2025 – Sep 30, 2026). This is roughly one-fifth of the MGIB-AD flat rate and does not include any VA-paid tuition-to-school or housing component — it's a flat stipend.
- **Obligation**: 6-year Selected Reserve service commitment.
- **No activation required**: this is the inverse of Chapter 33's rule — for Chapter 1606, ordinary drill and annual training service is sufficient to qualify; deployment/activation is not required. A Guard/Reserve member who never activates can still use Chapter 1606, but cannot use Chapter 33 (see Section 1).
- **Space Force flag (UNVERIFIED)**: Space Force has no traditional Selected Reserve component — Guardians instead serve under a single-component "sustained duty" / "not on sustained duty" model established by the Space Force Personnel Management Act (Dec 2023). Whether "not on sustained duty" Guardians qualify for Chapter 1606 the same way a traditional Selected Reservist does was not confirmed in this research pass. This is a real open question for the site's Space Force content and should be checked directly with a Space Force education office or va.gov before publishing a Space Force-specific Chapter 1606 answer.

Source: va.gov/education/benefit-rates/montgomery-selected-reserve-rates, retrieved 2026-07-12; Space Force structure per prior research already in this project (compass_artifact_wf-d8f86b54-1e81-595c-80ab-995e21fd37cb_text_markdown.md, retrieved 2026-07-12).

---

## 7. Tuition Assistance: one DoD-wide cap, but administration and usage rules differ by branch — and Coast Guard sits outside DoD's budget even where its cap matches

All six branches are reported to use the same headline numbers: **$250 per semester credit hour ($166 per quarter hour), capped at $4,500 per fiscal year**. That figure is well-corroborated across multiple independent sources (Congressional Research Service R47875, Military.com, myArmyBenefits) and can be treated as reliable. What is **not** independently confirmed at primary-source level in this pass is the branch-specific *usage* rules layered on top of that cap — e.g., a reported 16-semester-hour annual limit for Army versus 18 for Navy/Marine Corps/Air Force, and Army's reported 130-undergraduate/39-graduate degree credit ceiling. These numbers came from search-engine synthesis, not a direct fetch of each branch's own TA policy page, and should be re-verified (goarmy.com, myarmybenefits.us.army.mil, and equivalent Navy/Air Force/Marine Corps/Coast Guard pages) before the build treats them as fixed.

**Coast Guard sits under DHS, not DoD**, and its TA program is DHS-funded even though the dollar figures found in this pass matched the DoD-wide standard. This is exactly the kind of "shares the number, doesn't share the budget line" distinction the master research plan calls out — administratively it is a separate program that happens to be numerically aligned, not a DoD program Coast Guard participates in.

**Space Force's TA figures in the JSON are an inference, not a sourced fact.** Because Space Force is organized under the Department of the Air Force, it's reasonable to expect it follows the same AFVEC-administered policy as Air Force — but this was not independently confirmed this session and is flagged as such in the JSON.

---

## 8. Credentialing Assistance / COOL: genuinely uneven data quality across branches — say so rather than paper over it

A direct fetch attempt to `cool.osd.mil` (the DoD-wide COOL portal, and the correct primary source for every branch's Credentialing Assistance program) failed with a TLS certificate error in this research pass and was not retried, because the ~10-call tool budget for this command was already exhausted. As a result, credentialing assistance data quality varies markedly by branch in the JSON:

- **Army** is the best-sourced: Credentialing Assistance was cut from a $4,000/fiscal-year cap to **$2,000/fiscal-year** in 2024, with a reported lifetime limit of 3 credentials per 10 years of service, and commissioned officers (O1-O10) reportedly ineligible. This is corroborated by a March 2026 Stars and Stripes piece on the Army tightening the program's rules and funding, which is a stronger source than a generic aggregator.
- **Air Force** is moderately sourced: a reported $4,500/year cap via the Air Force Virtual Education Center (AFVEC), from search synthesis only.
- **Navy, Marine Corps, and Coast Guard** are explicitly left with **no dollar figure** (zeroed and flagged UNVERIFIED in the JSON) rather than guessed, because no reliable figure surfaced for them in this pass. The Coast Guard case is a specific caution: a search summary attributed a $4,500 figure to Coast Guard credentialing, but on inspection it reads as a description of Coast Guard's *Tuition Assistance* program, not Credentialing Assistance specifically — treating it as a CA figure would likely have been a fabrication by conflation, so it was excluded rather than used.
- **Space Force** CA figures are an inference from its Department-of-the-Air-Force affiliation, not a sourced fact, for the same reason as its TA figures above.

**Recommended next step before this section ships on the site**: a follow-up fetch pass targeting `cool.osd.mil/usn/`, `cool.osd.mil/usmc/`, `cool.osd.mil/uscg/`, and `cool.osd.mil/af/` directly (the certificate error may be transient or tied to the specific fetch tool used in this session) to fill the Navy, Marine Corps, Coast Guard, and confirm the Air Force/Space Force figures.

---

## Sources consulted (this session)

- va.gov: Post-9/11 GI Bill rates, Yellow Ribbon Program, benefit-rates hub, Montgomery GI Bill Active Duty rates, Montgomery GI Bill Selected Reserve rates, "how we determine your percentage" resource page.
- myarmybenefits.us.army.mil: Tuition Assistance, Army COOL pages.
- recruiting.army.mil: Tuition Assistance Fact Sheet (PDF).
- stripes.com: March 2026 reporting on Army credentialing-assistance funding changes.
- military.com and Congress.gov (CRS Report R47875): Tuition Assistance program background, cross-branch.
- cool.osd.mil: cited as the authoritative source for Credentialing Assistance, but a direct fetch failed (TLS certificate error) and was not independently retrieved this session — flagged throughout rather than guessed.

## Fields left UNVERIFIED (see JSON `unverified` array for the full list)

1. Whether Post-9/11 GI Bill MHA is paid to still-serving active-duty students (high-confidence general knowledge, not re-confirmed by direct fetch this session).
2. Space Force eligibility mechanics for Chapter 1606, given its non-traditional reserve structure.
3. Branch-specific Tuition Assistance semester-hour/degree usage limits (Army 16 hrs, others 18 hrs) — search-sourced only.
4. Space Force Tuition Assistance and Credentialing Assistance figures — inferred from Department of the Air Force structure, not directly sourced.
5. Coast Guard Tuition Assistance/Credentialing Assistance administration specifics and possible TA/CA conflation in source material.
6. Navy, Marine Corps, and Coast Guard Credentialing Assistance (COOL) dollar caps — no reliable figure found; left at $0/UNVERIFIED rather than guessed.
7. 2026-2027 AY Post-9/11 GI Bill future rates (private cap $30,908.34, online MHA $1,261/month) — reported by search synthesis, not fetch-verified.
