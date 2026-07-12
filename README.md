# Military Careers

An independent, **non-recruiting** reference that maps a young person's *interests*
to real U.S. military specialties across all six branches — and follows each one
through the complete service lifecycle:

```
interest → ASVAB & qualification → branch → specialty → prep (fitness, waivers, MEPS, DEP)
  → training pipeline → service career → retirement (BRS, TSP, the 20-year cliff)
  → transition (SkillBridge, DD-214, VA disability) → civilian career + veteran benefits
```

## What makes it different

- **Interest-first, not branch-first.** You start from what you're good at, not from a logo.
- **Every figure is sourced and dated, or explicitly marked `UNVERIFIED`.** Nothing is invented.
  Fabricated pay figures aimed at 16–24 year olds is the failure mode this project exists to avoid.
- **The credential gap is named, not hidden.** A combat medic is not a paramedic. An MP is not a
  police officer. An aircraft maintainer does not hold an FAA A&P. Every specialty says so.
- **The 20-year retirement cliff is stated plainly.** The pension is all-or-nothing at 20 years
  and is otherwise forfeited entirely. Most people who enlist never reach it.
- **The Coast Guard (DHS, not DoW) and Space Force (no reserve component, no academy) are never
  padded to false parity** with the larger branches.

## Data provenance

All content under `data/` was produced by a research phase executed against the command
spec in `master-prompt-v2.md`, prioritising `.mil` / `.gov` primary sources. Each file
carries its own `sources`, `unverified` and `completion_accountability` blocks.

| File | Command |
|---|---|
| `interest-taxonomy.json` | TAXONOMY — the 14 interest clusters everything routes on |
| `branch-profiles.json` | BRANCHES |
| `pay-tables.json` | COMPENSATION |
| `retirement.json` | RETIREMENT |
| `education-benefits.json` | EDU-BENEFITS |
| `veteran-benefits.json` | VETERAN-BENEFITS |
| `transition.json` | TRANSITION |
| `asset-manifest.json` | ASSETS |
| `specialties-*.json` | SPECIALTIES, one per interest cluster |

## A note on the insignia

**The emblems and badges in this app are original illustrations. They are not official
U.S. military insignia.**

This was not a stylistic choice. The asset research identified official sources for branch
emblems and rank insignia; every one of those URLs was then tested and **all returned HTTP 403**,
including the Department of War's own trademark guide and every branch `.mil` portal. The
governing asset policy requires that an unverifiable URL be omitted rather than guessed.

Official photography via the **DVIDS API** (genuinely public domain under 17 U.S.C. § 105) is the
correct long-term source and the app is structured to accept it. It is blocked only on a
registered, origin-locked `api_key`, which requires a human to sign up and bind the key to the
production domain. See `data/asset-manifest.json` → `dvids_pipeline`.

Branch **seals are never used** — they are high-risk and reserved to official government use.

## Legal

This is an independent informational resource. It is not affiliated with, endorsed by, or
authorized by the U.S. Department of War, the Department of Homeland Security, or any branch
of the U.S. Armed Forces. Disclaimer language follows the safe-harbor model at 32 CFR § 765.14.

If this site ever becomes commercial, the trademark posture flips to high risk and a written
license from each service becomes mandatory.

## Develop

```bash
cd app
npm install
npm run sync      # copy ../data/*.json into src/research/
npm run dev
npm run verify    # SSR-render every route; asserts the disclaimer/no-seal invariants
npm run build
```
