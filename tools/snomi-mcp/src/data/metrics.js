export const METRICS = {
  'AUD.001': { name: 'Total Followers', domain: 'AUD', formula: 'Native platform value', trust: 'T5', description: 'Total followers/subscribers at measurement date.', notes: 'Point-in-time snapshot. Does not reflect audience quality.' },
  'AUD.002': { name: 'Audience Growth Rate', domain: 'AUD', formula: '(followers_end - followers_start) / followers_start × 100', trust: 'T5', description: 'Percentage growth in followers over a defined period.', notes: 'Always declare the measurement period.' },
  'AUD.003': { name: 'Audience Quality Score', domain: 'AUD', formula: '% real active followers (3rd party tool)', trust: 'T2', description: 'Percentage of real, active followers as assessed by a third-party tool.', notes: 'Always T2 — third-party definitions vary. Always cite the tool.', subcodes: { 'AUD.003.FAKE': { name: 'Fake Account Rate', formula: '% fake/bot accounts', trust: 'T2' }, 'AUD.003.INACT': { name: 'Inactive Account Rate', formula: '% real but inactive', trust: 'T2' } } },
  'AUD.006.AGE': { name: 'Audience Age Distribution', domain: 'AUD', formula: '% per age bracket', trust: 'T4 (native) / T2 (3rd-party)', description: 'Percentage distribution by age brackets.' },
  'AUD.006.GEN': { name: 'Audience Gender Distribution', domain: 'AUD', formula: '% Male / Female / Unspecified', trust: 'T4 (native) / T2 (3rd-party)', description: 'Percentage distribution by gender. T4/T2 note: trust depends on source.' },
  'AUD.006.GEO': { name: 'Audience Geographic Distribution', domain: 'AUD', formula: '% per country/region, top N', trust: 'T4 (native) / T2 (3rd-party)', description: 'Top N countries/regions by audience share.' },
  'AUD.007': { name: 'Audience Interest Distribution', domain: 'AUD', formula: '% per interest category (3rd party)', trust: 'T2', description: 'Audience segmentation by interest categories.' },
  'AUD.008': { name: 'Audience Following Count', domain: 'AUD', formula: 'Average following count of audience members', trust: 'T2', description: 'Attention dilution signal.', notes: 'Flag if >2,000 (attention dilution risk).' },

  'ENG.001': { name: 'ER (Contextualised) — SNOMI PREFERRED', domain: 'ENG', formula: '(Σint / [REA.005|REA.001]) × (REA.001 / AUD.001) × 100', inputs: ['likes', 'comments', 'saves', 'shares', 'REA.001', 'AUD.001', 'REA.005 (optional)'], trust: 'T4', description: 'Contextualised ER. Integrates content quality (views) × audience penetration. SNOMI preferred.', notes: 'Use REA.005 when available, fall back to REA.001. ENG.001 ≠ ENG.002 — always specify which.', preferred: true },
  'ENG.002': { name: 'ER (Reach)', domain: 'ENG', formula: 'Σint / REA.001 × 100', inputs: ['likes', 'comments', 'saves', 'shares', 'REA.001'], trust: 'T4', description: 'Engagement rate on reach. Component metric.', notes: 'Cannot be compared cross-platform. Not interchangeable with ENG.001.' },
  'ENG.006': { name: 'Video Completion Rate', domain: 'ENG', formula: 'Complete views / REA.005 × 100', inputs: ['complete_views', 'REA.005'], trust: 'T5', description: 'Percentage of viewers who watched the full video.', notes: 'Thresholds: IG 3s, TK 2s, YT 30s, FB 3s.' },
  'ENG.007': { name: 'SER (Contextualised)', domain: 'ENG', formula: '(1·L+6·C+8·S+7·Sh) / [REA.005|REA.001] / 2 × (REA.001/AUD.001) × 100', inputs: ['likes', 'comments', 'saves', 'shares', 'REA.001', 'AUD.001', 'REA.005 (optional)'], trust: 'T4', description: 'Weighted ER contextualised. Weights: L×1, C×6, S×8, Sh×7.', notes: '÷2 normalisation calibrated per Socialinsider 2024.' },
  'ENG.008': { name: 'SER (Reach)', domain: 'ENG', formula: '(1·L+6·C+8·S+7·Sh) / REA.001 / 2 × 100', inputs: ['likes', 'comments', 'saves', 'shares', 'REA.001'], trust: 'T4', description: 'Weighted ER on reach. Weighted equivalent of ENG.002.' },

  'REA.001': { name: 'Organic Reach', domain: 'REA', formula: 'Native — unique accounts, deduplicated', trust: 'T5', description: 'Unique accounts that saw content at least once.', notes: 'Never sum across posts (not additive).' },
  'REA.002': { name: 'Total Impressions', domain: 'REA', formula: 'Native — total displays including repeats', trust: 'T5', description: 'Total displays, including repeat views.' },
  'REA.003': { name: 'Reach Rate', domain: 'REA', formula: 'REA.001 / AUD.001 × 100', inputs: ['REA.001', 'AUD.001'], trust: 'T4', description: '% of followers reached.' },
  'REA.004': { name: 'Frequency', domain: 'REA', formula: 'REA.002 / REA.001', inputs: ['REA.002', 'REA.001'], trust: 'T4', description: 'Avg times each viewer saw the content.' },
  'REA.005': { name: 'Video Views', domain: 'REA', formula: 'Native — threshold-based', trust: 'T5', description: 'Views meeting platform threshold.', notes: 'Thresholds: IG 3s, TK 2s, YT 30s, FB 3s.' },
  'REA.006': { name: 'Qualified Views', domain: 'REA', formula: 'Views ≥ 50% completion', trust: 'T5/T4', description: 'Views where viewer watched ≥50% of content.' },

  'CON.001': { name: 'Link Clicks', domain: 'CON', formula: 'Native platform value', trust: 'T5', description: 'Clicks on links in content.' },
  'CON.002': { name: 'CTR', domain: 'CON', formula: 'CON.001 / REA.002 × 100', inputs: ['CON.001', 'REA.002'], trust: 'T4', description: 'Click-through rate on impressions.' },

  'VAL.001': { name: 'EMV — Earned Media Value', domain: 'VAL', formula: 'exposure_base × ads_CPM_ref / 1000', inputs: ['exposure_base', 'ads_CPM_ref'], trust: 'T2–T4', trustRules: { native_ads_manager: 'T4', declared_3rd_party: 'T3', snomi_bench_pending: 'T2' }, description: 'Estimated advertising equivalent value of organic exposure.', notes: 'EMV ≠ Revenue. Must declare [base: ...] AND [CPM: ...]. Non-compliant without both.', required_declarations: ['base', 'cpm_ref'] },
  'VAL.002': { name: 'CPE — Cost Per Engagement', domain: 'VAL', formula: 'Budget / (L+C+S+Sh)', inputs: ['budget', 'likes', 'comments', 'saves', 'shares'], trust: 'T4', description: 'Cost per engagement action.' },
  'VAL.003': { name: 'Campaign CPM', domain: 'VAL', formula: 'Budget / REA.002 × 1000', inputs: ['budget', 'REA.002'], trust: 'T4', description: 'Actual spend per 1,000 impressions.', notes: 'VAL.003 ≠ VAL.001 ads CPM ref.' },
  'VAL.007': { name: 'Creator CPM', domain: 'VAL', formula: 'creator_fee / [REA.001|REA.002] × 1000', inputs: ['creator_fee', 'REA.001 or REA.002'], trust: 'T4', description: 'Creator fee per 1,000 exposures.', notes: 'VAL.007 ≠ VAL.008. Must declare base.' },
  'VAL.008': { name: 'Gross CPM', domain: 'VAL', formula: '(creator_fee + agency_fees) / [REA.001|REA.002] × 1000', inputs: ['creator_fee', 'agency_fees', 'REA.001 or REA.002'], trust: 'T4', description: 'Total cost per 1,000 exposures.' },

  'QUA.001': { name: 'Brief Compliance Score', domain: 'QUA', formula: 'Elements met / Total × 100', trust: 'T4', description: '% of brief requirements met.' },
  'QUA.006': { name: 'Native Partnership Label', domain: 'QUA', formula: 'Boolean (0/1)', trust: 'T5', description: 'Whether native platform partnership label was used.', notes: 'QUA.006 ≠ REG.001. Both independently required.' },

  'CRE.005': { name: 'Niche Authority Score', domain: 'CRE', formula: 'ENG.002 / median(ENG.002, vertical) × 100', inputs: ['ENG.002', 'vertical_median'], trust: 'T3', description: 'Creator ER vs vertical median.' },
  'CRE.006': { name: 'Category Partnership History', domain: 'CRE', formula: 'Count paid partnerships in category, last 12 months', trust: 'T3', description: 'Paid partnerships in same category, past 12 months.', notes: 'BETA metric. Dual read: expert OR saturated. Document source.', status: 'BETA' },

  'REG.001': { name: 'Legal Disclosure Requirement', domain: 'REG', formula: 'Country-specific — always requires [CC]', trust: 'T5', description: 'Legal paid partnership disclosure.', notes: 'REG.001 alone is invalid — must include [CC].', countryRules: { FR: '#partenariat or #publi (ARPP)', US: '#ad or #sponsored (FTC)', UK: '#ad (ASA)', DE: '#Werbung (UWG)', AU: '#ad (AANA)', BR: '#publi (CONAR)', IN: '#ad (ASCI)' } },
  'REG.003': { name: 'Native Platform Label', domain: 'REG', formula: 'Platform-specific label — Boolean', trust: 'T5', description: 'Use of native branded content/paid partnership label.', notes: 'REG.003 ≠ REG.001. Both independently required. May reduce reach 10–20%.', platformLabels: { IG: '"Paid Partnership" label', TK: '"Branded Content" toggle', YT: '"Includes paid promotion" disclosure', FB: '"Branded Content" tag' } }
};

export const DOMAINS = {
  AUD: 'Audience — Size, quality, composition',
  ENG: 'Engagement — Interaction with content',
  REA: 'Reach & Distribution — Content spread',
  CON: 'Conversion — Commercial actions',
  VAL: 'Value & ROI — Financial metrics',
  QUA: 'Content Quality — Quality, compliance, sentiment',
  CRE: 'Creator Health — Vitality, consistency, credibility',
  REG: 'Regulatory — National compliance (always requires [CC])'
};

export const TIERS = {
  NANO:  { range: '1k–10k',    reach_rate: '40–60%', description: 'High engagement, limited reach' },
  MICRO: { range: '10k–100k',  reach_rate: '20–40%', description: 'Optimal cost/efficiency' },
  MID:   { range: '100k–500k', reach_rate: '8–15%',  description: 'SNOMI standard reference' },
  MACRO: { range: '500k–1M',   reach_rate: '5–10%',  description: 'Premium reach + brand equity' },
  MEGA:  { range: '>1M',       reach_rate: '2–5%',   description: 'Celebrity premium / exclusivity' }
};

export const PLATFORMS = { IG: 'Instagram', TK: 'TikTok', YT: 'YouTube', FB: 'Facebook', TW: 'X/Twitter', LI: 'LinkedIn', PI: 'Pinterest', ALL: 'Cross-platform' };
export const INTERACTION_WEIGHTS = { like: 1, comment: 6, save: 8, share: 7, duet: 6, stitch: 6 };

export const COMPOSITE_SCORES = {
  CPI: {
    name: 'Creator Performance Index',
    scale: '0–100',
    components: [
      { name: 'Engagement Quality', weight: 0.30, metric: 'ENG.001' },
      { name: 'Audience Quality',   weight: 0.25, metric: 'AUD.003' },
      { name: 'Reach Efficiency',   weight: 0.20, metric: 'REA.003' },
      { name: 'Content Regularity', weight: 0.15, metric: 'CRE.001 + CRE.002' },
      { name: 'Niche Authority',    weight: 0.10, metric: 'CRE.005' }
    ],
    thresholds: { weak: '0–40', average: '41–60', good: '61–80', excellent: '81–100' }
  },
  CoPI: {
    name: 'Collaboration Performance Index',
    scale: '0–100',
    components: [
      { name: 'Reach Efficiency',     weight: 0.25, metric: 'REA.003 vs benchmark' },
      { name: 'Sponsored Engagement', weight: 0.25, metric: 'ENG.001 (sponsored vs organic)' },
      { name: 'Conversion',           weight: 0.25, metric: 'CON.002 + CON.003' },
      { name: 'Brief Compliance',     weight: 0.15, metric: 'QUA.001' },
      { name: 'Sentiment',            weight: 0.10, metric: 'QUA.003' }
    ]
  },
  BFS: {
    name: 'Brand Fit Score',
    scale: '0–100',
    components: [
      { name: 'Audience Match',               weight: 0.30, metric: 'AUD.004' },
      { name: 'Niche Authority',              weight: 0.25, metric: 'CRE.005' },
      { name: 'Brand Safety',                 weight: 0.20, metric: 'QUA.002' },
      { name: 'Category Partnership History', weight: 0.10, metric: 'CRE.006 [BETA]' },
      { name: 'Organic Mention Rate',         weight: 0.08, metric: 'QUA.005' },
      { name: 'Compliance History',           weight: 0.07, metric: 'CRE.004' }
    ]
  }
};
