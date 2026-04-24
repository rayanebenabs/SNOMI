import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from './server.js';
import { encodeTool }    from './tools/encode.js';
import { decodeTool }    from './tools/decode.js';
import { calculateTool } from './tools/calculate.js';
import { validateTool }  from './tools/validate.js';
import { benchmarkTool } from './tools/benchmark.js';
import { auditTool }     from './tools/audit.js';

const app = express();
app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, MCP-Session-Id');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// MCP endpoint — stateless (new server per request)
app.post('/mcp', async (req, res) => {
  try {
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    const server = createMcpServer();
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    res.on('finish', () => server.close().catch(() => {}));
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message });
  }
});

// ── REST API ─────────────────────────────────────────────────────────────────

function apiHandler(fn) {
  return async (req, res) => {
    try {
      const result = await fn(req.body);
      res.json({ ok: true, result });
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message });
    }
  };
}

app.post('/api/encode',    apiHandler(p => encodeTool(p)));
app.post('/api/decode',    apiHandler(p => decodeTool(p.code)));
app.post('/api/calculate', apiHandler(p => calculateTool(p)));
app.post('/api/validate',  apiHandler(p => validateTool(p.json_content)));
app.post('/api/benchmark', apiHandler(p => benchmarkTool(p)));
app.post('/api/audit',     apiHandler(p => auditTool(p)));

// ── Health & root ─────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({
  status: 'ok', server: 'snomi-mcp', version: '2.1.0',
  mcp_endpoint: '/mcp',
  api_endpoints: ['/api/encode','/api/decode','/api/calculate','/api/validate','/api/benchmark','/api/audit']
}));

app.get('/', (_req, res) => res.json({
  name: 'SNOMI Server',
  version: '2.1.0',
  description: 'SNOMI — Standard Nomenclature of Influence Metrics',
  docs: 'https://github.com/rayanebenabs/SNOMI',
  mcp_endpoint: '/mcp',
  api: {
    'POST /api/encode':    'Format raw metrics into a SNOMI citation string',
    'POST /api/decode':    'Explain a SNOMI code — body: { code }',
    'POST /api/calculate': 'Calculate a metric — body: { metric_code, ...inputs }',
    'POST /api/validate':  'Validate a JSON report — body: { json_content }',
    'POST /api/benchmark': 'Get benchmarks — body: { metric_code, tier?, market?, vertical?, value? }',
    'POST /api/audit':     'Full audit — body: { json_content, tier?, market?, vertical? }'
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SNOMI MCP Server v2.1.0 on port ${PORT}`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
});
