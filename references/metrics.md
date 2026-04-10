# SNOMI Full Metrics Catalog

> **Format column** — how the metric value is expressed when cited in a report.
> All metrics must be accompanied by a Trust Score and a time window (ISO dates).

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

| Code    | Name                   | Definition                                                                  | Formula                                         | Format          | Trust |
|---------|------------------------|-----------------------------------------------------------------------------|-------------------------------------------------|-----------------|-------|
| AUD.001 | Total Followers        | Total subscribers/followers at a given date                                 | Native platform value                           | integer         | T5    |
| AUD.002 | Audience Growth Rate   | % change in follower count over a period                                    | (end − start) / start × 100                    | %               | T5    |
| AUD.003 | Audience Quality Score | Estimated share of genuine, active followers                                | % active accounts / total — via 3rd-party tool | %               | T2    |
| AUD.004 | Target Audience Rate   | Share of audience matching brand's defined target persona                   | % audience meeting target criteria              | %               | T3    |
| AUD.005 | Audience Overlap       | Shared audience between two creators (for campaign deduplication)           | (Shared followers / min(A,B)) × 100             | %               | T2    |
| AUD.006 | Demographic Score      | Distribution by age, gender, geography — expressed as breakdown             | % per demographic cohort                        | % breakdown     | T4    |

**Note AUD.003:** Values above 85% are generally considered strong. Tools vary significantly — HypeAuditor, Modash, Kolsquare, Upfluence each use proprietary models. Never present as native platform data.

---

## ENG — Engagement

| Code    | Name                         | Definition                                                                                    | Formula                              | Format | Trust |
|---------|------------------------------|-----------------------------------------------------------------------------------------------|--------------------------------------|--------|-------|
| ENG.001 | Engagement Rate (Followers)  | Engagement against follower count. Common but biased if audience is unevenly active.          | (L+C+S+Sh) / Followers × 100        | %      | T4    |
| ENG.002 | Engagement Rate (Reach) ⭐   | Engagement against actual reach. SNOMI preferred metric for content resonance.                | (L+C+S+Sh) / Reach × 100            | %      | T4    |
| ENG.003 | Comment Rate                 | Comments relative to impressions — deep resonance indicator                                   | Comments / Impressions × 100         | %      | T4    |
| ENG.004 | Save Rate                    | Saves relative to impressions — perceived content value indicator                             | Saves / Impressions × 100            | %      | T4    |
| ENG.005 | Share Rate                   | Shares/reposts relative to impressions — virality indicator                                   | Shares / Impressions × 100           | %      | T4    |
| ENG.006 | Video Completion Rate        | Share watching to completion (or 75%+). Definition of "view" varies by platform.             | Complete views / Total views × 100   | %      | T5    |

**Interaction components (L+C+S+Sh):** Likes + Comments + Saves + Shares
Platform variants: Instagram includes Saves; TikTok includes Duets/Stitches; YouTube includes Thumbs up + Comments (no saves native)

**Trust propagation for ENG metrics (Δ = 1):**
- ENG.001: min(engagement T5, AUD.001 T5) − 1 = **T4** default. If audience inflated by fake followers → downgrade to T3.
- ENG.002: min(engagement T5, REA.001 T5) − 1 = **T4** default. If reach sourced from a third-party tool (T2) → T2−1 = **T1** — flag explicitly.
- ENG.003 / ENG.004 / ENG.005: same logic as ENG.002 — check the denominator's trust level.
- ENG.006: direct native read, Δ = 0 → **T5** regardless of platform.

---

## REA — Reach & Distribution

| Code    | Name              | Definition                                                                     | Formula                         | Format        | Trust |
|---------|-------------------|--------------------------------------------------------------------------------|---------------------------------|---------------|-------|
| REA.001 | Organic Reach     | Unique accounts seeing content organically (no paid boost)                     | Native platform value           | integer       | T5    |
| REA.002 | Total Impressions | Total displays (one account may generate multiple impressions)                 | Native platform value           | integer       | T5    |
| REA.003 | Reach Rate        | Share of total audience reached by a piece of content                          | Reach / Followers × 100        | %             | T4    |
| REA.004 | Frequency         | Average exposures per unique account                                           | Impressions / Reach             | ratio (×)     | T4    |
| REA.005 | Video Views       | Total view count. "View" definition: Instagram 3s, TikTok 2s, YouTube 30s.    | Native — declare platform def. | integer       | T5    |

---

## CON — Conversion

| Code    | Name                  | Definition                                                                         | Formula                             | Format              | Trust  |
|---------|-----------------------|------------------------------------------------------------------------------------|-------------------------------------|---------------------|--------|
| CON.001 | Link Clicks           | Clicks on bio link, swipe-up, or description link                                  | Native + tracking URL               | integer             | T4     |
| CON.002 | Click-Through Rate    | Clicks relative to impressions                                                     | Clicks / Impressions × 100          | %                   | T4     |
| CON.003 | Promo Code Usage Rate | Share of audience using creator-specific promo code                                | Code uses / Reach × 100             | %                   | T3     |
| CON.004 | Leads Generated       | Form completions / sign-ups attributable to creator (requires UTM or unique code)  | From tracking platform              | integer             | T3     |
| CON.005 | Attributed Sales      | Revenue attributable to collaboration via tracking. T1 without dedicated tracking. | Sales w/ creator code / Total sales | currency or %       | T3/T1  |
| CON.006 | Conversion Rate       | Share of generated traffic completing target action                                | Conversions / Clicks × 100          | %                   | T3     |

---

## VAL — Value & ROI

| Code    | Name  | Definition                                                                                     | Formula                            | Format                    | Trust |
|---------|-------|------------------------------------------------------------------------------------------------|------------------------------------|---------------------------|-------|
| VAL.001 | EMV   | Estimated advertising equivalent value. Highly contested — always declare methodology.         | Impressions × reference CPM / 1000 | currency                  | T3    |
| VAL.002 | CPE   | Average cost per engagement on sponsored content                                               | Total budget / Total engagements   | currency / engagement     | T4    |
| VAL.003 | CPM   | Cost per 1,000 impressions. Cite with [CC] + tier + production level for market benchmarks.   | Budget / Impressions × 1000        | currency / 1,000 imp.     | T4    |
| VAL.004 | CPC   | Cost per click — requires dedicated tracking URL                                               | Budget / Clicks                    | currency / click          | T4    |
| VAL.005 | ROAS  | Return on ad spend — requires sales tracking                                                   | Attributed revenue / Budget        | ratio (×) e.g. 3.2×       | T2    |
| VAL.006 | CPA   | Cost per acquisition — requires conversion tracking                                            | Budget / Conversions               | currency / acquisition    | T2    |

**EMV Methodologies:**
- **Launchmetrics**: weighted by creator tier, vertical, territory
- **Traackr**: based on native advertising CPMs per platform
- **Agency custom**: document your formula explicitly

**Trust propagation for VAL metrics:**
- VAL.001 (EMV): introduces a reference CPM assumption → Δ = 2, capped at **T3** regardless of how good REA.002 is.
- VAL.002 (CPE): budget (T1 self-reported) + engagements (T5 native) → min = T1, Δ=1 → floor **T1**. If budget is verified (contract) → T4.
- VAL.003 (CPM): budget / impressions → same as CPE. Trust depends entirely on budget source reliability.
- VAL.005 (ROAS) / VAL.006 (CPA): require conversion tracking (T2–T3 at best) → propagated trust rarely exceeds **T2**.

**Key rule — VAL.001:** EMV is always T3 maximum. A T5 impression count does not
elevate EMV above T3 because the reference CPM is inherently an assumption.

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
