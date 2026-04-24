import { METRICS, PLATFORMS, TIERS, DOMAINS } from '../data/metrics.js';

const PLATFORM_CODES = new Set(['IG','TK','YT','FB','TW','LI','PI','ALL']);
const COUNTRY_CODES  = new Set(['US','UK','FR','DE','AU','BR','IN','EU','GLOBAL']);

export function decodeTool(code) {
  const parts = code.toUpperCase().split('.');
  const domain = parts[0];
  const id     = parts[1];
  const baseKey = `${domain}.${id}`;

  const thirdPart = parts[2];
  const subKey = thirdPart && !PLATFORM_CODES.has(thirdPart) && !COUNTRY_CODES.has(thirdPart)
    ? `${baseKey}.${thirdPart}` : null;

  const platform = parts.find(p => PLATFORM_CODES.has(p));
  const country  = parts.find(p => COUNTRY_CODES.has(p));

  const metric = METRICS[subKey] || METRICS[baseKey];

  if (!metric) {
    return `## ${code}\n\nCode not found in SNOMI v2.1. Check the code or see the full catalog at https://github.com/rayanebenabs/SNOMI/blob/main/references/metrics.md\n\nKnown domains: ${Object.keys(DOMAINS).join(', ')}`;
  }

  let out = `## ${code}\n\n**${metric.name}**\n\n`;
  out += `| Field | Value |\n|-------|-------|\n`;
  out += `| Domain | \`${domain}\` — ${DOMAINS[domain] || domain} |\n`;
  out += `| Formula | \`${metric.formula}\` |\n`;
  out += `| Trust | **${metric.trust}** |\n`;
  if (platform) out += `| Platform | ${PLATFORMS[platform] || platform} |\n`;
  if (country)  out += `| Market | ${country} |\n`;
  if (metric.status) out += `| Status | ${metric.status} |\n`;
  out += `\n**${metric.description}**\n\n`;

  if (metric.notes) out += `**Notes & pitfalls:** ${metric.notes}\n\n`;
  if (metric.inputs) out += `**Required inputs:** ${Array.isArray(metric.inputs) ? metric.inputs.join(', ') : metric.inputs}\n\n`;
  if (metric.required_declarations) out += `**Required declarations:** ${metric.required_declarations.map(d => `\`[${d}: ...]\``).join(', ')}\n\n`;

  if (metric.trustRules) {
    out += `**Trust by CPM source:**\n`;
    for (const [src, t] of Object.entries(metric.trustRules)) out += `- ${src}: **${t}**\n`;
    out += '\n';
  }
  if (metric.countryRules) {
    out += `**Country requirements:**\n`;
    for (const [cc, rule] of Object.entries(metric.countryRules)) out += `- \`${baseKey}.${cc}\`: ${rule}\n`;
    out += '\n';
  }
  if (metric.platformLabels) {
    out += `**Native platform labels:**\n`;
    for (const [pl, label] of Object.entries(metric.platformLabels)) out += `- ${pl}: ${label}\n`;
    out += '\n';
  }
  if (metric.subcodes) {
    out += `**Subcodes:**\n`;
    for (const [sc, def] of Object.entries(metric.subcodes)) out += `- \`${sc}\`: ${def.name} — \`${def.formula}\` (${def.trust})\n`;
    out += '\n';
  }

  if (metric.status === 'BETA') out += `> ⚠ **BETA** — Document source and methodology when using in BFS.\n\n`;
  if (metric.preferred) out += `> ⭐ **SNOMI preferred metric.** ENG.001 ≠ ENG.002 — always specify which.\n\n`;

  const trustShort = metric.trust.split(' ')[0];
  out += `**Citation example:**\n\`\`\`\n${code}[inputs:L+C+S+Sh] | 5.2% | 2026-03-01→2026-03-31 | 2026-04-01 | Instagram Insights | ${trustShort}\n\`\`\`\n`;
  return out;
}
