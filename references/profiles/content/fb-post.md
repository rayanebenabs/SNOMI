# Profile: fb-post — Facebook Post
**Base resource:** [ContentUnit](../../resources/content-unit.md)

A Facebook Post is a text, image, or carousel post published to a Facebook Page or Profile.
Page posts are subject to organic reach decline — paid amplification (Boost) is common.

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `platform` | `"FB"` |
| `format` | `"POST"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `content_type` | code | 1..1 | `image`, `carousel`, `text`, or `video` |
| `is_page_post` | boolean | 1..1 | True if posted from a Page; false if personal Profile |
| `slide_count` | integer | 0..1 | Carousel slides if carousel |

---

## Applicable Metrics

| SNOMI Code | Name | Trust | Notes |
|-----------|------|-------|-------|
| `REA.001.FB` | Organic Reach | T5 | Significantly reduced vs. paid for Pages |
| `REA.002.FB` | Impressions | T5 | |
| `ENG.001.FB` | Engagement Rate (Followers) | T4 | |
| `ENG.002.FB` | Engagement Rate (Reach) | T4 | |

> Warning: Facebook organic reach for Pages is structurally low (1-5% of followers).
> Always distinguish organic vs. paid reach. Use `boost` field if amplified.
