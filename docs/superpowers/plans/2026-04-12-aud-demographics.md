# AUD Demographics Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre à jour le domaine AUD de SNOMI v1.2 avec les sous-codes démographiques (AUD.003.FAKE, AUD.003.INACT, AUD.006.AGE/GEN/GEO), supprimer AUD.006 standalone, et ajouter AUD.007 et AUD.008.

**Architecture:** Deux fichiers à modifier — `references/metrics.md` (catalogue de référence complet) et `SKILL.md` (quick reference utilisée par le skill). Les deux doivent rester cohérents l'un avec l'autre.

**Tech Stack:** Markdown, git

---

## File Map

| Fichier | Rôle | Action |
|---------|------|--------|
| `references/metrics.md` | Catalogue complet — source de vérité | Modifier section AUD (lignes 27–39) |
| `SKILL.md` | Quick reference du skill | Modifier section Audience (lignes 181–185) |

---

### Task 1 : Mettre à jour la section AUD dans `references/metrics.md`

**Files:**
- Modify: `references/metrics.md:27-39`

- [ ] **Step 1 : Lire la section AUD actuelle pour confirmer le contexte**

```bash
sed -n '27,42p' references/metrics.md
```

Résultat attendu : tableau avec AUD.001 à AUD.006 + Note AUD.003.

- [ ] **Step 2 : Remplacer la section AUD complète**

Remplacer le bloc actuel (lignes 27–39) par le contenu suivant. Utiliser l'outil Edit — `old_string` = le bloc entier ci-dessous, `new_string` = le bloc de remplacement.

**old_string (exact) :**
```
## AUD — Audience

| Code    | Name                   | Definition                                                                  | Formula                                         | Format          | Trust |
|---------|------------------------|-----------------------------------------------------------------------------|-------------------------------------------------|-----------------|-------|
| AUD.001 | Total Followers        | Total subscribers/followers at a given date                                 | Native platform value                           | integer         | T5    |
| AUD.002 | Audience Growth Rate   | % change in follower count over a period                                    | (end − start) / start × 100                    | %               | T5    |
| AUD.003 | Audience Quality Score | Estimated share of genuine, active followers                                | % active accounts / total — via 3rd-party tool | %               | T2    |
| AUD.004 | Target Audience Rate   | Share of audience matching brand's defined target persona                   | % audience meeting target criteria              | %               | T3    |
| AUD.005 | Audience Overlap       | Shared audience between two creators (for campaign deduplication)           | (Shared followers / min(A,B)) × 100             | %               | T2    |
| AUD.006 | Demographic Score      | Distribution by age, gender, geography — expressed as breakdown             | % per demographic cohort                        | % breakdown     | T4    |

**Note AUD.003:** Values above 85% are generally considered strong. Tools vary significantly — HypeAuditor, Modash, Kolsquare, Upfluence each use proprietary models. Never present as native platform data.
```

**new_string :**
```
## AUD — Audience

| Code         | Name                          | Definition                                                                   | Formula                                          | Format      | Trust |
|--------------|-------------------------------|------------------------------------------------------------------------------|--------------------------------------------------|-------------|-------|
| AUD.001      | Total Followers               | Total subscribers/followers at a given date                                  | Native platform value                            | integer     | T5    |
| AUD.002      | Audience Growth Rate          | % change in follower count over a period                                     | (end − start) / start × 100                     | %           | T5    |
| AUD.003      | Audience Quality Score        | Estimated share of genuine, active followers (aggregate)                     | % active accounts / total — via 3rd-party tool  | %           | T2    |
| AUD.003.FAKE | Fake Account Rate             | Estimated share of bot and fake accounts                                     | % fake accounts / total — via 3rd-party tool    | %           | T2    |
| AUD.003.INACT| Inactive Account Rate         | Share of real but recently inactive accounts                                 | % inactive accounts / total — via 3rd-party tool| %           | T2    |
| AUD.004      | Target Audience Rate          | Share of audience matching brand's defined target persona                    | % audience meeting target criteria               | %           | T3    |
| AUD.005      | Audience Overlap              | Shared audience between two creators (for campaign deduplication)            | (Shared followers / min(A,B)) × 100              | %           | T2    |
| AUD.006.AGE  | Audience Age Distribution     | Audience breakdown by age bracket (13–17, 18–24, 25–34, 35–44, 45–54, 55+) | % per age bracket — platform native or 3rd-party| % breakdown | T4    |
| AUD.006.GEN  | Audience Gender Distribution  | Audience breakdown by gender                                                 | % Male / Female / Unspecified                    | % breakdown | T4    |
| AUD.006.GEO  | Audience Geographic Distribution | Audience breakdown by country or region                                   | % per country (top N)                            | % breakdown | T4    |
| AUD.007      | Audience Interest Distribution| Audience breakdown by interest/affinity category                             | % per category (top N) — via 3rd-party tool     | % breakdown | T2    |
| AUD.008      | Audience Following Count      | Average number of accounts followed by audience members — attention dilution signal | Mean following count — via 3rd-party tool | integer     | T2    |

**Note AUD.003:** Values above 85% are generally considered strong. Tools vary significantly — HypeAuditor, Modash, Kolsquare, Upfluence each use proprietary models. Never present as native platform data. `AUD.003 ≈ 100% − AUD.003.FAKE − AUD.003.INACT` (approximation — tool definitions vary).

**Note AUD.003.FAKE / AUD.003.INACT:** Always declare which tool and version was used. HypeAuditor, Modash and Kolsquare use proprietary definitions of "fake" and "inactive" that are not directly comparable across tools.

**Note AUD.006.AGE / GEN / GEO:** Trust T4 applies when sourced from native platform analytics (Instagram Insights, TikTok Analytics, YouTube Studio). Downgrade to T2 if sourced from a third-party tool.

**Note AUD.007:** Interest taxonomies vary by tool — always declare the tool and its taxonomy. Do not compare AUD.007 values across reports sourced from different tools without normalisation.

**Note AUD.008 — indicative thresholds (non-normative):**
| Following count (avg) | Interpretation |
|---|---|
| < 500 | Focused audience — high attention |
| 500 – 2 000 | Within norm |
| > 2 000 | Attention dilution — flag for review |

Cross-reference with AUD.003 and ENG.002 before concluding.
```

- [ ] **Step 3 : Vérifier le fichier après modification**

```bash
sed -n '27,75p' references/metrics.md
```

Vérifier : AUD.003.FAKE et AUD.003.INACT présents, AUD.006 seul absent, AUD.006.AGE/GEN/GEO présents, AUD.007 et AUD.008 présents, notes complètes.

- [ ] **Step 4 : Commit**

```bash
git add references/metrics.md
git commit -m "feat(AUD): expand AUD domain with demographic sub-codes (v1.2)

- AUD.003.FAKE / AUD.003.INACT sub-codes for audience quality
- AUD.006 standalone removed; replaced by AUD.006.AGE / GEN / GEO
- AUD.007 Audience Interest Distribution added
- AUD.008 Audience Following Count added"
```

---

### Task 2 : Mettre à jour la Quick Reference AUD dans `SKILL.md`

**Files:**
- Modify: `SKILL.md:177-185`

- [ ] **Step 1 : Lire la section Audience actuelle**

```bash
sed -n '175,190p' SKILL.md
```

Résultat attendu : tableau avec AUD.001 à AUD.005 (AUD.006 absent du quick ref actuel).

- [ ] **Step 2 : Remplacer le bloc Audience**

**old_string (exact) :**
```
### Audience

| Code      | Name                   | Formula                                      | Trust |
|-----------|------------------------|----------------------------------------------|-------|
| `AUD.001` | Total Followers        | Native value                                 | T5    |
| `AUD.002` | Audience Growth Rate   | `(end − start) / [AUD.001_start] × 100`      | T5    |
| `AUD.003` | Audience Quality Score | % real active followers (3rd-party tool)     | T2    |
| `AUD.004` | Target Audience Rate   | % audience matching brand target persona     | T3    |
| `AUD.005` | Audience Overlap       | Shared audience between two creators         | T2    |
```

**new_string :**
```
### Audience

| Code           | Name                          | Formula                                      | Trust |
|----------------|-------------------------------|----------------------------------------------|-------|
| `AUD.001`      | Total Followers               | Native value                                 | T5    |
| `AUD.002`      | Audience Growth Rate          | `(end − start) / [AUD.001_start] × 100`      | T5    |
| `AUD.003`      | Audience Quality Score        | % real active followers (3rd-party tool)     | T2    |
| `AUD.003.FAKE` | Fake Account Rate             | % fake/bot accounts (3rd-party tool)         | T2    |
| `AUD.003.INACT`| Inactive Account Rate         | % real but inactive accounts (3rd-party tool)| T2    |
| `AUD.004`      | Target Audience Rate          | % audience matching brand target persona     | T3    |
| `AUD.005`      | Audience Overlap              | Shared audience between two creators         | T2    |
| `AUD.006.AGE`  | Audience Age Distribution     | % per age bracket (platform native or T2)    | T4    |
| `AUD.006.GEN`  | Audience Gender Distribution  | % Male / Female / Unspecified                | T4    |
| `AUD.006.GEO`  | Audience Geographic Distribution | % per country/region (top N)              | T4    |
| `AUD.007`      | Audience Interest Distribution| % per interest category (3rd-party tool)     | T2    |
| `AUD.008`      | Audience Following Count      | Avg accounts followed by audience members    | T2    |
```

- [ ] **Step 3 : Vérifier la cohérence avec metrics.md**

Confirmer que chaque code dans le quick ref de SKILL.md correspond à une entrée dans `references/metrics.md`. Aucun code ne doit apparaître dans l'un sans l'autre.

```bash
grep "AUD\." SKILL.md | grep -E "AUD\.(003|006|007|008)"
grep "AUD\." references/metrics.md | grep -E "AUD\.(003|006|007|008)"
```

- [ ] **Step 4 : Commit**

```bash
git add SKILL.md
git commit -m "feat(SKILL): update AUD quick reference with v1.2 demographic codes"
```

---

## Vérification finale

- [ ] `AUD.006` standalone n'apparaît nulle part comme métrique citée (uniquement comme préfixe dans `AUD.006.AGE` etc.)
- [ ] `AUD.003`, `AUD.003.FAKE`, `AUD.003.INACT` présents dans les deux fichiers
- [ ] `AUD.007` et `AUD.008` présents dans les deux fichiers
- [ ] Relation `AUD.003 ≈ 100% − FAKE − INACT` documentée dans metrics.md
- [ ] Notes outils (T2 si tiers, T4 si natif) présentes pour AUD.006.AGE/GEN/GEO
