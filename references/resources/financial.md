# SNOMI Resource: Financial
**Version 2.0 · Base Resource**

Financial resources cover the contractual and monetary layer of influencer campaigns.
All financial resources share the `Financial` resourceType and are differentiated
by their `type` field (Budget, Contract, Invoice, Payment, Bonus).

---

## Base Fields

Inherits all fields from [SnomiResource](../foundation/resource-model.md#base-resource-snomiresource).

| Field | Type | Cardinality | ValueSet | Description |
|-------|------|-------------|----------|-------------|
| `type` | code | 1..1 | [financial-types](../foundation/valuesets.md#valuesetfinancial-types) | Budget \| Contract \| Invoice \| Payment \| Bonus |
| `campaign` | Reference(Campaign) | 0..1 | — | Associated campaign |
| `currency` | code | 1..1 | — | ISO 4217 currency code |
| `parties` | Reference(Actor)[] | 1..* | — | All actors party to this financial resource |

---

## FIN.Budget

Planning document for campaign spend.

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `total_gross` | decimal | 1..1 | Total budget incl. agency fees and tax |
| `total_net` | decimal | 0..1 | Media/creator spend only (excl. fees) |
| `agency_fee_pct` | decimal | 0..1 | Agency commission as % of gross |
| `tax_rate` | decimal | 0..1 | Applicable VAT/tax rate |
| `allocations` | Allocation[] | 0..* | Per-creator or per-format breakdown |

### Allocation (BackboneElement)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `creator` | Reference(Actor) | 0..1 | Creator this allocation targets |
| `platform` | code | 0..1 | Platform this allocation targets |
| `format` | code | 0..1 | Content format this allocation targets |
| `posts_count` | integer | 0..1 | Number of deliverables |
| `amount_net` | decimal | 1..1 | Net fee to creator |
| `amount_gross` | decimal | 0..1 | Gross cost including fees |
| `fee_type` | code | 0..1 | See [ValueSet/fee-types](../foundation/valuesets.md#valuesetfee-types) |
| `usage_rights_included` | boolean | 0..1 | Whether usage rights are included in this fee |

---

## FIN.Contract

Legal agreement between parties defining deliverables, exclusivity, and payment.

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `signed_at` | date | 0..1 | Date all parties signed |
| `start_date` | date | 1..1 | Contract start date |
| `end_date` | date | 0..1 | Contract end date |
| `deliverables` | Deliverable[] | 1..* | Content deliverables contractually required |
| `exclusivity` | Exclusivity[] | 0..* | Sector/brand exclusivity clauses |
| `usage_rights` | UsageRight[] | 0..* | Content usage rights granted |
| `payment_terms` | PaymentTerms | 0..1 | Payment schedule |
| `governing_law` | code | 0..1 | ISO 3166-1 country of governing jurisdiction |

### Deliverable (BackboneElement)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `profile` | code | 1..1 | Content profile e.g. `ig-reel`, `tk-video` |
| `quantity` | integer | 1..1 | Number of posts required |
| `due_date` | date | 0..1 | Deadline for delivery |
| `brief_url` | url | 0..1 | Link to specific brief |
| `status` | code | 0..1 | `pending` \| `submitted` \| `approved` \| `rejected` \| `published` |

### Exclusivity (BackboneElement)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `category` | code | 1..1 | Content category (from [ValueSet/content-categories](../foundation/valuesets.md#valuesetcontent-categories)) |
| `competing_brand` | string | 0..1 | Specific competing brand if named |
| `start_date` | date | 1..1 | Exclusivity period start |
| `end_date` | date | 0..1 | Exclusivity period end (absent = indefinite) |

### UsageRight (BackboneElement)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `type` | code | 1..1 | See [ValueSet/usage-right-types](../foundation/valuesets.md#valuesetusage-right-types) |
| `duration_months` | integer | 0..1 | Rights duration in months |
| `territory` | code[] | 0..* | ISO 3166-1 territories. Absent = worldwide |
| `fee_additional` | Currency | 0..1 | Additional fee for this right (on top of base fee) |

### PaymentTerms (BackboneElement)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `structure` | code | 1..1 | See [ValueSet/payment-structures](../foundation/valuesets.md#valuesetpayment-structures) |
| `upfront_pct` | decimal | 0..1 | % paid before delivery |
| `on_delivery_pct` | decimal | 0..1 | % paid on delivery |
| `on_approval_pct` | decimal | 0..1 | % paid on brand approval |

---

## FIN.Invoice

Payment request issued by creator or agency to advertiser.

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `from` | Reference(Actor) | 1..1 | Invoice issuer |
| `to` | Reference(Actor) | 1..1 | Invoice recipient |
| `contract` | Reference(Financial) | 0..1 | Associated contract |
| `issued_at` | date | 1..1 | Issue date |
| `due_at` | date | 1..1 | Payment due date |
| `paid_at` | date | 0..1 | Actual payment date |
| `lines` | InvoiceLine[] | 1..* | Line items |
| `total_net` | Currency | 1..1 | Pre-tax total |
| `tax_rate` | decimal | 0..1 | Applied tax rate |
| `total_gross` | Currency | 1..1 | Total including tax |

### InvoiceLine (BackboneElement)

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `description` | string | 1..1 | Line item description |
| `deliverable_ref` | string | 0..1 | Reference to contract Deliverable |
| `quantity` | integer | 1..1 | Number of units |
| `unit_price_net` | Currency | 1..1 | Unit price excluding tax |
| `amount_net` | Currency | 1..1 | quantity × unit_price_net |

---

## FIN.Payment

Record of actual funds transferred.

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `invoice` | Reference(Financial) | 0..1 | Invoice being paid |
| `from` | Reference(Actor) | 1..1 | Payer |
| `to` | Reference(Actor) | 1..1 | Payee |
| `amount` | Currency | 1..1 | Amount transferred |
| `transferred_at` | dateTime | 1..1 | Transfer timestamp |
| `method` | string | 0..1 | Wire, SEPA, PayPal, etc. |
| `reference` | string | 0..1 | Bank transfer reference |

---

## FIN.Bonus

Performance-based additional payment triggered when KPIs are exceeded.

| Field | Type | Cardinality | Description |
|-------|------|-------------|-------------|
| `contract` | Reference(Financial) | 0..1 | Contract that defines this bonus |
| `creator` | Reference(Actor) | 1..1 | Recipient |
| `trigger_metric` | string | 1..1 | SNOMI code of the metric that triggered the bonus |
| `trigger_value` | string | 1..1 | Threshold value that was exceeded |
| `actual_value` | string | 1..1 | Actual metric value achieved |
| `amount` | Currency | 1..1 | Bonus amount |
| `earned_at` | date | 1..1 | Date the threshold was confirmed met |

---

## Example: Budget

```json
{
  "id": "budget-spring-launch-2026",
  "resourceType": "Financial",
  "type": "Budget",
  "profile": "budget",
  "status": "completed",
  "snomi_version": "2.0",
  "meta": { "created_at": "2026-02-01T08:00Z" },
  "campaign": { "resourceType": "Campaign", "id": "campaign-spring-launch-2026" },
  "parties": [
    { "resourceType": "Actor", "id": "advertiser-marque-x" },
    { "resourceType": "Actor", "id": "agency-influence-co" }
  ],
  "currency": "EUR",
  "total_gross": 25000.00,
  "total_net": 20000.00,
  "agency_fee_pct": 20,
  "tax_rate": 20,
  "allocations": [
    {
      "creator": { "resourceType": "Actor", "id": "creator-marie-dupont" },
      "platform": "IG",
      "format": "REEL",
      "posts_count": 2,
      "amount_net": 4500.00,
      "fee_type": "flat",
      "usage_rights_included": false
    },
    {
      "creator": { "resourceType": "Actor", "id": "creator-marie-dupont" },
      "platform": "TK",
      "format": "VIDEO",
      "posts_count": 1,
      "amount_net": 2500.00,
      "fee_type": "flat",
      "usage_rights_included": false
    }
  ]
}
```
