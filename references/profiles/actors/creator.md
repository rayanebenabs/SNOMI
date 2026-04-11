# Profile: creator — Content Creator / Influencer
**Base resource:** [Actor](../../resources/actor.md)

A Creator is a natural person (or media persona) who publishes content on one or
more social platforms and whose audience reach is commercially leveraged in
influencer marketing campaigns.

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `resourceType` | `"Actor"` |
| `profile` | `"creator"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | ValueSet | Description |
|-------|------|-------------|----------|-------------|
| `tier` | code | 0..1 | [actor-tiers](../../foundation/valuesets.md#valuesetactor-tiers) | NANO / MICRO / MID / MACRO / MEGA — declare per platform |
| `tier_platform` | code | 0..1 | [platforms](../../foundation/valuesets.md#valuesetplatforms) | Platform the tier is based on |
| `content_categories` | code[] | 0..* | [content-categories](../../foundation/valuesets.md#valuesetcontent-categories) | Primary content niches |
| `agency` | Reference(Actor) | 0..1 | — | Representing agency if any |
| `exclusivities` | Exclusivity[] | 0..* | — | Active exclusivity commitments |
| `media_kit_url` | url | 0..1 | — | Creator's media kit |
| `rate_card_url` | url | 0..1 | — | Creator's rate card (if public) |
| `avg_story_views` | MetricCitation | 0..1 | — | Average Story viewers |
| `performance_metrics` | MetricCitation[] | 0..* | — | CPI, AUD.001, ENG.002, etc. at account level |

---

## Tier Declaration Rule

Tier is platform-specific. A creator may be MACRO on Instagram and MICRO on TikTok.
Declare tier with platform reference:

```
"tier": "MACRO",
"tier_platform": "IG"
```

When reporting cross-platform, use the highest tier or declare per-platform.

---

## Exclusivity (BackboneElement)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `category` | code | 1..1 | Locked content category |
| `competing_brand` | string | 0..1 | Specific brand if named |
| `start_date` | date | 1..1 | Exclusivity period start |
| `end_date` | date | 0..1 | Absent = indefinite |

---

## Example

```json
{
  "id": "creator-marie-dupont",
  "resourceType": "Actor",
  "profile": "creator",
  "status": "active",
  "snomi_version": "2.0",
  "meta": { "created_at": "2026-01-15T09:00Z" },
  "name": "Marie Dupont",
  "country": "FR",
  "languages": ["fr"],
  "handles": [
    {
      "platform": "IG",
      "username": "mariedupont",
      "verified": false,
      "followers": {
        "code": "AUD.001.IG",
        "value": "87,400",
        "produced": "2026-04-01",
        "source": "Instagram Insights",
        "trust": "T5"
      }
    }
  ],
  "profile_data": {
    "tier": "MICRO",
    "tier_platform": "IG",
    "content_categories": ["beauty", "fashion"],
    "exclusivities": [
      {
        "category": "beauty",
        "competing_brand": "Brand Z",
        "start_date": "2026-01-01",
        "end_date": "2026-06-30"
      }
    ],
    "performance_metrics": [
      {
        "code": "ENG.002.IG",
        "value": "5.2%",
        "produced": "2026-04-01",
        "source": "Instagram Insights",
        "trust": "T4"
      },
      {
        "code": "AUD.003.IG",
        "value": "89%",
        "produced": "2026-04-01",
        "source": "HypeAuditor",
        "trust": "T2"
      }
    ]
  }
}
```
