# SNOMI Governance

**Version 2.1 · Effective 2026**

This document defines how SNOMI is maintained, how decisions are made, and how
the standard evolves over time.

---

## 1. Governance Model

SNOMI operates under a **BDFL (Benevolent Dictator For Life) with open RFC**
model, designed to transition to a multi-stakeholder committee once adoption
reaches critical mass (see §6).

This model was chosen because:
- SNOMI is an early-stage standard that needs to move fast
- Design coherence matters more than committee consensus at this stage
- The RFC process ensures anyone can propose changes and be heard
- The transition criteria are explicit and public from day one

---

## 2. Roles

### 2.1 Lead Maintainer

**Rayane Benabdeljalil** — [Pollen Agency](https://thepollen.agency)
Contact: snomi.team@gmail.com

The Lead Maintainer:
- Has final decision authority on all specification changes
- Merges or closes RFCs after the public comment period
- Tags releases and maintains the CHANGELOG
- Appoints Core Contributors
- Can veto any change at any time, with written justification

The Lead Maintainer commits to:
- Responding to all RFCs within 14 days of submission
- Publishing written justification for any rejection
- Declaring any conflict of interest on commercially sensitive proposals
- Transferring governance to the SNOMI Committee (§6) when criteria are met

### 2.2 Core Contributors

Core Contributors are invited by the Lead Maintainer. They:
- Review RFCs and provide structured feedback
- Maintain specific domains or profiles (declared in their contributor record)
- Can merge editorial PRs (typos, clarifications) without RFC
- Do not have veto power — that remains with the Lead Maintainer

Current Core Contributors: *none yet — accepting nominations*

### 2.3 Community Contributors

Anyone can:
- Open an RFC via GitHub Issues using the RFC template
- Comment on open RFCs during the public comment period
- Submit PRs for typo fixes, broken links, or formatting issues
- Propose new benchmarks via the Benchmark Update template

Community Contributors are credited in the CHANGELOG for accepted contributions.

---

## 3. Change Tiers

Not all changes require the same process. The tier determines the review overhead.

| Tier | Examples | Process |
|------|----------|---------|
| **T0** | Typos, broken links, formatting | Direct PR, no RFC required |
| **T1** | New benchmark data, note clarifications, new country for REG.001 | Benchmark Update issue + 7-day review |
| **T2** | New metric (new code), new content/actor profile, formula revision | RFC required — 21-day comment period |
| **T3** | Core model change (new resource type, cardinality change, domain rename), breaking change | RFC required — 30-day comment period + explicit changelog migration guide |

**When in doubt, open an RFC.** It costs nothing and creates a public record.

---

## 4. RFC Process

### Step 1 — Open an RFC

Use the **[RFC issue template](.github/ISSUE_TEMPLATE/rfc.yml)** on GitHub.
Fill in all required fields. Incomplete RFCs will be labelled `needs-info` and
paused until the author completes them.

Every RFC must include:
- **Motivation** — what problem does this solve? Cite real use cases.
- **Proposed change** — exact new code, formula, or model change
- **Trust score** — default trust and propagation rule for new metrics
- **Backward compatibility** — how existing SNOMI-compliant records are affected
- **Alternatives considered** — at least one alternative and why it was rejected

### Step 2 — Public Comment Period

- T2 RFC: **21 days** from the day the RFC is labelled `rfc-open`
- T3 RFC: **30 days** from the same label

During this period, anyone can comment. Core Contributors are expected to
provide structured feedback. The RFC author may revise the proposal based on
comments — revisions reset the timer only if they change the core proposal.

### Step 3 — Decision

After the comment period, the Lead Maintainer issues one of:

| Decision | Label | Meaning |
|----------|-------|---------|
| `rfc-accepted` | The proposal will be included in the next minor or major release |
| `rfc-deferred` | Technically sound but out of scope for current release cycle |
| `rfc-rejected` | Will not be included — written justification required |
| `rfc-needs-revision` | Accepted in principle, but requires specific changes before merge |

Accepted RFCs are assigned to a release milestone. The author may be asked to
write the final spec text (reviewed by Core Contributors before merge).

### Step 4 — Implementation & Release

Accepted proposals are merged into `references/` and reflected in the CHANGELOG
under the appropriate version. The `snomi_version` field in SKILL.md is bumped.

---

## 5. Versioning Policy

SNOMI uses **semantic versioning** at the specification level.

| Bump | Trigger | Examples |
|------|---------|---------|
| **Patch** (2.1.1) | Typo fixes, note clarifications, broken links | No impact on conformance |
| **Minor** (2.2) | New metrics, new profiles, new benchmarks, new optional fields | Backward compatible — existing records remain valid |
| **Major** (3.0) | Breaking changes to required fields, resource type renames, domain restructuring | Migration guide published alongside |

**Release cadence:**
- Patch releases: as needed, no ceremony
- Minor releases: quarterly (March, June, September, December)
- Major releases: no sooner than 12 months apart, 60-day deprecation notice required

**Metric retirement:**
Metrics are never deleted — they receive `status: retired` with a migration note
pointing to the replacement code. Retired codes remain valid in historical records.

---

## 6. Transition to SNOMI Committee

The governance model transitions from BDFL to a **multi-stakeholder committee**
when **all three** of the following criteria are met:

1. **Adoption threshold:** 3 or more independent organisations (agencies, tools,
   or advertisers) publicly declare SNOMI compliance in their reporting
2. **Contribution threshold:** 5 or more T2/T3 RFCs accepted from external
   contributors (i.e., not the Lead Maintainer) within any 12-month window
3. **Maintainer nomination:** at least 3 candidates from distinct organisations
   are willing to serve as committee members

When criteria are met, the Lead Maintainer will publish a transition plan within
30 days. The committee will have an odd number of members (3, 5, or 7) with no
single organisation holding more than 2 seats. The Lead Maintainer becomes a
permanent non-voting facilitator during the first committee cycle.

---

## 7. Conflict of Interest

Any contributor (including the Lead Maintainer) who has a direct commercial
interest in the outcome of an RFC must:
1. Declare the interest explicitly in the RFC thread
2. Abstain from casting any deciding vote (once committee model is active)

The Lead Maintainer retains veto power even with declared conflicts, but must
provide written public justification.

---

## 8. Code of Conduct

SNOMI follows the [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

Violations can be reported to snomi.team@gmail.com. All reports are handled
confidentially. The Lead Maintainer is the initial point of contact; if the
complaint involves the Lead Maintainer, it should be sent to a Core Contributor.

---

## 9. Amendments to This Document

Changes to GOVERNANCE.md itself follow the T3 process (30-day comment period).
The Lead Maintainer cannot amend GOVERNANCE.md without a public RFC, except for
editorial corrections (T0).

---

*SNOMI Governance v1.0 · Adopted 2026 · Next review: Q1 2027*
