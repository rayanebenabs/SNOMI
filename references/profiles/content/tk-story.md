# Profile: tk-story — TikTok Story
**Base resource:** [ContentUnit](../../resources/content-unit.md)

TikTok Stories are ephemeral 24-hour content (photo or short video) displayed
in a Stories bar above the Following feed. Less algorithmically distributed than
main-feed videos. Available on accounts with Stories access.

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `platform` | `"TK"` |
| `format` | `"STORY"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `content_type` | code | 1..1 | `image` or `video` |
| `duration_seconds` | integer | 0..1 | Video duration if video story (≤ 60s) |
| `is_ephemeral` | boolean | 1..1 | Fixed: `true` (24h lifespan) |
| `has_link` | boolean | 0..1 | Link attached |

---

## Applicable Metrics

| SNOMI Code | Name | Trust | Notes |
|-----------|------|-------|-------|
| `REA.001.TK` | Story Viewers | T5 | Unique accounts |
| `REA.002.TK` | Story Impressions | T5 | |
| `ENG.002.TK` | Engagement Rate | T4 | |

> ⚠ TikTok Story analytics are more limited than Instagram Stories. Platform
> native data availability is lower — document missing fields explicitly.
