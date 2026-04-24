import { BENCHMARKS } from '../data/benchmarks.js';
import { TIERS } from '../data/metrics.js';

export function benchmarkTool(params) {
  const { metric_code, tier, market, vertical, value } = params;
  const code = metric_code.toUpperCase();

  let bk = null;
  if (code.includes('ENG.002') && code.includes('IG')) bk = BENCHMARKS['ENG.002.IG'];
  else if (code.includes('ENG.001') && code.includes('TK')) bk = BENCHMARKS['ENG.001.TK'];
  else if (code.includes('VAL.003')) bk = BENCHMARKS['VAL.003'];
  else if (code.includes('CRE.003')) bk = BENCHMARKS['CRE.003'];
  else if (code.includes('ENG.002')) bk = BENCHMARKS['ENG.002.IG'];
  else if (code.includes('ENG.001')) bk = BENCHMARKS['ENG.001.TK'];

  if (!bk) {
    return `## Benchmark — ${metric_code}\n\nNo benchmark available for this code in SNOMI v2.1.\n\nAvailable: \`ENG.002.IG\`, \`ENG.001.TK\`, \`VAL.003\`, \`CRE.003\`\n`;
  }

  let out = `## Benchmark — ${metric_code}\n\n**${bk.description}**\n*Source: ${bk.source}*\n\n`;

  // Tier section
  if (tier && bk.byTier?.[tier]) {
    const t = bk.byTier[tier];
    out += `### Tier: ${tier} (${TIERS[tier]?.range})\n`;
    out += `| | Value |\n|---|---|\n| Min | ${t.min}% |\n| Avg | ${t.avg}% |\n| Max | ${t.max}% |\n\n`;
    if (value !== undefined) {
      const status = value >= t.avg ? '✅ Above average' : value >= t.min ? '⚠ Below average' : '❌ Below minimum';
      out += `**Your value (${value}%):** ${status} for ${tier} tier\n\n`;
    }
  }

  // Vertical section
  if (vertical && bk.byVertical) {
    const vData = bk.byVertical[vertical.toLowerCase()];
    if (vData) {
      out += `### Vertical: ${vertical}\n`;
      out += `| Market | Value |\n|--------|-------|\n`;
      for (const [k, v] of Object.entries(vData)) out += `| ${k} | ${v}% |\n`;
      out += '\n';
      if (value !== undefined) {
        const diff = ((value - vData.global) / vData.global * 100).toFixed(1);
        out += `**Your value (${value}%) vs global (${vData.global}%):** ${diff > 0 ? '+' : ''}${diff}%\n\n`;
      }
    } else {
      out += `⚠ No data for vertical "${vertical}". Available: ${Object.keys(bk.byVertical).join(', ')}\n\n`;
    }
  }

  // Market CPM section
  if (bk.byMarket) {
    const platform = ['IG','TK','YT','FB'].find(p => code.includes(p)) || 'IG';
    if (market) {
      const mkt = bk.byMarket[market.toUpperCase()];
      if (mkt) {
        out += `### Market: ${market.toUpperCase()}\n`;
        out += `| Platform | CPM (${mkt.currency}) |\n|----------|------|\n`;
        for (const pl of ['IG','TK','YT','FB']) if (mkt[pl]) out += `| ${pl} | ${mkt[pl]} |\n`;
        out += '\n';
        if (bk.tierMultipliers) {
          out += `**Tier multipliers:** `;
          out += Object.entries(bk.tierMultipliers).map(([t, v]) => `${t} ×${v.min}–${v.max}`).join(' · ');
          out += '\n\n';
        }
      }
    } else {
      out += `### CPM reference by market (${platform})\n`;
      out += `| Market | CPM | Currency |\n|--------|-----|----------|\n`;
      for (const [mkt, d] of Object.entries(bk.byMarket)) out += `| ${mkt} | ${d[platform] || '—'} | ${d.currency} |\n`;
      out += '\n';
    }
  }

  // Full tier table (when no specific tier requested)
  if (!tier && bk.byTier) {
    out += `### All tiers\n| Tier | Followers | Min | Avg | Max |\n|------|-----------|-----|-----|-----|\n`;
    for (const [t, d] of Object.entries(bk.byTier)) out += `| ${t} | ${TIERS[t]?.range} | ${d.min}% | ${d.avg}% | ${d.max}% |\n`;
    out += '\n';
    if (value !== undefined) {
      out += `**Your value (${value}%)** — tier breakdown:\n`;
      for (const [t, d] of Object.entries(bk.byTier)) {
        const status = value >= d.avg ? '✅' : value >= d.min ? '⚠' : '❌';
        out += `- ${t}: ${status}\n`;
      }
      out += '\n';
    }
  }

  // Full vertical table (when no specific vertical requested)
  if (!vertical && bk.byVertical) {
    out += `### All verticals (global)\n| Vertical | Global avg |\n|----------|------------|\n`;
    for (const [v, d] of Object.entries(bk.byVertical)) out += `| ${v} | ${d.global}% |\n`;
    out += '\n';
  }

  if (bk.thresholds) {
    out += `### Performance thresholds\n`;
    for (const [level, range] of Object.entries(bk.thresholds)) out += `- **${level}:** ${range}\n`;
    out += '\n';
  }

  out += `*Trust: T2 — benchmarks are third-party estimated*\n`;
  return out;
}
