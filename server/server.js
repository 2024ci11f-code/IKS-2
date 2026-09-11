import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { filterSystems, findSystem, getAllSystems } from './repositories/systemsRepository.js';

const port = Number(process.env.PORT || 5051);
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const researchPath = fileURLToPath(new URL('./data/research-papers.json', import.meta.url));

function send(response, status, body) {
  response.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Access-Control-Allow-Origin':frontendOrigin, 'Access-Control-Allow-Methods':'GET, OPTIONS' });
  response.end(JSON.stringify(body));
}

function pagination(items, searchParams) {
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 12));
  const total = items.length;
  return { data:items.slice((page - 1) * limit, page * limit), pagination:{ page, limit, total, pages:Math.ceil(total / limit) } };
}

async function handleRequest(request, response) {
  if (request.method === 'OPTIONS') return send(response, 204, {});
  if (request.method !== 'GET') return send(response, 405, { error:'Method not allowed' });
  const url = new URL(request.url, `http://${request.headers.host}`);
  const path = url.pathname;
  const systems = await getAllSystems();

  if (path === '/api/health') return send(response, 200, { data:{ status:'ok' } });
  if (path === '/api/systems/filters') return send(response, 200, { data:{ states:[...new Set(systems.map((s) => s.state))].sort(), regions:[...new Set(systems.map((s) => s.region))].sort(), types:[...new Set(systems.map((s) => s.type))].sort() } });
  if (path === '/api/states') return send(response, 200, { data:[...new Map(systems.map((s) => [s.state, { name:s.state, region:s.region, systemCount:0 }])).values()].map((state) => ({ ...state, systemCount:systems.filter((s) => s.state === state.name).length })) });
  if (path === '/api/systems/map') return send(response, 200, { data:systems.filter((system) => system.latitude !== null && system.longitude !== null) });
  if (path === '/api/research-papers') return send(response, 200, pagination(JSON.parse(await readFile(researchPath, 'utf8')), url.searchParams));
  if (path === '/api/systems') return send(response, 200, pagination(filterSystems(systems, Object.fromEntries(url.searchParams)), url.searchParams));
  if (path.startsWith('/api/systems/')) {
    const system = findSystem(systems, decodeURIComponent(path.slice('/api/systems/'.length)));
    if (!system) return send(response, 404, { error:'Water system not found' });
    const references = JSON.parse(await readFile(researchPath, 'utf8')).filter((reference) => reference.coverage === 'all' || reference.relatedTypes?.includes(system.type));
    return send(response, 200, { data:{ ...system, references } });
  }
  return send(response, 404, { error:'Route not found' });
}

createServer((request, response) => handleRequest(request, response).catch((error) => { console.error(error); send(response, 500, { error:'Internal server error' }); })).listen(port, () => console.log(`API server listening on http://localhost:${port}`));
