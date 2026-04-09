# SNOMI — Standard Nomenclature of Influence Metrics

**Version 1.1 · Open International Standard**

SNOMI is an open, vendor-neutral standard that assigns unique codes, formulas, and trust levels to every metric used in influencer marketing — making reports comparable, auditable, and manipulation-resistant.

---

## Documentation

The full documentation is available at: **https://rayanebenabs.github.io/SNOMI**

---

## Repository structure

```
snomi/
├── SKILL.md                  # AI skill — load into Claude, GPT, or Gemini
├── references/
│   ├── metrics.md            # Full metrics catalog (all 8 domains, 40+ codes)
│   └── benchmarks.md         # Regional benchmarks (ENG, CPM by market & tier)
└── docs/
    └── index.html            # Documentation website (auto-deployed via GitHub Pages)
```

---

## What is SNOMI?

Influencer marketing is a multi-billion dollar industry built on metrics that mean different things to different people. An "engagement rate" from one platform or agency is rarely the same as another's. EMV is cited without methodology. Reports are not auditable.

SNOMI solves this by providing:

- **Unique codes** — `ENG.002.IG` means exactly one thing, always
- **Trust levels** — T1 (self-reported) to T5 (native platform data)
- **Comparability** — benchmarks always include market, tier, and source
- **Open standard** — no vendor lock-in, works with any tool or agency

---

## Code structure

```
[DOMAIN].[ID].[PLATFORM]          →  universal metric
[DOMAIN].[ID].[PLATFORM].[CC]     →  market-specific benchmark or regulatory variant
```

### The 8 domains

| Domain | Name | Covers |
|--------|------|--------|
| `AUD` | Audience | Size, quality, composition |
| `ENG` | Engagement | Interaction with content |
| `REA` | Reach & Distribution | Content spread |
| `CON` | Conversion | Commercial actions |
| `VAL` | Value & ROI | Financial metrics |
| `QUA` | Content Quality | Quality, compliance, sentiment |
| `CRE` | Creator Health | Vitality, consistency, credibility |
| `REG` | Regulatory | National compliance — always requires [CC] |

---

## AI Integration

Load `SKILL.md` into any AI model to get a SNOMI-fluent analyst:

| Model | Method |
|-------|--------|
| **Claude** | Add `SKILL.md` to your Claude Code skills directory |
| **ChatGPT / GPT-4o** | Paste into Custom GPT instructions |
| **Gemini** | Paste into Gemini Gem instructions |

Once loaded, the model supports 6 operating modes: `ENCODE` · `DECODE` · `CALCULATE` · `VALIDATE` · `BENCHMARK` · `AUDIT`

---

## Contributing

Suggestions, corrections, and new metric proposals are welcome.

- **Email:** snomi.team@gmail.com
- **GitHub Issues:** open an issue in this repository

### What to contribute

- Missing metric
- Incorrect or ambiguous formula
- Benchmark update (new source, new market)
- New national regulation (REG domain)
- Improvement to the citation standard

---

## License

SNOMI is released as an open standard. You are free to use, cite, and build upon it — with attribution.

---

*SNOMI v1.1 · 2026*
