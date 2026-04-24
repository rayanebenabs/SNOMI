import { METRICS } from '../data/metrics.js';

export function encodeTool(params) {
  const { metric_code, value, time_window_start, time_window_end, produced_date, source, inputs, base, cpm_ref } = params;

  const baseKey = metric_code.split('[')[0].split('.').slice(0, 2).join('.');
  const metricDef = METRICS[metric_code] || METRICS[baseKey];

  let codeStr = metric_code;
  if (inputs) codeStr += `[inputs:${inputs}]`;
  if (base) codeStr += `[base: ${base}]`;
  if (cpm_ref) codeStr += `[CPM: ${cpm_ref}]`;

  const timeWindow = time_window_start && time_window_end
    ? `${time_window_start}→${time_window_end}`
    : (time_window_start || time_window_end || 'not declared');

  let trust = metricDef?.trust?.split(' ')[0] || 'T?';
  if (metric_code.startsWith('VAL.001')) {
    if (cpm_ref?.includes('native')) trust = 'T4';
    else if (cpm_ref) trust = 'T3';
    else trust = 'T2';
  }

  const citation = `${codeStr} | ${value} | ${timeWindow} | ${produced_date || 'not declared'} | ${source || 'not declared'} | ${trust}`;

  const warnings = [];
  if (metricDef?.required_declarations?.includes('base') && !base) warnings.push('VAL.001 requires `[base: REA.001|REA.002|REA.005|REA.006]` declaration.');
  if (metricDef?.required_declarations?.includes('cpm_ref') && !cpm_ref) warnings.push('VAL.001 requires `[CPM: source|platform|format|market|period]` declaration.');
  if (!produced_date) warnings.push('Missing `produced` date (extraction date). Add YYYY-MM-DD.');
  if (!source) warnings.push('Missing `source` declaration.');
  if (metric_code.startsWith('REG.001') && !metric_code.match(/\.(US|UK|FR|DE|AU|BR|IN|EU)/)) warnings.push('REG.001 requires a country code [CC] e.g. REG.001.FR');

  let out = `## SNOMI Citation\n\n\`\`\`\n${citation}\n\`\`\`\n\n`;
  if (metricDef) {
    out += `**${metricDef.name}**\n`;
    out += `Formula: \`${metricDef.formula}\`\n`;
    out += `Trust: **${trust}**\n\n`;
  }
  out += `### JSON structure\n\`\`\`json\n${JSON.stringify({ code: codeStr, value, time_window: time_window_start && time_window_end ? { start: time_window_start, end: time_window_end } : null, produced: produced_date || null, source: source || null, trust }, null, 2)}\n\`\`\`\n`;
  if (warnings.length > 0) out += `\n### ⚠ Compliance warnings\n${warnings.map(w => `- ⚠ ${w}`).join('\n')}\n`;
  else out += `\n✅ Citation is complete and compliant.\n`;
  return out;
}
