# snomi-validate

> Official JSON Schema validator and CLI for the [SNOMI v2.1](https://snomi.io) standard  
> Standard Nomenclature of Influence Metrics

[![npm version](https://img.shields.io/npm/v/snomi-validate.svg)](https://www.npmjs.com/package/snomi-validate)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![SNOMI](https://img.shields.io/badge/standard-SNOMI%20v2.1-orange.svg)](https://snomi.io)

---

## What it does

`snomi-validate` checks that a SNOMI JSON resource (ContentUnit, Actor, Campaign, Financial) is:

1. **Structurally valid** — conforms to the SNOMI JSON Schema (required fields, correct types, enums, patterns)
2. **Semantically compliant** — passes all SNOMI business rules (platform↔profile match, VAL.001 declarations, REG country suffixes, disclosure requirements, etc.)

---

## Installation

```bash
# Run once without installing
npx snomi-validate validate report.json

# Install globally
npm install -g snomi-validate

# Install as a dev dependency (CI)
npm install --save-dev snomi-validate
```

---

## CLI usage

```bash
# Validate a single file (human-readable output)
snomi-validate validate report.json

# Validate multiple files
snomi-validate validate content-unit.json actor.json campaign.json

# Validate all JSON files in a folder
snomi-validate validate examples/*.json

# JSON output (for CI pipelines / log ingestion)
snomi-validate validate report.json --format json

# Exit 0 even on errors (capture output without failing the build)
snomi-validate validate report.json --exit-zero

# Print version
snomi-validate version
```

### Exit codes

| Code | Meaning |
|------|---------|
| `0`  | All resources compliant (errors = 0) |
| `1`  | One or more resources have validation errors |
| `2`  | CLI usage error (bad arguments, file not found) |

---

## Example output

**Compliant resource:**
```
SNOMI v2.1 — Compliance Report
────────────────────────────────────────────────────────────
File     : report.json
Resource : ContentUnit (ig-reel)
────────────────────────────────────────────────────────────
✅ PASS  Schema validation
✅ PASS  All SNOMI business rules
────────────────────────────────────────────────────────────
✅ Compliant — 0 errors, 0 warnings
```

**Non-compliant resource:**
```
SNOMI v2.1 — Compliance Report
────────────────────────────────────────────────────────────
File     : report.json
Resource : ContentUnit (ig-reel)
────────────────────────────────────────────────────────────
❌ FAIL  [profile-platform-match] platform — Profile "ig-reel" requires platform "IG" but got "TK"
         Fix: Set platform to "IG" or use a different profile
❌ FAIL  [val001-needs-base] metrics[2].code — VAL.001 (EMV) must declare the exposure base
         Fix: Add [base: REA.001] or [base: REA.002]
⚠️  WARN  [sponsored-disclosure] disclosure — Sponsored content has no disclosure tags
         Fix: Add native_label_used: true and/or disclosure_tags (e.g. ["#ad", "#partenariat"])
────────────────────────────────────────────────────────────
❌ Non-compliant — 2 errors, 1 warning
```

---

## Programmatic API

```js
const { validate, validateFile } = require('snomi-validate');

// Validate a JS object
const result = validate({
  resourceType: 'ContentUnit',
  profile: 'ig-reel',
  // ...
});

console.log(result.schemaErrors);   // AJV errors
console.log(result.ruleIssues);     // SNOMI business rule issues

// Validate a file (supports single resource or array)
const results = validateFile('./report.json');
// returns a single result object, or an array if the file contains an array
```

### Result object

```ts
{
  resourceType: string | null,
  profile: string | null,
  schemaErrors: AjvError[],       // [] if schema-valid
  ruleIssues: {
    level: 'error' | 'warning' | 'info',
    rule: string,                 // e.g. "val001-needs-base"
    path: string,                 // e.g. "metrics[2].code"
    message: string,
    fix: string | null,
  }[]
}
```

---

## Business rules validated

| Rule ID | Description |
|---------|-------------|
| `profile-platform-match` | `ig-reel` → must have `platform: "IG"`, `tk-video` → `"TK"`, etc. |
| `sponsored-disclosure` | `is_sponsored: true` requires `native_label_used` or `disclosure_tags` |
| `metric-produced-required` | Every MetricCitation must have a `produced` date |
| `val001-needs-base` | `VAL.001` (EMV) must declare `[base: REA.001]` or `[base: REA.002]` |
| `val001-needs-cpm-source` | `VAL.001` must declare `[CPM: ...]` with source and benchmark |
| `reg-needs-country` | `REG.001` / `REG.002` must carry a country code suffix (e.g. `REG.001.FR`) |
| `reg003-needs-platform` | `REG.003` must carry a platform suffix (e.g. `REG.003.IG`) |
| `low-trust-needs-note` | T1/T2 metrics should document their methodology in `note` |
| `eng-formula-unspecified` | `ENG.001` / `ENG.002` should clarify the formula used |
| `con002-needs-base` | `CON.002` (CTR) should declare its denominator base |
| `handle-followers-code` | Handle followers must use `AUD.001.[PLATFORM]` |
| `duplicate-handle-platform` | Only one Handle per platform per Actor |
| `handle-followers-platform-mismatch` | Handle platform must match `AUD.001.[PLATFORM]` code |
| `campaign-reach-not-summed` | `REA.001` in a Campaign aggregate must document deduplication |

---

## GitHub Actions integration

```yaml
# .github/workflows/snomi-validate.yml
- name: Validate SNOMI reports
  run: npx snomi-validate validate reports/*.json --format json
```

See the [full workflow example](https://github.com/rayanebenabs/SNOMI/blob/main/.github/workflows/validate.yml).

---

## Supported resource types

| `resourceType` | Profiles |
|----------------|---------|
| `ContentUnit`  | `ig-reel` `ig-story` `ig-post` `ig-video` `tk-video` `tk-story` `yt-short` `yt-video` `fb-reel` `fb-post` `li-post` `tw-post` `pin-pin` |
| `Actor`        | `creator` `advertiser` `agency` `platform` `tool` `regulatory-body` |
| `Campaign`     | `campaign` |
| `Financial`    | Budget · Contract · Invoice · Payment · Bonus |

---

## Links

- Standard specification: [snomi.io](https://snomi.io)
- GitHub repo: [rayanebenabs/SNOMI](https://github.com/rayanebenabs/SNOMI)
- Governance: [GOVERNANCE.md](https://github.com/rayanebenabs/SNOMI/blob/main/GOVERNANCE.md)
- Report an issue: [GitHub Issues](https://github.com/rayanebenabs/SNOMI/issues)

---

## License

MIT — see [LICENSE](LICENSE).  
The SNOMI specification itself is licensed under [CC BY 4.0](https://github.com/rayanebenabs/SNOMI/blob/main/LICENSE).
