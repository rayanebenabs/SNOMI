# Profile: ig-reel — Instagram Reel
**Base resource:** [ContentUnit](../../resources/content-unit.md)

An Instagram Reel is a short-form vertical video (15–90 seconds) published on
Instagram. Reels appear in the Reels tab, the main feed, and the Explore page.
They support audio remixing, product tags, and Meta Ads boosting.

---

## Fixed Fields (constrained from ContentUnit)

| Field | Fixed Value |
|-------|------------|
| `platform` | `"IG"` |
| `format` | `"REEL"` |
| `content_type` | `"video"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `duration_seconds` | integer | 1..1 | Content duration. Must be 15–90 seconds |
| `aspect_ratio` | string | 1..1 | Must be `"9:16"` for native Reels |
| `audio_original` | boolean | 0..1 | True if original audio; false if trending sound |
| `audio_name` | string | 0..1 | Name of audio track used |
| `product_tags_count` | integer | 0..1 | Number of product tags added |
| `has_collab` | boolean | 0..1 | True if posted as a collaboration with another account |
| `collab_account` | string | 0..1 | Username of collaboration partner |
| `view_threshold_seconds` | integer | 1..1 | Fixed: `3` (Instagram counts a view at 3 seconds) |

---

## Applicable Metrics

| SNOMI Code | Name | Trust | Notes |
|-----------|------|-------|-------|
| `REA.001.IG` | Organic Reach | T5 | Unique accounts |
| `REA.002.IG` | Total Impressions | T5 | Includes repeat exposures |
| `REA.003.IG` | Reach Rate | T4 | [REA.001] / [AUD.001] × 100 |
| `REA.004.IG` | Frequency | T4 | [REA.002] / [REA.001] |
| `REA.005.IG` | Video Views | T5 | ≥ 3 seconds threshold |
| `REA.006.IG` | Qualified Views | T5/T4 | Native if available; else [ENG.006] × [REA.005] / 100 |
| `ENG.001.IG` | Engagement Rate (Followers) | T4 | (L+C+S+Sh) / [AUD.001] × 100 |
| `ENG.002.IG` | Engagement Rate (Reach) ⭐ | T4 | (L+C+S+Sh) / [REA.001] × 100 |
| `ENG.006.IG` | Video Completion Rate | T5 | Complete views / [REA.005] × 100 |
| `CON.001.IG` | Link Clicks | T5 | Swipe-up or sticker link |
| `CON.002.IG` | CTR | T4 | [CON.001] / [REA.002] × 100 |
| `VAL.001[base: REA.001].IG` | EMV (Reach base) | T3 max | Declare method |
| `VAL.001[base: REA.002].IG` | EMV (Impressions base) | T3 max | Inflated by frequency |
| `VAL.002.IG` | CPE | T4 | Budget / engagements |
| `VAL.003.IG` | CPM | T4 | Budget / [REA.002] × 1000 |
| `QUA.006.IG` | Native Partnership Label | T5 | Boolean |
| `REG.001.[CC]` | Legal Disclosure | T5 | Required if sponsored |
| `REG.003.IG` | Instagram Native Label | T5 | "Paid Partnership" label |

---

## Constraints

- `duration_seconds` must be between 15 and 90
- If `is_sponsored = true` and `native_label_used = false`, a `REG.001.[CC]` citation must be present in `metrics[]`
- `VAL.001` citations must include `[base: REA.001]`, `[base: REA.002]`, `[base: REA.005]`, or `[base: REA.006]` declaration

---

## View Threshold Note

Instagram counts a **view** at ≥ 3 seconds of watch time. `REA.005.IG` therefore
represents "plays ≥ 3s" — this is lower than YouTube (30s) but higher than TikTok (2s).
Always declare this when comparing cross-platform view counts.
