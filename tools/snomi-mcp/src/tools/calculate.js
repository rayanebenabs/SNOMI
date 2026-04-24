export function calculateTool(p) {
  const code = p.metric_code.toUpperCase();
  const L = p.likes || 0, C = p.comments || 0, S = p.saves || 0, Sh = p.shares || 0;
  const reach = p.reach, impressions = p.impressions, views = p.views;
  const followers = p.followers, complete_views = p.complete_views;
  const budget = p.budget, agency_fees = p.agency_fees || 0;
  const ads_cpm = p.ads_cpm, ads_cpm_source = p.ads_cpm_source;

  let steps = [], result = null, trust = null, warnings = [], unit = '';

  if (code.startsWith('ENG.001')) {
    if (!reach || !followers) return err('ENG.001', 'reach (REA.001) and followers (AUD.001)', '(Σint / [REA.005|REA.001]) × (REA.001 / AUD.001) × 100');
    const totalInt = L + C + S + Sh;
    const denom = views || reach;
    const denomLabel = views ? 'REA.005 (video views)' : 'REA.001 (reach — no views provided)';
    const ratio = reach / followers;
    result = (totalInt / denom) * ratio * 100;
    trust = 'T4'; unit = '%';
    steps = [
      `**Σint** = ${L} (L) + ${C} (C) + ${S} (S) + ${Sh} (Sh) = **${totalInt}**`,
      `**÷ ${denomLabel}** = ${totalInt} / ${denom} = ${(totalInt/denom).toFixed(6)}`,
      `**× audience penetration** (REA.001/AUD.001) = × (${reach}/${followers}) = × ${ratio.toFixed(6)}`,
      `**× 100** = **${result.toFixed(2)}%**`
    ];

  } else if (code.startsWith('ENG.002')) {
    if (!reach) return err('ENG.002', 'reach (REA.001)', 'Σint / REA.001 × 100');
    const totalInt = L + C + S + Sh;
    result = (totalInt / reach) * 100;
    trust = 'T4'; unit = '%';
    steps = [
      `**Σint** = ${L} + ${C} + ${S} + ${Sh} = **${totalInt}**`,
      `**÷ REA.001 × 100** = ${totalInt} / ${reach} × 100 = **${result.toFixed(2)}%**`
    ];

  } else if (code.startsWith('ENG.007')) {
    if (!reach || !followers) return err('ENG.007', 'reach and followers', '(1·L+6·C+8·S+7·Sh) / [REA.005|REA.001] / 2 × (REA.001/AUD.001) × 100');
    const w = (1*L) + (6*C) + (8*S) + (7*Sh);
    const denom = views || reach;
    result = (w / denom / 2) * (reach / followers) * 100;
    trust = 'T4'; unit = '%';
    steps = [
      `**Weighted Σint** (L×1, C×6, S×8, Sh×7) = (1×${L}) + (6×${C}) + (8×${S}) + (7×${Sh}) = **${w}**`,
      `**÷ ${views ? 'REA.005' : 'REA.001'} ÷ 2** = ${w} / ${denom} / 2 = ${(w/denom/2).toFixed(6)}`,
      `**× audience penetration × 100** = **${result.toFixed(2)}%**`
    ];

  } else if (code.startsWith('ENG.008')) {
    if (!reach) return err('ENG.008', 'reach (REA.001)', '(1·L+6·C+8·S+7·Sh) / REA.001 / 2 × 100');
    const w = (1*L) + (6*C) + (8*S) + (7*Sh);
    result = (w / reach / 2) * 100;
    trust = 'T4'; unit = '%';
    steps = [
      `**Weighted Σint** = (1×${L}) + (6×${C}) + (8×${S}) + (7×${Sh}) = **${w}**`,
      `**÷ REA.001 ÷ 2 × 100** = ${w} / ${reach} / 2 × 100 = **${result.toFixed(2)}%**`
    ];

  } else if (code.startsWith('ENG.006')) {
    if (!complete_views || !views) return err('ENG.006', 'complete_views and views (REA.005)', 'Complete views / REA.005 × 100');
    result = (complete_views / views) * 100;
    trust = 'T5'; unit = '%';
    steps = [`${complete_views} / ${views} × 100 = **${result.toFixed(2)}%**`];

  } else if (code.startsWith('REA.003')) {
    if (!reach || !followers) return err('REA.003', 'reach and followers', 'REA.001 / AUD.001 × 100');
    result = (reach / followers) * 100;
    trust = 'T4'; unit = '%';
    steps = [`${reach} / ${followers} × 100 = **${result.toFixed(2)}%**`];

  } else if (code.startsWith('REA.004')) {
    if (!impressions || !reach) return err('REA.004', 'impressions (REA.002) and reach (REA.001)', 'REA.002 / REA.001');
    result = impressions / reach;
    trust = 'T4'; unit = '(frequency)';
    steps = [`${impressions} / ${reach} = **${result.toFixed(2)}**`];

  } else if (code.startsWith('VAL.001')) {
    const base = views || reach || impressions;
    const baseLabel = views ? 'REA.005' : reach ? 'REA.001' : 'REA.002';
    if (!base || !ads_cpm) return err('VAL.001', 'exposure base (reach/views/impressions) and ads_cpm', 'exposure_base × ads_CPM_ref / 1000');
    result = base * ads_cpm / 1000;
    trust = ads_cpm_source === 'native' ? 'T4' : ads_cpm_source === 'declared' ? 'T3' : 'T2';
    unit = '(currency)';
    steps = [
      `**Base** = ${base.toLocaleString()} (${baseLabel})`,
      `**× ads CPM ref** = × ${ads_cpm}`,
      `**÷ 1000** = **${result.toFixed(2)}**`,
      `CPM source: ${ads_cpm_source || 'not declared'} → Trust: **${trust}**`
    ];
    if (!ads_cpm_source) warnings.push('Declare ads_cpm_source for correct trust: "native" (T4), "declared" (T3), or "bench_pending" (T2)');

  } else if (code.startsWith('VAL.002')) {
    const totalInt = L + C + S + Sh;
    if (!budget || !totalInt) return err('VAL.002', 'budget and interaction counts', 'Budget / (L+C+S+Sh)');
    result = budget / totalInt;
    trust = 'T4'; unit = '(currency per engagement)';
    steps = [`${budget} / ${totalInt} = **${result.toFixed(2)}**`];

  } else if (code.startsWith('VAL.003')) {
    if (!budget || !impressions) return err('VAL.003', 'budget and impressions (REA.002)', 'Budget / REA.002 × 1000');
    result = (budget / impressions) * 1000;
    trust = 'T4'; unit = '(CPM)';
    steps = [`${budget} / ${impressions} × 1000 = **${result.toFixed(2)}**`];

  } else if (code.startsWith('VAL.007')) {
    const base = reach || impressions;
    if (!budget || !base) return err('VAL.007', 'creator_fee (budget) and reach or impressions', 'creator_fee / [REA.001|REA.002] × 1000');
    result = (budget / base) * 1000;
    trust = 'T4'; unit = '(CPM)';
    steps = [`${budget} / ${base} × 1000 = **${result.toFixed(2)}**`];

  } else if (code.startsWith('VAL.008')) {
    const base = reach || impressions;
    if (!budget || !base) return err('VAL.008', 'creator_fee, agency_fees and reach or impressions', '(creator_fee + agency_fees) / [REA.001|REA.002] × 1000');
    result = ((budget + agency_fees) / base) * 1000;
    trust = 'T4'; unit = '(CPM)';
    steps = [
      `**Total fees** = ${budget} + ${agency_fees} = ${budget + agency_fees}`,
      `/ ${base} × 1000 = **${result.toFixed(2)}**`
    ];

  } else if (code.startsWith('CON.002')) {
    if (!L || !impressions) return `## Calculate CON.002 (CTR)\n\n❌ Pass link clicks via \`likes\` field and impressions via \`impressions\`.\n`;
    result = (L / impressions) * 100;
    trust = 'T4'; unit = '%';
    steps = [`${L} clicks / ${impressions} impressions × 100 = **${result.toFixed(2)}%**`];

  } else {
    return `## Calculate ${code}\n\n❌ Not yet supported. Supported: ENG.001, ENG.002, ENG.007, ENG.008, ENG.006, REA.003, REA.004, VAL.001–003, VAL.007–008, CON.002\n`;
  }

  const inputLines = [
    L && `Likes: ${L}`, C && `Comments: ${C}`, S && `Saves: ${S}`, Sh && `Shares: ${Sh}`,
    reach && `Reach (REA.001): ${reach.toLocaleString()}`,
    impressions && `Impressions (REA.002): ${impressions.toLocaleString()}`,
    views && `Views (REA.005): ${views.toLocaleString()}`,
    followers && `Followers (AUD.001): ${followers.toLocaleString()}`,
    complete_views && `Complete views: ${complete_views.toLocaleString()}`,
    budget && `Budget/Fee: ${budget}`,
    agency_fees && `Agency fees: ${agency_fees}`,
    ads_cpm && `Ads CPM ref: ${ads_cpm}`
  ].filter(Boolean);

  let out = `## Calculate ${code}\n\n`;
  out += `### Inputs\n${inputLines.map(i => `- ${i}`).join('\n')}\n\n`;
  out += `### Steps\n${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n`;
  out += `### Result\n\n**${code} = ${result.toFixed(2)} ${unit}**\n**Trust: ${trust}**\n\n`;
  out += `*Trust propagation: T_result = max(T1, min(T_inputs) − Δ=1) = ${trust}*\n`;
  if (warnings.length > 0) out += `\n### ⚠ Warnings\n${warnings.map(w => `- ${w}`).join('\n')}\n`;
  return out;
}

function err(code, required, formula) {
  return `## Calculate ${code}\n\n❌ Missing required inputs: **${required}**\n\nFormula: \`${formula}\`\n`;
}
