# SNOMI Resource: Campaign
**Version 2.0 · Base Resource**

A `Campaign` aggregates one or more ContentUnits produced by one or more Creators
for a single Advertiser, within a defined period and budget. It is the unit of
cross-creator, cross-platform performance reporting.

---

## Fields

Inherits all fields from [SnomiResource](../foundation/resource-model.md#base-resource-snomiresource).

| Field | Type | Cardinality | ValueSet | Description |
|-------|------|-------------|----------|-------------|
| `name` | string | 1..1 | — | Campaign name |
| `advertiser` | Reference(Actor) | 1..1 | — | Brand / advertiser |
| `agency` | Reference(Actor) | 0..1 | — | Agency managing the campaign |
| `creators` | Reference(Actor)[] | 1..* | — | Participating creators |
| `content_units` | Reference(ContentUnit)[] | 0..* | — | All content produced in this campaign |
| `objective` | code | 1..1 | [campaign-objectives](../foundation/valuesets.md#valuesetcampaign-objectives) | Primary campaign goal |
| `period` | Period | 1..1 | — | Campaign start and end dates |
| `platforms` | code[] | 1..* | [platforms](../foundation/valuesets.md#valuesetplatforms) | Platforms in scope |
| `country_targets` | code[] | 0..* | — | ISO 3166-1 target markets |
| `brief_url` | url | 0..1 | — | Link to creative brief document |
| `budget` | Reference(Financial) | 0..1 | — | Associated FIN.Budget resource |
| `contract` | Reference(Financial) | 0..1 | — | Associated FIN.Contract resource |
| `kpis` | KPI[] | 0..* | — | Target and actual KPI values |
| `aggregate_metrics` | MetricCitation[] | 0..* | — | Campaign-level totals (sum across all ContentUnits) |

---

## KPI (BackboneElement)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `metric_code` | string | 1..1 | SNOMI metric code (e.g. `ENG.002.IG`) |
| `target_value` | string | 1..1 | Target value with unit |
| `actual_value` | string | 0..1 | Actual achieved value (filled post-campaign) |
| `trust` | code | 0..1 | Trust score of actual value |
| `achieved` | boolean | 0..1 | Whether target was met |

---

## Aggregate Metric Convention

When reporting campaign totals:
- `REA.001` (Reach): **do not sum** — unique accounts. Report as estimated unique reach with methodology note.
- `REA.002` (Impressions): **sum** across all ContentUnits.
- `ENG.002`: recalculate as total engagements ÷ total reach (not average of rates).
- `VAL.001`: **sum** individual EMVs. Declare base metric consistently across all ContentUnits.

---

## Example

```json
{
  "id": "campaign-spring-launch-2026",
  "resourceType": "Campaign",
  "profile": "campaign",
  "status": "completed",
  "snomi_version": "2.0",
  "meta": { "created_at": "2026-02-01T08:00Z" },
  "name": "Spring Launch — Marque X",
  "advertiser": { "resourceType": "Actor", "id": "advertiser-marque-x" },
  "agency": { "resourceType": "Actor", "id": "agency-influence-co" },
  "creators": [
    { "resourceType": "Actor", "id": "creator-marie-dupont" },
    { "resourceType": "Actor", "id": "creator-alex-martin" }
  ],
  "objective": "awareness",
  "period": { "start": "2026-03-01", "end": "2026-03-31" },
  "platforms": ["IG", "TK"],
  "country_targets": ["FR"],
  "kpis": [
    {
      "metric_code": "REA.002.IG",
      "target_value": "2,000,000",
      "actual_value": "2,340,000",
      "trust": "T5",
      "achieved": true
    },
    {
      "metric_code": "ENG.002.IG",
      "target_value": "3.5%",
      "actual_value": "4.8%",
      "trust": "T4",
      "achieved": true
    }
  ]
}
```
