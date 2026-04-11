# SNOMI Resource Model
**Version 2.0 · Foundation Layer**

All SNOMI resources share a common base structure. This document defines the
type system, cardinality notation, and base fields every resource must include.

---

## Cardinality Notation

| Notation | Meaning |
|----------|---------|
| `1..1`   | Required — exactly one value |
| `0..1`   | Optional — zero or one value |
| `1..*`   | Required — one or more values |
| `0..*`   | Optional — zero or more values |

---

## Primitive Types

| Type | Description | Example |
|------|-------------|---------|
| `string` | UTF-8 text | `"@creator_handle"` |
| `code` | Value from a defined ValueSet | `"IG"`, `"T5"`, `"REEL"` |
| `integer` | Whole number | `90`, `1200000` |
| `decimal` | Decimal number | `4.8`, `0.032` |
| `boolean` | true or false | `true` |
| `date` | ISO 8601 date | `"2026-04-11"` |
| `dateTime` | ISO 8601 datetime | `"2026-04-11T14:30Z"` |
| `duration` | Seconds (integer) | `30` |
| `currency` | Decimal + ISO 4217 code | `{ amount: 5000.00, code: "EUR" }` |
| `percentage` | Decimal 0–100 | `4.8` |
| `ratio` | Decimal multiplier | `1.5` |
| `url` | Absolute URL | `"https://instagram.com/p/xyz"` |

---

## Complex Types

### Period
Time range with mandatory start.

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `start` | date | 1..1 | Start of period (inclusive) |
| `end` | date | 0..1 | End of period (inclusive). Absent = open-ended |

### Currency
Monetary value with denomination.

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `amount` | decimal | 1..1 | Numeric value |
| `currency` | code | 1..1 | ISO 4217 currency code (EUR, USD, GBP, …) |

### MetricCitation
A single measured or calculated SNOMI metric value. Used in `metrics[]` arrays.

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `code` | string | 1..1 | Full SNOMI code e.g. `ENG.002.IG.FR` |
| `value` | string | 1..1 | Value with unit e.g. `"4.8%"`, `"€42,000"` |
| `time_window` | string | 0..1 | Period covered. Inherits from parent resource if absent |
| `produced` | date | 1..1 | Extraction date (YYYY-MM-DD) |
| `source` | string | 1..1 | Data source (e.g. `"Instagram Insights"`, `"HypeAuditor"`) |
| `trust` | code | 1..1 | T1–T5 (see Trust ValueSet) |
| `note` | string | 0..1 | Caveats, flags, methodology notes |

### Handle
A creator or actor's identity on a single platform.

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `platform` | code | 1..1 | Platform code from ValueSet/platforms |
| `username` | string | 1..1 | Handle without @ |
| `url` | url | 0..1 | Profile URL |
| `verified` | boolean | 0..1 | Platform-verified status |
| `followers` | MetricCitation | 0..1 | AUD.001.[PLATFORM] at last pull |

### Reference
A typed pointer to another SNOMI resource.

```
Reference(ResourceType)
```

Serialised as: `{ resourceType: "ContentUnit", id: "ig-reel-001" }`
The `ResourceType` annotation is documentation-only — it declares which type is expected.

---

## Base Resource: SnomiResource

Every SNOMI resource (ContentUnit, Actor, Campaign, Financial) inherits these fields.

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `id` | string | 1..1 | Unique identifier (kebab-case, human-readable) |
| `resourceType` | code | 1..1 | Discriminator: `ContentUnit` \| `Actor` \| `Campaign` \| `Financial` |
| `profile` | code | 1..1 | Profile code from ValueSet/profiles (e.g. `ig-reel`, `creator`) |
| `status` | code | 1..1 | Lifecycle status — see ValueSet/status |
| `snomi_version` | string | 1..1 | SNOMI version this record conforms to (e.g. `"2.0"`) |
| `meta` | Meta | 1..1 | Provenance and audit fields |

### Meta (BackboneElement)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `created_at` | dateTime | 1..1 | When this record was first created |
| `updated_at` | dateTime | 0..1 | When this record was last modified |
| `produced_by` | string | 0..1 | Tool, platform, or person that produced the data |
| `source_url` | url | 0..1 | Original data source URL |

---

## Profile Mechanism

A **Profile** constrains a base resource by:
1. **Fixing** certain fields to specific values (e.g. `platform = "IG"`, `format = "REEL"`)
2. **Narrowing cardinality** (e.g. a field optional at base level becomes required in the profile)
3. **Adding profile-specific fields** via a `profile_data` BackboneElement
4. **Declaring applicable metrics** — which SNOMI metric codes are valid for this resource type

Profiles do not create new resource types. A `ig-reel` is still a `ContentUnit` and can be
processed by any system that understands `ContentUnit`.

---

## Versioning

SNOMI resources use semantic versioning at the spec level (`snomi_version`).
- Minor version bumps (2.1, 2.2) add optional fields or new profiles — backward compatible.
- Major version bumps (3.0) may change required fields — migration guide published.
- Retired profiles remain documented with `status: retired` and a migration note.
