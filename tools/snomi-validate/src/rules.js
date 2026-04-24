'use strict';

/**
 * SNOMI Business Rules v2.1
 *
 * Rules that cannot be expressed in JSON Schema alone.
 * Each rule returns an array of Issue objects: { level, rule, path, message, fix }
 * level: 'error' | 'warning' | 'info'
 */

// ─── Profile → Platform mapping ───────────────────────────────────────────────
const PROFILE_PLATFORM = {
  'ig-reel':  'IG', 'ig-story': 'IG', 'ig-post':  'IG', 'ig-video': 'IG',
  'tk-video': 'TK', 'tk-story': 'TK',
  'yt-short': 'YT', 'yt-video': 'YT',
  'fb-reel':  'FB', 'fb-post':  'FB',
  'li-post':  'LI',
  'tw-post':  'TW',
  'pin-pin':  'PI',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function issue(level, rule, path, message, fix) {
  return { level, rule, path: path || 'root', message, fix: fix || null };
}

function parseMetricCode(code) {
  // Strip inline declarations like [base: REA.001] or [CPM: native|IG|Reel|FR|2026-Q1]
  const clean = code.replace(/\[.*?\]/g, '').trim();
  const parts  = clean.split('.');
  return {
    domain:   parts[0],
    id:       parts[1],
    subcode:  parts[2],  // platform or subtype (e.g. FAKE, AGE, IG)
    country:  parts[3],  // country code if present
    raw:      code,
  };
}

function hasInlineDeclaration(code, key) {
  const re = new RegExp(`\\[${key}[:\\s]`, 'i');
  return re.test(code);
}

// ─── Rule: Platform matches profile ──────────────────────────────────────────
function ruleProfilePlatformMatch(resource) {
  if (resource.resourceType !== 'ContentUnit') return [];
  const expected = PROFILE_PLATFORM[resource.profile];
  if (!expected) return [];
  if (resource.platform !== expected) {
    return [issue('error', 'profile-platform-match',
      'platform',
      `Profile "${resource.profile}" requires platform "${expected}" but got "${resource.platform}"`,
      `Set platform to "${expected}" or use a different profile`)];
  }
  return [];
}

// ─── Rule: Sponsored content must have disclosure ─────────────────────────────
function ruleSponsoredDisclosure(resource) {
  if (resource.resourceType !== 'ContentUnit') return [];
  if (!resource.is_sponsored) return [];
  const hasNative = resource.native_label_used === true;
  const hasTags   = Array.isArray(resource.disclosure_tags) && resource.disclosure_tags.length > 0;
  if (!hasNative && !hasTags) {
    return [issue('warning', 'sponsored-disclosure',
      'disclosure',
      'Sponsored content (is_sponsored: true) has neither native_label_used nor disclosure_tags',
      'Add native_label_used: true and/or disclosure_tags (e.g. ["#ad", "#partenariat"])')];
  }
  return [];
}

// ─── Rule: MetricCitation produced date required ──────────────────────────────
function ruleMetricProduced(metrics, basePath) {
  if (!Array.isArray(metrics)) return [];
  return metrics.flatMap((m, i) => {
    if (!m.produced) {
      return [issue('error', 'metric-produced-required',
        `${basePath}[${i}]`,
        `MetricCitation "${m.code}" is missing "produced" date`,
        'Add produced: "YYYY-MM-DD" (date data was extracted, not time window end)')];
    }
    return [];
  });
}

// ─── Rule: REG.001 and REG.002 must have country suffix ───────────────────────
function ruleRegNeedsCountry(metrics, basePath) {
  if (!Array.isArray(metrics)) return [];
  return metrics.flatMap((m, i) => {
    const issues = [];
    const parsed = parseMetricCode(m.code);
    if (parsed.domain !== 'REG') return [];

    const id = parsed.id;

    // REG.003 uses PLATFORM suffix — exempt from country check
    if (id === '003') {
      if (!parsed.subcode || !['IG','TK','YT','FB','TW','LI','PI'].includes(parsed.subcode)) {
        issues.push(issue('error', 'reg003-needs-platform',
          `${basePath}[${i}].code`,
          `REG.003 must have a platform suffix (e.g. REG.003.IG), got "${m.code}"`,
          'Add platform suffix: REG.003.IG | REG.003.TK | REG.003.YT | REG.003.FB'));
      }
      return issues;
    }

    // REG.001 and REG.002 must have country code
    const cc = parsed.country || parsed.subcode;
    const isCountryCode = cc && /^[A-Z]{2}$/.test(cc) && !['IG','TK','YT','FB','TW','LI'].includes(cc);
    if (!isCountryCode) {
      issues.push(issue('error', 'reg-needs-country',
        `${basePath}[${i}].code`,
        `REG.${id} requires a country code suffix (e.g. REG.001.FR), got "${m.code}"`,
        'Add country code: REG.001.FR | REG.001.US | REG.001.UK | etc.'));
    }
    return issues;
  });
}

// ─── Rule: VAL.001 (EMV) must declare base metric and CPM source ──────────────
function ruleVal001Declaration(metrics, basePath) {
  if (!Array.isArray(metrics)) return [];
  return metrics.flatMap((m, i) => {
    const parsed = parseMetricCode(m.code);
    if (parsed.domain !== 'VAL' || parsed.id !== '001') return [];
    const issues = [];

    if (!hasInlineDeclaration(m.code, 'base')) {
      issues.push(issue('error', 'val001-needs-base',
        `${basePath}[${i}].code`,
        `VAL.001 (EMV) must declare the exposure base, got "${m.code}"`,
        'Add [base: REA.001] or [base: REA.002] — e.g. VAL.001[base: REA.001].IG.FR'));
    }

    if (!hasInlineDeclaration(m.code, 'CPM')) {
      issues.push(issue('error', 'val001-needs-cpm-source',
        `${basePath}[${i}].code`,
        `VAL.001 (EMV) must declare the CPM source, got "${m.code}"`,
        'Add [CPM: native|IG|Reel|FR|2026-Q1] or [CPM: 4.20|EUR|IG|Reel|FR|2026|source] or [CPM: SNOMI-bench-pending|IG|Reel|2025]'));
    }

    return issues;
  });
}

// ─── Rule: T1/T2 metrics should have a methodological note ───────────────────
function ruleLowTrustNote(metrics, basePath) {
  if (!Array.isArray(metrics)) return [];
  return metrics.flatMap((m, i) => {
    if (['T1','T2'].includes(m.trust) && !m.note) {
      return [issue('warning', 'low-trust-needs-note',
        `${basePath}[${i}]`,
        `MetricCitation "${m.code}" has trust ${m.trust} but no methodology note`,
        'Add note: explain tool name/version or estimation methodology')];
    }
    return [];
  });
}

// ─── Rule: Bare "CPM" without type qualifier is ambiguous ─────────────────────
function ruleCpmAmbiguity(metrics, basePath) {
  if (!Array.isArray(metrics)) return [];
  return metrics.flatMap((m, i) => {
    const parsed = parseMetricCode(m.code);
    // If code is just VAL.003 with no [type] declaration and note contains "CPM" loosely
    if (parsed.domain === 'VAL' && (m.note || '').toLowerCase().includes('cpm') === false) return [];
    // Flag: if a metric value contains "CPM" in the note without type qualification
    if (m.note && /\bCPM\b/.test(m.note) && !/VAL\.003|VAL\.007|VAL\.008|ads CPM ref/i.test(m.note)) {
      return [issue('warning', 'cpm-type-ambiguous',
        `${basePath}[${i}].note`,
        `"CPM" cited in note without specifying type for "${m.code}"`,
        'Specify: ads CPM ref (input to VAL.001) · campaign CPM (VAL.003) · creator CPM (VAL.007) · gross CPM (VAL.008)')];
    }
    return [];
  });
}

// ─── Rule: ENG.001 vs ENG.002 — must specify which ───────────────────────────
function ruleEngAmbiguity(metrics, basePath) {
  if (!Array.isArray(metrics)) return [];
  return metrics.flatMap((m, i) => {
    const parsed = parseMetricCode(m.code);
    if (parsed.domain !== 'ENG') return [];
    const id = parsed.id;
    if (!['001','002'].includes(id)) return [];
    // Check if note or code clarifies the formula used
    if (!m.note || !(/contextualised|reach|followers|REA\.001|AUD\.001/i.test(m.note))) {
      return [issue('info', 'eng-formula-unspecified',
        `${basePath}[${i}]`,
        `ENG.${id} — recommend noting which formula was used (contextualised vs reach-only)`,
        'ENG.001 = contextualised (preferred). ENG.002 = reach-only. Add a note or ensure code is unambiguous.')];
    }
    return [];
  });
}

// ─── Rule: REA.001 / REA.002 / REA.005 base declaration in derived metrics ───
function ruleReachBaseDeclaration(metrics, basePath) {
  if (!Array.isArray(metrics)) return [];
  return metrics.flatMap((m, i) => {
    const parsed = parseMetricCode(m.code);
    // CON.002 (CTR) must declare base
    if (parsed.domain === 'CON' && parsed.id === '002') {
      if (!hasInlineDeclaration(m.code, 'base')) {
        return [issue('warning', 'con002-needs-base',
          `${basePath}[${i}].code`,
          `CON.002 (CTR) should declare its denominator base, got "${m.code}"`,
          'Add [base: REA.002] or [base: REA.001] — the two produce results differing by frequency (REA.004)')];
      }
    }
    return [];
  });
}

// ─── Rule: Handle.followers must use AUD.001.[PLATFORM] ───────────────────────
function ruleHandleFollowersCode(handles) {
  if (!Array.isArray(handles)) return [];
  return handles.flatMap((h, i) => {
    if (!h.followers) return [];
    if (!h.followers.code || !h.followers.code.startsWith('AUD.001.')) {
      return [issue('error', 'handle-followers-code',
        `handles[${i}].followers.code`,
        `Handle followers must use AUD.001.[PLATFORM], got "${h.followers.code}"`,
        `Use AUD.001.${h.platform}`)];
    }
    const expectedCode = `AUD.001.${h.platform}`;
    if (!h.followers.code.startsWith(expectedCode)) {
      return [issue('warning', 'handle-followers-platform-mismatch',
        `handles[${i}].followers.code`,
        `Handle platform is "${h.platform}" but followers code is "${h.followers.code}"`,
        `Change code to start with AUD.001.${h.platform}`)];
    }
    return [];
  });
}

// ─── Rule: Handle platforms must be unique per Actor ─────────────────────────
function ruleHandleUniquePlatforms(handles) {
  if (!Array.isArray(handles)) return [];
  const seen = {};
  return handles.flatMap((h, i) => {
    if (seen[h.platform]) {
      return [issue('error', 'duplicate-handle-platform',
        `handles[${i}]`,
        `Duplicate handle for platform "${h.platform}" — only one Handle per platform allowed`,
        'Merge duplicate handles or remove the redundant entry')];
    }
    seen[h.platform] = true;
    return [];
  });
}

// ─── Rule: Campaign aggregate metrics — REA.001 should not be summed ─────────
function ruleCampaignReachAggregation(campaign) {
  if (campaign.resourceType !== 'Campaign') return [];
  if (!Array.isArray(campaign.aggregate_metrics)) return [];
  return campaign.aggregate_metrics.flatMap((m, i) => {
    const parsed = parseMetricCode(m.code);
    if (parsed.domain === 'REA' && parsed.id === '001') {
      if (!m.note || !/unique|methodology|dedup/i.test(m.note)) {
        return [issue('warning', 'campaign-reach-not-summed',
          `aggregate_metrics[${i}]`,
          'REA.001 (Reach) in a Campaign should not be summed across ContentUnits — it measures unique accounts',
          'Add a note explaining the deduplication methodology or use estimated unique reach')];
      }
    }
    return [];
  });
}

// ─── Main export ──────────────────────────────────────────────────────────────
function runRules(resource) {
  const issues = [];
  const metrics = resource.metrics || resource.aggregate_metrics || [];
  const metricsPath = resource.metrics ? 'metrics' : 'aggregate_metrics';

  issues.push(...ruleProfilePlatformMatch(resource));
  issues.push(...ruleSponsoredDisclosure(resource));
  issues.push(...ruleMetricProduced(resource.metrics, 'metrics'));
  issues.push(...ruleMetricProduced(resource.aggregate_metrics, 'aggregate_metrics'));
  issues.push(...ruleMetricProduced(resource.kpis, 'kpis'));
  issues.push(...ruleRegNeedsCountry(resource.metrics, 'metrics'));
  issues.push(...ruleRegNeedsCountry(resource.aggregate_metrics, 'aggregate_metrics'));
  issues.push(...ruleVal001Declaration(resource.metrics, 'metrics'));
  issues.push(...ruleVal001Declaration(resource.aggregate_metrics, 'aggregate_metrics'));
  issues.push(...ruleLowTrustNote(resource.metrics, 'metrics'));
  issues.push(...ruleLowTrustNote(resource.aggregate_metrics, 'aggregate_metrics'));
  issues.push(...ruleCpmAmbiguity(resource.metrics, 'metrics'));
  issues.push(...ruleEngAmbiguity(resource.metrics, 'metrics'));
  issues.push(...ruleReachBaseDeclaration(resource.metrics, 'metrics'));
  issues.push(...ruleHandleFollowersCode(resource.handles));
  issues.push(...ruleHandleUniquePlatforms(resource.handles));
  issues.push(...ruleCampaignReachAggregation(resource));

  return issues;
}

module.exports = { runRules };
