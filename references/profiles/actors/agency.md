# Profile: agency — Agency
**Base resource:** [Actor](../../resources/actor.md)

An Agency acts as intermediary between Advertisers and Creators, or provides
media buying / strategy services. Agencies may represent creators (talent agency)
or advertisers (media/strategy agency), or both (full-service).

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `profile` | `"agency"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | ValueSet | Description |
|-------|------|-------------|----------|-------------|
| `agency_type` | code | 1..1 | [agency-types](../../foundation/valuesets.md#valuesetagency-types) | talent \| media \| full_service \| pr \| performance |
| `represented_creators` | Reference(Actor)[] | 0..* | — | Creators on the agency's roster |
| `advertiser_clients` | Reference(Actor)[] | 0..* | — | Brands the agency serves |
| `standard_fee_pct` | decimal | 0..1 | — | Standard commission rate (T1 — declared) |
| `platforms_specialization` | code[] | 0..* | [platforms](../../foundation/valuesets.md#valuesetplatforms) | Platform areas of expertise |
