# SNOMI Full Metrics Catalog

> **Format column** — how the metric value is expressed when cited in a report.
> All metrics must be accompanied by a Trust Score, a time window (ISO dates), and a produced date (when the data was extracted — YYYY-MM-DD).

## Trust Propagation

The **Trust** column shows the default score when all inputs are native (T5).
For calculated metrics, apply the propagation rule:

```
T_result = max(T1,  min(T_inputs) − Δ)
```

| Δ | Condition |
|---|-----------|
| 0 | Direct native read |
| 1 | Standard formula, no assumptions |
| 2 | Formula with methodology assumptions — capped at T3 |

Composite scores (CPI, CoPI, BFS) use Δ = 0 and inherit `min(component T scores)`.
The Trust column in each table below reflects the **ideal case** (all T5 inputs).
Always recalculate when inputs are not native.

---

## AUD — Audience

| Code         | Name                             | Definition                                                                            | Formula                                           | Format      | Trust |
|--------------|----------------------------------|---------------------------------------------------------------------------------------|---------------------------------------------------|-------------|-------|
| AUD.001      | Total Followers                  | Total subscribers/followers at a given date                                           | Native platform value                             | integer     | T5    |
| AUD.002      | Audience Growth Rate             | % change in follower count over a period                                              | (end − start) / start × 100                      | %           | T5    |
| AUD.003      | Audience Quality Score           | Estimated share of genuine, active followers (aggregate)                              | % active accounts / total — via 3rd-party tool   | %           | T2    |
| AUD.003.FAKE | Fake Account Rate                | Estimated share of bot and fake accounts                                              | % fake accounts / total — via 3rd-party tool     | %           | T2    |
| AUD.003.INACT| Inactive Account Rate            | Share of real but recently inactive accounts                                          | % inactive accounts / total — via 3rd-party tool | %           | T2    |
| AUD.004      | Target Audience Rate             | Share of audience matching brand's defined target persona                             | % audience meeting target criteria                | %           | T3    |
| AUD.005      | Audience Overlap                 | Shared audience between two creators (for campaign deduplication)                     | (Shared followers / min(A,B)) × 100               | %           | T2    |
| AUD.006.AGE  | Audience Age Distribution        | Audience breakdown by age bracket (13–17, 18–24, 25–34, 35–44, 45–54, 55+)          | % per age bracket — platform native or 3rd-party | % breakdown | T4    |
| AUD.006.GEN  | Audience Gender Distribution     | Audience breakdown by gender                                                          | % Male / Female / Unspecified                     | % breakdown | T4    |
| AUD.006.GEO  | Audience Geographic Distribution | Audience breakdown by country or region                                               | % per country (top N)                             | % breakdown | T4    |
| AUD.007      | Audience Interest Distribution   | Audience breakdown by interest/affinity category                                      | % per category (top N) — via 3rd-party tool      | % breakdown | T2    |
| AUD.008      | Audience Following Count         | Average number of accounts followed by audience members — attention dilution signal   | Mean following count — via 3rd-party tool        | integer     | T2    |

**Note AUD.003:** Values above 85% are generally considered strong. Tools vary significantly — HypeAuditor, Modash, Kolsquare, Upfluence each use proprietary models. Never present as native platform data. `AUD.003 ≈ 100% − AUD.003.FAKE − AUD.003.INACT` (approximation — tool definitions vary).

**Note AUD.003.FAKE / AUD.003.INACT:** Always declare which tool and version was used. HypeAuditor, Modash and Kolsquare use proprietary definitions of "fake" and "inactive" that are not directly comparable across tools.

**Note AUD.006.AGE / GEN / GEO:** Trust T4 applies when sourced from native platform analytics (Instagram Insights, TikTok Analytics, YouTube Studio). Downgrade to T2 if sourced from a third-party tool.

**Note AUD.007:** Interest taxonomies vary by tool — always declare the tool and its taxonomy. Do not compare AUD.007 values across reports sourced from different tools without normalisation.

**Note AUD.008 — indicative thresholds (non-normative):**
| Following count (avg) | Interpretation |
|---|---|
| < 500 | Focused audience — high attention |
| 500 – 2 000 | Within norm |
| > 2 000 | Attention dilution — flag for review |

Cross-reference with AUD.003 and ENG.002 before concluding.

---

## ENG — Engagement

| Code    | Name                         | Definition                                                                                    | Formula (codified)                                        | Format | Trust |
|---------|------------------------------|-----------------------------------------------------------------------------------------------|-----------------------------------------------------------|--------|-------|
| ENG.001 | Engagement Rate (Followers)  | Engagement against follower count. Common but biased if audience is unevenly active.          | `(L+C+S+Sh) / [AUD.001] × 100`                          | %      | T4    |
| ENG.002 | Engagement Rate (Reach) ⭐   | Engagement against actual reach. SNOMI preferred metric for content resonance.                | `(L+C+S+Sh) / [REA.001] × 100`                          | %      | T4    |
| ENG.003 | Comment Rate                 | Comments relative to impressions — deep resonance indicator                                   | `Comments / [REA.002] × 100`                             | %      | T4    |
| ENG.004 | Save Rate                    | Saves relative to impressions — perceived content value indicator                             | `Saves / [REA.002] × 100`                                | %      | T4    |
| ENG.005 | Share Rate                   | Shares/reposts relative to impressions — virality indicator                                   | `Shares / [REA.002] × 100`                               | %      | T4    |
| ENG.006 | Video Completion Rate        | Share watching to completion (or 75%+). Definition of "view" varies by platform.             | `Complete views / [REA.005] × 100`                       | %      | T5    |

**Interaction components (L+C+S+Sh):** Likes + Comments + Saves + Shares
Platform variants: Instagram includes Saves; TikTok includes Duets/Stitches; YouTube includes Thumbs up + Comments (no saves native)

**Trust propagation for ENG metrics (Δ = 1):**
- ENG.001: min(engagement T5, AUD.001 T5) − 1 = **T4** default. If audience inflated by fake followers → downgrade to T3.
- ENG.002: min(engagement T5, REA.001 T5) − 1 = **T4** default. If reach sourced from a third-party tool (T2) → T2−1 = **T1** — flag explicitly.
- ENG.003 / ENG.004 / ENG.005: same logic as ENG.002 — check the denominator's trust level.
- ENG.006: direct native read, Δ = 0 → **T5** regardless of platform.

---

## REA — Reach & Distribution

### The Reach / Impressions / Views triad

These three metrics are **not interchangeable**. They measure fundamentally different things and must never be substituted for one another without explicit declaration.

| Concept | Code | What it counts | Deduplicated? | Includes repeats? |
|---------|------|----------------|---------------|-------------------|
| Reach | REA.001 | Unique accounts that saw the content | ✅ Yes | ✗ No |
| Impressions | REA.002 | Total times the content was displayed | ✗ No | ✅ Yes |
| Video Views | REA.005 | Accounts that watched past the threshold | Partial* | Partial* |
| Qualified Views | REA.006 | Views ≥ 50% completion — engaged exposure | ✅ Yes (native) | ✗ No |

*View definition and deduplication vary by platform (see REA.005 note below).

**Relationship:** `[REA.002] = [REA.001] × [REA.004]`
(Impressions = Reach × Frequency). If you know two values, you can derive the third.

**Key rule:** Always declare which of REA.001, REA.002, REA.005, or REA.006 is used as the base for any calculated metric (EMV, CTR, CPM, engagement rate on reach). A metric cited without specifying its exposure base is non-compliant.

| Code    | Name              | Definition                                                                     | Formula (codified)                           | Format        | Trust |
|---------|-------------------|--------------------------------------------------------------------------------|----------------------------------------------|---------------|-------|
| REA.001 | Organic Reach     | Unique accounts seeing content organically (no paid boost)                     | Native platform value                        | integer       | T5    |
| REA.002 | Total Impressions | Total displays — one account may generate multiple impressions via frequency   | Native platform value                        | integer       | T5    |
| REA.003 | Reach Rate        | Share of total audience reached by a piece of content                          | `[REA.001] / [AUD.001] × 100`               | %             | T4    |
| REA.004 | Frequency         | Average exposures per unique account                                           | `[REA.002] / [REA.001]`                     | ratio (×)     | T4    |
| REA.005 | Video Views       | Total view count — **threshold varies by platform, declare when citing**       | Native — declare platform definition         | integer       | T5    |
| REA.006 | Qualified Views   | Views reaching ≥ 50% completion — measures genuine engaged exposure            | Native (where available) or `[ENG.006] × [REA.005] / 100` | integer | T5 / T4 |

**REA.005 — Platform view thresholds:**

| Platform | View counted after | Deduplicated? |
|----------|--------------------|---------------|
| Instagram | 3 seconds | No (same account counts multiple times) |
| TikTok | 2 seconds (auto-play) | No |
| YouTube | 30 seconds | Yes (unique viewer) |
| Facebook | 3 seconds | No |
| LinkedIn | 2 seconds | No |

**REA.006 — Availability:** Native on YouTube (as "watch time" proxy). On Instagram and TikTok, derive from `[ENG.006] × [REA.005] / 100` → T4. Flag if derived.

**Trust propagation for REA metrics:**
- REA.003: `min([REA.001] T5, [AUD.001] T5) − 1` = **T4** default.
- REA.004: `min([REA.002] T5, [REA.001] T5) − 1` = **T4** default.
- REA.006 (derived): `min([ENG.006] T5, [REA.005] T5) − 1` = **T4**. If native → **T5**.

---

## CON — Conversion

| Code    | Name                  | Definition                                                                         | Formula (codified)                             | Format              | Trust  |
|---------|-----------------------|------------------------------------------------------------------------------------|------------------------------------------------|---------------------|--------|
| CON.001 | Link Clicks           | Clicks on bio link, swipe-up, or description link                                  | Native + tracking URL                          | integer             | T4     |
| CON.002 | Click-Through Rate    | Clicks relative to impressions — declare base metric                               | `[CON.001] / [REA.002] × 100`                 | %                   | T4     |
| CON.003 | Promo Code Usage Rate | Share of audience using creator-specific promo code                                | `Code uses / [REA.001] × 100`                 | %                   | T3     |
| CON.004 | Leads Generated       | Form completions / sign-ups attributable to creator (requires UTM or unique code)  | From tracking platform                         | integer             | T3     |
| CON.005 | Attributed Sales      | Revenue attributable to collaboration via tracking. T1 without dedicated tracking. | `Sales w/ creator code / Total sales × 100`   | currency or %       | T3/T1  |
| CON.006 | Conversion Rate       | Share of generated traffic completing target action                                | `[CON.004 or CON.005] / [CON.001] × 100`      | %                   | T3     |

**Note CON.002:** The denominator must be declared. Using [REA.002] (impressions) vs [REA.001] (reach) can produce results that differ by a factor of [REA.004] (frequency). Always specify: `CON.002[base: REA.002]` or `CON.002[base: REA.001]`.

---

## VAL — Value & ROI

| Code    | Name  | Definition                                                                                     | Formula (codified)                                                  | Format                    | Trust |
|---------|-------|------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|---------------------------|-------|
| VAL.001 | EMV   | Estimated advertising equivalent value. **Base metric must be declared.** Always declare methodology. | `[REA.001 or REA.002 or REA.005 or REA.006] × ref_CPM / 1000` | currency                  | T3    |
| VAL.002 | CPE   | Average cost per engagement on sponsored content                                               | `Budget / (L+C+S+Sh)`                                              | currency / engagement     | T4    |
| VAL.003 | CPM   | Cost per 1,000 impressions. Cite with [CC] + tier + production level.                         | `Budget / [REA.002] × 1000`                                        | currency / 1,000 imp.     | T4    |
| VAL.004 | CPC   | Cost per click — requires dedicated tracking URL                                               | `Budget / [CON.001]`                                               | currency / click          | T4    |
| VAL.005 | ROAS  | Return on ad spend — requires sales tracking                                                   | `[CON.005] / Budget`                                               | ratio (×) e.g. 3.2×       | T2    |
| VAL.006 | CPA   | Cost per acquisition — requires conversion tracking                                            | `Budget / [CON.004]`                                               | currency / acquisition    | T2    |

### VAL.001 — EMV base metric declaration

EMV must declare which exposure metric it uses as its base. The choice is not neutral — it changes the result by a factor of [REA.004] (frequency) or more:

| Syntax | Base metric | Effect | When to use |
|--------|-------------|--------|-------------|
| `VAL.001[base: REA.001]` | Organic Reach | Most conservative — deduplicated unique accounts | Standard recommendation |
| `VAL.001[base: REA.002]` | Total Impressions | Inflated by frequency — higher number | Comparable to display advertising |
| `VAL.001[base: REA.005]` | Video Views | For video content only — threshold varies by platform (declare) | Video campaigns |
| `VAL.001[base: REA.006]` | Qualified Views (≥50%) | Most rigorous — genuine engaged exposure | Premium / quality-first campaigns |

**Citation example:**
```
VAL.001[base: REA.001].IG.FR | €28,400 | Q1 2026 | 2026-04-05 | Launchmetrics method | T3
VAL.001[base: REA.002].IG.FR | €61,000 | Q1 2026 | 2026-04-05 | Launchmetrics method | T3
```
These two lines refer to the same campaign — the difference is 2.15× (the frequency). Both are T3 maximum regardless of input quality.

**EMV Methodologies — always declare:**
- **Launchmetrics**: weighted by creator tier, vertical, territory
- **Traackr**: based on native advertising CPMs per platform
- **Agency custom**: document your formula explicitly

**Trust propagation for VAL metrics:**
- VAL.001 (EMV): Δ = 2 (ref CPM is an assumption) → capped at **T3** regardless of base metric quality.
- VAL.002 (CPE): `min(Budget trust, engagement T5) − 1`. Budget T1 (self-reported) → **T1**. Budget T4 (verified contract) → **T4**.
- VAL.003 (CPM): `min(Budget trust, [REA.002] T5) − 1`. Capped by budget source trust.
- VAL.005 / VAL.006: require conversion tracking → propagated trust rarely exceeds **T2**.

**Key rule — VAL.001:** EMV is always T3 maximum. A T5 base metric does not
elevate EMV above T3 — the reference CPM is inherently an assumption (Δ=2).

---

## QUA — Content Quality

| Code    | Name                    | Definition                                                                              | Formula                                                           | Format           | Trust |
|---------|-------------------------|-----------------------------------------------------------------------------------------|-------------------------------------------------------------------|------------------|-------|
| QUA.001 | Brief Compliance Score  | Adherence to brief requirements (mentions, visuals, messages)                           | Elements met / Total elements × 100                               | %                | T4    |
| QUA.002 | Brand Safety Score      | Absence of problematic content in creator's recent editorial context                    | Via moderation tool or manual audit                               | score 0–100      | T2    |
| QUA.003 | Sentiment Score         | Average comment tone (positive / neutral / negative)                                    | NLP semantic analysis                                             | % breakdown      | T3    |
| QUA.004 | Perceived Authenticity  | Qualitative naturalness/credibility of sponsored content                                | Jury score or audience survey                                     | score 0–10       | T2    |
| QUA.005 | Organic Mention Rate    | Creator content mentioning brand unpaid — brand affinity indicator                      | Organic brand posts / Total posts × 100                           | %                | T3    |
| QUA.006 | Native Partnership Label| Use of the platform's native branded content tool to disclose a paid partnership        | Boolean per post (present / absent) — verifiable natively         | boolean (0 / 1)  | T5    |

**QUA.006 — Why this is distinct from REG.001**

REG.001.[CC] measures legal compliance (visible hashtag, mandatory text). QUA.006 measures whether the creator activated the platform's native branded content tool — a complementary layer:

- **T5** because it is verifiable directly on the platform (the label is either visible or not)
- **Data access:** activating the native label unlocks Branded Content Insights (reach boostable by the brand, shared metrics on the advertiser side)
- **Algorithm impact:** some platforms slightly penalize organic reach on natively labeled posts — document this effect per platform in CoPI reports to avoid unfairly penalizing the creator vs. their organic ENG.002 baseline
- A post can have QUA.006 = 1 AND violate REG.001 (label activated but required hashtag absent) — the two codes are independent

---

## CRE — Creator Health

| Code    | Name                      | Definition                                                                                           | Formula                                                             | Format                    | Trust |
|---------|---------------------------|------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|---------------------------|-------|
| CRE.001 | Publishing Frequency      | Average posts per week over analyzed period                                                          | Posts / Weeks                                                       | #/week                    | T5    |
| CRE.002 | Publishing Regularity     | Coefficient of variation of posting frequency (lower = more consistent)                              | Std dev frequency / Mean frequency                                  | coefficient (decimal ≥ 0) | T4    |
| CRE.003 | Collaboration Rate        | Share of content as sponsored partnerships. High = audience saturation risk.                         | Sponsored posts / Total posts × 100                                 | %                         | T4    |
| CRE.004 | Compliance History        | Track record: deadlines, brief adherence, legal obligations                                          | Qualitative agency score                                            | score 0–10                | T2    |
| CRE.005 | Niche Authority Score     | Creator engagement vs. vertical peers                                                                | Creator ENG.002 / Median ENG.002 for vertical                       | ratio (×) e.g. 1.4×       | T3    |
| CRE.006 | Category Partnership History | Count and recency of paid partnerships in the same sector as the target brand                     | Count of paid partnerships in sector (rolling 12 months) + recency weighting | integer (count)  | T3    |

**CRE.003 risk thresholds:** <20% healthy · 20–40% monitor · >40% saturation risk

**Trust propagation for CRE metrics:**
- CRE.001 / CRE.002: derived from post counts (T5 native) → Δ=1 → **T4** default.
- CRE.003: sponsored posts / total posts — both T5 counts → Δ=1 → **T4** default.
- CRE.005 (Niche Authority Score): ratio of ENG.002 values. Trust = min(creator ENG.002 T, median ENG.002 T) − 1. If median is estimated (T3) → T3−1 = **T2**.
- CRE.006: counted from public data or agency records → **T3** default, cannot exceed T3.

**CRE.006 — Dual-signal interpretation ⚠ [BETA — to be validated against campaign data]**

This metric generates two opposing signals that must be read together:

| Sector partnerships (12 months) | Positive signal | Risk signal |
|----------------------------------|-----------------|-------------|
| 0                                | —               | No proof of concept in the category |
| 1–3                              | Basic sector experience | None |
| 4–8                              | ✅ Audience familiar with the category; creator credible in the niche | Monitor if CRE.003 > 30% |
| 9+                               | —               | ⚠ Category fatigue risk; perception of "catalogue creator" |

- **Positive signal:** a creator with 5 successful Beauty partnerships is statistically more reliable for a Beauty brand than a creator with no track record — the audience has already been exposed to this type of message and responded positively.
- **Risk signal:** if the creator has worked with all of the brand's direct competitors, check exclusivity clauses and message dilution risk.
- **Recency weighting:** weight the last 6 months at ×2 vs. months 7–12 to capture recent momentum.
- **Do not confuse** with CRE.003 (overall sponsored content rate): CRE.006 is sector-specific, CRE.003 is total.

Always cross-reference CRE.006 with QUA.004 (Perceived Authenticity) on posts from the same category.

---

## REG — Regulatory Compliance

*(Country code [CC] is mandatory on REG.001 and REG.002 — codes without [CC] are invalid)*
*(Exception: REG.003 uses a [PLATFORM] suffix instead of [CC] — see below)*

> REG metrics are compliance checks, not quantitative metrics. Output format for all REG codes: **compliant / non-compliant / not applicable**.

### REG.001 — Legal disclosure by country (hashtag / text)

| Code        | CC  | Authority              | Key Requirement                                        | Required format                       |
|-------------|-----|------------------------|--------------------------------------------------------|---------------------------------------|
| REG.001.FR  | FR  | ARPP                   | Mandatory disclosure of commercial partnership         | #partenariat or #collaboration        |
| REG.001.US  | US  | FTC                    | Clear & conspicuous disclosure of material connection  | #ad or #sponsored                     |
| REG.001.UK  | UK  | ASA / CAP Code         | Disclosure required for all paid promotions            | #ad mandatory (gifted content too)    |
| REG.001.DE  | DE  | Landesmedienanstalten  | Disclosure required even for gifted products           | #Werbung or #Anzeige                  |
| REG.001.AU  | AU  | ACCC                   | Disclosure of material benefits                        | #ad or equivalent                     |
| REG.001.BR  | BR  | CONAR                  | Paid partnership disclosure — Resolução 206/2021       | #publi or #publicidade                |
| REG.001.IN  | IN  | ASCI                   | Influencer Advertising Guidelines 2021                 | #ad within first 3 lines              |

### REG.002 — Platform-level obligations (DSA / aggregated regulatory)

| Code        | CC  | Authority            | Key Requirement                                     | Format                    |
|-------------|-----|----------------------|-----------------------------------------------------|---------------------------|
| REG.002.EU  | EU  | Digital Services Act | Platform transparency for commercial content        | Platform-level obligation |

### REG.003 — Native platform branded content labels (by platform)

> **Structural exception:** REG.003 uses `[PLATFORM]` as suffix (not `[CC]`) because these obligations are global and imposed by the platform itself, independently of territory.
> REG.003.[PLATFORM] is **complementary to REG.001.[CC]**, not a substitute. A post can have REG.003.IG activated and still violate REG.001.FR if the required hashtag is absent.

| Code        | Platform  | Native tool                               | Obligation                                                                               | Data benefit                                                     |
|-------------|-----------|-------------------------------------------|------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| REG.003.IG  | Instagram | "Paid Partnership" label                  | Required by Instagram ToS for all paid content. Allows the brand to boost the post.      | Branded Content Insights shared with the advertiser (T5)         |
| REG.003.TK  | TikTok    | "Branded Content" toggle                  | Mandatory TikTok ToS. Without activation, the post may be removed. Slightly reduces organic reach. | Access to Branded Content Analytics via TikTok Ads          |
| REG.003.YT  | YouTube   | "Includes paid promotion" checkbox        | Required by YouTube ToS for any paid mention. Displays an on-screen banner.              | No additional data unlocked                                      |
| REG.003.FB  | Facebook  | "Branded Content" tag (Brand Collabs Mgr) | Mandatory tagging of the brand partner for monetized creators.                           | Reach and engagement metrics shared with the brand               |

**Algorithm note (REG.003):** On Instagram and TikTok, activating the native label can reduce organic reach by 10–20% depending on the period (the algorithm treats the post as advertising content). Document this effect in CoPI reports to avoid unfairly benchmarking the creator's ENG.002 against their organic baseline.
