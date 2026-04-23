# Changelog

All notable changes to the SNOMI specification are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

> **Metric retirement policy:** retired codes are never deleted.
> They receive `status: retired` with a migration note. All historical
> records citing retired codes remain valid.

---

## [Unreleased]

Changes accepted via RFC but not yet tagged in a release.

---

## [2.1.0] — 2026-04-23

### Added
- **ENG.001 (revised)** — Contextualised Engagement Rate: new preferred formula
  `(Σint / [REA.005|REA.001]) × (REA.001 / AUD.001) × 100`. Integrates content
  quality (via views) and audience penetration (via reach/followers ratio).
  Previous ENG.001 formula is now ENG.002.
- **ENG.007** — SER (Contextualised): weighted equivalent of ENG.001 using
  interaction weights (L×1 · C×6 · S×8 · Sh×7). ÷2 normalization calibrated
  per Socialinsider 2024.
- **ENG.008** — SER (Reach): weighted equivalent of ENG.002.
- **VAL.007** — Creator CPM: what the brand paid per 1k exposures (creator fee only)
- **VAL.008** — Gross CPM: creator fee + agency fees per 1k exposures
- **Four CPM type clarification** in VAL domain: ads CPM ref · VAL.003 · VAL.007 · VAL.008
  are now explicitly distinct — "CPM" alone is non-compliant
- **VAL.001 CPM source declaration** extended: `[CPM: native | declared | bench-pending]`
  with corresponding trust scores T4 / T3 / T2
- **Trust propagation table** in SKILL.md with practical examples across all main metrics
- **Interaction weights** standardised: Like ×1 · Comment ×6 · Save ×8 · Share ×7 ·
  Duet ×6 · Stitch ×6
- **AUD.008** — Audience Following Count: attention dilution signal
- **REA.006** — Qualified Views (≥50% completion): rigorous exposure base
- **CRE.006** (BETA) — Category Partnership History: dual-signal interpretation added

### Changed
- ENG.001 is now the **SNOMI preferred metric** (contextualised). Previous ENG.001
  (ER on followers) is now the definition of **ENG.002** for clarity.
  ⚠ Code renaming: `ENG.001_v1` → `ENG.002`, new contextualised formula → `ENG.001`.
  Migration: all prior `ENG.001` citations in v2.0 reports should be re-labelled
  `ENG.002` when the formula was `Σint / [AUD.001] × 100`.
- `ENG.002` preferred label changed from "Engagement Rate (Reach)" to component
  metric status — ENG.001 is the standard for general use
- VAL.001 trust score now depends on CPM source type (T2/T3/T4) rather than being
  hard-capped at T3

### Fixed
- Inconsistency between `references/metrics.md` and `SKILL.md` ENG formulas resolved
- REA.005 platform view thresholds clarified (IG: 3s · TK: 2s · YT: 30s · FB: 3s)
- CPI formula updated to reference ENG.001 (contextualised) instead of prior ENG.001

### Governance
- GOVERNANCE.md added (this release)
- CONTRIBUTING.md added
- LICENSE (CC BY 4.0) added
- GitHub issue templates added: RFC, Benchmark Update, Bug Report

---

## [2.0.0] — 2026-02-01

### Added — Resource Model (new in v2)
- **SnomiResource** base type: all resources inherit `id`, `resourceType`,
  `profile`, `status`, `snomi_version`, `meta`
- **ContentUnit** resource: central measurement object with 12 content profiles
  (`ig-reel`, `ig-story`, `ig-post`, `tk-video`, `tk-story`, `yt-short`,
  `yt-video`, `fb-reel`, `fb-post`, `li-post`, `tw-post`, `pin-pin`)
- **Actor** resource with 5 profiles: `creator`, `advertiser`, `agency`,
  `platform`, `tool`
- **Campaign** resource: aggregates ContentUnits, links Actors, holds KPIs
- **Financial** resource with 5 sub-types: `Budget`, `Contract`, `Invoice`,
  `Payment`, `Bonus`
- **MetricCitation** complex type: structured metric value with code, trust,
  source, produced date, and time window
- **Handle** complex type: per-platform creator identity with follower citation
- **Profile mechanism** documented: profiles constrain base resources without
  creating new types

### Added — Metrics
- Full 8-domain catalog: AUD (12 codes) · ENG (6) · REA (6) · CON (6) ·
  VAL (6) · QUA (6) · CRE (6) · REG (country-specific)
- **Composite scores**: CPI (Creator Performance Index), CoPI (Collaboration
  Performance Index), BFS (Brand Fit Score)
- **Trust propagation rule**: `T_result = max(T1, min(T_inputs) − Δ)`
  with Δ table (0 / 1 / 2)
- **REG domain**: REG.001 (legal disclosure by country, 7 markets),
  REG.002 (DSA/platform obligations), REG.003 (native platform labels by platform)
- **QUA.006** distinction from REG.001 documented: native label ≠ legal disclosure

### Added — Benchmarks
- ENG.002.IG by vertical × region × tier
- ENG.001.TK by vertical × region × tier
- VAL.003 CPM reference by market (7 countries) × platform
- Tier multipliers and production complexity multipliers for CPM
- ENG.002 interpretation thresholds by tier

### Added — Foundation
- ValueSets: platforms · content-formats · content-types · profiles ·
  actor-tiers · status · trust · campaign-objectives · content-categories ·
  financial-types · fee-types · usage-right-types · payment-structures ·
  agency-types
- Cardinality notation and primitive type system
- SKILL.md v2.0 for AI integration (6 operating modes)

### Changed (from v1)
- Complete restructure from flat metric list to typed resource model
- Trust scores moved from per-metric annotation to propagation rule
- REG domain replaces ad-hoc compliance notes
- Composite scores formalised with weighted formulas

---

## [1.0.0] — 2025 (pre-structured)

Initial publication of SNOMI as a flat metric nomenclature document.
Established the `[DOMAIN].[ID].[PLATFORM].[CC]` code structure and the
T1–T5 trust scale. No formal resource model. No composite scores.

*No detailed changelog available for this version.*

---

[Unreleased]: https://github.com/rayanebenabs/SNOMI/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/rayanebenabs/SNOMI/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/rayanebenabs/SNOMI/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/rayanebenabs/SNOMI/releases/tag/v1.0.0
