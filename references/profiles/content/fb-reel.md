# Profile: fb-reel — Facebook Reel
**Base resource:** [ContentUnit](../../resources/content-unit.md)

Facebook Reels are short-form vertical videos (≤ 90s) shared on Facebook.
They appear in the Reels section of the Facebook app and may be cross-posted
from Instagram. Analytics come from Meta Business Suite.

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `platform` | `"FB"` |
| `format` | `"REEL"` |
| `content_type` | `"video"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `duration_seconds` | integer | 1..1 | ≤ 90 seconds |
| `cross_posted_from_ig` | boolean | 0..1 | True if originally an Instagram Reel |
| `view_threshold_seconds` | integer | 1..1 | Fixed: `3` |

---

## Applicable Metrics

Same structure as `ig-reel` with platform suffix `.FB`.
Key difference: Facebook reach pools are often larger (older demographics) but
engagement rates are structurally lower than Instagram for the same content type.

| SNOMI Code | Name | Trust |
|-----------|------|-------|
| `REA.001.FB` | Organic Reach | T5 |
| `REA.002.FB` | Total Impressions | T5 |
| `REA.005.FB` | Video Views | T5 |
| `ENG.002.FB` | Engagement Rate (Reach) | T4 |
| `VAL.001[base: REA.001].FB` | EMV (Reach base) | T3 max |
