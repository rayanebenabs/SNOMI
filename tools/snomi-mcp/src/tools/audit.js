import { validateTool } from './validate.js';
import { benchmarkTool } from './benchmark.js';

const NATIVE_SOURCES = ['Instagram Insights', 'TikTok Analytics', 'YouTube Studio', 'Facebook Insights', 'LinkedIn Analytics'];

export async function auditTool(params) {
  const { json_content, tier, market, vertical } = params;

  let parsed;
  try { parsed = JSON.parse(json_content); }
  catch (e) { return `# SNOMI Audit\n\n❌ **Invalid JSON** — ${e.message}\n`; }

  let out = `# SNOMI Audit Report\n\n`;
  out += `| Field | Value |\n|-------|-------|\n`;
  out += `| Resource | ${parsed.resourceType || '—'} ${parsed.profile ? `(${parsed.profile})` : ''} |\n`;
  out += `| SNOMI version | ${parsed.snomi_version || 'not declared'} |\n`;
  out += `| Metrics | ${parsed.metrics?.length || 0} citation(s) |\n`;
  out += `| Date | ${new Date().toISOString().split('T')[0]} |\n\n---\n\n`;

  // 1. Compliance
  out += `## 1. Compliance\n\n`;
  const validResult = await validateTool(json_content);
  out += validResult.replace('## SNOMI Validation\n\n', '') + '\n';

  // 2. Benchmarks
  out += `## 2. Performance Benchmarks\n\n`;
  let benchmarked = false;
  if (parsed.metrics?.length > 0) {
    for (const m of parsed.metrics) {
      if (!m.code) continue;
      const numVal = parseFloat(m.value);
      if (!isNaN(numVal) && (m.code.includes('ENG.002') && m.code.includes('IG') || m.code.includes('ENG.001') && m.code.includes('TK'))) {
        benchmarked = true;
        out += `### ${m.code}\n`;
        out += benchmarkTool({ metric_code: m.code, tier, market, vertical, value: numVal }).replace(/^## Benchmark.*\n\n/, '');
      }
    }
  }
  if (!benchmarked) {
    out += `No benchmarkable metrics (ENG.002.IG or ENG.001.TK) found in report.\n\n`;
    if (tier) out += benchmarkTool({ metric_code: 'ENG.002.IG', tier, market, vertical });
  }

  // 3. Risk flags
  out += `## 3. Risk Flags\n\n`;
  const flags = { high: [], medium: [], info: [] };

  if (parsed.metrics?.length > 0) {
    for (const m of parsed.metrics) {
      if (!m.code) continue;

      // AUD.008 attention dilution
      if (m.code.includes('AUD.008') && parseFloat(m.value) > 2000)
        flags.high.push(`AUD.008 = ${m.value} — Attention dilution (threshold >2,000 avg following count)`);

      // ENG.002 trust chain
      if (m.code.includes('ENG.002') && m.source && !NATIVE_SOURCES.some(s => m.source.includes(s)))
        flags.medium.push(`ENG.002 sourced from non-native tool "${m.source}" — trust chain downgrades to T1`);

      // Trust violations
      if (m.trust === 'T5' && m.code.startsWith('AUD.003'))
        flags.high.push(`${m.code} declared T5 — AUD.003 is always T2 (third-party tool)`);
      if (m.trust === 'T5' && m.code.startsWith('VAL.001'))
        flags.high.push(`${m.code} declared T5 — VAL.001 max trust is T4`);

      // CRE.003 saturation
      if (m.code.includes('CRE.003')) {
        const v = parseFloat(m.value);
        if (v > 40)      flags.high.push(`CRE.003 = ${m.value}% — Audience fatigue risk (threshold >40%)`);
        else if (v > 20) flags.medium.push(`CRE.003 = ${m.value}% — Monitor collaboration saturation (20–40%)`);
      }

      // CRE.006 high count
      if (m.code.includes('CRE.006') && parseFloat(m.value) > 9)
        flags.medium.push(`CRE.006 = ${m.value} partnerships — High category saturation (>9/12m). Cross-check with QUA.004`);
    }
  }

  // Sponsored without disclosure
  if (parsed.is_sponsored && parsed.resourceType === 'ContentUnit') {
    if (!parsed.metrics?.some(m => m.code?.startsWith('REG.003') || m.code?.startsWith('QUA.006')))
      flags.high.push('Sponsored content: no native platform label (REG.003/QUA.006)');
    if (!parsed.metrics?.some(m => m.code?.startsWith('REG.001')))
      flags.high.push('Sponsored content: no legal disclosure metric (REG.001.[CC])');
  }

  // Native label algorithm impact
  if (parsed.metrics?.some(m => m.code?.startsWith('REG.003.IG') || m.code?.startsWith('REG.003.TK')))
    flags.info.push('Native label (REG.003) active — document potential organic reach reduction (10–20%) in CoPI reports');

  const totalFlags = flags.high.length + flags.medium.length + flags.info.length;
  if (totalFlags === 0) {
    out += `✅ No risk flags identified.\n\n`;
  } else {
    if (flags.high.length)   out += `### 🔴 High\n${flags.high.map(f => `- ${f}`).join('\n')}\n\n`;
    if (flags.medium.length) out += `### 🟡 Medium\n${flags.medium.map(f => `- ${f}`).join('\n')}\n\n`;
    if (flags.info.length)   out += `### 🔵 Info\n${flags.info.map(f => `- ${f}`).join('\n')}\n\n`;
  }

  // Summary verdict
  out += `---\n\n## Verdict\n\n`;
  const isCompliant = validResult.includes('✅ **SNOMI COMPLIANT**');
  if (isCompliant && flags.high.length === 0) out += `✅ **PASS** — SNOMI compliant, no high-priority risk flags.\n`;
  else if (!isCompliant) out += `❌ **FAIL** — Compliance errors must be resolved before labelling SNOMI-compliant.\n`;
  else out += `⚠ **REVIEW REQUIRED** — Compliant but ${flags.high.length} high-priority flag(s) need attention.\n`;

  return out;
}
