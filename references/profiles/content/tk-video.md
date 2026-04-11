# Profile: tk-video — TikTok Video
**Base resource:** [ContentUnit](../../resources/content-unit.md)

A TikTok Video is a short-to-mid-form vertical video published to TikTok's main
feed and For You Page (FYP). Duration ranges from 15 seconds to 10 minutes.
Sound is algorithmically significant — using trending sounds increases FYP reach.

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `platform` | `"TK"` |
| `format` | `"VIDEO"` |
| `content_type` | `"video"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `duration_seconds` | integer | 1..1 | 15–600 seconds |
| `aspect_ratio` | string | 1..1 | `"9:16"` for standard; `"1:1"` or `"16:9"` also supported |
| `sound_name` | string | 0..1 | Name of sound/track used |
| `sound_original` | boolean | 0..1 | Original audio created by the creator |
| `hashtags` | string[] | 0..* | Hashtags used in caption |
| `duet_enabled` | boolean | 0..1 | Duet feature enabled |
| `stitch_enabled` | boolean | 0..1 | Stitch feature enabled |
| `is_spark_ad` | boolean | 0..1 | Promoted via TikTok Spark Ads |
| `spark_ad_budget` | Currency | 0..1 | Media spend if Spark Ad |
| `view_threshold_seconds` | integer | 1..1 | Fixed: `2` (TikTok counts view at 2 seconds) |
| `is_fyp_eligible` | boolean | 0..1 | Whether the post was sent to For You Page |

---

## Applicable Metrics

| SNOMI Code | Name | Trust | Notes |
|-----------|------|-------|-------|
| `REA.001.TK` | Organic Reach | T5 | Unique accounts |
| `REA.002.TK` | Total Impressions | T5 | Total video displays |
| `REA.005.TK` | Video Views | T5 | ≥ 2 seconds threshold |
| `REA.006.TK` | Qualified Views | T4 | Derived: [ENG.006.TK] × [REA.005.TK] / 100 |
| `ENG.002.TK` | Engagement Rate (Reach) ⭐ | T4 | (L+C+Sh) / [REA.001] × 100 |
| `ENG.006.TK` | Video Completion Rate | T5 | Full plays / [REA.005] × 100 |
| `ENG.005.TK` | Share Rate | T4 | Shares are uniquely high signal on TikTok |
| `CON.001.TK` | Link Clicks | T5 | Link in bio / TikTok Shop |
| `VAL.001[base: REA.005].TK` | EMV (Views base) | T3 max | TikTok-standard: views as base |
| `REG.001.[CC]` | Legal Disclosure | T5 | Required if sponsored |
| `REG.003.TK` | TikTok Branded Content Toggle | T5 | Mandatory for paid content |

---

## TikTok-Specific Notes

- **Shares** (`ENG.005.TK`) are the primary virality vector on TikTok — weight them above Likes and Comments in any TikTok engagement analysis.
- **For You Page reach** is not directly measurable. Traffic source breakdown (FYP vs. Following vs. Search) is available via TikTok Creator Tools — record it in `metrics[]` with a custom note.
- **REA.001 on TikTok** may include non-followers who discovered the video via FYP. This makes ENG.002.TK potentially higher than ENG.001.TK — do not substitute.
