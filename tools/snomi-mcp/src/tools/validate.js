const NATIVE_SOURCES = ['Instagram Insights', 'TikTok Analytics', 'YouTube Studio', 'Facebook Insights', 'LinkedIn Analytics', 'Twitter Analytics', 'Pinterest Analytics'];
const VALID_PLATFORMS = new Set(['IG','TK','YT','FB','TW','LI','PI','SC','BE','TH']);
const PLATFORM_PROFILES = {
  IG: ['ig-reel','ig-story','ig-post','ig-video'],
  TK: ['tk-video','tk-story'],
  YT: ['yt-short','yt-video'],
  FB: ['fb-reel','fb-post'],
  LI: ['li-post'],
  TW: ['tw-post'],
  PI: ['pin-pin']
};

export async function validateTool(jsonContent) {
  let parsed;
  try { parsed = JSON.parse(jsonContent); }
  catch (e) { return `## SNOMI Validation\n\n❌ **Invalid JSON** — ${e.message}\n`; }

  const errors = [], warnings = [];

  // Required base fields
  if (!parsed.resourceType) errors.push('Missing required field: `resourceType`');
  if (!parsed.snomi_version) warnings.push('Missing `snomi_version` field (expected: "2.1")');
  if (!parsed.id) warnings.push('Missing `id` field');
  if (!parsed.status) warnings.push('Missing `status` field');

  // ContentUnit-specific rules
  if (parsed.resourceType === 'ContentUnit') {
    if (!parsed.platform) errors.push('ContentUnit requires `platform` field');
    if (!parsed.profile)  errors.push('ContentUnit requires `profile` field');
    if (parsed.platform && !VALID_PLATFORMS.has(parsed.platform)) errors.push(`Unknown platform: "${parsed.platform}". Valid: ${[...VALID_PLATFORMS].join(', ')}`);
    if (parsed.platform && parsed.profile && PLATFORM_PROFILES[parsed.platform]) {
      if (!PLATFORM_PROFILES[parsed.platform].includes(parsed.profile)) {
        errors.push(`Profile "${parsed.profile}" is not valid for platform "${parsed.platform}". Valid: ${PLATFORM_PROFILES[parsed.platform].join(', ')}`);
      }
    }
    if (parsed.is_sponsored) {
      const hasNativeLabel  = parsed.metrics?.some(m => m.code?.startsWith('REG.003') || m.code?.startsWith('QUA.006'));
      const hasLegalDiscl   = parsed.metrics?.some(m => m.code?.startsWith('REG.001'));
      if (!hasNativeLabel)  errors.push('Sponsored content: missing native platform label (REG.003 or QUA.006)');
      if (!hasLegalDiscl)   errors.push('Sponsored content: missing legal disclosure (REG.001.[CC])');
    }
  }

  // Metric citations
  if (parsed.metrics && Array.isArray(parsed.metrics)) {
    parsed.metrics.forEach((m, i) => {
      const ref = `Metric[${i}] \`${m.code || 'no code'}\``;
      if (!m.code)   errors.push(`${ref}: missing \`code\``);
      if (m.value === undefined || m.value === null) errors.push(`${ref}: missing \`value\``);
      if (!m.source)   warnings.push(`${ref}: missing \`source\``);
      if (!m.produced) warnings.push(`${ref}: missing \`produced\` date (YYYY-MM-DD)`);
      if (!m.trust)    warnings.push(`${ref}: missing \`trust\` score`);
      if (!m.time_window) warnings.push(`${ref}: missing \`time_window\``);

      // VAL.001 declarations
      if (m.code?.startsWith('VAL.001')) {
        const hasBase = m.code.includes('[base:') || m.base;
        const hasCPM  = m.code.includes('[CPM:')  || m.cpm_ref;
        if (!hasBase) errors.push(`${ref}: VAL.001 requires \`[base: REA.001|REA.002|REA.005|REA.006]\` declaration`);
        if (!hasCPM)  errors.push(`${ref}: VAL.001 requires \`[CPM: source]\` declaration`);
        if (m.trust === 'T5') errors.push(`${ref}: VAL.001 cannot be T5. Max trust is T4 (native CPM)`);
      }

      // REG.001 country code
      if (m.code?.startsWith('REG.001') && !m.code.match(/\.(US|UK|FR|DE|AU|BR|IN|EU)/)) {
        errors.push(`${ref}: REG.001 requires country code [CC]. Use REG.001.FR, REG.001.US, etc.`);
      }

      // AUD.003 trust
      if (m.code?.startsWith('AUD.003') && m.trust === 'T5') {
        errors.push(`${ref}: AUD.003 cannot be T5. Third-party audience tools are always T2`);
      }

      // ENG.002 from non-native source
      if (m.code?.startsWith('ENG.002') && m.source && !NATIVE_SOURCES.some(s => m.source.includes(s))) {
        warnings.push(`${ref}: ENG.002 from non-native source ("${m.source}") — trust chain downgrades to T1`);
      }
    });
  }

  const compliant = errors.length === 0;
  let out = `## SNOMI Validation\n\n`;
  out += compliant ? `✅ **SNOMI COMPLIANT**\n\n` : `❌ **NOT COMPLIANT**\n\n`;
  if (parsed.resourceType) out += `**Resource type:** ${parsed.resourceType}\n`;
  if (parsed.profile) out += `**Profile:** ${parsed.profile}\n`;
  if (parsed.snomi_version) out += `**SNOMI version:** ${parsed.snomi_version}\n`;
  out += `\n**Summary:** ${errors.length} error(s), ${warnings.length} warning(s)\n`;
  if (errors.length   > 0) out += `\n### Errors\n${errors.map(e => `- ❌ ${e}`).join('\n')}\n`;
  if (warnings.length > 0) out += `\n### Warnings\n${warnings.map(w => `- ⚠ ${w}`).join('\n')}\n`;
  if (compliant && warnings.length === 0) out += `\n✅ This report can be labelled **"SNOMI v2.1 compliant"**.\n`;
  return out;
}
