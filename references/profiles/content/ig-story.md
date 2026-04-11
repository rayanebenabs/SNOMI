# Profile: ig-story — Instagram Story
**Base resource:** [ContentUnit](../../resources/content-unit.md)

An Instagram Story is ephemeral content (photo or short video) that disappears
after 24 hours unless saved to a Highlight. Stories appear only to followers
and do not appear in the main feed or Explore. Unique viewers = REA.001 for Stories.

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `platform` | `"IG"` |
| `format` | `"STORY"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `duration_seconds` | integer | 0..1 | Video duration if video story (≤ 60s). Absent for photo stories |
| `content_type` | code | 1..1 | `image` or `video` |
| `is_ephemeral` | boolean | 1..1 | Fixed: `true`. Set to `false` if saved to Highlight |
| `highlight_name` | string | 0..1 | Name of Highlight if saved |
| `has_link_sticker` | boolean | 0..1 | Link sticker present (available all accounts) |
| `has_product_sticker` | boolean | 0..1 | Shopping product sticker |
| `has_poll_sticker` | boolean | 0..1 | Poll or emoji slider |
| `has_quiz_sticker` | boolean | 0..1 | Quiz sticker |
| `has_countdown_sticker` | boolean | 0..1 | Countdown timer sticker |
| `frame_index` | integer | 0..1 | Position in a multi-frame story sequence (1-based) |
| `total_frames` | integer | 0..1 | Total frames in sequence |
| `view_threshold_seconds` | integer | 1..1 | Fixed: `1` (any display = 1 view) |

---

## Applicable Metrics

| SNOMI Code | Name | Trust | Notes |
|-----------|------|-------|-------|
| `REA.001.IG` | Story Viewers | T5 | Unique accounts who viewed this Story frame |
| `REA.002.IG` | Story Impressions | T5 | Total views (includes replays) |
| `ENG.002.IG` | Engagement Rate (Reach) | T4 | Interactive actions / unique viewers |
| `CON.001.IG` | Link Clicks | T5 | Taps on link sticker |
| `CON.002.IG` | CTR | T4 | [CON.001] / [REA.001] × 100 |
| `VAL.001[base: REA.001].IG` | EMV | T3 max | Story reach base recommended |

**Story-specific navigation metrics (T5 native):**

| SNOMI Code | Name | Description |
|-----------|------|-------------|
| `ENG.NAV.FORWARD.IG` | Forward Taps | Taps to skip to next story |
| `ENG.NAV.BACK.IG` | Back Taps | Taps to replay previous frame |
| `ENG.NAV.EXIT.IG` | Story Exits | Swipe-away / app close |
| `ENG.NAV.NEXT.IG` | Next Story Swipes | Swipe to next account's story |

> Navigation metrics use the `ENG.NAV` sub-namespace. Completion rate = 1 − (exits / unique viewers).

---

## Constraints

- Reach for Stories (`REA.001.IG`) counts **unique viewers of this frame**, not the story sequence total
- If `frame_index` is present, `total_frames` must also be present
- Highlights (`is_ephemeral = false`) accumulate views beyond 24h — note the `time_window` carefully
