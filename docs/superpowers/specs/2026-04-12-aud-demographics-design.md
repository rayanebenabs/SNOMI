# SNOMI — AUD Domain : Audience Demographics Extension
**Design Document · v1.2 · 2026-04-12**

---

## Contexte

SNOMI v1.1 couvre la taille et la qualité d'audience (AUD.001–AUD.006) mais manque de granularité sur la composition démographique. Ce document spécifie les changements apportés au domaine AUD pour la v1.2 :

1. Éclatement de `AUD.003` en sous-codes (qualité d'audience)
2. Remplacement de `AUD.006` par trois sous-codes distincts (démographies)
3. Ajout de `AUD.007` (centres d'intérêt)
4. Ajout de `AUD.008` (following count moyen)

---

## Changements par code

### AUD.003 — Audience Quality Score (mis à jour)

AUD.003 reste le score agrégé de qualité. Deux sous-codes s'ajoutent pour permettre une citation granulaire.

| Code | Nom | Définition | Formule | Format | Trust |
|------|-----|-----------|---------|--------|-------|
| AUD.003 | Audience Quality Score | Part estimée de followers genuins et actifs | % comptes actifs réels / total — via outil tiers | % | T2 |
| AUD.003.FAKE | Fake Account Rate | Part estimée de bots et faux comptes | % faux comptes / total — via outil tiers | % | T2 |
| AUD.003.INACT | Inactive Account Rate | Part de comptes réels mais sans activité récente | % comptes inactifs / total — via outil tiers | % | T2 |

**Relation entre les trois :**
```
AUD.003 ≈ 100% − AUD.003.FAKE − AUD.003.INACT
```
Cette approximation varie selon les outils — toujours déclarer la source. Les modèles HypeAuditor, Modash, Kolsquare et Upfluence utilisent des définitions propriétaires de "fake" et "inactif" qui ne sont pas directement comparables.

**Impact sur les scores composites :** AUD.003 (agrégat) continue d'alimenter le CPI à 25%. Les sous-codes sont des outils d'analyse, pas des composantes du CPI.

---

### AUD.006 — Suppression comme métrique standalone

AUD.006 ("Demographic Score") est **supprimé comme code autonome**. Il n'avait pas de formule propre et son utilité disparaît avec l'introduction des sous-codes. AUD.006 devient un **préfixe de namespace uniquement**.

Les trois sous-codes remplacent AUD.006 :

| Code | Nom | Définition | Formule | Format | Trust |
|------|-----|-----------|---------|--------|-------|
| AUD.006.AGE | Audience Age Distribution | Répartition par tranche d'âge | % par tranche | % breakdown | T4 |
| AUD.006.GEN | Audience Gender Distribution | Répartition par genre | % Homme / Femme / Non-spécifié | % breakdown | T4 |
| AUD.006.GEO | Audience Geographic Distribution | Répartition par pays ou région | % par pays (top N) | % breakdown | T4 |

**Tranches d'âge SNOMI standard :** 13–17 · 18–24 · 25–34 · 35–44 · 45–54 · 55+

**Trust T4 justifié :** Instagram Insights, TikTok Analytics, YouTube Studio exposent nativement ces trois dimensions pour l'audience du créateur. Si la source est un outil tiers, citer T2.

**Exemples de citation :**
```
AUD.006.AGE.IG | 18–24: 41%, 25–34: 33%, 35–44: 16%, autres: 10% | 2026-04-01 | Instagram Insights | T4
AUD.006.GEN.IG | H: 38%, F: 61%, N/A: 1% | 2026-04-01 | Instagram Insights | T4
AUD.006.GEO.IG | FR: 52%, BE: 14%, CH: 8%, autres: 26% | 2026-04-01 | Instagram Insights | T4
```

---

### AUD.007 — Audience Interest Distribution (nouveau)

| Champ | Valeur |
|-------|--------|
| Code | AUD.007 |
| Nom | Audience Interest Distribution |
| Définition | Répartition des centres d'intérêt de l'audience par catégorie d'affinité |
| Formule | % par catégorie (top N) — via outil tiers |
| Format | % breakdown |
| Trust | T2 |

**Note outil :** Les taxonomies de catégories varient selon l'outil. HypeAuditor, Modash et Kolsquare utilisent chacun leurs propres labels. Toujours déclarer l'outil et sa taxonomie. Ne pas comparer deux rapports AUD.007 issus d'outils différents sans normalisation préalable.

**Utilité dans le casting :** AUD.007 enrichit la lecture de AUD.004 (Target Audience Rate) — si la marque cible les amateurs de sport et que 68% de l'audience est classée "Sport & Fitness", c'est un signal de fit fort, même si AUD.004 n'est pas disponible.

---

### AUD.008 — Audience Following Count (nouveau)

| Champ | Valeur |
|-------|--------|
| Code | AUD.008 |
| Nom | Audience Following Count |
| Définition | Nombre moyen de comptes suivis par les membres de l'audience — signal de dilution d'attention |
| Formule | Moyenne du following count de l'audience — via outil tiers |
| Format | integer (moyenne) |
| Trust | T2 |

**Seuils indicatifs (non normatifs) :**

| Following count moyen | Interprétation |
|---|---|
| < 500 | Audience focalisée — attention élevée |
| 500 – 2 000 | Dans la norme |
| > 2 000 | Dilution d'attention — signal de vigilance |

Croiser avec AUD.003 et ENG.002 pour confirmer. Un AUD.008 élevé combiné à un ENG.002 fort reste positif — ce sont les deux signaux ensemble qui comptent.

---

## Tableau récapitulatif — domaine AUD v1.2

| Code | Nom | Statut |
|------|-----|--------|
| AUD.001 | Total Followers | inchangé |
| AUD.002 | Audience Growth Rate | inchangé |
| AUD.003 | Audience Quality Score | mis à jour (ajout sous-codes) |
| AUD.003.FAKE | Fake Account Rate | **nouveau** |
| AUD.003.INACT | Inactive Account Rate | **nouveau** |
| AUD.004 | Target Audience Rate | inchangé |
| AUD.005 | Audience Overlap | inchangé |
| AUD.006 | Demographic Score | **supprimé** (namespace uniquement) |
| AUD.006.AGE | Audience Age Distribution | **nouveau** |
| AUD.006.GEN | Audience Gender Distribution | **nouveau** |
| AUD.006.GEO | Audience Geographic Distribution | **nouveau** |
| AUD.007 | Audience Interest Distribution | **nouveau** |
| AUD.008 | Audience Following Count | **nouveau** |

---

## Impact sur les scores composites

- **CPI :** inchangé. AUD.003 (agrégat) continue d'alimenter le CPI à 25%.
- **BFS :** AUD.007 peut enrichir la composante "Audience Match" (AUD.004) quand AUD.004 n'est pas disponible — documenter l'usage dans le rapport.
- **CoPI :** aucun impact.
