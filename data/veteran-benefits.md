# Veteran Benefits — Narrative Notes

**Command**: `VETERAN-BENEFITS` · **Retrieved**: 2026-07-12 · **Companion file**: `veteran-benefits.json`

This file carries the nuance, "it depends" conditions, and build guidance that the JSON schema can't hold. Every figure below is sourced and dated in the JSON; this file explains what the figures mean in practice.

---

## VA Healthcare Priority Groups (1–8)

VA health care is not first-come-first-served once a veteran is enrolled — priority group determines both *access* during resource-constrained periods and *how much the veteran pays*. The group is not a fixed label: it is recalculated based on disability rating, income, and time-limited eligibility windows.

**The mechanism most builds get wrong**: combat veterans discharged on or after October 1, 2013 get a **10-year enhanced-eligibility window** from their discharge date (Priority Group 6), not a permanent status. After that window closes, VA reassigns them to the highest group they otherwise qualify for — which could be a lower-priority, copay-owing group if they have no rated disability and higher income. A build that hardcodes "combat vet = Group 6 forever" will misinform users approaching that 10-year mark.

**Cost-share pattern, in plain terms**: Groups 1–5 generally don't pay copays. Groups 6–8 may, depending on whether the care is for a service-connected condition (never copayed) versus unrelated care, and — for Groups 7–8 specifically — whether household income is above or below VA's geographically-adjusted income limit (which varies by where the veteran lives, not a flat national threshold). Regardless of group, mental health counseling, military sexual trauma-related care, and VA claim exams are copay-free for everyone, and any veteran who does owe medication copays has those capped at $700/year in aggregate.

**What we did not verify this session**: the exact current-year dollar copay table (e.g., specific outpatient visit copay amounts) and the full breakdown of Priority Group 8's sub-priorities (a–g), which are tied to prior VA enrollment history. Do not put a specific copay dollar figure into the build without a fresh, dated fetch of `va.gov/health-care/copay-rates`.

---

## VA Home Loan

The "$0 down" pitch is directionally true but has real edges the build should surface rather than paper over.

**Entitlement, unpacked**: "Full entitlement" (no prior unrestored VA loan) means no VA-imposed loan-amount ceiling — but the VA still only *guarantees* a portion of the loan to the lender (basic $36,000, or roughly 25% of the loan for bonus/second-tier entitlement). The lender decides the actual amount they'll approve based on credit, income, and debt-to-income ratio. A veteran with excellent credit and a modest income will not be approved for an unlimited loan just because VA sets no statutory cap — "no VA limit" is not the same as "no limit."

**Reduced entitlement is the case builds tend to omit**: a veteran who used a VA loan before and still has it outstanding (or defaulted on one) has *reduced* remaining entitlement, calculated against the county's FHFA conforming loan limit. This is the scenario where a genuine down payment can become necessary — the "no down payment" promise is really a "no down payment *if you have full, unused entitlement*" promise.

**Funding fee**: ranges roughly 0.5%–3.3% of the loan depending on loan type, first-vs-subsequent use, and down payment size (see JSON for the full fee table, effective 2023-04-07 per va.gov as retrieved 2026-07-12). It's financed into the loan by default, which is why some veterans experience a VA loan as "no cash down payment" while still borrowing more than the home's negotiated price would suggest. Veterans receiving VA disability compensation (or eligible for it but drawing retirement/active-duty pay instead) are exempt from the fee entirely — this exemption is worth flagging prominently in any loan-benefit calculator the site builds, since it's a substantial cost difference many veterans don't realize applies to them.

**The VA guarantee never exceeds appraised value or purchase price**, whichever is lower. If a veteran's offer exceeds appraisal, the gap is the veteran's cash to cover — VA financing does not solve an over-appraisal gap.

---

## GI Bill Transferability — the Under-Covered Part

This is explicitly the piece the master prompt flagged as under-covered, and it deserves direct treatment: **transferring Post-9/11 GI Bill benefits to a spouse or child is not a free administrative action.** Approval requires the service member to commit to **4 additional years of service** from the date the transfer is approved, layered on top of whatever obligation they already owe. A service member transferring benefits at, say, year 8 of an anticipated 12-year career has just extended their minimum commitment to 12 years from the transfer-approval date — potentially past their originally planned separation point.

**It must happen while still serving.** The election is made through milConnect (a Department of Defense system, not a VA one) while the member is on active duty or in the Selected Reserve. This is a common point of confusion: veterans who separate and then try to transfer benefits at a VA regional office cannot do so — the window closed at separation. Anyone planning to transfer benefits needs to do it *before* they get anywhere near a separation decision.

**Exceptions exist but are narrow**: Purple Heart recipients skip both the 6-year and 4-year requirements (but must still request the transfer while serving). If a member is discharged before finishing the 4-year additional obligation for reasons outside their control — service-connected illness/injury, hardship, involuntary reduction in force, or death — benefits already transferred to a dependent typically remain usable even though the obligation wasn't completed. This is a narrow safety valve, not a general escape hatch — a member who simply changes their mind or gets an ordinary voluntary separation does not get this protection, and the 4-year clock is real.

**Build implication**: any transferability calculator or explainer on the site should surface the 4-year obligation as prominently as the benefit itself — presenting transfer as a costless dependent perk misleads users into a major, binding service-length decision.

---

## State-Level Benefit Variance — Explicit Anti-Pattern Warning

The master prompt names this as an anti-pattern to avoid, and it is worth restating plainly: **there is no such thing as "the" veteran property tax exemption, "the" veteran state income tax break, or "the" veteran tuition benefit.** These are set state-by-state (and often further modified county-by-county for property tax), and the two official examples pulled directly from state government sources this session make the spread concrete:

- **Texas**: a 100%-disabled veteran's home is **fully exempt** from property tax — the entire appraised value, not just a slice of it (Tax Code § 11.131).
- **California**: a 100%-disabled veteran instead gets a flat **$100,000 exemption of assessed value** (inflation-adjusted annually) — a structurally different, and for most homes, much smaller benefit than Texas's full exemption.

Same federal disability rating. Two states. Two very different real-dollar outcomes. This is exactly the pattern the master prompt warns against collapsing into a single national figure — doing so would actively mislead a user in either state.

**For the build**: do not ship a static 50-state benefit table as authoritative content. If the site wants to show state benefits, either (a) link out per state to that state's official veterans-affairs agency with a "verify current amounts" disclaimer, or (b) scope a dedicated future research pass that walks all 50 states individually against their own official sources — which was out of this command's ~12-call tool budget and is appropriately deferred rather than faked.

---

## Sources Consulted

va.gov (priority groups, copay rates, home loan funding fee/closing costs, home loan entitlement/limits, GI Bill transfer benefits), news.va.gov (state tax exemption overview), comptroller.texas.gov (Texas disabled veteran property tax exemption), boe.ca.gov (California disabled veterans' exemption). Full URLs and retrieval dates in `veteran-benefits.json` → `sources`.

**Tool usage**: 6 web searches + 6 web fetches = 12 calls (at budget ceiling).

**Fields left UNVERIFIED**: exact current-year copay dollar table by service type; Priority Group 8 sub-priority (a–g) detailed text; confirmation that the funding fee schedule effective 2023-04-07 hasn't been superseded by newer legislation not yet reflected on va.gov. Full list in `veteran-benefits.json` → `unverified`.
