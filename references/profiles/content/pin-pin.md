# Profile: pin-pin — Pinterest Pin
**Base resource:** [ContentUnit](../../resources/content-unit.md)

A Pinterest Pin is a visual bookmark (image, video, or carousel) published to
Pinterest boards. Pins have a long content lifespan — a Pin can receive impressions
months or years after publication. Analytics via Pinterest Business Analytics.

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `platform` | `"PI"` |
| `format` | `"PIN"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `content_type` | code | 1..1 | `image`, `video`, or `carousel` |
| `board_name` | string | 0..1 | Pinterest board the Pin was posted to |
| `destination_url` | url | 0..1 | URL the Pin links to |
| `is_idea_pin` | boolean | 0..1 | True if Idea Pin format (multi-page, no external link) |

---

## Applicable Metrics

| SNOMI Code | Name | Trust | Notes |
|-----------|------|-------|-------|
| `REA.002.PI` | Impressions | T5 | |
| `CON.001.PI` | Link Clicks (Outbound) | T5 | High-value signal on Pinterest |
| `ENG.004.PI` | Save Rate | T4 | "Saves" are the primary engagement signal on Pinterest |

> Pinterest's primary engagement action is **Saves** (equivalent to ENG.004).
> Saves indicate strong content-audience fit and drive long-tail discovery.
> Prioritise ENG.004.PI and CON.001.PI as primary KPIs for Pinterest campaigns.
