import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from './server.js';

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

app.get('/health', (_req, res) => res.json({
  status: 'ok', server: 'snomi-mcp', version: '2.1.0',
  tools: ['snomi_encode','snomi_decode','snomi_calculate','snomi_validate','snomi_benchmark','snomi_audit']
}));

app.get('/', (_req, res) => res.json({
  name: 'SNOMI MCP Server',
  version: '2.1.0',
  description: 'Model Context Protocol server for SNOMI — Standard Nomenclature of Influence Metrics',
  mcp_endpoint: '/mcp',
  docs: 'https://github.com/rayanebenabs/SNOMI',
  tools: [
    { name: 'snomi_encode',    description: 'Convert raw metrics into SNOMI citation format' },
    { name: 'snomi_decode',    description: 'Explain a SNOMI metric code' },
    { name: 'snomi_calculate', description: 'Calculate a SNOMI metric from raw inputs' },
    { name: 'snomi_validate',  description: 'Validate a JSON report for SNOMI compliance' },
    { name: 'snomi_benchmark', description: 'Get benchmarks by metric, tier, market, vertical' },
    { name: 'snomi_audit',     description: 'Full compliance + benchmark + risk audit' }
  ]
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SNOMI MCP Server v2.1.0 on port ${PORT}`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
});
