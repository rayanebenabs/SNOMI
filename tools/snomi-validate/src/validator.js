'use strict';

const Ajv     = require('ajv');
const addFormats = require('ajv-formats');
const path    = require('path');
const fs      = require('fs');
const { runRules } = require('./rules');

const SCHEMA_DIR = path.join(__dirname, '..', 'schemas');

function loadSchema(name) {
  const file = path.join(SCHEMA_DIR, `${name}.json`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const RESOURCE_SCHEMA_MAP = {
  ContentUnit: 'content-unit',
  Actor:       'actor',
  Campaign:    'campaign',
  Financial:   'financial',
};

let _ajv;
function getAjv() {
  if (_ajv) return _ajv;
  _ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(_ajv);
  return _ajv;
}

// Cache compiled validators by schema name so AJV doesn't try to re-add
// the same $id on subsequent calls — which throws "schema already exists".
const _compiled = {};
function getValidator(schemaName) {
  if (_compiled[schemaName]) return _compiled[schemaName];
  const schema = loadSchema(schemaName);
  _compiled[schemaName] = getAjv().compile(schema);
  return _compiled[schemaName];
}

function validate(resource) {
  const resourceType = resource.resourceType;

  if (!resourceType) {
    return {
      resourceType: null,
      profile: null,
      schemaErrors: [{ path: 'root', message: 'Missing required field "resourceType"' }],
      ruleIssues: [],
    };
  }

  const schemaName = RESOURCE_SCHEMA_MAP[resourceType];
  if (!schemaName) {
    return {
      resourceType,
      profile: resource.profile || null,
      schemaErrors: [{ path: 'resourceType', message: `Unknown resourceType "${resourceType}". Must be one of: ContentUnit, Actor, Campaign, Financial` }],
      ruleIssues: [],
    };
  }

  const validateFn = getValidator(schemaName);
  const valid = validateFn(resource);
  const schemaErrors = valid ? [] : (validateFn.errors || []);

  const ruleIssues = runRules(resource);

  return {
    resourceType,
    profile: resource.profile || null,
    schemaErrors,
    ruleIssues,
  };
}

function validateFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return {
      resourceType: null,
      profile: null,
      schemaErrors: [{ path: 'root', message: `Invalid JSON: ${e.message}` }],
      ruleIssues: [],
    };
  }

  // Support both single resource and array of resources
  if (Array.isArray(data)) {
    return data.map(r => validate(r));
  }
  return validate(data);
}

module.exports = { validate, validateFile };
