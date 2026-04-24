# Contributing to SNOMI

Thank you for your interest in contributing to SNOMI. This document explains
how to propose changes, what makes a good contribution, and how to get
your proposal accepted.

If you just want to report a problem with the specification, skip to
[Reporting issues](#reporting-issues).

---

## What you can contribute

SNOMI welcomes four types of contribution:

### 1. New metrics or formula revisions (T2/T3 RFC)
Propose a new metric code, revise an existing formula, or change a trust
propagation rule. This requires an RFC — see [Opening an RFC](#opening-an-rfc).

Good candidates:
- A metric you need in real campaigns that doesn't have a SNOMI code yet
- A formula you believe is incorrect or ambiguous
- An interaction type missing from the ENG domain (e.g. platform-specific action)

Not good candidates:
- Proprietary metrics that only make sense within one tool's methodology
- Metrics that duplicate an existing code with marginal differences

### 2. New benchmarks (T1)
Add or update engagement rate benchmarks, CPM reference values, or tier
thresholds. Benchmark contributions must cite a primary source with a
publication date.

Use the **[Benchmark Update](.github/ISSUE_TEMPLATE/benchmark-update.yml)**
issue template. No RFC required.

Requirements:
- Source must be a named published report (IAB, HypeAuditor, Rival IQ, etc.)
- Publication year must be ≥ current year − 2
- Must specify market (`[CC]`), vertical, and tier
- Self-published agency benchmarks are accepted only if methodology is disclosed

### 3. New platform profiles (T2 RFC)
Add a content profile for a new platform/format combination, or an actor
profile for a new participant type. Requires an RFC.

A new content profile must define:
- The platform and format codes (existing or proposed)
- Profile-specific fields (`profile_data`)
- The canonical list of applicable metrics
- The platform's view threshold (for REA.005)
- Disclosure/labelling requirements (REG.003)

### 4. Editorial fixes (T0 — no RFC)
Typos, broken links, grammar, formatting, and other non-normative changes.
Open a PR directly. No issue required. These are merged by Core Contributors.

---

## Opening an RFC

1. **Check for duplicates** — search open and closed issues for your topic
   before opening a new one. If a similar RFC exists, comment on it.

2. **Use the RFC template** — open a
   [new RFC issue](.github/ISSUE_TEMPLATE/rfc.yml). Fill in every field.
   Incomplete RFCs get labelled `needs-info` and stall.

3. **Be specific** — your RFC must include exact proposed spec text, not just
   a concept. If you are proposing a new metric, write the full table row as it
   would appear in `references/metrics.md`.

4. **Declare your context** — mention whether you are an agency, tool vendor,
   brand, or independent. This helps reviewers understand the use case and
   identify potential conflicts of interest.

5. **Engage during the comment period** — respond to feedback within 7 days or
   the RFC may be deprioritised.

---

## What makes a contribution accepted

The Lead Maintainer and Core Contributors evaluate proposals against these
criteria:

| Criterion | What we look for |
|-----------|-----------------|
| **Real use case** | The metric or change solves a problem that real campaigns face, not a theoretical edge case |
| **Non-duplication** | The proposal cannot be covered by an existing code with a note |
| **Formula precision** | The formula is unambiguous and all input metrics reference existing SNOMI codes |
| **Trust score accuracy** | The proposed default trust score correctly applies the propagation rule (T_result = max(T1, min(T_inputs) − Δ)) |
| **Backward compatibility** | Existing SNOMI-compliant records remain valid, or a migration path is clearly documented |
| **Source quality** | Any referenced benchmarks cite primary sources with dates |

We reject contributions that:
- Lock SNOMI to a proprietary tool's methodology without a neutral formulation
- Add metrics already covered by existing codes (use a note instead)
- Introduce T5 trust for metrics that depend on third-party estimation
- Change the trust propagation core rule (this is a T3 change requiring 30-day comment)

---

## Reporting issues

To report a bug in the specification (wrong formula, incorrect trust level,
contradictory definitions):

1. Open a **[Bug Report](.github/ISSUE_TEMPLATE/bug-report.yml)** issue
2. Include: the affected code, what the current spec says, what it should say,
   and the impact on real reports

For security or sensitive issues, email snomi.team@gmail.com directly.

---

## Credits

All accepted contributions are credited in the CHANGELOG under the relevant
version entry. If you want to be credited under an organisation name rather
than your personal name, specify this in your issue or PR.

---

## Style guide for spec text

When writing proposed spec text, follow these conventions so your PR is easy
to review:

- **Metric table rows** follow the exact column order of `references/metrics.md`:
  `Code | Name | Definition | Formula | Format | Trust`
- **Formulas** reference SNOMI codes in brackets: `[REA.001]`, not plain words
  like "reach"
- **Trust scores** in the table reflect the **ideal case** (all T5 inputs).
  Add a note below the table for non-obvious propagation cases.
- **Notes** go in a `**Note [CODE]:**` block immediately after the table, not
  inline in cells
- **Country codes** follow ISO 3166-1 alpha-2. Platform codes follow the
  existing `ValueSet/platforms`
- Use **sentence case** for metric names (e.g. "Engagement rate on reach",
  not "Engagement Rate On Reach")

---

*Questions? Open a [Discussion](https://github.com/rayanebenabs/SNOMI/discussions)
or email snomi.team@gmail.com*
