# Profile: tw-post — X/Twitter Post
**Base resource:** [ContentUnit](../../resources/content-unit.md)

An X (Twitter) Post (formerly Tweet) is a text post (up to 280 characters for free
accounts) that may include images, videos, or polls. X Analytics provides Impressions
(views) and Engagements natively.

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `platform` | `"TW"` |
| `format` | `"TWEET"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `content_type` | code | 1..1 | `text`, `image`, `video`, or `mixed` |
| `character_count` | integer | 0..1 | Post character count |
| `is_thread_start` | boolean | 0..1 | True if this is the first post in a thread |
| `thread_length` | integer | 0..1 | Total posts in thread if thread_start |
| `has_poll` | boolean | 0..1 | Poll attached |

---

## Applicable Metrics

| SNOMI Code | Name | Trust | Notes |
|-----------|------|-------|-------|
| `REA.002.TW` | Impressions (Views) | T5 | X calls this "Views" — maps to REA.002 |
| `ENG.001.TW` | Engagement Rate (Followers) | T4 | |
| `REA.001.TW` | Reach | T4 | Not directly native — estimate with caution |

> Warning: X Analytics does not provide deduplicated Reach natively. `REA.001.TW` must be
> marked T2 or T3 if derived via third-party tool. `REA.002.TW` (Impressions/Views) is T5.
