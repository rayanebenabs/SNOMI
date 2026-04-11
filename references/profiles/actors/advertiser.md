# Profile: advertiser — Brand / Advertiser
**Base resource:** [Actor](../../resources/actor.md)

An Advertiser is the brand or company commissioning and funding the influencer
campaign. It is the party that defines the brief, approves content, and holds
the campaign budget.

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `profile` | `"advertiser"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | ValueSet | Description |
|-------|------|-------------|----------|-------------|
| `sector` | code | 0..1 | [content-categories](../../foundation/valuesets.md#valuesetcontent-categories) | Primary business sector |
| `brand_safety_keywords` | string[] | 0..* | — | Topics/words incompatible with brand values |
| `preferred_creator_tiers` | code[] | 0..* | [actor-tiers](../../foundation/valuesets.md#valuesetactor-tiers) | Typical creator tier targets |
| `preferred_platforms` | code[] | 0..* | [platforms](../../foundation/valuesets.md#valuesetplatforms) | Default campaign platforms |
| `agency` | Reference(Actor) | 0..* | — | Agencies working on behalf of this advertiser |
| `annual_influencer_budget` | Currency | 0..1 | — | Annual influencer marketing budget (T1 — self-reported) |
