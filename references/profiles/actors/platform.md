# Profile: platform — Social Media Platform
**Base resource:** [Actor](../../resources/actor.md)

A Platform is a social media network operator. Platforms are referenced as data
sources in `MetricCitation.source` and define the native data trust ceiling (T5).
Platforms also define content format rules (view thresholds, duration limits, etc.).

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `profile` | `"platform"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `platform_code` | code | 1..1 | SNOMI platform code (IG, TK, YT, FB, TW, LI, PI) |
| `api_available` | boolean | 1..1 | Whether a public/partner API exists for data extraction |
| `api_name` | string | 0..1 | API product name (e.g. "Instagram Graph API") |
| `native_analytics_tool` | string | 0..1 | Name of built-in analytics (e.g. "Instagram Insights") |
| `native_trust_ceiling` | code | 1..1 | Fixed: `T5` — native platform data is always T5 |

---

## Pre-defined Platform Records

| id | platform_code | native_analytics_tool |
|----|------------|----------------------|
| `platform-instagram` | IG | Instagram Insights |
| `platform-tiktok` | TK | TikTok Analytics / Creator Center |
| `platform-youtube` | YT | YouTube Studio |
| `platform-facebook` | FB | Meta Business Suite |
| `platform-twitter` | TW | X Analytics |
| `platform-linkedin` | LI | LinkedIn Analytics |
| `platform-pinterest` | PI | Pinterest Business Analytics |
