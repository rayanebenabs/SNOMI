'use strict';

const ICONS = { error: '❌', warning: '⚠️ ', info: 'ℹ️ ' };
const LABELS = { error: 'FAIL', warning: 'WARN', info: 'INFO' };

function formatText(result, filePath) {
  const lines = [];
  const w = 60;
  const hr = '─'.repeat(w);

  lines.push('');
  lines.push(`SNOMI v2.1 — Compliance Report`);
  lines.push(hr);
  if (filePath) lines.push(`File     : ${filePath}`);
  lines.push(`Resource : ${result.resourceType || '?'} (${result.profile || '?'})`);
  lines.push(hr);

  if (result.schemaErrors.length === 0) {
    lines.push('✅ PASS  Schema validation');
  } else {
    result.schemaErrors.forEach(e => {
      lines.push(`❌ FAIL  [schema] ${e.path || e.instancePath || ''} — ${e.message}`);
    });
  }

  if (result.ruleIssues.length === 0) {
    lines.push('✅ PASS  All SNOMI business rules');
  } else {
    result.ruleIssues.forEach(issue => {
      const icon  = ICONS[issue.level] || '•';
      const label = LABELS[issue.level] || issue.level.toUpperCase();
      lines.push(`${icon} ${label}  [${issue.rule}] ${issue.path} — ${issue.message}`);
      if (issue.fix) {
        lines.push(`         Fix: ${issue.fix}`);
      }
    });
  }

  lines.push(hr);

  const errors   = result.schemaErrors.length + result.ruleIssues.filter(i => i.level === 'error').length;
  const warnings = result.ruleIssues.filter(i => i.level === 'warning').length;
  const infos    = result.ruleIssues.filter(i => i.level === 'info').length;

  if (errors === 0 && warnings === 0) {
    lines.push(`✅ Compliant — 0 errors, 0 warnings${infos ? `, ${infos} info` : ''}`);
  } else {
    const parts = [];
    if (errors)   parts.push(`${errors} error${errors > 1 ? 's' : ''}`);
    if (warnings) parts.push(`${warnings} warning${warnings > 1 ? 's' : ''}`);
    if (infos)    parts.push(`${infos} info`);
    const verdict = errors > 0 ? '❌ Non-compliant' : '⚠️  Compliant with warnings';
    lines.push(`${verdict} — ${parts.join(', ')}`);
  }

  lines.push('');
  return lines.join('\n');
}

function formatJson(result, filePath) {
  const errors   = result.schemaErrors.length + result.ruleIssues.filter(i => i.level === 'error').length;
  const warnings = result.ruleIssues.filter(i => i.level === 'warning').length;

  return JSON.stringify({
    snomi_version: '2.1',
    file: filePath,
    resource: { type: result.resourceType, profile: result.profile },
    compliant: errors === 0,
    summary: {
      errors,
      warnings,
      infos: result.ruleIssues.filter(i => i.level === 'info').length,
    },
    schema_errors: result.schemaErrors.map(e => ({
      path: e.instancePath || e.path || '',
      message: e.message,
    })),
    rule_issues: result.ruleIssues,
  }, null, 2);
}

module.exports = { formatText, formatJson };
