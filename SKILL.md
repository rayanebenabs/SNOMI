---
name: snomi
description: >
  SNOMI (Standard Nomenclature of Influence Metrics) is an open international
  standard for influencer marketing metrics. Use this skill for ANY task
  involving influencer performance measurement: coding raw metrics into SNOMI
  format, decoding SNOMI codes, calculating composite scores (CPI, CoPI, BFS),
  validating campaign reports for compliance, comparing creator performance
  against regional benchmarks, auditing EMV methodology, or flagging
  non-standard metric usage. Triggers include: "analyze this creator",
  "calculate engagement rate", "is this report correct", "what's the CPI",
  "validate this report", "compare these creators", "what does ENG.001 mean",
  "audit this campaign", "calculate EMV", "benchmark this against the market",
  "flag non-compliant metrics", or any mention of influencer KPIs, reach,
  engagement, CPM, ROAS, EMV in a marketing context. When in doubt, use SNOMI
  — it exists precisely to structure these conversations.
---

# SNOMI — Standard Nomenclature of Influence Metrics
**Version 2.1 · Open International Standard**

You are a SNOMI-fluent analyst. Every time metrics are discussed in an
influencer marketing context, you think and speak in SNOMI codes. Your goal
is to bring precision and comparability to a field that historically suffers
from ambiguity.

---

## Code Structure

```
[DOMAIN].[ID].[PLATFORM]          → universal metric
[DOMAIN].[ID].[PLATFORM].[CC]     → market-specific benchmark or regulatory variant
```

**Optional declarations (append to code):**
```
[inputs: L+C+S+Sh]                → declare which interaction types are included
[base: REA.001]                   → declare the exposure base used in a formula
[CPM: native | IG | Reel | FR | 2026-Q1]  → declare ads CPM ref source for VAL.001
```

**Platforms:** `IG` Instagram · `TK` TikTok · `YT` YouTube · `FB` Facebook ·
`TW` X/Twitter · `LI` LinkedIn · `PI` Pinterest · `ALL` cross-platform

**Country codes (use only for benchmarks or REG domain):**
`.US` `.UK` `.FR` `.DE` `.AU` `.BR` `.IN` `.EU` `.GLOBAL`

**Trust Score** — always cite alongside a metric:
| Score | Level  | Meaning |
|-------|--------|---------|
| T5    | Gold   | Native platform data, non-manipulable |
| T4    | Silver | Calculated from T5 inputs, standard formula, no assumptions |
| T3    | Bronze | Calculated with declared methodology assumptions |
| T2    | Copper | Estimated via third-party tool or interim benchmark |
| T1    | Iron   | Self-reported, unverifiable, or propagation floor |

### Trust Propagation Rule

The trust score of a **calculated metric** depends on the trust of its inputs.

```
T_result = max(T1,  min(T_inputs) − Δ)
```

**Δ (calculation penalty):**
| Δ | When to apply |
|---|---------------|
| 0 | Direct platform read — no calculation |
| 1 | Standard formula, no assumptions (ratio, sum, rate) |
| 2 | Formula introduces one level of methodology assumption |
| 3 | Formula introduces two levels of methodology assumption |

**Composite scores (CPI, CoPI, BFS):** Δ = 0. They inherit `min(component T scores)` directly.

**VAL.001 (EMV) — trust is bounded by ads CPM reference source:**
| CPM source | Example | T_result |
|------------|---------|----------|
| Native Ads Manager (T4) | Meta Ads Manager, same period | **T4** |
| Declared third-party benchmark (T3) | Launchmetrics, cited source | **T3** |
| SNOMI-bench-pending (T2) | Interim global avg fallback | **T2** |

**Practical examples:**

| Metric | Inputs | min(T) | Δ | T_result |
|--------|--------|--------|---|----------|
| ENG.001.IG — native data | REA.005 T5 + REA.001 T5 + AUD.001 T5 | T5 | −1 | **T4** |
| ENG.002.IG — native data | engagements T5 + REA.001 T5 | T5 | −1 | **T4** |
| ENG.002.IG — 3rd-party reach | engagements T5 + REA.001 T2 | T2 | −1 | **T1** ⚠ |
| REA.003 — native data | REA.001 T5 + AUD.001 T5 | T5 | −1 | **T4** |
| VAL.001 — native CPM | REA.001 T5 + CPM T4 (Ads Manager) | T4 | −1 | **T4** |
| VAL.001 — declared CPM | REA.001 T5 + CPM T3 (cited) | T3 | −1 | **T3** |
| VAL.001 — bench-pending | REA.001 T5 + CPM T2 (SNOMI estimate) | T2 | −1 | **T2** |
| CPI — all native inputs | ENG.001 T4 + REA.003 T4 + AUD.003 T4 | T4 | 0 | **T4** |
| CPI — includes AUD.003 T2 | ENG.001 T4 + REA.003 T4 + AUD.003 T2 | T2 | 0 | **T2** |

**Key consequence:** a report citing `CPI | 74 | T4` is only valid if all 5 CPI
components were sourced at T4 or above. If AUD.003 came from a third-party tool
(T2), the CPI must be cited as T2.

---

## Resource Model

SNOMI defines structured Resources alongside the metrics system.

### Resource Types
- **ContentUnit** — a single piece of content (Reel, Story, Video, etc.)
- **Actor** — any party in the ecosystem (Creator, Advertiser, Agency, Platform, Tool)
- **Campaign** — a collection of ContentUnits with shared objective and budget
- **Financial** — contract, budget, invoice, payment, or bonus

### Content Profiles
| Profile | Platform | Format | View Threshold |
|---------|----------|--------|---------------|
| `ig-reel` | IG | REEL | 3s |
| `ig-story` | IG | STORY | 1 view |
| `ig-post` | IG | POST | — |
| `tk-video` | TK | VIDEO | 2s |
| `tk-story` | TK | STORY | — |
| `yt-short` | YT | SHORT | platform-defined |
| `yt-video` | YT | VIDEO | 30s |
| `fb-reel` | FB | REEL | 3s |
| `fb-post` | FB | POST | — |
| `li-post` | LI | POST | — |
| `tw-post` | TW | TWEET | — |
| `pin-pin` | PI | PIN | — |

### Actor Profiles
`creator` · `advertiser` · `agency` · `platform` · `tool`

### Financial Resources
`FIN.Budget` · `FIN.Contract` · `FIN.Invoice` · `FIN.Payment` · `FIN.Bonus`

### Encoding a ContentUnit (ENCODE mode)
```
RESOURCE: ContentUnit
profile: ig-reel
platform: IG | format: REEL | content_type: video
creator: [actor id or handle]
published_at: [date]
time_window: [start → end]
is_sponsored: true/false
metrics:
  REA.001.IG    | [value] | [window] | [produced] | Instagram Insights | T5
  REA.005.IG    | [value] | [window] | [produced] | Instagram Insights | T5
  AUD.001.IG    | [value] | [date]   | [produced] | Instagram Insights | T5
  ENG.001[inputs:L+C+S+Sh].IG | [value] | [window] | [produced] | calculated | T4
  VAL.001[base: REA.001][CPM: native|IG|Reel|CC|period].IG.[CC] | [value] | [window] | [produced] | [source] | T4
```

---

## The 8 Domains

| Domain | Name               | Covers |
|--------|--------------------|--------|
| `AUD`  | Audience           | Size, quality, composition |
| `ENG`  | Engagement         | Interaction with content |
| `REA`  | Reach & Distribution | Content spread |
| `CON`  | Conversion         | Commercial actions |
| `VAL`  | Value & ROI        | Financial metrics |
| `QUA`  | Content Quality    | Quality, compliance, sentiment |
| `CRE`  | Creator Health     | Vitality, consistency, credibility |
| `REG`  | Regulatory         | National compliance — **always requires [CC]** |

→ For the full metrics catalog (all codes, formulas, definitions), read
`references/metrics.md`

→ For engagement rate benchmarks by vertical and tier, read
`references/benchmarks.md`

---

## Core Metrics — Quick Reference

### Audience

| Code             | Name                             | Formula                                       | Trust |
|------------------|----------------------------------|-----------------------------------------------|-------|
| `AUD.001`        | Total Followers                  | Native value                                  | T5    |
| `AUD.002`        | Audience Growth Rate             | `(end − start) / [AUD.001_start] × 100`       | T5    |
| `AUD.003`        | Audience Quality Score           | % real active followers (3rd-party tool)      | T2    |
| `AUD.003.FAKE`   | Fake Account Rate                | % fake/bot accounts (3rd-party tool)          | T2    |
| `AUD.003.INACT`  | Inactive Account Rate            | % real but inactive accounts (3rd-party tool) | T2    |
| `AUD.004`        | Target Audience Rate             | % audience matching brand target persona      | T3    |
| `AUD.005`        | Audience Overlap                 | Shared audience between two creators          | T2    |
| `AUD.006.AGE`    | Audience Age Distribution        | % per age bracket (T4 native / T2 3rd-party)  | T4    |
| `AUD.006.GEN`    | Audience Gender Distribution     | % Male / Female / Unspecified                 | T4    |
| `AUD.006.GEO`    | Audience Geographic Distribution | % per country/region (top N)                  | T4    |
| `AUD.007`        | Audience Interest Distribution   | % per interest category (3rd-party tool)      | T2    |
| `AUD.008`        | Audience Following Count         | Avg accounts followed by audience members     | T2    |

### Engagement

Interaction weights (SNOMI standard): **Like ×1 · Comment ×6 · Save ×8 · Share ×7 · Duet ×6 · Stitch ×6**

| Code      | Name                           | Formula                                                                      | Trust |
|-----------|--------------------------------|------------------------------------------------------------------------------|-------|
| `ENG.001` ⭐ | ER (Contextualised) — **PREFERRED** | `(Σint / [REA.005\|REA.001]) × (REA.001 / AUD.001) × 100`            | T4    |
| `ENG.002` | ER (Reach)                     | `Σint / [REA.001] × 100`                                                    | T4    |
| `ENG.003` | Comment Rate                   | `C / [REA.002] × 100`                                                       | T4    |
| `ENG.004` | Save Rate                      | `S / [REA.002] × 100`                                                       | T4    |
| `ENG.005` | Share Rate                     | `Sh / [REA.002] × 100`                                                      | T4    |
| `ENG.006` | Video Completion Rate          | `Complete views / [REA.005] × 100`                                          | T5    |
| `ENG.007` ⭐ | SER (Contextualised) — weighted | `(1·L+6·C+8·S+7·Sh) / [REA.005\|REA.001] / 2 × (REA.001/AUD.001) × 100` | T4    |
| `ENG.008` | SER (Reach) — weighted         | `(1·L+6·C+8·S+7·Sh) / [REA.001] / 2 × 100`                               | T4    |

**ENG.001 vs ENG.002:**
- `ENG.001` = engagement density on views, weighted by audience penetration. Integrates content quality (via views) and creator reach efficiency (via reach/followers ratio). SNOMI preferred.
- `ENG.002` = engagement on reach only, no audience context. Component metric — useful as a building block.
- `[REA.005|REA.001]` = use REA.005 (video views) when available; fall back to REA.001 (reach) for static content.

**ENG.007 vs ENG.008:** weighted equivalents of ENG.001/ENG.002. Weight each interaction type by its quality signal (saves and comments count more than likes). ÷2 normalization calibrated so SER ≈ ER on average-quality posts (Socialinsider 2024).

**ENG.001 and ENG.002 are NOT interchangeable — always specify which is used.**

### Reach & Distribution

| Code      | Name              | Formula                                  | Trust |
|-----------|-------------------|------------------------------------------|-------|
| `REA.001` | Organic Reach     | Native — unique accounts, deduplicated   | T5    |
| `REA.002` | Total Impressions | Native — total displays, includes repeats| T5    |
| `REA.003` | Reach Rate        | `[REA.001] / [AUD.001] × 100`            | T4    |
| `REA.004` | Frequency         | `[REA.002] / [REA.001]`                  | T4    |
| `REA.005` | Video Views       | Native — threshold: IG 3s · TK 2s · YT 30s | T5 |
| `REA.006` | Qualified Views   | Views ≥ 50% completion                   | T5/T4 |

Note: REA.001 ≠ REA.002 ≠ REA.005 ≠ REA.006 — never substitute one for another without declaration.
EMV and CPM figures on REA.002 are always exactly `REA.004 ×` the REA.001-based figure.

### Conversion

| Code      | Name              | Formula                              | Trust |
|-----------|-------------------|--------------------------------------|-------|
| `CON.001` | Link Clicks       | Native or UTM-tracked                | T4    |
| `CON.002` | CTR               | `[CON.001] / [REA.002] × 100`        | T4    |
| `CON.003` | Promo Code Rate   | `Code uses / [REA.001] × 100`        | T3    |
| `CON.004` | Leads / Sign-ups  | Tracking platform                    | T3    |
| `CON.005` | Attributed Sales  | Sales tracking (last-click or model) | T3    |
| `CON.006` | CVR               | `[CON.004] / [CON.001]`              | T3    |

### Value & ROI

**Four distinct CPM types — never write "CPM" alone:**

| Code      | Name            | What it measures                                             | Formula                                                         | Trust  |
|-----------|-----------------|--------------------------------------------------------------|-----------------------------------------------------------------|--------|
| `VAL.001` | EMV             | Equivalent ad spend for the exposure generated              | `exposure_base × ads CPM ref[platform][format] / 1000`         | T2–T4  |
| `VAL.002` | CPE             | Actual cost per engagement (campaign budget)                | `Budget / (L+C+S+Sh)`                                          | T4     |
| `VAL.003` | Campaign CPM    | Actual cost per 1k impressions (campaign budget)            | `Budget / [REA.002] × 1000`                                    | T4     |
| `VAL.004` | CPC             | Actual cost per click                                       | `Budget / [CON.001]`                                           | T4     |
| `VAL.005` | ROAS            | Return on ad spend                                          | `[CON.005] / Budget`                                           | T2     |
| `VAL.006` | CPA             | Cost per acquisition                                        | `Budget / [CON.004]`                                           | T2     |
| `VAL.007` | Creator CPM     | What the brand paid per 1k exposures (creator fee only)     | `creator_fee / [REA.001\|REA.002] × 1000`                     | T4     |
| `VAL.008` | Gross CPM       | Creator fee + agency fees per 1k exposures                  | `(creator_fee + agency_fees) / [REA.001\|REA.002] × 1000`    | T4     |

**VAL.001 — ads CPM ref source must always be declared:**
```
[CPM: native | IG | Reel | FR | 2026-Q1]          → pulled from Ads Manager (T4)
[CPM: 4.20 | EUR | IG | Reel | FR | 2026 | source] → declared with cited source (T3)
[CPM: SNOMI-bench-pending | IG | Reel | 2025]      → interim global fallback (T2)
```

**VAL.007 vs VAL.008 vs VAL.001 — why creator CPM is structurally higher than ads CPM ref:**
Creator fee bundles both distribution (reaching the audience) and content production. An ad campaign bills these separately. VAL.007/VAL.008 must never be compared raw against the ads CPM ref without acknowledging this structural difference.

### Content Quality

| Code      | Name                    | Formula / Method                                  | Trust |
|-----------|-------------------------|---------------------------------------------------|-------|
| `QUA.001` | Brief Compliance Score  | `Elements met / Total elements × 100`             | T4    |
| `QUA.002` | Brand Safety Score      | Moderation tool or manual audit                   | T2    |
| `QUA.003` | Sentiment Score         | NLP semantic analysis                             | T3    |
| `QUA.004` | Perceived Authenticity  | Jury score or audience survey                     | T2    |
| `QUA.005` | Organic Mention Rate    | `Organic brand posts / Total posts × 100`         | T3    |
| `QUA.006` | Native Partnership Label| Boolean — native branded content tool activated   | T5    |

QUA.006 ≠ REG.001: native label unlocks analytics — it does not replace the legal disclosure hashtag.

### Creator Health

| Code      | Name                        | Formula / Method                                        | Trust |
|-----------|-----------------------------|---------------------------------------------------------|-------|
| `CRE.001` | Publishing Frequency        | `Posts / Weeks`                                         | T5    |
| `CRE.002` | Publishing Regularity       | `Std dev / Mean frequency`                              | T4    |
| `CRE.003` | Collaboration Rate          | `Sponsored posts / Total posts × 100`                   | T4    |
| `CRE.004` | Compliance History          | Qualitative agency score                                | T2    |
| `CRE.005` | Niche Authority Score       | `[ENG.002] / median([ENG.002], vertical)`               | T3    |
| `CRE.006` ⚠ BETA | Category Partnership History | Count paid partnerships in sector (12 months)  | T3    |

CRE.003 thresholds: <20% healthy · 20–40% monitor · >40% saturation risk.

---

## Creator Tier Definitions (SNOMI standard)

| Tier     | Follower range        | Typical reach rate | Profile |
|----------|-----------------------|--------------------|---------|
| Nano     | 1,000 – 10,000        | 40–60%             | High ENG, limited reach |
| Micro    | 10,000 – 100,000      | 20–40%             | Optimal cost/efficiency |
| Mid-tier | 100,000 – 500,000     | 8–15%              | SNOMI standard reference |
| Macro    | 500,000 – 1,000,000   | 5–10%              | Premium reach + brand equity |
| Mega     | > 1,000,000           | 2–5%               | Celebrity premium / exclusivity |

---

## Composite Scores

### CPI — Creator Performance Index (0–100)
"Health check" of a creator independent of any collaboration.

| Component           | Weight | Source                |
|---------------------|--------|-----------------------|
| Engagement Quality  | 30%    | **ENG.001**           |
| Audience Quality    | 25%    | AUD.003               |
| Reach Efficiency    | 20%    | REA.003               |
| Content Regularity  | 15%    | CRE.001 + CRE.002     |
| Niche Authority     | 10%    | CRE.005               |

Scale: 0–40 Weak · 41–60 Average · 61–80 Good · 81–100 Excellent

To calculate CPI: normalize each component to 0–100 relative to the vertical's benchmark,
apply weights, sum. If a component is missing, scale remaining weights proportionally and flag.

### CoPI — Collaboration Performance Index (0–100)
Performance of a specific collaboration.

| Component            | Weight | Source                                 |
|----------------------|--------|----------------------------------------|
| Reach Efficiency     | 25%    | REA.003 vs. benchmark                  |
| Sponsored Engagement | 25%    | **ENG.001** (sponsored vs. organic)    |
| Conversion           | 25%    | CON.002 + CON.003 if available         |
| Brief Compliance     | 15%    | QUA.001                                |
| Sentiment            | 10%    | QUA.003                                |

### BFS — Brand Fit Score (0–100)
Pre-collaboration casting tool.

| Component                    | Weight | Source   | Notes |
|------------------------------|--------|----------|-------|
| Audience Match               | 30%    | AUD.004  | |
| Niche Authority              | 25%    | CRE.005  | |
| Brand Safety                 | 20%    | QUA.002  | |
| Category Partnership History | 10%    | CRE.006  | ⚠ BETA — see note below |
| Organic Mention Rate         | 8%     | QUA.005  | |
| Compliance History           | 7%     | CRE.004  | |

**CRE.006 BETA note:** Positive (4–8 sector partnerships/12m) → BFS +5 pts max.
Negative (9+ or direct competitors) → BFS −8 pts max. If unavailable, redistribute 10%
proportionally and flag. Never include a guessed CRE.006 value.

---

## Standard Citation Format

Every metric in a SNOMI-compliant report must include:
1. SNOMI code + platform + country code (if benchmark)
2. Value
3. Time window (ISO dates) — the period the metric covers
4. Produced date (ISO YYYY-MM-DD) — when data was extracted or calculated
5. Data source
6. Trust Score

PRODUCED ≠ TIME WINDOW. Platform data can be revised retroactively.

```
ENG.001[inputs:L+C+S+Sh].IG.FR   | 5.9%   | 2026-03-01 → 2026-03-31 | 2026-04-02 | Instagram Insights   | T4
ENG.002[inputs:L+C+S+Sh].IG.FR   | 8.0%   | 2026-03-01 → 2026-03-31 | 2026-04-02 | Instagram Insights   | T4
AUD.003.IG                        | 91%    | 2026-04-01               | 2026-04-01 | HypeAuditor          | T2
VAL.001[base: REA.001][CPM: native|IG|Reel|FR|2026-Q1].IG.FR | €2,856 | Q1 2026 | 2026-04-05 | Meta Ads Manager | T4
VAL.007[base: REA.001].IG.FR      | €5.15/1k | Q1 2026             | 2026-04-05 | contract             | T4
```

---

## Operating Modes

### MODE: ENCODE
Convert raw data or plain-language reports into SNOMI citation format.
Flag any metric that can't be mapped and explain why.

Example input: *"@creator had 4.2% engagement on Instagram Reels in March,
850k followers, 680k reach, 142k video views, 72% real audience from HypeAuditor"*

Output:
```
AUD.001.IG          | 850,000 | 2026-03-31 | [today] | Instagram Insights | T5
REA.001.IG          | 680,000 | 2026-03-01 → 2026-03-31 | [today] | Instagram Insights | T5
REA.005.IG          | 142,000 | 2026-03-01 → 2026-03-31 | [today] | Instagram Insights | T5
AUD.003.IG          | 72%     | 2026-03-31 | [today] | HypeAuditor | T2
ENG.001[inputs:?].IG | 4.2%   | 2026-03-01 → 2026-03-31 | [today] | source unknown | T4
  ⚠ 4.2% — unclear if calculated on followers (old ENG.001), reach (ENG.002), or
    contextualised formula (current ENG.001). Request clarification.
    ENG.001 current formula: (Σint/[REA.005|REA.001]) × (REA.001/AUD.001) × 100
    ENG.002 formula:         Σint / [REA.001] × 100
```

### MODE: DECODE
When given a SNOMI code, explain it in plain language: formula, trust score interpretation, common pitfalls, and how it differs from similar codes.

### MODE: CALCULATE
When given data points, compute the requested metric or composite score step by step. Show your working. If data is missing, flag it and compute with available data, noting the gap.

### MODE: VALIDATE
Audit a report or set of metrics for SNOMI compliance. Check for:
- Missing platform suffix
- Missing country code on benchmark citations
- ENG.001 vs ENG.002 ambiguity (always specify)
- ENG.007 vs ENG.008 ambiguity (if SER is cited)
- VAL.001 (EMV) cited without declared base metric and CPM source
- VAL.001 CPM source not specifying type (native / declared / bench-pending)
- "CPM" cited without specifying which type (ads CPM ref / VAL.003 / VAL.007 / VAL.008)
- VAL.007/VAL.008 compared to ads CPM ref without noting structural production cost difference
- T1/T2 metrics cited without methodological note
- REG.001/REG.002 codes cited without country suffix
- REG.003 codes cited without platform suffix
- QUA.006 absent from sponsored post reports
- CRE.006 used in BFS without BETA flag and source documentation
- Cross-platform comparisons without normalization note
- REA.001 / REA.002 / REA.005 / REA.006 mixed without declaration

Output a structured compliance report: ✅ passing / ⚠ warning / ❌ error.

### MODE: BENCHMARK
Compare a metric value against benchmarks from `references/benchmarks.md`.
Always output: the metric code, the observed value, the benchmark range (by vertical and tier),
and a contextual interpretation (above/below/in-line with market).

### MODE: AUDIT (full)
Full report audit = VALIDATE + BENCHMARK + flagging of strategic risks
(e.g., audience saturation from high CRE.003, EMV/revenue confusion,
non-comparable metrics mixed in same report, CPM type confusion).

---

## Critical Rules (non-negotiable)

1. **EMV ≠ Revenue.** Never conflate VAL.001 with sales generated.
2. **ENG.001 ≠ ENG.002.** Always specify which. ENG.001 is the SNOMI preferred metric (contextualised). ENG.002 is the reach-only component. They are not interchangeable.
3. **REG.001/REG.002 require [CC].** REG.001 alone is invalid. Exception: REG.003 uses [PLATFORM].
4. **Benchmarks require [CC] and CPM type.** "CPM: $5.20" is non-compliant. Declare which CPM type (ads CPM ref / VAL.003 / VAL.007 / VAL.008) + source + country.
5. **T1/T2 metrics need a note.** Low-trust metrics must be explicitly flagged when cited.
6. **Cross-platform ≠ comparable by default.** ENG.002.IG ≠ ENG.002.TK. Always compare the same metric code across platforms.
7. **Never write "CPM" alone.** Four distinct types exist: ads CPM ref (VAL.001 input) · campaign CPM (VAL.003) · creator CPM (VAL.007) · gross CPM (VAL.008). Always declare which.
8. **REG.003 ≠ REG.001.** Native partnership label (QUA.006 = 1) does not replace the legal disclosure hashtag. Both are independent.
9. **CRE.006 is BETA.** Do not present a BFS incorporating CRE.006 as definitive without documenting source and method.
10. **Reach ≠ Impressions ≠ Views.** REA.001, REA.002, REA.005, REA.006 are distinct and must never be substituted without declaration.
11. **VAL.001 must declare base + CPM source.** `VAL.001` alone is non-compliant. Always: `VAL.001[base: REA.001][CPM: native|IG|Reel|FR|2026-Q1]`.
12. **Calculated metric formulas must reference SNOMI codes.** Use `[REA.001]`, `[AUD.001]` — not generic terms like "reach" or "followers".
13. **Trust propagates through formulas.** T_result = max(T1, min(T_inputs) − Δ). A metric is never more trustworthy than its weakest input.

---

## Tone & Style

- Be precise but not pedantic. The goal is clarity, not bureaucracy.
- When you flag an issue, suggest the fix.
- When data is ambiguous, ask one targeted question rather than a list.
- In composite score calculations, show the math — it builds trust.
- When comparing to benchmarks, give context (vertical, tier, region).
