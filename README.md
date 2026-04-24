# SNOMI — Standard Nomenclature of Influence Metrics

**Version 2.1 · Open International Standard**

[![SNOMI Compliance](https://github.com/rayanebenabs/SNOMI/actions/workflows/validate.yml/badge.svg)](https://github.com/rayanebenabs/SNOMI/actions/workflows/validate.yml)
[![npm](https://img.shields.io/npm/v/snomi-validate)](https://www.npmjs.com/package/snomi-validate)

SNOMI is an open, vendor-neutral standard that assigns unique codes, formulas, and trust levels to every metric used in influencer marketing — making reports comparable, auditable, and manipulation-resistant.

---

## What is SNOMI?

Influencer marketing is a multi-billion dollar industry built on metrics that mean different things to different people. An "engagement rate" from one platform or agency is rarely the same as another's. EMV is cited without methodology. Reports are not auditable.

SNOMI solves this by providing:

- **Unique codes** — `ENG.001.IG` means exactly one thing, always
- **Trust levels** — T1 (self-reported) to T5 (native platform data)
- **Comparability** — benchmarks always include market, tier, and source
- **Open standard** — no vendor lock-in, works with any tool or agency

```
ENG.001[inputs:L+C+S+Sh].IG.FR | 5.9% | 2026-03-01→2026-03-31 | 2026-04-02 | Instagram Insights | T4
```

---

## Code Structure

```
[DOMAIN].[ID].[PLATFORM]          →  universal metric
[DOMAIN].[ID].[PLATFORM].[CC]     →  market-specific benchmark or regulatory variant
```

### The 8 Domains

| Domain | Name | Covers |
|--------|------|--------|
| `AUD` | Audience | Size, quality, composition |
| `ENG` | Engagement | Interaction with content |
| `REA` | Reach & Distribution | Content spread |
| `CON` | Conversion | Commercial actions |
| `VAL` | Value & ROI | Financial metrics |
| `QUA` | Content Quality | Quality, compliance, sentiment |
| `CRE` | Creator Health | Vitality, consistency, credibility |
| `REG` | Regulatory | National compliance — always requires `[CC]` |

### Trust Scale

| Level | Name | Source |
|-------|------|--------|
| T5 | Gold | Native platform data, non-manipulable |
| T4 | Silver | Calculated from T5 inputs, standard formula |
| T3 | Bronze | Calculated with declared methodology assumptions |
| T2 | Copper | Estimated via third-party tool or benchmark |
| T1 | Iron | Self-reported or unverifiable |

---

## Validator — `snomi-validate`

`snomi-validate` is the official CLI tool to check whether a JSON report is SNOMI-compliant.

### Install

```bash
npm install -g snomi-validate
```

Or use without installing:

```bash
npx snomi-validate validate report.json
```

### Usage

```bash
# Validate a single file
snomi-validate validate report.json

# Validate multiple files
snomi-validate validate reports/*.json

# Output as JSON (for CI pipelines)
snomi-validate validate report.json --format json
```

### Example output

```
✅ SNOMI COMPLIANT — report.json
   Resource type : ContentUnit
   Profile       : ig-reel
   Version       : 2.1
   Metrics       : 4 citations validated
```

```
❌ NOT COMPLIANT — report.json
   3 error(s) found:

   [VAL.001] Missing required declaration: [base: REA.001]
   [REG.001] Country code [CC] is required for regulatory metrics
   [profile] Profile "ig-reel" is not valid for platform "TK"
```

### What it validates

1. **JSON Schema** — required fields, correct value types, recognised SNOMI codes
2. **Business rules** — SNOMI-specific logic that schemas cannot express:
   - `VAL.001` must declare `[base: ...]` and `[CPM: ...]`
   - `REG.001` requires a country code `[CC]`
   - Profile/platform consistency (e.g. `ig-reel` cannot be on TikTok)
   - Trust score propagation rules
   - Sponsorship disclosure requirements

See [`tools/snomi-validate/README.md`](tools/snomi-validate/README.md) for the full API documentation.

---

## Repository Structure

```
SNOMI/
├── GOVERNANCE.md                     # Decision-making model, RFC process, versioning
├── CONTRIBUTING.md                   # How to propose changes
├── CHANGELOG.md                      # Version history (v1.0 → v2.1)
├── LICENSE                           # CC BY 4.0 (spec) + MIT (tools)
├── SKILL.md                          # AI integration skill
├── examples/
│   └── content-unit/
│       └── compliant-ig-reel.json    # Reference compliant example
├── references/
│   ├── foundation/                   # Resource model, type system, value sets
│   ├── resources/                    # ContentUnit, Actor, Campaign, Financial
│   ├── profiles/                     # Content profiles (ig-reel, tk-video…) and actor profiles
│   ├── metrics.md                    # Full metrics catalog (8 domains)
│   └── benchmarks.md                 # Regional CPM and engagement benchmarks
├── tools/
│   └── snomi-validate/               # CLI validator (npm: snomi-validate)
│       ├── bin/snomi.js              # CLI entry point
│       ├── src/                      # validator.js · rules.js · reporter.js
│       ├── schemas/                  # JSON Schemas for all resource types
│       └── test/                     # 11 test cases (compliant + non-compliant)
├── .github/
│   ├── ISSUE_TEMPLATE/               # RFC · Benchmark Update · Bug Report
│   └── workflows/                    # CI: validate · spec-lint · publish
└── docs/
    └── index.html                    # Documentation website (GitHub Pages)
```

---

## MCP Server & REST API

SNOMI exposes a public server with two integration modes — **MCP** for AI clients and **REST API** for applications.

**Base URL:** `https://snomi-production.up.railway.app`

### MCP (Claude Desktop, Cursor, …)

```
POST /mcp
```

```json
{
  "mcpServers": {
    "snomi": {
      "command": "npx",
      "args": ["mcp-remote", "https://snomi-production.up.railway.app/mcp"]
    }
  }
}
```

### REST API

| Endpoint | Body | Description |
|----------|------|-------------|
| `POST /api/encode` | `{ metric_code, value, ... }` | Format raw metrics into SNOMI citation |
| `POST /api/decode` | `{ code }` | Explain a SNOMI code |
| `POST /api/calculate` | `{ metric_code, likes, reach, ... }` | Calculate a metric step-by-step |
| `POST /api/validate` | `{ json_content }` | Validate a JSON report |
| `POST /api/benchmark` | `{ metric_code, tier?, market?, vertical? }` | Get benchmarks |
| `POST /api/audit` | `{ json_content, tier?, market?, vertical? }` | Full audit |

All endpoints return `{ ok: true, result: "..." }` or `{ ok: false, error: "..." }`.

```js
// Example — validate a report
const res = await fetch('https://snomi-production.up.railway.app/api/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ json_content: JSON.stringify(report) })
});
const { ok, result } = await res.json();

// Example — calculate ENG.001
const res = await fetch('https://snomi-production.up.railway.app/api/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ metric_code: 'ENG.001', likes: 420, comments: 38, saves: 95, shares: 12, reach: 8400, followers: 24000 })
});
```

Source: [`tools/snomi-mcp/`](tools/snomi-mcp/)

---

## AI Integration

Load `SKILL.md` into any AI model to get a SNOMI-fluent analyst that supports 6 operating modes:

`ENCODE` · `DECODE` · `CALCULATE` · `VALIDATE` · `BENCHMARK` · `AUDIT`

| Model | Method |
|-------|--------|
| **Claude** | Add `SKILL.md` to your Claude Code skills directory |
| **ChatGPT / GPT-4o** | Paste into Custom GPT instructions |
| **Gemini** | Paste into Gemini Gem instructions |

---

## Contributing

SNOMI uses an RFC process for all changes. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

| Change type | Process |
|-------------|---------|
| Typo / broken link | Open a PR directly |
| New benchmark data | Use the [Benchmark Update](https://github.com/rayanebenabs/SNOMI/issues/new?template=benchmark-update.yml) template |
| New metric / formula change | Open an [RFC](https://github.com/rayanebenabs/SNOMI/issues/new?template=rfc.yml) — 21-day comment period |
| Core model change | Open an [RFC](https://github.com/rayanebenabs/SNOMI/issues/new?template=rfc.yml) — 30-day comment period |

Questions? Email [snomi.team@gmail.com](mailto:snomi.team@gmail.com) or open a [Discussion](https://github.com/rayanebenabs/SNOMI/discussions).

---

## License

The SNOMI specification is released under [CC BY 4.0](LICENSE) — free to use, cite, and build upon with attribution.

Reference implementations and tooling are additionally available under the MIT License.

> "Metrics cited per SNOMI v2.1 — https://github.com/rayanebenabs/SNOMI"

---

*SNOMI v2.1 · Maintained by [Rayane Benabdeljalil](https://thepollen.agency) · [snomi.team@gmail.com](mailto:snomi.team@gmail.com)*
