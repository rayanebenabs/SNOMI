# SNOMI ValueSets
**Version 2.0 · Foundation Layer**

ValueSets define the allowed values for `code`-typed fields across all SNOMI resources.
Every code field must reference a ValueSet. Using a value not in the set is non-compliant.

---

## ValueSet/platforms

Platforms supported by SNOMI. Used in `ContentUnit.platform`, `Handle.platform`, etc.

| Code | Name | Notes |
|------|------|-------|
| `IG` | Instagram | Meta property |
| `TK` | TikTok | ByteDance property |
| `YT` | YouTube | Alphabet/Google property |
| `FB` | Facebook | Meta property |
| `TW` | X (Twitter) | X Corp property |
| `LI` | LinkedIn | Microsoft property |
| `PI` | Pinterest | |
| `SC` | Snapchat | |
| `BE` | BeReal | |
| `TH` | Threads | Meta property |
| `ALL` | Cross-platform | Aggregated / multi-platform metric |

---

## ValueSet/content-formats

Content format types. Used in `ContentUnit.format`.

| Code | Name | Platforms |
|------|------|-----------|
| `REEL` | Short-form vertical video (looping) | IG, FB |
| `STORY` | Ephemeral 24h content | IG, FB, TK, SC |
| `POST` | Static image or carousel | IG, FB, LI, TW, PI |
| `VIDEO` | Standard long/mid-form video | TK, YT, FB, LI |
| `SHORT` | Vertical short-form video ≤60s | YT |
| `LIVE` | Live broadcast | IG, TK, YT, FB |
| `CAROUSEL` | Multi-slide swipeable post | IG, LI |
| `ARTICLE` | Long-form written content | LI |
| `PIN` | Visual bookmark/discovery pin | PI |
| `TWEET` | Short text post | TW |
| `THREAD` | Series of connected posts | TW, TH |
| `PODCAST` | Audio episode | YT, LI |

---

## ValueSet/content-types

Media type of the content. Used in `ContentUnit.content_type`.

| Code | Name |
|------|------|
| `video` | Video content (any duration) |
| `image` | Single static image |
| `carousel` | Multiple images or mixed media |
| `text` | Text-only post |
| `audio` | Audio-only |
| `mixed` | Combination of types (e.g. carousel with video slides) |

---

## ValueSet/profiles

All defined SNOMI profiles. Used in `SnomiResource.profile`.

**Content profiles:**

| Code | ResourceType | Name |
|------|-------------|------|
| `ig-reel` | ContentUnit | Instagram Reel |
| `ig-story` | ContentUnit | Instagram Story |
| `ig-post` | ContentUnit | Instagram Post (image/carousel) |
| `ig-video` | ContentUnit | Instagram Video / IGTV |
| `tk-video` | ContentUnit | TikTok Video |
| `tk-story` | ContentUnit | TikTok Story |
| `yt-short` | ContentUnit | YouTube Short |
| `yt-video` | ContentUnit | YouTube Video |
| `fb-reel` | ContentUnit | Facebook Reel |
| `fb-post` | ContentUnit | Facebook Post |
| `li-post` | ContentUnit | LinkedIn Post |
| `tw-post` | ContentUnit | X/Twitter Post |
| `pin-pin` | ContentUnit | Pinterest Pin |

**Actor profiles:**

| Code | ResourceType | Name |
|------|-------------|------|
| `creator` | Actor | Content creator / influencer |
| `advertiser` | Actor | Brand / advertiser |
| `agency` | Actor | Talent or media agency |
| `platform` | Actor | Social media platform operator |
| `tool` | Actor | Analytics or management software |
| `regulatory-body` | Actor | Advertising standards authority |

---

## ValueSet/actor-tiers

Creator tier classification by follower count (platform-agnostic).
Used in `Creator.tier`.

| Code | Name | Follower Range |
|------|------|---------------|
| `NANO` | Nano-influencer | < 10,000 |
| `MICRO` | Micro-influencer | 10,000 – 99,999 |
| `MID` | Mid-tier | 100,000 – 499,999 |
| `MACRO` | Macro-influencer | 500,000 – 2,999,999 |
| `MEGA` | Mega / celebrity | ≥ 3,000,000 |

> Tier is declared per-platform using the platform's primary follower count (AUD.001).
> A creator may hold different tiers on different platforms.

---

## ValueSet/status

Lifecycle status for all resources. Used in `SnomiResource.status`.

| Code | Applies to | Meaning |
|------|-----------|---------|
| `draft` | All | Created but not validated or published |
| `active` | All | In use / live |
| `completed` | Campaign, Financial | Finished with no further actions |
| `archived` | ContentUnit, Actor | No longer active but record preserved |
| `cancelled` | Campaign, Financial | Abandoned before completion |
| `retired` | Profile, Metric | Superseded — do not use for new records |
| `disputed` | Financial | Under dispute between parties |

---

## ValueSet/trust

SNOMI trust scores. Used in `MetricCitation.trust`.

| Code | Level | Meaning |
|------|-------|---------|
| `T5` | Gold | Native platform data, non-manipulable |
| `T4` | Silver | Calculated from T5 inputs, standard formula, no assumptions |
| `T3` | Bronze | Calculated with methodology assumptions (e.g. EMV) |
| `T2` | Copper | Estimated via third-party tool |
| `T1` | Iron | Self-reported, unverifiable, or propagation floor |

---

## ValueSet/campaign-objectives

Used in `Campaign.objective`.

| Code | Name | Primary Metrics |
|------|------|----------------|
| `awareness` | Brand Awareness | REA.001, REA.002, REA.003, CPM |
| `engagement` | Engagement / Community | ENG.002, ENG.004, ENG.005, CPI |
| `conversion` | Direct Conversion | CON.001–CON.006, ROAS |
| `consideration` | Consideration / Intent | REA.003, ENG.002, CON.002 |
| `branding` | Brand Equity | QUA.003, QUA.004, BFS |
| `ugc` | User-Generated Content | QUA.005, CON.001 |
| `launch` | Product Launch | REA.002, CON.002, VAL.001 |

---

## ValueSet/content-categories

Creator niche / content categories. Used in `Creator.content_categories`.

| Code | Name |
|------|------|
| `beauty` | Beauty & Cosmetics |
| `fashion` | Fashion & Style |
| `fitness` | Fitness & Sport |
| `food` | Food & Beverage |
| `travel` | Travel & Tourism |
| `tech` | Technology & Gaming |
| `family` | Family & Parenting |
| `finance` | Personal Finance |
| `education` | Education & How-To |
| `entertainment` | Entertainment & Comedy |
| `sustainability` | Sustainability & Eco |
| `health` | Health & Wellness |
| `automotive` | Automotive |
| `luxury` | Luxury & High-End |
| `pets` | Pets & Animals |

---

## ValueSet/financial-types

Used in `Financial.type`.

| Code | Name |
|------|------|
| `Budget` | Planned spend allocation |
| `Contract` | Legal agreement between parties |
| `Invoice` | Payment request |
| `Payment` | Actual funds transfer |
| `Bonus` | Performance-based additional payment |

---

## ValueSet/fee-types

Compensation model. Used in `Allocation.fee_type`.

| Code | Name | Description |
|------|------|-------------|
| `flat` | Flat fee | Fixed amount per deliverable |
| `cpe` | Cost per engagement | Budget ÷ total engagements |
| `cpm` | Cost per mille | Budget ÷ impressions × 1000 |
| `cpa` | Cost per acquisition | Budget ÷ conversions |
| `rev_share` | Revenue share | % of attributed sales |
| `gifting` | Product gifting only | No monetary compensation |
| `hybrid` | Flat + performance | Base fee + bonus on KPI |

---

## ValueSet/usage-right-types

Content usage rights. Used in `UsageRight.type`.

| Code | Name | Description |
|------|------|-------------|
| `paid_social` | Paid social amplification | Boosting creator's post via brand ad account |
| `owned` | Owned channels | Brand website, newsletter, owned social |
| `earned` | Earned media | PR, organic brand sharing |
| `ooh` | Out-of-home | Billboards, displays |
| `tv` | Television / broadcast | TV spot using creator content |
| `print` | Print media | Magazine, press |
| `packaging` | Product packaging | Content used on physical product |

---

## ValueSet/payment-structures

Used in `PaymentTerms.structure`.

| Code | Description |
|------|-------------|
| `full_upfront` | 100% paid before content delivery |
| `split_50_50` | 50% upfront, 50% on delivery |
| `split_30_70` | 30% upfront, 70% on approval |
| `on_delivery` | 100% on content delivery |
| `on_approval` | 100% on brand approval |
| `net_30` | Invoice due 30 days after delivery |
| `net_60` | Invoice due 60 days after delivery |
| `milestone` | Custom milestone-based schedule |

---

## ValueSet/agency-types

Used in `Agency.agency_type`.

| Code | Name |
|------|------|
| `talent` | Creator/talent representation |
| `media` | Media buying and planning |
| `full_service` | Both talent + media |
| `pr` | Public relations |
| `performance` | Performance/affiliate marketing |
