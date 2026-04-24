# SNOMI Governance

**Version 2.1 · Effective 2026**

This document defines how SNOMI is maintained, how decisions are made, and how
the standard evolves over time.

---

## 1. Governance Model

SNOMI is governed by the **SNOMI Committee**, a standing body responsible for
the integrity, evolution, and neutrality of the standard. The Committee operates
on a **President + Validation Committee** model:

- The **President** holds strategic leadership and final ratification authority
- The **Validation Committee** reviews all proposed changes and issues formal
  recommendations before any decision is ratified
- The **RFC process** ensures that anyone — inside or outside the Committee —
  can propose changes and be heard

This model was chosen because:
- SNOMI must be vendor-neutral and credible to multiple stakeholders
- Design coherence requires a single ratification authority
- Rigorous validation of changes requires structured peer review
- The RFC process creates a public, auditable record of every decision

---

## 2. Roles

### 2.1 President

**Rayane Benabdeljalil** — President of the SNOMI Committee
Contact: snomi.team@gmail.com

The President:
- Chairs the SNOMI Committee
- Has final ratification authority on all specification changes
- Can veto any Validation Committee recommendation, with written justification
- Tags releases and maintains the CHANGELOG
- Appoints and removes Validation Committee members
- Represents SNOMI in external partnerships and communications

The President commits to:
- Submitting all T2/T3 decisions to the Validation Committee before ratification
- Responding to all RFCs within 14 days of submission
- Publishing written justification for any rejection or veto
- Declaring any conflict of interest on commercially sensitive proposals

### 2.2 Validation Committee

The Validation Committee is the peer-review body of the SNOMI standard. It is
appointed by the President and operates independently on all technical matters.

**Composition:** 3 to 7 members drawn from agencies, platforms, advertisers, or
academic institutions active in influencer marketing. No single organisation may
hold more than one seat.

**Current members:**

| Name | LinkedIn |
|------|----------|
| Rayane Benabdeljalil | [linkedin.com/in/rayane-benabdeljalil](https://www.linkedin.com/in/rayane-benabdeljalil/) |
| Lucile Couret | [linkedin.com/in/lucilecouret](https://www.linkedin.com/in/lucilecouret/) |
| Rita Bennani | [linkedin.com/in/rita-bennani-71884664](https://www.linkedin.com/in/rita-bennani-71884664/) |

The Validation Committee:
- Reviews all T2 and T3 RFCs during the public comment period
- Issues a formal **recommendation** (approve / reject / revise) with written
  rationale before the President ratifies
- Can flag conflicts of interest and request recusal
- Conducts an annual review of the full metrics catalog
- Maintains domain ownership over assigned SNOMI domains (declared per member)

Validation Committee members serve **12-month renewable terms**. The President
may not unilaterally remove a member mid-term without a written cause statement
published in the repository.

### Joining the Validation Committee

The Validation Committee is open to professionals active in influencer marketing,
digital advertising, or adjacent fields. We are particularly looking for
practitioners from agencies, platforms, advertisers, and academic institutions.

**To apply**, send an email to [snomi.team@gmail.com](mailto:snomi.team@gmail.com)
with the subject line `Validation Committee — Application` and include:

- Your name and current organisation
- Your area of expertise within influencer marketing
- Which SNOMI domain(s) you would like to maintain (see §3 and the metrics catalog)
- A brief statement on why metric standardisation matters to you

Applications are reviewed on a rolling basis. Accepted candidates are confirmed
by the President and announced publicly in the repository.

### 2.3 Core Contributors

Core Contributors are invited by the President. They:
- Review RFCs and provide structured feedback
- Maintain specific domains or profiles (declared in their contributor record)
- Can merge editorial PRs (typos, clarifications) without RFC
- Do not have ratification power — that remains with the President

Current Core Contributors: *none yet — accepting nominations*

### 2.4 Community Contributors

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

## 6. Committee Expansion

The Validation Committee is designed to grow as SNOMI adoption increases.
Expansion is triggered when **both** of the following criteria are met:

1. **Adoption threshold:** 5 or more independent organisations (agencies, tools,
   or advertisers) publicly declare SNOMI compliance in their reporting
2. **Contribution threshold:** 5 or more T2/T3 RFCs accepted from external
   contributors within any 12-month window

When expansion criteria are met, the President will publish an open call for
nominations within 30 days. New members are confirmed by a majority vote of the
existing Validation Committee. The Committee size may not exceed 7 members at
any time, and no single organisation may hold more than one seat.

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
The President cannot amend GOVERNANCE.md without a public RFC and a formal
recommendation from the Validation Committee, except for editorial corrections
(T0). Any amendment to §2 (Roles) requires explicit Validation Committee
approval.

---

*SNOMI Governance v1.0 · Adopted 2026 · Next review: Q1 2027*
