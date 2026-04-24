'use strict';

/**
 * SNOMI Validator — Test runner
 *
 * Runs basic assertions on the compliant and non-compliant fixtures.
 * Exit 0 = all tests passed. Exit 1 = one or more failures.
 */

const path = require('path');
const { validateFile } = require('../src/validator');

const FIXTURES = path.join(__dirname, 'fixtures');
let passed = 0;
let failed = 0;

function assert(label, condition, detail) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ ${label}${detail ? ': ' + detail : ''}`);
    failed++;
  }
}

// ─── Test 1: Compliant ig-reel ────────────────────────────────────────────────
console.log('\n── Test 1: compliant-ig-reel.json ──────────────────────────────');
const result1 = validateFile(path.join(FIXTURES, 'compliant-ig-reel.json'));
const r1 = Array.isArray(result1) ? result1[0] : result1;

assert('No schema errors', r1.schemaErrors.length === 0,
  r1.schemaErrors.map(e => e.message).join('; '));

const r1Errors = r1.ruleIssues.filter(i => i.level === 'error');
assert('No rule errors', r1Errors.length === 0,
  r1Errors.map(i => i.message).join('; '));

// ─── Test 2: Non-compliant batch ─────────────────────────────────────────────
console.log('\n── Test 2: non-compliant.json (batch of 2) ─────────────────────');
const results2 = validateFile(path.join(FIXTURES, 'non-compliant.json'));
assert('Returns array of 2 results', Array.isArray(results2) && results2.length === 2);

const [cu, actor] = results2;

// ContentUnit: ig-reel on TK platform → profile-platform-match error
const profileMismatch = cu.ruleIssues.find(i => i.rule === 'profile-platform-match');
assert('Detects ig-reel on TK platform mismatch', !!profileMismatch, 'rule: profile-platform-match');

// ContentUnit: sponsored but no disclosure
const disclosureIssue = cu.ruleIssues.find(i => i.rule === 'sponsored-disclosure');
assert('Detects missing sponsored disclosure', !!disclosureIssue, 'rule: sponsored-disclosure');

// ContentUnit: REA.001 missing produced date
const missingProduced = cu.ruleIssues.find(i => i.rule === 'metric-produced-required');
assert('Detects missing produced date on REA.001', !!missingProduced, 'rule: metric-produced-required');

// ContentUnit: VAL.001 missing [base:] and [CPM:] declarations
const val001Issues = cu.ruleIssues.filter(i => i.rule === 'val001-needs-base' || i.rule === 'val001-needs-cpm-source');
assert('Detects VAL.001 missing [base:] and [CPM:] declarations', val001Issues.length === 2,
  `found ${val001Issues.length} issues`);

// ContentUnit: REG.001 missing country code
const regIssue = cu.ruleIssues.find(i => i.rule === 'reg-needs-country');
assert('Detects REG.001 missing country code', !!regIssue, 'rule: reg-needs-country');

// Actor: username has @ prefix → schema error
const atSymbolError = actor.schemaErrors.find(e => e.message && e.message.includes('pattern'));
assert('Detects @ in username (schema pattern violation)', !!atSymbolError,
  actor.schemaErrors.map(e => e.message).join('; '));

// Actor: duplicate IG handle
const dupPlatform = actor.ruleIssues.find(i => i.rule === 'duplicate-handle-platform');
assert('Detects duplicate IG handle', !!dupPlatform, 'rule: duplicate-handle-platform');

// Actor: AUD.001 platform mismatch (TK code on IG handle)
const followersMismatch = actor.ruleIssues.find(i => i.rule === 'handle-followers-platform-mismatch');
assert('Detects AUD.001.TK code on IG handle', !!followersMismatch, 'rule: handle-followers-platform-mismatch');

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n── Results: ${passed} passed, ${failed} failed ─────────────────────────\n`);
process.exit(failed > 0 ? 1 : 0);
