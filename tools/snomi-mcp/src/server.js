import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { encodeTool }    from './tools/encode.js';
import { decodeTool }    from './tools/decode.js';
import { calculateTool } from './tools/calculate.js';
import { validateTool }  from './tools/validate.js';
import { benchmarkTool } from './tools/benchmark.js';
import { auditTool }     from './tools/audit.js';

export function createMcpServer() {
  const server = new McpServer({
    name: 'snomi-mcp',
    version: '2.1.0',
  });

  server.tool(
    'snomi_encode',
    'Convert raw metric data into a SNOMI-compliant citation string. Use when you have numbers and want to format them per the SNOMI standard.',
    {
      metric_code:        z.string().describe('SNOMI code e.g. ENG.001.IG.FR, VAL.001'),
      value:              z.union([z.string(), z.number()]).describe('Metric value e.g. 5.9 or "5.9%"'),
      time_window_start:  z.string().optional().describe('Period start YYYY-MM-DD'),
      time_window_end:    z.string().optional().describe('Period end YYYY-MM-DD'),
      produced_date:      z.string().optional().describe('Extraction date YYYY-MM-DD'),
      source:             z.string().optional().describe('Data source e.g. "Instagram Insights"'),
      inputs:             z.string().optional().describe('Interaction types e.g. "L+C+S+Sh"'),
      base:               z.string().optional().describe('For VAL.001: base metric e.g. "REA.001"'),
      cpm_ref:            z.string().optional().describe('For VAL.001: CPM ref e.g. "native|IG|Reel|FR|2026-Q1"'),
    },
    async (p) => ({ content: [{ type: 'text', text: encodeTool(p) }] })
  );

  server.tool(
    'snomi_decode',
    'Explain a SNOMI metric code: name, formula, trust score, pitfalls, citation example.',
    { code: z.string().describe('SNOMI code to decode e.g. ENG.001, VAL.001, AUD.003.FAKE') },
    async (p) => ({ content: [{ type: 'text', text: decodeTool(p.code) }] })
  );

  server.tool(
    'snomi_calculate',
    'Calculate a SNOMI metric from raw inputs with step-by-step working and trust score.',
    {
      metric_code:    z.string().describe('Metric to calculate e.g. ENG.001, ENG.007, VAL.001, REA.003'),
      likes:          z.number().optional(),
      comments:       z.number().optional(),
      saves:          z.number().optional(),
      shares:         z.number().optional(),
      reach:          z.number().optional().describe('REA.001 — organic reach'),
      impressions:    z.number().optional().describe('REA.002 — total impressions'),
      views:          z.number().optional().describe('REA.005 — video views'),
      followers:      z.number().optional().describe('AUD.001 — total followers'),
      complete_views: z.number().optional().describe('For ENG.006'),
      budget:         z.number().optional().describe('Campaign budget or creator fee'),
      agency_fees:    z.number().optional().describe('Agency fees for VAL.008'),
      ads_cpm:        z.number().optional().describe('Ads CPM reference for VAL.001'),
      ads_cpm_source: z.string().optional().describe('"native", "declared", or "bench_pending"'),
    },
    async (p) => ({ content: [{ type: 'text', text: calculateTool(p) }] })
  );

  server.tool(
    'snomi_validate',
    'Validate a JSON report against SNOMI schema and 14 business rules. Returns errors, warnings, and compliance verdict.',
    { json_content: z.string().describe('JSON string of the SNOMI report to validate') },
    async (p) => ({ content: [{ type: 'text', text: await validateTool(p.json_content) }] })
  );

  server.tool(
    'snomi_benchmark',
    'Get SNOMI benchmark values for a metric by tier, market, and vertical. Optionally compare your value.',
    {
      metric_code: z.string().describe('e.g. ENG.002.IG, ENG.001.TK, VAL.003'),
      tier:        z.enum(['NANO','MICRO','MID','MACRO','MEGA']).optional(),
      market:      z.string().optional().describe('US, UK, FR, DE, AU, BR, IN'),
      vertical:    z.string().optional().describe('fashion, food, sports, tech, travel, education, parenting, beauty, comedy…'),
      value:       z.number().optional().describe('Your actual value to compare'),
    },
    async (p) => ({ content: [{ type: 'text', text: benchmarkTool(p) }] })
  );

  server.tool(
    'snomi_audit',
    'Full SNOMI audit: compliance validation + benchmark comparison + risk flags. Combines validate + benchmark + strategic analysis.',
    {
      json_content: z.string().describe('JSON string of the SNOMI report to audit'),
      tier:         z.enum(['NANO','MICRO','MID','MACRO','MEGA']).optional(),
      market:       z.string().optional().describe('US, UK, FR, DE, AU, BR, IN'),
      vertical:     z.string().optional().describe('Content vertical for benchmark context'),
    },
    async (p) => ({ content: [{ type: 'text', text: await auditTool(p) }] })
  );

  return server;
}
