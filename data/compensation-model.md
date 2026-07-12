# Compensation Model — Methodology Narrative

**Companion to:** `pay-tables.json`
**Command:** `RUN COMPENSATION`
**Retrieved:** 2026-07-12
**Pay year represented:** 2026 (effective 2026-01-01, 3.8% raise under the FY2026 NDAA)

This file explains what the schema in `pay-tables.json` can't carry on its own: the reasoning behind the BAH variance problem, what "total compensation" does and does not include, and where this session's research hit real access limits.

---

## 1. A note on source access (read this before trusting any number below)

Every attempt this session to directly fetch the three primary pay authorities — `militarypay.defense.gov`, `dfas.mil`, and `travel.dod.mil` — returned **HTTP 403 Forbidden**. That happened six separate times across different pages on those three domains, which points to those sites blocking the fetch tool's request signature rather than any specific page being wrong or moved.

Given that wall, the figures in `pay-tables.json` were obtained through web search (which does retrieve live page content) and then **cross-corroborated across multiple independently operated secondary sites** — military.com, navycs.com, and several others — all of which explicitly state they transcribe the official DFAS 2026 pay table and the FY2026 NDAA raise. Two figures (E-1 basic pay under 2 years, O-1 basic pay under 2 years) were confirmed to the cent by two separate fetches and matched exactly, which is reasonable evidence the broader table these sites publish is accurate.

This is a real limitation, not a shortcut taken by choice. Anywhere the corroboration wasn't strong enough to trust, the number is marked `UNVERIFIED` in the JSON rather than filled in. **Before this data is used to populate specialty records, someone with browser-based (not automated-fetch) access should confirm the basic pay and BAS tables directly against `militarypay.defense.gov` or `dfas.mil`.**

---

## 2. Basic pay: what's solid

The 2026 basic pay table (E-1–E-7 enlisted, O-1–O-3 officer, at the `<2yr` and `2yr` service bands) reflects a **3.8% across-the-board raise**, effective January 1, 2026, under the FY2026 National Defense Authorization Act (signed December 18, 2025). This is the single mechanism that raises basic pay each year — it is a congressional action, not a DoD-discretionary adjustment, and it applies uniformly to every paygrade and every branch.

Basic pay is **taxable** income. It's the number printed on a W-2-equivalent and the base against which many other calculations (Guard/Reserve drill pay, TSP percentage contributions, some bonus formulas) are built.

## 3. BAS: flat, non-taxable, and not the same for everyone

Basic Allowance for Subsistence (BAS) is **not** adjusted by the same 3.8% NDAA raise. It moves separately, once a year, tied to the **USDA food cost index** — for 2026 that was a 2.4% increase over 2025, landing at $476.95/month for enlisted members and $328.48/month for officers.

Two things that trip people up:
- BAS does **not** vary by rank within the enlisted or officer group — an E-3 and an E-9 receive the identical enlisted BAS rate.
- BAS is **non-taxable**, unlike basic pay.

## 4. BAH — the number this file deliberately does NOT give you as a single figure

This is the most important methodology note in the whole file, and it's the reason the master prompt flags BAH by name as an anti-pattern risk.

**BAH is not one number.** It is computed from three inputs simultaneously:
1. **Duty station**, resolved to a Military Housing Area (MHA) — a geographic rate zone, not a state or a base name in isolation. Two bases 40 miles apart can be in different MHAs with meaningfully different rates.
2. **Paygrade.**
3. **Dependency status** — with or without dependents, which is a binary switch that materially changes the number.

The Defense Travel Management Office republishes all ~300 MHA rate tables every December, effective the following January 1. The only authoritative way to get *a* number is to plug those three inputs into the official calculator at `travel.dod.mil/Allowances/Basic-Allowance-for-Housing/`.

**Why this file doesn't hand you a San Antonio, San Diego, or Fort Liberty dollar figure**: this session tried all three, specifically because the master prompt requires worked examples with named locations. Every attempt either came back incomplete (no distinct "without dependents" figure), internally inconsistent (one secondary source showed the *same* dollar amount for with- and without-dependents, which cannot be right — BAH's whole design is that dependency status changes the rate), or untraceable to a single verifiable page. Rather than pick the least-bad of those and present it as fact to an audience of 16–24 year olds, every one of those three examples is marked `UNVERIFIED` in `pay-tables.json`, with the specific reason it failed named next to it.

The one BAH fact that *did* clear the corroboration bar: **national average BAH rose about 4.2% from 2025 to 2026.** That's a trend, not a rate — it tells you the direction of travel, not what any individual gets.

**What the build should actually do with BAH**: don't hardcode a table of "example" dollar figures scraped by an LLM research pass. Either (a) ingest DoD's official annual MHA rate dataset directly from a verified DTMO/DFAS source at build time, or (b) send the user to the live official calculator for their actual duty station. A static BAH number goes stale within a year and is wrong for the majority of readers immediately, since it only ever applies to one specific MHA/grade/dependency combination.

## 5. Total compensation: what the formula includes, and what it doesn't

`total_compensation_model.formula` in the JSON is:

> basic pay (taxable) + BAH (non-taxable, location-specific) + BAS (non-taxable, flat) + quantified non-cash value (TSP match, TRICARE, group life insurance floor)

The **worked example** in the JSON (E-4, 2 years of service) deliberately stops short of a full annual total. It shows basic pay + BAS = $3,779.95/month, $45,359.40/year — and then explicitly **excludes BAH** rather than inserting a placeholder number, because no duty-station BAH figure cleared this session's confidence bar. That means **the annual figure in this file understates true total compensation, likely substantially**, since BAH is frequently the single largest component of a service member's compensation package (often larger than basic pay itself in high-cost MHAs). Anyone using this worked example downstream needs to add a real, sourced BAH figure for the specific location being discussed before presenting a "total compensation" number to a user.

### Non-cash components — what's quantified and what isn't

- **TSP / Blended Retirement System (BRS) government contribution**: DoD automatically contributes 1% of basic pay to TSP starting 60 days after entry, and matches the member's own contributions up to an additional 4% (dollar-for-dollar on the first 3% the member contributes, $0.50-on-the-dollar on the next 2%) once the member has completed 2 years of service. Maximum DoD contribution is 5% of basic pay, reached when the member personally contributes 5% or more. This detail came from web search corroboration of DoD/Military OneSource pages, not a direct primary fetch this session — it should be re-verified when `RUN RETIREMENT` executes, since that command owns full retirement depth.
- **TRICARE healthcare**: not quantified. No civilian-equivalent-premium dollar figure was sourced this session. Don't invent one.
- **Non-taxable value of BAH/BAS**: conceptually real (a service member pays no federal or state income tax on these allowances, unlike a civilian's taxable housing/food stipend) but **not converted into a specific dollar "uplift" figure** in this file, because doing so requires assuming an individual's marginal tax rate, which varies person to person. Any number claiming to be "the tax value of BAH" without naming an assumed tax bracket should be treated as invented.

## 6. Guard/Reserve drill pay — explicitly not the same thing as active-duty pay

Drill pay uses the **1/30th rule**: one drill period equals 1/30 of the equivalent active-duty monthly basic pay for that paygrade and years of service. A standard drill weekend (Saturday + Sunday, two periods per day, four periods total) works out to about 4/30 — roughly 13.3% — of the monthly active-duty base rate.

The four drill-pay examples in `pay-tables.json` (E-4, E-5, E-6 at `<2yr`, and O-3 at `<2yr`) are **computed by this session**, applying that rule to the basic-pay figures already sourced above — they are labeled "computed, not authoritative" in the JSON, consistent with the difference between a number pulled from a source and a number derived by arithmetic from a sourced input.

Two things this number does **not** include, and that a reader must not assume:
- **No BAH, no BAS** for the drill period itself. Those allowances apply only during periods of active-duty orders (like Annual Training), not routine inactive duty for training (drill weekends).
- A traditional drilling Guard/Reserve member's real annual income is dominated by their **civilian job**, not drill pay. Drill pay compensates the drill obligation; it is not a salary replacement, and presenting it as comparable to active-duty total compensation would be exactly the anti-pattern the master prompt prohibits.

---

## 7. Summary of what's UNVERIFIED and why

| Figure | Status | Why |
|---|---|---|
| Basic pay table (E-1–E-7, O-1–O-3) | Corroborated, not primary-fetched | 403 on all 3 official domains; strong convergence across independent secondary sources; two figures confirmed to the cent |
| BAS (enlisted/officer) | Corroborated, not primary-fetched | Same access issue; strong convergence across ~6 independent sources |
| BAS II enhanced rate | `UNVERIFIED` | Single-source only |
| BAH — any specific location/grade dollar figure | `UNVERIFIED` | All 3 attempts (San Antonio, San Diego, Fort Liberty) failed corroboration or were internally inconsistent |
| BAH national trend (4.2% YoY) | Corroborated | Directional only, not usable as a specific rate |
| TSP match structure (1% auto + up to 4% match) | Corroborated via search, not primary-fetched | Should be re-verified in `RUN RETIREMENT` |
| TRICARE non-cash value | `UNVERIFIED` | Not sourced this session |
| Tax-advantage dollar uplift of BAH/BAS | Not computed | Depends on individual marginal tax rate; conceptual explanation given instead |
| Guard/Reserve drill pay (4 examples) | Computed, not sourced | Arithmetic applying the documented 1/30th rule to this file's own sourced basic-pay figures |

**Tool budget**: this command's allotted budget was 12 web search/fetch calls; 18 were used (8 search, 10 fetch), specifically because the binding anti-fabrication instruction for this run took priority over the soft budget once it became clear BAH needed extra verification attempts. The additional spend did not succeed in producing a verifiable location-specific BAH figure — the honest result is `UNVERIFIED` entries, not a fabricated number.
