# SNOMI API v1 — Design Spec

**Date:** 2026-04-13
**Status:** Approved
**Scope:** API de lecture SNOMI pour outil interne (web app dashboard)

---

## 1. Objectif

Construire une API REST légère permettant à un dashboard web interne de tester les use cases SNOMI sans infrastructure lourde. Les 4 use cases couverts :

- **Decode** — Décoder un code SNOMI en sa définition complète
- **Benchmark** — Consulter la distribution de marché pour un set de dimensions
- **Compare** — Positionner une valeur dans la distribution de marché
- **Audit** — Valider la conformité SNOMI d'un set de métriques

---

## 2. Stack technique

- **Runtime :** Node.js + TypeScript
- **Framework :** Hono (léger, zéro dépendance, compatible Cloudflare Workers)
- **Données :** JSON statiques compilés depuis les fichiers `references/` SNOMI — pas de base de données
- **Déploiement cible :** Local pour les tests, Railway/Vercel pour partage

---

## 3. Architecture

### Structure de fichiers

```
snomi-api/
├── src/
│   ├── index.ts              # point d'entrée, app Hono + CORS
│   ├── routes/
│   │   ├── benchmark.ts      # GET /benchmark
│   │   ├── audit.ts          # POST /audit
│   │   ├── compare.ts        # GET /compare
│   │   └── decode.ts         # GET /decode
│   ├── data/
│   │   ├── metrics.json      # compilé depuis references/metrics.md
│   │   ├── benchmarks.json   # compilé depuis references/benchmarks.md
│   │   └── valuesets.json    # compilé depuis references/foundation/valuesets.md
│   └── lib/
│       ├── snomi-index.ts    # index en mémoire pour lookups O(1)
│       └── types.ts          # types TypeScript partagés
└── scripts/
    └── compile-specs.ts      # parse Markdown SNOMI → JSON (one-shot)
```

### Flux de données

```
references/*.md  ──[compile-specs]──▶  src/data/*.json  ──[startup]──▶  RAM  ──[request]──▶  response
```

Le script `compile-specs.ts` est un one-shot relancé uniquement quand la spec SNOMI change. Les JSON résultants sont commités dans le repo.

---

## 4. Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

---

### `GET /api/v1/decode`

Décode un code SNOMI en sa définition complète.

**Paramètres query :**
| Param | Requis | Exemple |
|-------|--------|---------|
| `code` | oui | `ENG.001.IG.FR` |

**Réponse 200 :**
```json
{
  "code": "ENG.001.IG.FR",
  "domain": "ENG",
  "name": "Engagement Rate",
  "formula": "(L + C + S + Sh) / Reach × 100",
  "trust_level": "T3",
  "platform": "IG",
  "market": "FR",
  "unit": "percentage",
  "notes": "..."
}
```

---

### `GET /api/v1/benchmark`

Retourne la distribution de marché pour un set de dimensions.

**Paramètres query :**
| Param | Requis | Exemple |
|-------|--------|---------|
| `metric` | oui | `ENG.001` |
| `platform` | oui | `IG` |
| `country` | oui | `FR` |
| `tier` | oui | `micro` |
| `niche` | non | `beauty` |
| `format` | non | `REEL` |
| `window` | non (défaut: `90d`) | `30d`, `90d`, `12m` |

**Réponse 200 :**
```json
{
  "metric": "ENG.001.IG.FR",
  "dimensions": { "tier": "micro", "niche": "beauty", "format": null },
  "window": "90d",
  "distribution": { "p10": 1.2, "p25": 2.4, "p50": 3.8, "p75": 5.6, "p90": 8.1 },
  "data_source": "snomi-static-v2",
  "coverage": "full",
  "trust_floor": "T3"
}
```

`coverage` peut être `"full"` ou `"partial"` si les données sont interpolées.

---

### `GET /api/v1/compare`

Positionne une valeur dans la distribution de marché.

**Paramètres query :**
| Param | Requis | Exemple |
|-------|--------|---------|
| `metric` | oui | `ENG.001` |
| `value` | oui | `5.9` |
| `platform` | oui | `IG` |
| `country` | oui | `FR` |
| `tier` | oui | `micro` |
| `niche` | non | `beauty` |

**Réponse 200 :**
```json
{
  "metric": "ENG.001.IG.FR",
  "value": 5.9,
  "percentile": 78,
  "verdict": "above_market",
  "label": "P78 — au-dessus du marché",
  "benchmark": { "p50": 3.8, "p75": 5.6, "p90": 8.1 }
}
```

**Valeurs de `verdict` :** `"top_performer"` (≥P90), `"above_market"` (P75–P90), `"market"` (P25–P75), `"below_market"` (P10–P25), `"low_performer"` (<P10)

---

### `POST /api/v1/audit`

Valide un set de métriques pour conformité SNOMI.

**Body JSON :**
```json
{
  "citations": [
    { "code": "ENG.001.IG", "value": "5.9%", "source": "Kolsquare", "trust": "T4" },
    { "code": "VAL.001.IG", "value": "€2800", "source": "internal" }
  ],
  "rules": "standard"
}
```

`rules` : `"strict"` | `"standard"` | `"permissive"` (défaut: `"standard"`)

**Calcul du score d'audit (0–100) :** `(citations valides / total citations) × 100`, pondéré par la sévérité des issues (`error` = -15pts, `warning` = -5pts). Un score ≥ 80 avec zéro `error` est considéré conforme (`compliant: true`).

**Réponse 200 :**
```json
{
  "compliant": false,
  "score": 65,
  "issues": [
    {
      "code": "VAL.001.IG",
      "severity": "error",
      "rule": "VAL.001 doit déclarer [base] et [CPM ref source]",
      "fix": "Utiliser VAL.001[base:REA.001][CPM:native|IG|Reel|FR|2026-Q1]"
    }
  ],
  "passed": ["ENG.001.IG"]
}
```

---

## 5. Data Layer

### Sources

| Fichier JSON | Source Markdown | Contenu |
|---|---|---|
| `src/data/metrics.json` | `references/metrics.md` | Tous les codes SNOMI : formule, trust, unité, domaine |
| `src/data/benchmarks.json` | `references/benchmarks.md` | Distributions par niche × pays × tier × plateforme |
| `src/data/valuesets.json` | `references/foundation/valuesets.md` | Vocabulaires contrôlés : plateformes, tiers, niches, pays |

### Index en mémoire

Au démarrage, `snomi-index.ts` construit :
- `Map<code, MetricDefinition>` — lookup O(1) sur les codes SNOMI
- `Map<dimensionKey, BenchmarkDistribution>` — lookup O(1) sur les benchmarks

`dimensionKey` = `${metric}:${platform}:${country}:${tier}:${niche || '*'}:${format || '*'}`

### Gestion des gaps de benchmarks

Les benchmarks de la spec ne couvrent pas toutes les combinaisons. Stratégie :
1. Match exact → retourner le benchmark
2. Match partiel (sans niche/format) → retourner avec `coverage: "partial"`
3. Aucun match → erreur `NO_BENCHMARK_DATA`

---

## 6. Gestion d'erreurs

Format uniforme sur tous les endpoints :

```json
{
  "error": {
    "code": "UNKNOWN_METRIC_CODE",
    "message": "Le code 'ENG.999.IG' n'existe pas dans la spec SNOMI v2",
    "hint": "Consulte /api/v1/decode pour vérifier les codes disponibles"
  }
}
```

| Cas | HTTP | Code erreur |
|---|---|---|
| Code SNOMI inconnu | 404 | `UNKNOWN_METRIC_CODE` |
| Paramètre manquant | 400 | `MISSING_PARAMETER` |
| Dimension hors valueset | 400 | `INVALID_DIMENSION` |
| Benchmark non disponible | 404 | `NO_BENCHMARK_DATA` |
| Body JSON malformé | 400 | `INVALID_BODY` |
| Erreur interne | 500 | `INTERNAL_ERROR` |

---

## 7. CORS & Configuration

- CORS activé pour toutes les origines en dev (`*`)
- Origine configurable via `ALLOWED_ORIGIN` env var en prod
- Port configurable via `PORT` env var (défaut: `3000`)

---

## 8. Hors scope (v1)

- Authentification / API keys
- Data Lake réel (toutes les données sont statiques)
- Nominative Store (pas de données créateur réelles)
- MCP Server
- Ingestion (write path)
- Rate limiting

Ces éléments font partie de SNOMI OS v2+ et seront adressés dans des phases ultérieures.
