export const BENCHMARKS = {
  'ENG.002.IG': {
    metric: 'ENG.002', platform: 'IG',
    description: 'Engagement Rate on Reach — Instagram',
    source: 'HypeAuditor / Socialinsider 2024–2025',
    byVertical: {
      fashion:        { global: 3.1, EMEA: 3.0, NA: 2.9, APAC: 3.4, LATAM: 3.6 },
      food:           { global: 4.0, EMEA: 3.8, NA: 3.7, APAC: 4.5, LATAM: 4.2 },
      sports:         { global: 4.7, EMEA: 4.5, NA: 5.1, APAC: 4.3, LATAM: 4.8 },
      tech:           { global: 2.8, EMEA: 2.7, NA: 3.0, APAC: 2.9, LATAM: 2.5 },
      travel:         { global: 3.4, EMEA: 3.3, NA: 3.2, APAC: 3.7, LATAM: 3.5 },
      education:      { global: 3.8, EMEA: 3.6, NA: 4.0, APAC: 3.9, LATAM: 3.5 },
      parenting:      { global: 5.1, EMEA: 4.9, NA: 5.3, APAC: 4.8, LATAM: 5.2 },
      sustainability: { global: 4.5, EMEA: 4.7, NA: 4.3, APAC: 4.2, LATAM: 4.4 },
      beauty:         { global: 3.6, EMEA: 3.5, NA: 3.8, APAC: 3.9, LATAM: 3.7 },
      lifestyle:      { global: 3.3, EMEA: 3.2, NA: 3.1, APAC: 3.5, LATAM: 3.4 }
    },
    byTier: {
      NANO:  { min: 3.0, avg: 4.5, max: 6.0 },
      MICRO: { min: 2.5, avg: 3.5, max: 5.0 },
      MID:   { min: 2.0, avg: 3.0, max: 4.5 },
      MACRO: { min: 1.0, avg: 2.0, max: 3.5 },
      MEGA:  { min: 0.8, avg: 1.5, max: 2.5 }
    },
    thresholds: { excellent: '>5%', good: '3–5%', average: '1.5–3%', weak: '<1.5%' }
  },

  'ENG.001.TK': {
    metric: 'ENG.001', platform: 'TK',
    description: 'Engagement Rate (Contextualised) — TikTok',
    source: 'HypeAuditor 2024–2025',
    byVertical: {
      comedy:      { global: 11.1, EMEA: 10.5, NA: 12.0, APAC: 10.8, LATAM: 11.5 },
      educational: { global: 9.5,  EMEA: 9.0,  NA: 10.2, APAC: 9.8,  LATAM: 9.0  },
      sports:      { global: 8.9,  EMEA: 8.5,  NA: 9.5,  APAC: 8.7,  LATAM: 9.1  },
      beauty:      { global: 7.8,  EMEA: 7.5,  NA: 8.2,  APAC: 8.0,  LATAM: 7.6  },
      fashion:     { global: 6.9,  EMEA: 6.7,  NA: 7.2,  APAC: 7.1,  LATAM: 6.8  },
      food:        { global: 8.2,  EMEA: 7.9,  NA: 8.5,  APAC: 8.4,  LATAM: 8.0  },
      tech:        { global: 6.1,  EMEA: 5.9,  NA: 6.5,  APAC: 6.3,  LATAM: 5.8  }
    },
    byTier: {
      NANO:  { min: 8.0,  avg: 12.0, max: 18.0 },
      MICRO: { min: 6.0,  avg: 9.0,  max: 14.0 },
      MID:   { min: 4.0,  avg: 7.0,  max: 11.0 },
      MACRO: { min: 2.5,  avg: 5.0,  max: 8.0  },
      MEGA:  { min: 1.5,  avg: 3.5,  max: 6.0  }
    }
  },

  'VAL.003': {
    metric: 'VAL.003',
    description: 'Campaign CPM reference by market and platform',
    source: 'IAB / Meta Ads Manager benchmarks 2025',
    byMarket: {
      US: { IG: 6.70, TK: 9.40, YT: 7.80, FB: 5.20, currency: 'USD' },
      UK: { IG: 5.20, TK: 7.10, YT: 6.40, FB: 4.10, currency: 'GBP' },
      FR: { IG: 4.80, TK: 6.50, YT: 5.90, FB: 3.70, currency: 'EUR' },
      DE: { IG: 5.40, TK: 7.20, YT: 6.60, FB: 4.20, currency: 'EUR' },
      AU: { IG: 7.20, TK: 9.80, YT: 8.20, FB: 5.50, currency: 'AUD' },
      BR: { IG: 3.20, TK: 4.50, YT: 3.80, FB: 2.60, currency: 'BRL' },
      IN: { IG: 210,  TK: 280,  YT: 240,  FB: 170,  currency: 'INR' }
    },
    tierMultipliers: {
      NANO:  { min: 0.5, max: 0.7 },
      MICRO: { min: 0.8, max: 1.0 },
      MID:   { min: 1.0, max: 1.0 },
      MACRO: { min: 1.3, max: 1.7 },
      MEGA:  { min: 1.8, max: 3.0 }
    },
    productionMultipliers: {
      C1: { min: 0.6, max: 0.8, label: 'UGC / light production' },
      C2: { min: 1.0, max: 1.0, label: 'Standard production' },
      C3: { min: 1.8, max: 3.0, label: 'Heavy / professional shoot' }
    }
  },

  'CRE.003': {
    metric: 'CRE.003',
    description: 'Collaboration Rate — sponsorship saturation thresholds',
    thresholds: { healthy: '<20%', monitor: '20–40%', risk: '>40%' },
    notes: '% of content that is sponsored. High rate = audience fatigue risk.'
  }
};
