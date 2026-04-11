# Profile: li-post — LinkedIn Post
**Base resource:** [ContentUnit](../../resources/content-unit.md)

A LinkedIn Post is content published by a personal profile or Company Page.
LinkedIn analytics use "Impressions" and "Unique Impressions" (≈ reach).
Professional context makes CPM benchmarks different from consumer platforms.

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `platform` | `"LI"` |
| `format` | `"POST"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `content_type` | code | 1..1 | `text`, `image`, `carousel`, `video`, or `article` |
| `is_company_page` | boolean | 1..1 | True if posted from a Company Page |
| `slide_count` | integer | 0..1 | Carousel slides |
| `article_url` | url | 0..1 | If content_type = article, link to the article |

---

## Applicable Metrics

| SNOMI Code | Name | Trust | Notes |
|-----------|------|-------|-------|
| `REA.001.LI` | Unique Impressions | T5 | LinkedIn "Unique Impressions" ≈ Reach |
| `REA.002.LI` | Total Impressions | T5 | |
| `ENG.001.LI` | Engagement Rate (Followers) | T4 | |
| `ENG.002.LI` | Engagement Rate (Reach) | T4 | |
| `CON.001.LI` | Link Clicks | T5 | |

> LinkedIn's "Impressions" = total displays. "Unique Impressions" = deduplicated.
> Map: `REA.001.LI` -> Unique Impressions; `REA.002.LI` -> Impressions.
