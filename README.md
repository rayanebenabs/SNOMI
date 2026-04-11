# SNOMI — Standard Nomenclature of Influence Metrics

**Version 2.0 · Open International Standard**

SNOMI is an open, vendor-neutral standard that assigns unique codes, formulas, and trust levels to every metric used in influencer marketing — making reports comparable, auditable, and manipulation-resistant.

---

## Documentation

The full documentation is available at: **https://rayanebenabs.github.io/SNOMI**

---

## Repository Structure

```
SNOMI/
├── SKILL.md                          # AI integration skill (v2.0)
├── references/
│   ├── foundation/
│   │   ├── resource-model.md         # Base types, cardinality, type system
│   │   └── valuesets.md              # All controlled vocabularies
│   ├── resources/
│   │   ├── content-unit.md           # Base ContentUnit resource
│   │   ├── actor.md                  # Base Actor resource
│   │   ├── campaign.md               # Campaign resource
│   │   └── financial.md              # Financial resources (Budget/Contract/Invoice/Payment/Bonus)
│   ├── profiles/
│   │   ├── content/
│   │   │   ├── ig-reel.md            # Instagram Reel
│   │   │   ├── ig-story.md           # Instagram Story
│   │   │   ├── ig-post.md            # Instagram Post/Carousel
│   │   │   ├── tk-video.md           # TikTok Video
│   │   │   ├── tk-story.md           # TikTok Story
│   │   │   ├── yt-short.md           # YouTube Short
│   │   │   ├── yt-video.md           # YouTube Video
│   │   │   ├── fb-reel.md            # Facebook Reel
│   │   │   ├── fb-post.md            # Facebook Post
│   │   │   ├── li-post.md            # LinkedIn Post
│   │   │   ├── tw-post.md            # X/Twitter Post
│   │   │   └── pin-pin.md            # Pinterest Pin
│   │   └── actors/
│   │       ├── creator.md            # Creator/Influencer
│   │       ├── advertiser.md         # Brand/Advertiser
│   │       ├── agency.md             # Agency
│   │       ├── platform.md           # Social platform
│   │       └── tool.md               # Analytics tool
│   ├── metrics.md                    # Full metrics catalog (AUD/ENG/REA/CON/VAL/QUA/CRE/REG)
│   └── benchmarks.md                 # Regional CPM and engagement benchmarks
└── docs/
    └── index.html                    # Documentation website (GitHub Pages)
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

*SNOMI v2.0 · 2026*
