# SNOMI Resource: Actor
**Version 2.0 · Base Resource**

An `Actor` is any party that participates in the influencer marketing ecosystem.
Profiles specialise Actor: `creator`, `advertiser`, `agency`, `platform`, `tool`.

---

## Base Fields

Inherits all fields from [SnomiResource](../foundation/resource-model.md#base-resource-snomiresource).

| Field | Type | Cardinality | ValueSet | Description |
|-------|------|-------------|----------|-------------|
| `name` | string | 1..1 | — | Display name |
| `legal_name` | string | 0..1 | — | Full legal entity name |
| `country` | code | 0..1 | — | ISO 3166-1 alpha-2 primary country |
| `languages` | code[] | 0..* | — | ISO 639-1 spoken/published languages |
| `contact` | Contact | 0..1 | — | Contact information |
| `handles` | Handle[] | 0..* | — | Per-platform identities |
| `profile_data` | BackboneElement | 0..1 | — | Profile-specific fields |

---

## Contact (BackboneElement)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `email` | string | 0..1 | Business email |
| `website` | url | 0..1 | Website or media kit URL |
| `phone` | string | 0..1 | Phone number |

---

## Constraints

- `profile` must be an actor profile code (`creator`, `advertiser`, `agency`, `platform`, `tool`, `regulatory-body`)
- `handles` must not contain two entries with the same `platform`

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
  "languages": ["fr", "en"],
  "handles": [
    {
      "platform": "IG",
      "username": "mariedupont",
      "url": "https://instagram.com/mariedupont",
      "verified": false,
      "followers": {
        "code": "AUD.001.IG",
        "value": "87,400",
        "produced": "2026-04-01",
        "source": "Instagram Insights",
        "trust": "T5"
      }
    },
    {
      "platform": "TK",
      "username": "marie.dupont",
      "url": "https://tiktok.com/@marie.dupont",
      "verified": false,
      "followers": {
        "code": "AUD.001.TK",
        "value": "142,000",
        "produced": "2026-04-01",
        "source": "TikTok Analytics",
        "trust": "T5"
      }
    }
  ]
}
```
