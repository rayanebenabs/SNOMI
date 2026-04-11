# Profile: yt-video — YouTube Video
**Base resource:** [ContentUnit](../../resources/content-unit.md)

A YouTube Video is a standard long/mid-form video (> 60 seconds) published to a
YouTube channel. It is distributed via search, recommendations, and subscriptions.
YouTube's 30-second view threshold makes `REA.005.YT` the most premium view metric.

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `platform` | `"YT"` |
| `format` | `"VIDEO"` |
| `content_type` | `"video"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `duration_seconds` | integer | 0..1 | Total video duration |
| `aspect_ratio` | string | 0..1 | Typically `"16:9"` |
| `chapters_count` | integer | 0..1 | Number of chapter markers |
| `is_premiere` | boolean | 0..1 | Published as a YouTube Premiere |
| `premiere_viewers_peak` | integer | 0..1 | Peak concurrent Premiere viewers (T5) |
| `cards_count` | integer | 0..1 | Number of YouTube cards (CTAs) |
| `end_screen_enabled` | boolean | 0..1 | End screen activated |
| `view_threshold_seconds` | integer | 1..1 | Fixed: `30` — industry-standard YouTube view threshold |
| `is_sponsored_integration` | boolean | 0..1 | Contains a paid brand integration segment |
| `integration_start_seconds` | integer | 0..1 | Second mark where brand integration begins |

---

## Applicable Metrics

| SNOMI Code | Name | Trust | Notes |
|-----------|------|-------|-------|
| `REA.001.YT` | Unique Viewers | T5 | Deduplicated audience |
| `REA.002.YT` | Total Impressions | T5 | From impressions report |
| `REA.005.YT` | Video Views | T5 | ≥ 30 seconds |
| `REA.006.YT` | Qualified Views | T5 | Native on YouTube: 50% completion threshold |
| `ENG.002.YT` | Engagement Rate (Reach) | T4 | |
| `ENG.006.YT` | Video Completion Rate | T5 | Average % viewed |
| `CON.001.YT` | Link Clicks | T5 | Card/description link clicks |
| `CON.002.YT` | CTR | T4 | Card CTR |
| `VAL.001[base: REA.005].YT` | EMV (Views base) | T3 max | 30s view standard for YouTube |
| `REG.003.YT` | Native Disclosure Checkbox | T5 | "Includes paid promotion" checkbox |
| `REG.001.[CC]` | Legal Disclosure | T5 | Required if sponsored |

---

## Watch Time Note

`watch_time_hours` is available natively from YouTube Studio but has no current
SNOMI code. Record it as a custom metric with note: `"YouTube Studio native — no SNOMI code, record as supplementary"`
until a `REA.007` (Watch Time) code is formally added.
