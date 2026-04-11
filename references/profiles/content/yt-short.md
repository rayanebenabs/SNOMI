# Profile: yt-short — YouTube Short
**Base resource:** [ContentUnit](../../resources/content-unit.md)

A YouTube Short is a vertical video of ≤ 60 seconds distributed via the
Shorts shelf and integrated into standard YouTube search/recommendations.
Shorts have a separate analytics tab in YouTube Studio.

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `platform` | `"YT"` |
| `format` | `"SHORT"` |
| `content_type` | `"video"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `duration_seconds` | integer | 1..1 | Must be ≤ 60 seconds |
| `aspect_ratio` | string | 1..1 | `"9:16"` for Shorts shelf eligibility |
| `appears_in_shorts_shelf` | boolean | 1..1 | Fixed: `true` if ≤ 60s and 9:16 |
| `sound_name` | string | 0..1 | Audio track if remix |
| `view_threshold_seconds` | integer | 1..1 | YouTube Shorts: view counted differently — see note |

---

## Applicable Metrics

| SNOMI Code | Name | Trust | Notes |
|-----------|------|-------|-------|
| `REA.005.YT` | Video Views | T5 | YouTube Shorts uses scroll-based view counting |
| `REA.006.YT` | Qualified Views | T5 | Native on YouTube (50% completion threshold) |
| `ENG.002.YT` | Engagement Rate (Reach) | T4 | |
| `ENG.006.YT` | Video Completion Rate | T5 | Full swipes-through / views |
| `REA.001.YT` | Reach | T5 | Unique viewers |
| `VAL.001[base: REA.005].YT` | EMV (Views base) | T3 max | |

---

## View Threshold Note — Shorts

YouTube Shorts uses a **swipe-based view model**: a view is counted when a user
watches the Short rather than immediately scrolling past. The exact second threshold
is not publicly documented by YouTube; declare as `view_threshold_seconds: "platform-defined"`
and note this in the metric's `note` field.
