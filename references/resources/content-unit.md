# SNOMI Resource: ContentUnit
**Version 2.0 · Base Resource**

A `ContentUnit` represents a single piece of content published (or planned) on a social
platform. It is the central object of SNOMI measurement — every metric lives on a
ContentUnit or is aggregated from multiple ContentUnits via a Campaign.

Profiles specialise ContentUnit for specific platform/format combinations:
`ig-reel`, `tk-video`, `yt-short`, etc. See `references/profiles/content/`.

---

## Base Fields

Inherits all fields from [SnomiResource](../foundation/resource-model.md#base-resource-snomiresource).

| Field | Type | Cardinality | ValueSet | Description |
|-------|------|-------------|----------|-------------|
| `platform` | code | 1..1 | [platforms](../foundation/valuesets.md#valuesetplatforms) | Platform where content is published |
| `format` | code | 1..1 | [content-formats](../foundation/valuesets.md#valuesetcontent-formats) | Content format type |
| `content_type` | code | 1..1 | [content-types](../foundation/valuesets.md#valuesetcontent-types) | Media type |
| `url` | url | 0..1 | — | Direct URL to the published content |
| `published_at` | dateTime | 0..1 | — | When content went live |
| `time_window` | Period | 0..1 | — | Analytics window (start–end). All `MetricCitation` in `metrics[]` default to this window if not individually specified |
| `creator` | Reference(Actor) | 1..1 | — | The creator who published this content |
| `campaign` | Reference(Campaign) | 0..1 | — | Campaign this content belongs to |
| `is_sponsored` | boolean | 1..1 | — | True if content is a paid partnership |
| `native_label_used` | boolean | 0..1 | — | Platform's native branded content label activated (QUA.006) |
| `disclosure_tags` | string[] | 0..* | — | Hashtags used for legal disclosure (e.g. `#ad`, `#partenariat`) |
| `language` | code | 0..1 | — | ISO 639-1 language code |
| `country_target` | code[] | 0..* | — | ISO 3166-1 alpha-2 target markets |
| `boost` | Boost | 0..1 | — | Paid amplification details if content was boosted |
| `metrics` | MetricCitation[] | 0..* | — | All measured SNOMI metrics for this content unit |
| `profile_data` | BackboneElement | 0..1 | — | Profile-specific fields (defined in each profile document) |

---

## Boost (BackboneElement)

Used when content was additionally amplified via paid media.

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `platform_ad_account` | string | 0..1 | Ad account ID used for boosting |
| `budget` | Currency | 0..1 | Media spend on amplification |
| `start_date` | date | 0..1 | Boost start date |
| `end_date` | date | 0..1 | Boost end date |
| `objective` | code | 0..1 | Platform campaign objective |

---

## Applicable Metrics

Any SNOMI metric may be attached to a ContentUnit via `metrics[]`. Profiles
declare a canonical list of **applicable metrics** — those that are meaningful
for that format. Metrics outside the applicable list may still be included
but must carry a note explaining the context.

---

## Constraints

- `profile` must be a content profile code (not an actor profile code)
- `platform` must match the profile's declared platform
- `format` must match the profile's declared format
- If `is_sponsored = true`, at least one of `native_label_used` or `disclosure_tags` should be present (warning if both absent)
- All `MetricCitation` in `metrics[]` must carry `produced` (extraction date)

---

## Example

```json
{
  "id": "ig-reel-campaign-a-001",
  "resourceType": "ContentUnit",
  "profile": "ig-reel",
  "status": "active",
  "snomi_version": "2.0",
  "meta": {
    "created_at": "2026-04-05T10:00Z",
    "produced_by": "Instagram Insights"
  },
  "platform": "IG",
  "format": "REEL",
  "content_type": "video",
  "url": "https://instagram.com/reel/xyz",
  "published_at": "2026-03-10T18:00Z",
  "time_window": { "start": "2026-03-10", "end": "2026-04-09" },
  "creator": { "resourceType": "Actor", "id": "creator-marie-dupont" },
  "campaign": { "resourceType": "Campaign", "id": "campaign-spring-launch" },
  "is_sponsored": true,
  "native_label_used": true,
  "disclosure_tags": ["#partenariat"],
  "language": "fr",
  "country_target": ["FR", "BE", "CH"],
  "metrics": [
    {
      "code": "REA.001.IG",
      "value": "124,500",
      "produced": "2026-04-05",
      "source": "Instagram Insights",
      "trust": "T5"
    },
    {
      "code": "ENG.002.IG",
      "value": "5.2%",
      "produced": "2026-04-05",
      "source": "Instagram Insights",
      "trust": "T4"
    },
    {
      "code": "VAL.001[base: REA.001].IG.FR",
      "value": "€18,400",
      "produced": "2026-04-05",
      "source": "Launchmetrics method",
      "trust": "T3",
      "note": "ref CPM: €29.50 for Micro-tier, Beauty, FR"
    }
  ]
}
```
