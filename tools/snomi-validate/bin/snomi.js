#!/usr/bin/env node
'use strict';

/**
 * snomi-validate CLI
 *
 * Usage:
 *   snomi-validate validate <file> [--format text|json] [--exit-zero]
 *   snomi-validate validate <file1> <file2> ... [--format text|json]
 *   snomi-validate version
 *   snomi-validate help
 *
 * Exit codes:
 *   0 — All resources compliant (or --exit-zero passed)
 *   1 — One or more resources have errors
 *   2 — CLI usage error
 */

const path = require('path');
const fs   = require('fs');
const { validateFile } = require('../src/validator');
const { formatText, formatJson } = require('../src/reporter');

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

// ─── Arg parsing ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);

function parseArgs(args) {
  const opts = {
    command: null,
    files: [],
    format: 'text',
    exitZero: false,
  };

  let i = 0;
  while (i < args.length) {
    const a = args[i];
    if (a === '--format' || a === '-f') {
      opts.format = args[++i] || 'text';
    } else if (a === '--exit-zero') {
      opts.exitZero = true;
    } else if (!opts.command) {
      opts.command = a;
    } else {
      opts.files.push(a);
    }
    i++;
  }
  return opts;
}

const opts = parseArgs(args);

// ─── Commands ─────────────────────────────────────────────────────────────────
function printHelp() {
  console.log(`
snomi-validate v${pkg.version} — SNOMI Compliance Validator

USAGE
  snomi-validate validate <file.json> [options]
  snomi-validate validate <f1.json> <f2.json> ... [options]

COMMANDS
  validate   Validate one or more SNOMI JSON files
  version    Print version
  help       Show this message

OPTIONS
  --format text|json   Output format (default: text)
  --exit-zero          Always exit 0 (useful in CI to capture output without failing the build)

EXAMPLES
  snomi-validate validate report.json
  snomi-validate validate campaign.json actor.json --format json
  snomi-validate validate reports/*.json --format json > results.json

EXIT CODES
  0   All resources compliant
  1   One or more resources have validation errors
  2   CLI usage error
`);
}

function printVersion() {
  console.log(`snomi-validate v${pkg.version}`);
}

function cmdValidate(files, format, exitZero) {
  if (files.length === 0) {
    console.error('Error: no files specified. Usage: snomi-validate validate <file.json>');
    process.exit(2);
  }

  let totalErrors = 0;
  const jsonResults = [];

  for (const filePath of files) {
    const absPath = path.resolve(filePath);

    if (!fs.existsSync(absPath)) {
      const errMsg = `File not found: ${filePath}`;
      if (format === 'json') {
        jsonResults.push({ file: filePath, error: errMsg });
      } else {
        console.error(`❌ ${errMsg}`);
      }
      totalErrors++;
      continue;
    }

    let results = validateFile(absPath);

    // Always normalise to array
    if (!Array.isArray(results)) results = [results];

    for (const result of results) {
      const errCount = result.schemaErrors.length + result.ruleIssues.filter(i => i.level === 'error').length;
      totalErrors += errCount;

      if (format === 'json') {
        // Build JSON-serialisable result manually
        const errors   = result.schemaErrors.length + result.ruleIssues.filter(i => i.level === 'error').length;
        const warnings = result.ruleIssues.filter(i => i.level === 'warning').length;
        jsonResults.push({
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
        });
      } else {
        process.stdout.write(formatText(result, filePath));
      }
    }
  }

  if (format === 'json') {
    const output = files.length === 1 && jsonResults.length === 1
      ? jsonResults[0]
      : jsonResults;
    console.log(JSON.stringify(output, null, 2));
  }

  if (!exitZero) {
    process.exit(totalErrors > 0 ? 1 : 0);
  }
}

// ─── Dispatch ─────────────────────────────────────────────────────────────────
switch (opts.command) {
  case 'validate':
    cmdValidate(opts.files, opts.format, opts.exitZero);
    break;
  case 'version':
  case '--version':
  case '-v':
    printVersion();
    break;
  case 'help':
  case '--help':
  case '-h':
  case null:
    printHelp();
    break;
  default:
    console.error(`Unknown command: ${opts.command}. Run "snomi-validate help" for usage.`);
    process.exit(2);
}
