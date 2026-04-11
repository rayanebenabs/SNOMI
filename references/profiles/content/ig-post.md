# Profile: ig-post — Instagram Post (Image / Carousel)
**Base resource:** [ContentUnit](../../resources/content-unit.md)

An Instagram Post is a static image or carousel (2–10 slides) published to the
main feed and profile grid. Unlike Reels, posts are permanent by default. Carousels
generate individual slide analytics in addition to overall post analytics.

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `platform` | `"IG"` |
| `format` | `"POST"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `content_type` | code | 1..1 | `image` or `carousel` |
| `slide_count` | integer | 0..1 | Number of slides if carousel (2–10) |
| `aspect_ratio` | string | 0..1 | `"1:1"` (square) \| `"4:5"` (portrait) \| `"1.91:1"` (landscape) |
| `has_alt_text` | boolean | 0..1 | Accessibility alt text provided |
| `product_tags_count` | integer | 0..1 | Shopping tags |
| `has_collab` | boolean | 0..1 | Collab post with another account |

---

## Applicable Metrics

| SNOMI Code | Name | Trust | Notes |
|-----------|------|-------|-------|
| `REA.001.IG` | Organic Reach | T5 | Unique accounts |
| `REA.002.IG` | Total Impressions | T5 | |
| `ENG.001.IG` | Engagement Rate (Followers) | T4 | |
| `ENG.002.IG` | Engagement Rate (Reach) ⭐ | T4 | Preferred |
| `ENG.004.IG` | Save Rate | T4 | Saves / [REA.002] — strong signal for Posts |
| `ENG.005.IG` | Share Rate | T4 | |
| `CON.001.IG` | Link Clicks | T5 | Bio link or link in caption |
| `VAL.001[base: REA.001].IG` | EMV | T3 max | |

> **Carousel-specific:** Report each slide's individual reach/impressions using
> `frame_index` suffix notation: `REA.001.IG[slide:1]`, `REA.001.IG[slide:2]`, etc.
> The overall post `REA.001` = unique accounts who saw any slide.
