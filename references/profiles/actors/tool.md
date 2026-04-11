# Profile: tool — Analytics / Management Tool
**Base resource:** [Actor](../../resources/actor.md)

A Tool is a software platform (SaaS or proprietary) used to collect, calculate,
or analyse influencer marketing metrics. Data sourced from a Tool carries a maximum
trust of T2 (unless the tool has native API access, in which case T5 is possible
for raw data pass-through).

---

## Fixed Fields

| Field | Fixed Value |
|-------|------------|
| `profile` | `"tool"` |

---

## Profile-Specific Fields (`profile_data`)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `tool_type` | code | 1..1 | `analytics` \| `ugc` \| `crm` \| `monitoring` \| `booking` \| `attribution` |
| `api_integrations` | code[] | 0..* | Platform APIs this tool integrates with |
| `trust_ceiling` | code | 1..1 | Max trust any metric from this tool can carry. `T5` if native API pass-through; `T2` if proprietary estimation model |
| `methodology_url` | url | 0..1 | Link to tool's published methodology |
| `snomi_certified` | boolean | 0..1 | Whether tool has published SNOMI-compliant output |

---

## Known Tools Reference

| Tool | trust_ceiling | Notes |
|------|--------------|-------|
| HypeAuditor | T2 | Proprietary AI estimation model |
| Traackr | T2 | Blended native + estimated data |
| Launchmetrics | T3 | EMV methodology published; native data T5 pass-through possible |
| Modash | T2 | Audience quality estimation |
| Brandwatch | T2 | Social listening — NLP sentiment |
| Sprout Social | T5 | Native API pass-through for own accounts |
| Later | T5 | Native API pass-through for managed accounts |

> This table is informational. Tool trust ceilings should be verified against
> each tool's current methodology documentation before citing.
