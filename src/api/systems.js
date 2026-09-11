import client from './client';

function cleanParams(params = {}) {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''));
}

export async function getSystems(params) {
  const response = await client.get('/systems', { params:cleanParams(params) });
  return response.data;
}

export async function getSystem(id) {
  const response = await client.get(`/systems/${encodeURIComponent(id)}`);
  return response.data.data;
}

export async function getFilters() {
  const response = await client.get('/systems/filters');
  return response.data.data;
}

export async function getMapSystems() {
  const response = await client.get('/systems/map');
  return response.data.data;
}

export async function getResearchPapers(params) {
  const response = await client.get('/research-papers', { params:cleanParams(params) });
  return response.data;
}
