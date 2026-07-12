# branch-profiles.md — Narrative Notes on the Six Service Branches

*Companion to `branch-profiles.json`. This file carries nuance, caveats, and "it depends" conditions that don't fit the schema. Neutral factual reference — no recruiter marketing language. Retrieved 2026-07-12. This document does NOT re-cover ASVAB minimums, fitness standards, MEPS/DEP mechanics, waivers, or officer-pathway mechanics in depth — see the sibling document `compass_artifact_wf-d8f86b54-1e81-595c-80ab-995e21fd37cb_text_markdown.md` (referred to below as `prep-pathway.md`) for that layer.*

---

## What this file is for

`branch-profiles.json` answers "what is this branch, and how do I get in." It deliberately stops short of "how do I prepare to qualify" (ASVAB, fitness, waivers) — that's the sibling document's job. Where the two documents both touch a topic (e.g., age limits, academy nominations), this file either points to the sibling document's sourcing or independently confirms a figure; it does not silently repeat a number without checking for conflict first.

---

## Sizing: read "size_active_duty" as an authorized ceiling, not a census

Every number in `size_active_duty` comes from FY2026 authorized end-strength figures (Congressional Research Service report IN12651, covering the five Department of War services, and 14 U.S.C. §4904 for the Coast Guard). These are **statutory ceilings Congress authorized for the fiscal year**, not a real-time headcount. Two things follow:

1. Actual on-duty personnel counts fluctuate against the ceiling throughout the year and are reported separately (and often later) than the authorization.
2. The Coast Guard case makes this concrete: its FY2026 authorized ceiling is 50,000, but a GAO report (GAO-25-107224, cited independently in `prep-pathway.md`) put actual FY2024 active-duty strength at roughly 42,000. That's an ~8,000-person gap between "authorized" and "actual." This document reports the authorized figure because that's what the schema field name implies and because it's the only figure with a clean statutory citation — but a build that surfaces this number to end users should probably label it "authorized strength" rather than "current strength," or better, seek out the Coast Guard's most recent actual-strength press release before shipping.

The Space Force's 10,400 figure is worth sitting with: it is roughly 2% the size of the Army's 454,000. Any UI treatment that presents all six branches as visually equal-weight options (e.g., six equal tiles) will misrepresent the actual scale disparity. This isn't a value judgment — it's a fact about a four-year-old organization the size of a mid-sized regional employer, positioned in the same list as the U.S. Army.

---

## Coast Guard: the DHS distinction is more than administrative trivia

The Coast Guard's placement under DHS rather than the Department of War affects more than an org chart line:

- **Wartime transfer**: Under 14 U.S.C. §3, the President or Congress can transfer the Coast Guard to the Department of the Navy during wartime. This has actually happened historically (WWI, WWII). It is not a hypothetical clause — it is the mechanism by which a nominally civilian-agency-adjacent force becomes a full Department of War asset when needed. This is a genuinely distinctive structural fact worth surfacing in any "how is the Coast Guard different" UI module.
- **Trademark/name protection**: The project's own master prompt cites 14 U.S.C. §934 as the Coast Guard's separate trademark/name-protection statute (distinct from how the other five services protect their marks). This citation was carried over from prior research in this project rather than independently re-verified against the U.S. Code this session — flagged as UNVERIFIED in the JSON's `unverified` array. If the ASSET/BUILD-SPEC phase needs the exact statutory text, re-verify the section number directly against uscode.house.gov before using it as an asset-policy citation.
- **Benefit administration**: `prep-pathway.md` already notes that GI Bill and most pay/benefit structures run largely parallel to DoD, but administration mechanics (e.g., some TRICARE and personnel-system particulars) differ because the parent agency differs. Don't assume every DoD benefit page applies verbatim to Coast Guard members without checking a Coast Guard-specific source.
- **Recruiting posture**: The Coast Guard is also the branch furthest along in loosening its accession standards recently — GAO-25-107224 documents the AFQT minimum for diploma holders dropping from 40 to 32 and the enlistment age ceiling rising from 34 to 41 in a November 2023 instruction update, with a further age increase to 42 reflected in current secondary reporting. This is a genuinely fast-moving branch in terms of eligibility policy, more so than its small size might suggest.

---

## Space Force: don't force it into the same shape as the other five

The binding instruction for this command was explicit: no false parity. Concretely, here's what that means when building against this data:

- **No reserve component, at all.** Not "a small reserve" — none. The Space Force Personnel Management Act (Dec. 2023) replaced the reserve/Guard concept with a single-component model: Guardians are either on "sustained duty" (full-time) or "not on sustained duty" (part-time), with an inactive-status pool similar to the Individual Ready Reserve. The first cohort under this model — 247 former Air Force Reservists — was announced in April 2026. A UI that offers a "Guard/Reserve path" selector for Space Force the same way it does for the other five branches would misrepresent the organization. The correct UI treatment is either to omit the toggle for Space Force or to relabel it "sustained / not on sustained duty" with an explanatory note.
- **No separate academy — genuinely, not "under construction."** Space Force officers commission via USAFA or AFROTC. There is no roadmap artifact suggesting a dedicated Space Force academy is coming; the schema's `academy` field should say "None," not "TBD" or "planned."
- **Basic training is literally shared infrastructure**, not merely similar. Guardians attend the same 7.5-week BMT at JBSA-Lackland as Airmen, in the same physical location, with the only Space Force-specific addition being a dedicated cadre of Space Force drill instructors and about 21 extra hours of Space Force-specific content layered onto the Air Force curriculum. Leadership has floated eventually standing up a dedicated Guardian-only site (Patrick Space Force Base, FL, and Colorado locations have both been mentioned), but as of this research date that has not happened. Any specialty/training-pipeline content downstream of this document should not describe Space Force basic training as though it happens at a distinct "Space Force boot camp" — it doesn't yet.
- **Narrow specialty list is a feature of the branch, not a data-collection gap.** When the SPECIALTIES command runs per interest cluster, expect the Space Force column to be thin or empty for most clusters (e.g., culinary, combat arms, maritime/nautical). That's correct and should not be "padded" with adjacent Air Force specialties relabeled as Space Force ones.

---

## Basic training length figures — precision notes

- **Navy**: The 9-week figure reflects a January 2025 "optimization" from the prior 10-week length (itself a 2020-era extension from an even earlier 8-week baseline). Search results surfaced both the 2020 "extends to 10 weeks" headline and the 2025 "optimizes to 9 weeks" headline; this document uses the more recent figure as current. If a future research pass finds a subsequent change, update this figure — Navy BMT length has moved three times in six years and should be treated as unstable, not settled.
- **Air Force / Space Force**: Reported everywhere as "approximately 7.5 weeks." The JSON schema requires an integer for `length_weeks`, so both records store `7` with a note flagging the true figure as 7.5 — a build surfacing this number to users should render "7.5 weeks," not "7 weeks."
- **Army**: 10 weeks is the standard Basic Combat Training figure across all four training centers. This document does not have a confirmed length for One Station Unit Training (OSUT) — the combined BCT+job-training track used for combat-arms MOSs like Infantry and Armor at Fort Moore — because no session search targeted it specifically and inherited knowledge was not trusted without a fresh citation. Flagged UNVERIFIED; a future SPECIALTIES run touching combat-arms MOSs should resolve this rather than inherit the gap.
- **Coast Guard**: The 8-week Cape May figure is well-established, but a recent article (mycg.uscg.mil) describes a new one-week "acclimation course" added after graduation for at least some cohorts. Whether this is now universal or a limited pilot was not resolved this session — if the build surfaces an exact "weeks to graduation" figure for Coast Guard, note that it may now be 9 weeks total rather than 8, pending confirmation.

---

## Mission statements: paraphrased, not quoted verbatim

Per this project's quality gate (quotes capped at 15 words, one per source), every `mission` field in the JSON is a paraphrase of the branch's official statement rather than a verbatim quote — with one exception: the Space Force's nine-word statement ("secure the nation's interests in, from, and to space") is short enough to reproduce close to verbatim without breaching the cap. If a downstream build wants exact verbatim mission text for display (e.g., a pull-quote treatment), fetch the original page directly rather than reusing the paraphrase here as if it were a quote.

---

## Age-limit figures: the weakest-sourced field in this dataset, by design tradeoff

Every branch's `general_eligibility.age_range` in the JSON is flagged as sourced only to secondary aggregator sites (operationmilitarykids.org, militaryprephub.com) plus, for the Army, a Stars and Stripes news article reporting a 2026 policy change. None of these were independently cross-checked against a primary goarmy.com/navy.com/airforce.com/marines.com/spaceforce.com/gocoastguard.com eligibility page within this session's tool budget. This is a deliberate tradeoff disclosed here rather than hidden: age ceilings have moved for nearly every branch in the last three years (Air Force 39→42 in 2023, Coast Guard 34→41→42, Army 35→42 in 2026), making them one of the fastest-moving eligibility facts in this whole project. Treat every number in this field as directional and re-verify against the branch's own site before it drives a user-facing claim — this is the single field in this document most likely to be stale by the time it's read.

---

## "Department of War" labeling

This document uses "Department of War (formerly DoD)" for the five Department of War service branches because that is the literal enum value specified by the master prompt's schema for this command. No search performed this session independently confirmed the legal/statutory status of a Department of Defense→Department of War rename as of the July 2026 retrieval date — official pages found during research (e.g., a Senate Armed Services posture-statement PDF) still used "Department of the Air Force" framing rather than a renamed parent department. Flagged UNVERIFIED in the JSON. If BUILD-SPEC or a later command needs to state this rename as settled fact, verify it directly against a primary source (e.g., an executive order text or a war.gov/defense.gov masthead) before doing so.

---

## Sources consulted (one line)

Official/primary — army.mil, goarmy.com, moore.army.mil, home.army.mil (Fort Jackson), navy.mil (including bootcamp.navy.mil, netc.navy.mil), navy.com, airforce.com, basictraining.af.mil, af.mil, marines.mil, mcrdsd.marines.mil, mcrdpi.marines.mil, ocs.marines.mil, spaceforce.mil, gocoastguard.com, forcecom.uscg.mil, mycg.uscg.mil, uscode.house.gov (14 U.S.C. §4904), congress.gov / everycrsreport.com (CRS IN12651, FY2026 NDAA Active Component End-Strength); secondary/corroborating — Stars and Stripes, FOX11 Los Angeles, operationmilitarykids.org, militaryprephub.com, airandspaceforces.com.

*Items left UNVERIFIED and why (see also the `unverified` array in branch-profiles.json):* (1) Army OSUT exact length by MOS — not searched this session. (2) Current 2026 non-citizen/LPR enlistment policy nuance across all branches — general citizenship baseline is stable, decades-old law; current-year exceptions/pauses were not checked. (3) Enlisted maximum-age figures for all six branches — secondary-source corroboration only. (4) "Department of War" as a codified legal name — schema-directed label, not independently confirmed. (5) Coast Guard's 14 U.S.C. §934 citation — carried over from the project's own master prompt, not re-verified against the U.S. Code. (6) Whether the Coast Guard's new one-week post-Cape-May acclimation course is now universal. (7) The ~8,000-person gap between the Coast Guard's 50,000 statutory end-strength ceiling and its ~42,000 reported actual strength — both figures are real and sourced, but not reconciled into a single number.
