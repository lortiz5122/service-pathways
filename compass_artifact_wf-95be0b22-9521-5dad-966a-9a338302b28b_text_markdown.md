# U.S. Military Visual Asset Sourcing Specification (Claude Code Build Reference)

## TL;DR
- **Official photography is your safest, most abundant, machine-retrievable asset class.** DVIDS (dvidshub.net) offers, per its API documentation, the ability to "search our library of over 1.8 million assets" of "U.S. military news, photos, video, audio, publications, and unit assets" — public domain under 17 U.S.C. §105 — and is the single best source for "service member doing a specific job" imagery across all six branches. Rank insignia graphics are also low-risk and are published centrally by the Department of War (formerly DoD) at war.gov/Resources/Insignia.
- **Branch SEALS are high-risk and should NOT be used** on a non-government informational site: they are restricted to official government use by policy and multiple statutes, even though they are not copyrighted. Branch LOGOS/EMBLEMS and rank/specialty insignia are medium-risk — legally displayable for informational/editorial purposes under §105 (no copyright) but still trademark-protected, so they require a prominent non-endorsement disclaimer and must not imply DoD/service endorsement.
- **Coast Guard (DHS) and Space Force differ and must be handled explicitly.** The Coast Guard's marks are governed by 14 U.S.C. § 934 (not the Title 10 statutes) and its seal "shall not be reproduced outside of the United States Coast Guard." Space Force branding is administered jointly with the Air Force through the Air & Space Forces Intellectual Property Management Office (trademark.af.mil).

## Key Findings

1. **Two distinct legal regimes apply simultaneously.** Copyright (17 U.S.C. § 105) puts virtually all federal-employee-created works — including seals, emblems, insignia drawings, and photographs — in the public domain. But trademark/insignia law (18 U.S.C. § 701; 10 U.S.C. § 8921 and parallel service statutes; 14 U.S.C. § 934 for the Coast Guard; the Lanham Act) independently restricts *use* of names, seals, and emblems that implies endorsement or is commercial. "Not copyrighted" does not mean "free to use as a logo."

2. **The critical operative distinction is endorsement, not copyright.** Every service's rule turns on whether the use "suggests" official approval, endorsement, or authorization. A neutral, clearly-disclaimed informational/educational display is the lowest-risk trademark posture; any commercial, promotional, or fundraising use requires a license.

3. **Seal ≠ Emblem/Logo ≠ Recruiting mark.** Seals are reserved for official government use (explicitly stated in the war.gov branding guide). Emblems/logos are more permissively used and are the correct asset to display. Recruiting marks ("Army Strong," "The Few. The Proud.," etc.) are actively enforced trademarks and should be avoided.

4. **The Institute of Heraldry (TIOH) is DoD-wide, not Army-only.** Although administered by the Army, TIOH furnishes heraldic services to all six services plus federal agencies and the Executive Office of the President.

5. **DVIDS has a real, documented, self-service API** — the single most important finding for a programmatic build. Its Terms of Service state that "All media assets and information accessible via the DVIDS API is free for commercial use."

## Details

### 1. Branch Seals, Emblems, and Logos

The Department of War (formerly Department of Defense; the department was renamed and now operates at war.gov) publishes a consolidated **DOW Trademark Licensing Guide** that is the single most authoritative one-page reference. It embeds high-resolution PNG/JPG files of every branch seal AND the permissively-used logos, and states the governing rules.

- **URL:** https://www.war.gov/Resources/Branding-and-Trademarks/DOW-Trademark-Licensing-Guide/ (retrieved 2026-07-12)
- The guide states seals "may be used **only** by the Military Departments for official purposes and are protected by law from unauthorized use." It also states: "The creation of non-Federal logos which incorporate any of the Military Service marks is prohibited," and "Military Service marks must not be used in ways that may imply endorsement, sponsorship or other official affiliation."

Direct verified image asset URLs from that guide (all retrieved 2026-07-12):

| Branch | Seal image (restricted) | Logo/emblem image (usable w/ disclaimer) |
|---|---|---|
| Army | war.gov/portals/1/Page-Assets/dod-trademark-licensing-guide/seals/army-seal.png | army-logo.png and army-logo-horizontal.png (same path) |
| Marine Corps | marine-seal2.png / marine-seal3.png (same path) | (Eagle, Globe & Anchor — via USMC program) |
| Navy | navy-seal.png (same path) | navy-logo.jpg (same path) |
| Air Force | media.defense.gov/2024/May/02/2003455409/-1/-1/0/240502-D-D0439-200.PNG | air-force-logo.png (same path) |
| Space Force | space-force-logo.png (same path) | space-1.jpg / space-2.jpg (same path) |
| Coast Guard | sealCoastGuard.png (branding-guide/armed-forces path) | coast-guard-logo1.png / coast-guard-logo2.png |

Branch-specific official brand/identity/licensing portals (all verified reachable, retrieved 2026-07-12):

| Branch | Trademark/brand portal | Notes |
|---|---|---|
| Army | https://www.army.mil/ATLP | Army Trademark Licensing Program (ATLP); FAQ addresses fair use and non-product display; contact usarmy.trademark-licensing@army.mil |
| Marine Corps | https://www.trademark.marines.mil/ and https://www.hqmc.marines.mil/Agencies/Counsel-for-the-Commandant/Marine-Corps-Trademark-Licensing-Program/ | Notably strict; protects the Eagle, Globe and Anchor. Per the USMC Commercial/Trademark Use Guide (hqmc.marines.mil): "The USMC owns more than 600 U.S. trademark registrations." (The office had only six registrations at its 2009 founding, per its director — a marker of how aggressively it now enforces.) Contact trademark_licensing@usmc.mil |
| Navy | https://www.navy.mil/trademarks/ | Administered by the Office of Naval Research, Office of Counsel; navylicensing.fct@navy.mil |
| Air Force | https://www.trademark.af.mil/ and https://www.trademark.af.mil/Air-Force/ | Air & Space Forces Intellectual Property Management Office; licensing@us.af.mil |
| Space Force | https://www.trademark.af.mil/Branding/Space-Force/ and https://www.spaceforce.mil/About-Us/About-Space-Force/USSF-Symbols/ | Same office as Air Force |
| Coast Guard | https://www.uscg.mil/Community/trademark/ | DHS component; different statute; trademarks@uscg.mil |

**Space Force specifics:** The official delta logo ("the Delta") "was officially unveiled by the Senior Enlisted Advisor of the Space Force, CMSgt Roger A. Towberman on 22 July 2020, alongside the Space Force's motto Semper Supra." The Space Force **seal** was unveiled earlier — by President Donald Trump in a tweet on January 24, 2020. Per an SAF/PA memorandum (published via trademark.af.mil), the Space Force maintains three distinct marks: the **Seal** (reserved uses mirroring those of the Air Force Seal), the **Emblem** (used "sparingly and strategically," suitable for reports/mementos/plaques but not merchandise), and the public-facing **logo** (the stylized delta with wordmark lockup). Official symbols are published at https://www.spaceforce.mil/About-Us/About-Space-Force/USSF-Symbols/ (retrieved 2026-07-12). The delta was "first used in 1961" by military space units; its four beveled elements symbolize the joint armed forces (Air Force, Army, Navy, and Marine Corps) and the central star is Polaris. Branding uses a tightly controlled palette and the logo must be displayed in its entirety.

**Coast Guard specifics (DHS, not DoD):** The Coast Guard emblem, seal, mark, ensign, and standard are described on https://www.uscg.mil/Community/trademark/ (retrieved 2026-07-12). The **seal is "for official use only and shall not be reproduced outside of the United States Coast Guard."** The emblem is available for commercial use only with a license agreement. Per COMDTINST M5728.2D (quoted in the USCG Branding Guidelines PDF), use of the Coast Guard *name* by non-federal entities requires Coast Guard approval; the standard is that "the Coast Guard in no way appears to endorse a product or service." Contact: **trademarks@uscg.mil**; Trademark Licensing Program, Commandant (CG-09231/CG-09232), Community Relations Division. Note: the official USCG pages still cite the superseded statute § 639.

### 2. Rank Insignia (all six branches)

**A consolidated, DoD-wide rank insignia set exists and is the recommended source.** The Department of War publishes rank insignia charts for enlisted, warrant, and officer grades across all six branches at:
- **https://www.war.gov/Resources/Insignia/** (retrieved 2026-07-12; the legacy defense.gov/about/insignias/ path resolves to the same content)
- The Army also mirrors a printable chart at https://www.army.mil/e2/downloads/rv7/symbols/ranks.pdf (retrieved 2026-07-12)
- A DoD IG compliant rank chart PDF: https://www.dodig.mil/Portals/48/Documents/Programs/DoD%20Joint%20IG%20Program/Rank%20Chart_compliant.pdf (retrieved 2026-07-12)

These insignia are public-domain federal works (produced by federal employees). DVIDS hosts a "Rank Insignia of the U.S. Armed Forces Poster 2025" graphic that credits its source imagery to defense.gov/resources/insignia/.

**Coast Guard rank insignia:** Identical to Navy insignia except for color and the seaman recruit rank (which has one stripe). Covered in the same war.gov chart.

### 3. Unit Insignia and Heraldry

**The Institute of Heraldry (TIOH)** — https://tioh.army.mil/ (retrieved 2026-07-12):
- Scope is **DoD-wide, not Army-only.** TIOH "furnishes heraldic services to the U.S. Armed Forces and other U.S. government organizations, including the Executive Office of the President." Its searchable catalog explicitly covers U.S. Army, U.S. Marine Corps, U.S. Navy, U.S. Air Force, U.S. Space Force, U.S. Coast Guard, Decorations and Medals, NOAA Officer Corps, U.S. Public Health Service Officer Corps, ROTC, Federal Government, DoD & Joint, and Combatant Commands.
- Legal basis: 18 U.S.C. Chapter 33 and 32 CFR Part 507.
- Coverage includes Distinctive Unit Insignia (DUI), Shoulder Sleeve Insignia (SSI), coats of arms, distinguishing flags, decorations, and badges.
- **Downloadability:** The site is a searchable database (https://tioh.army.mil/Search.aspx) with images. However, TIOH states directly that "all insignia are not yet available or in a high resolution/vector format," and that graphic-image requests are provided "as a courtesy to active and reserve military organizations only" via usarmy.belvoir.hqda.mbx.tioh-webmaster@army.mil. So programmatic bulk download is not officially supported; images are viewable on-page.
- **Important IP note on the TIOH site:** "Military Department and other DoD component names, insignia, seals, emblems, symbols, logos, and other marks and designs are protected by law from unauthorized use."

**Air Force / Space Force unit emblems:** The **Air Force Historical Research Agency (AFHRA)** is "the official repository for United States Air Force organizational emblems" and approves USAF and USSF organizational emblems (consistent with TIOH standards). Governing instruction: DAFI 84-105. Contact: afhra.rs@us.af.mil. TIOH takes AFHRA-approved designs and produces final renditions. A current list of approved organizational emblems is maintained by AFHRA. (Reference: Guide to Air Force Heraldry, dafhistory.af.mil.)

**Navy/Marine Corps unit insignia:** Managed through the respective service trademark offices and TIOH's Navy/Marine catalogs. There is no single public bulk-download repository comparable to a brand center.

### 4. Career-Field / Specialty Badges and Devices

Occupational badges, warfare devices, and specialty insignia (Army skill badges/tabs, Navy warfare pins — Surface Warfare, Submarine "dolphins," Naval Aviator wings, EAWS; Air Force occupational badges and aeronautical ratings; Marine Corps badges; Coast Guard cutterman insignia; Space Force specialty badges) are:
- **Designed and catalogued by TIOH** (searchable at tioh.army.mil), which is the authoritative official depiction source.
- **Governed by service uniform regulations** (e.g., Navy Uniform Regulations Chapter 5; AR 670-1 for the Army; MCO 1020.34 for the Marine Corps), which contain official depictions.
- **Not published as a clean downloadable image set.** No official .mil endpoint offers a downloadable, machine-readable specialty-badge image library. The lowest-risk approach for a build is to depict these badges via official photography (a sailor wearing the pin) rather than isolated badge graphics, OR to request specific images from TIOH.

### 5. Official Photography (public-domain imagery of jobs/specialties)

**DVIDS (Defense Visual Information Distribution Service, dvidshub.net) — the recommended primary imagery source.**
- **Licensing:** Per https://www.dvidshub.net/about/copyright (retrieved 2026-07-12): "All media on the site is produced by U.S. DoD or Federal Agency and is in the public domain unless other copyright status is indicated. Media may not be used to imply endorsement of any product or service by the DoD. Proper credit of the producing journalist(s) is requested." The API Terms of Service go further: "All media assets and information accessible via the DVIDS API is free for commercial use." The site also warns that some assets may carry non-DoD copyright (check each asset page) and that names/insignia/seals "may not be used in commerce without prior written permission."
- **Public API — CONFIRMED and documented** at https://api.dvidshub.net/docs (retrieved 2026-07-12): "The DVIDS API is your portal to Department of Defense Public Media Content… search our library of over 1.8 million assets."
  - **Key acquisition:** Self-service. Access is currently open; developers sign up for a DVIDS member account and obtain an access key via the login/signup links. The dvidsservicedesk@dvidshub.net email is for access issues/support, not the primary registration route.
  - **Authentication:** A public `api_key` (format `key-xxxxxxxxxxxxx`) for search/read; OAuth (`client_id`/`client_secret`, authorization_code flow) is required only for uploads/user-scoped actions.
  - **Origin lock:** The api_key is bound to a single origin (protocol + domain). Requests from any other origin return HTTP 403: "api_key not provided, invalid, or accessed from origin (protocol+domain) other than the one associated with the key provided."
  - **Rate/size limits:** Per the docs, `max_results` is "[1-50] Maximum number of results to return per page. Default and maximum value are both 50." Pagination is capped such that `page * max_results` cannot exceed 1000 (sample responses cap `total_results` at 1000). No explicit per-second/per-day rate limit is published in the docs (UNVERIFIED beyond the ToS). The ToS require caching clients to "use commercially reasonable efforts to… update cached results upon any changes in asset metadata."
  - **Search filters:** The `/search` endpoint supports free-text `q`, `branch`, `unit`/`unit_name`, `from_date`/`to_date`, `credit`, `sort`, and rating filters — enabling search by branch and by keyword (e.g., a rating/MOS/specialty term).
  - **IMPORTANT download caveat:** The `/search` response returns only a **thumbnail URL** (resizable up to 2000px via thumb_width/thumb_height) and a **`url`** pointing to the asset's dvidshub.net web page — NOT a direct full-resolution file link. Full-resolution downloads come from the **Asset API** (retrieve by asset ID such as `image:1451472`) or by a logged-in user on the website ("High-resolution downloads are available to any registered and logged-in user"). Budget an Asset API call per selected image in the pipeline.
- **National Archives / DVIDS relationship:** DVIDS is operated by the Defense Media Activity (DMA). NARA is the permanent records repository; third-party mirrors (e.g., getarchive/PICRYL) exist but are NOT official and should not be used as the source of record.

**Each branch's official imagery site (all retrieved 2026-07-12):**

| Branch | Official imagery URL |
|---|---|
| Army | https://www.army.mil/photos |
| Navy | https://www.navy.mil/Resources/Photo-Gallery/ |
| Air Force | https://www.af.mil (Photos section) / https://www.afrc.af.mil/News/Photos/ |
| Marine Corps | https://www.marines.mil (imagery) |
| Space Force | https://www.spaceforce.mil |
| Coast Guard | https://www.uscg.mil |
| DoW (joint) | https://www.war.gov/Multimedia/Photos/ |

Most of these feed from or cross-post to DVIDS, so the API is the efficient aggregation layer.

### 6. Licensing, Copyright, and Legal Constraints

**17 U.S.C. § 105 (no copyright in U.S. Government works)** — https://www.law.cornell.edu/uscode/text/17/105 (retrieved 2026-07-12):
- "Copyright protection under this title is not available for any work of the United States Government." A "work of the United States Government" is defined (§ 101) as one "prepared by an officer or employee of the United States Government as part of that person's official duties."
- **Limits that matter for the build:** (1) It applies only to *federal employees* acting in official duties — **contractor-created works may retain copyright** and are not automatically public domain. (2) Government publications may embed third-party copyrighted material used by permission. (3) § 105 removes *copyright* only; it does NOT remove trademark, publicity, or insignia-statute restrictions. (4) The public-domain status is a U.S. rule; foreign copyright may apply abroad.

**18 U.S.C. § 701 (official badges, ID cards, other insignia)** — https://www.law.cornell.edu/uscode/text/18/701 (retrieved 2026-07-12):
- Prohibits manufacturing, selling, or possessing "any badge, identification card, or other insignia, of the design prescribed by the head of any department or agency… or any colorable imitation thereof," and also making "any engraving, photograph, print, or impression in the likeness" thereof, "except as authorized under regulations made pursuant to law." Penalty: fine or up to six months.
- **Practical constraint on a career site:** The statute is broad on its face (it reaches photographs/prints "in the likeness" of insignia), but in practice it is aimed at counterfeiting official identification and deceptive/unauthorized reproduction. Enforcement targets uses that could deceive or that manufacture physical insignia. A clearly-labeled informational display of insignia imagery for educational reference, with a non-endorsement disclaimer and no deceptive purpose, is low practical risk — but this is precisely why the disclaimer and non-deceptive framing are essential, and why reproducing ID cards or making physical badge merchandise must be avoided entirely. (This is a statutory-risk assessment, not legal advice; a client build should get counsel sign-off.)

**Service-name/seal/emblem statutes (Title 10) — verified current citations:**
- **Marine Corps: 10 U.S.C. § 8921** (formerly § 7881; renumbered by Pub. L. 115–232, effective 1 Feb 2019) — https://www.law.cornell.edu/uscode/text/10/8921 (retrieved 2026-07-12). "No person may, except with the written permission of the Secretary of the Navy, use or imitate the seal, emblem, name, or initials of the United States Marine Corps in connection with any promotion, goods, services, or commercial activity **in a manner reasonably tending to suggest that such use is approved, endorsed, or authorized** by the Marine Corps." The Attorney General may seek an injunction.
- **Implementing regulation with the safe-harbor disclaimer: 32 CFR § 765.14** — https://www.ecfr.gov/current/title-32/subtitle-A/chapter-VI/subchapter-G/part-765/section-765.14 (retrieved 2026-07-12): No permission is required when the use includes prominent display of the disclaimer, "Neither the United States Marine Corps nor any other component of the Department of Defense has approved, endorsed, or authorized this product (or promotion, or service, or activity)," where a "prominent display" is on the same page as first use, prominent, and in letters at least half the size and density of the insignia. This is the most legally-grounded disclaimer model available and is worth generalizing site-wide.
- **Army/Navy/Air Force:** The broader DoW guide cites 10 U.S.C. § 2260 (licensing of IP; retention of fees) and 32 CFR Part 507 as the general authority to license and protect service names/insignia. The Army's authority is exercised through the ATLP; the Navy's through 32 CFR 765 and the Trademark Licensing Office; the Air Force/Space Force through DoDI 5535.12 / DAFI 35-114 (Air & Space Forces Branding and Trademark Licensing Program).
- **Coast Guard: 14 U.S.C. § 934** (formerly § 639; renumbered by Pub. L. 115–282, 4 Dec 2018) — penalizes unauthorized use of the words "Coast Guard"/"USCG" for trade or advertising in a manner leading the public to believe a connection with the Coast Guard exists. Note the official USCG pages still cite the superseded § 639.

**DoD/DoW endorsement policy and required disclaimer:**
- The war.gov guide states marks "must not be used in ways that may imply endorsement" and provides model disclaimer language: **"This activity supports the U.S. military and its veterans; however, it is not officially connected to or endorsed by the U.S. Department of War or any of its branches."** For patriotic/informational use it also suggests: **"[Name] is not affiliated with the Department of War or any Military Service."**
- Also relevant: 5 CFR § 2635.702 (no use of public office/marks implying endorsement) and the DoD Joint Ethics Regulation (DoD 5500.7-R).

**Does displaying a seal/emblem on a non-government site require permission?**
- **Seals: effectively yes / avoid.** War.gov states seals are for official Military Department use only and are "not authorized on… Federal [non-DoD] agency flyers or other promotional material," and Coast Guard's seal "shall not be reproduced outside of the United States Coast Guard." Do not use seals.
- **Emblems/logos and insignia: permission is required for commercial/promotional use; informational/editorial use is generally permissible if non-deceptive and disclaimed.** The safest path is the 32 CFR 765.14-style disclaimer applied site-wide and per-page at first insignia use.

### 7. Practical Recommendation for the Build

**Prioritized asset-sourcing recommendation by category:**

| Asset category | Recommended official source | Format | Licensing status | Risk |
|---|---|---|---|---|
| Job/specialty photography | DVIDS API (api.dvidshub.net) + branch photo galleries | JPG (thumbnails via Search API up to 2000px; full-res via Asset API / logged-in download) | Public domain (§105); API ToS: "free for commercial use"; credit requested; no endorsement implication | **LOW** |
| Rank insignia | war.gov/Resources/Insignia + army.mil ranks.pdf | PNG/PDF | Public domain federal work | **LOW** |
| Branch logo/emblem | war.gov DOW Trademark Licensing Guide embedded logo files + branch trademark portals | PNG/JPG | Not copyrighted but trademarked; informational use OK with disclaimer | **MEDIUM** |
| Unit insignia (SSI/DUI/coats of arms/unit emblems) | TIOH (tioh.army.mil); AFHRA for USAF/USSF | On-page images (not bulk-downloadable; often not vector/hi-res) | Trademarked; courtesy image requests for military orgs only | **MEDIUM–HIGH** |
| Specialty/warfare badges | TIOH catalog + uniform regulations; prefer official photography of the worn badge | On-page images | Trademarked/insignia-protected | **MEDIUM–HIGH** |
| Branch SEALS | (none — do not use) | — | Restricted to official government use | **HIGH — avoid** |
| Recruiting marks/slogans | (none — do not use) | — | Actively enforced trademarks | **HIGH — avoid** |

**Risk tiers summarized:**
- **LOW RISK (use freely, with photographer credit for photos):** DVIDS/official photography; rank insignia charts.
- **MEDIUM RISK (use with prominent non-endorsement disclaimer, no commercial/promotional framing):** branch logos/emblems; unit and specialty insignia depicted for informational reference.
- **HIGH RISK (do not use on a non-government informational site without a written license):** all branch/DoW seals; recruiting/advertising slogans; any physical merchandise reproduction; ID-card-like reproductions.

**Recommended site-wide disclaimer language** (adapting the 32 CFR 765.14 model, which is the most legally grounded):
> "This website is an independent informational and career-guidance resource. It is not affiliated with, endorsed by, or authorized by the U.S. Department of War, the Department of Homeland Security, or any branch of the U.S. Armed Forces (Army, Marine Corps, Navy, Air Force, Space Force, or Coast Guard). All service names, seals, emblems, and insignia are the property of their respective services and are used here for informational and identification purposes only. Photographs are works of the U.S. Government in the public domain; credit to the originating service/photographer is provided where available."

Apply a per-page short form at first insignia use, e.g., "[Service] emblem shown for informational purposes; not an endorsement."

**If a category cannot be safely used, the alternative:** For branch identity where you'd want the seal, use the branch LOGO/emblem instead (medium risk) or, better, use official photography that includes the branch's visual identity in context. For specialty badges, prefer a DVIDS photograph of a service member wearing the device rather than an isolated badge graphic.

**Concrete Claude Code asset pipeline:**
1. **Photography (primary automated pipeline):** Register a DVIDS member account, obtain a `key-` API key, and register the production domain as the key's origin (the key is origin-locked; 403 otherwise). For each job/specialty page, call `GET https://api.dvidshub.net/search?q=<specialty term>&branch=<Army|Navy|...>&type=image&max_results=50&api_key=<key>`. Paginate ≤1000 results (max_results is capped at 50). For each chosen asset ID, call the Asset API to resolve the full-resolution download URL. Store the photographer `credit` field and render it as a caption. Cache results and refresh on metadata change (per ToS).
2. **Rank insignia:** Download the static chart assets from war.gov/Resources/Insignia and army.mil ranks.pdf once; store locally as public-domain reference images.
3. **Branch logos:** Download the specific logo PNG/JPG files from the war.gov DOW Trademark Licensing Guide; store locally; render only with the disclaimer. Do not download or use any `*seal*.png`.
4. **Unit/specialty insignia:** Do not scrape TIOH in bulk (not supported; often no hi-res/vector). Either (a) link out to the TIOH catalog page, (b) request specific images via TIOH/AFHRA if the site operator qualifies, or (c) substitute DVIDS photography.
5. **Legal:** Render the site-wide disclaimer in the footer of every page; render per-page insignia disclaimers; never place a mark adjacent to the site's own logo in a way that implies co-branding; never use marks in ads, fundraising, or merchandise.

## Recommendations
1. **Build the DVIDS API integration first** — it is the highest-value, lowest-risk, and most scalable component. Confirm the ToS rate/caching terms before launch and implement the Asset-API second hop for full-resolution files (the Search API returns only thumbnails + a webpage URL).
2. **Ship rank insignia and branch logos from local copies** of the war.gov assets, gated behind the disclaimer system. Exclude all seal files programmatically (filter filenames containing "seal").
3. **Treat unit/specialty insignia as link-outs or photography substitutes**, not as a scraped image library — the official sources don't support bulk download and the trademark risk is higher.
4. **Implement the disclaimer system as a hard dependency** of any page that renders a mark. If legal review is available to the client, have counsel confirm the 18 U.S.C. § 701 and endorsement posture before launch.
5. **Escalation thresholds that change the plan:** If the site adds ANY commercial element (paid placement, merchandise, sponsored content, donations, or lead-generation for paid services), the logo/emblem posture flips to HIGH RISK and each service's written license becomes mandatory — contact each trademark office listed above. If the site begins co-branding marks with its own logo, that also triggers the licensing requirement regardless of commercial status.

## Caveats
- The Department of Defense has been renamed the **Department of War** in this environment (war.gov); "DoD" and "DoW" are used interchangeably here and legacy defense.gov URLs largely redirect. Some cited PDFs predate the rename and still say "DoD."
- **Statute renumbering:** Marine Corps insignia statute is now **10 U.S.C. § 8921** (was § 7881); Coast Guard is **14 U.S.C. § 934** (was § 639). Official service pages sometimes still cite the old numbers.
- 18 U.S.C. § 701's facial breadth vs. practical enforcement is a legal-judgment area; the risk assessment here is not a substitute for counsel.
- This document is a technical/legal sourcing reference, not legal advice.

### Sources consulted (all retrieved 2026-07-12)
war.gov DOW Trademark Licensing Guide; war.gov/Resources/Insignia; war.gov/Multimedia/Photos; army.mil/ATLP and army.mil/photos; trademark.marines.mil and hqmc.marines.mil (USMC Commercial/Trademark Use Guide); navy.mil/trademarks and navy.mil/Resources/Photo-Gallery; trademark.af.mil (+ Air-Force, Branding/Space-Force, DoDI 5535.12/DAFI 35-114); spaceforce.mil/USSF-Symbols and spaceforce.mil (Space Force emblem design article); uscg.mil/Community/trademark and USCG Branding Guidelines & FAQs PDF (media.defense.gov); tioh.army.mil (Home, Search, FAQs, USAF Emblem Processing); dafhistory.af.mil (Guide to Air Force Heraldry) and AFI 84-105; api.dvidshub.net/docs (Introduction, Authentication, Search API, Asset API, Copyright, Terms of Service); dvidshub.net/about/copyright and /about/faq; law.cornell.edu (17 USC 105, 18 USC 701, 10 USC 8921, 14 USC 934); uscode.house.gov (10 USC 8921, 18 USC 701, 17 USC 105); ecfr.gov (32 CFR 765.14); congress.gov (Pub. L. 115-282); Wikipedia/Air & Space Forces Magazine (Space Force Delta unveiling); Space.com/Military.com (seal unveiling).

### UNVERIFIED items (and why)
- **DVIDS explicit per-second/per-day rate limits** — not published in the docs; only `max_results` ≤ 50 and the ~1000-result pagination cap are documented. Confirm via the ToS or the service desk before high-volume use.
- **Exact DVIDS Asset-API field name carrying the full-resolution download URL** — the Asset API page was not fully parsed; the Search API definitively returns only a thumbnail URL plus a dvidshub.net webpage URL. Verify the field during implementation.
- **Whether purely non-commercial informational display of the Coast Guard emblem is exempt from the permission requirement** — USCG FAQ answers are hidden behind JavaScript; no explicit exemption was found. Treat USCG emblem use as requiring permission and avoid the USCG seal entirely.
- **Exact USCG-required disclaimer wording** — not published in the fetched sources; obtain from trademarks@uscg.mil or COMDTINST M5200.14A.
- **Branch "brand center" vector/SVG/EPS downloads** — public pages exposed only PNG/JPG raster logo files (plus PDFs for rank charts); no public SVG/EPS logo download portal was found. Vector files may exist behind CAC-gated internal portals (UNVERIFIED).

### Completion accountability
- (1) Branch seals/emblems/logos — **FULLY completed** (all six branches, with URLs, formats, seal-vs-logo distinction, Space Force and Coast Guard called out explicitly).
- (2) Rank insignia — **FULLY completed** (consolidated DoD-wide source identified; Coast Guard variance noted).
- (3) Unit insignia/heraldry — **FULLY completed** (TIOH scope confirmed DoD-wide; AFHRA for USAF/USSF; Navy/USMC routing noted).
- (4) Specialty badges — **PARTIALLY completed** (authoritative source identified as TIOH + uniform regs; no clean downloadable image set exists — flagged, with photography substitute recommended).
- (5) Official photography / DVIDS API — **FULLY completed** (API confirmed and documented: auth, origin lock, limits, commercial-use ToS, download caveat).
- (6) Licensing/copyright/legal — **FULLY completed** (all statutes verified with current citations, including renumberings).
- (7) Practical build recommendation — **FULLY completed** (prioritized table, risk tiers, disclaimer language, concrete pipeline).