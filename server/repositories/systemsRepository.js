import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseCsv } from '../lib/csv.js';

const csvPath = fileURLToPath(new URL('../data/systems.csv', import.meta.url));
const fallbackImage = 'https://images.unsplash.com/photo-1609619385073-731304f5f3f1?auto=format&fit=crop&w=1200&q=85';
let systemsCache;

function slugify(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function normaliseRecord(record, index) {
  return {
    id: `${slugify(record.name)}-${index + 1}`,
    name: record.name,
    type: record.type,
    state: record.state,
    region: record.region,
    place: record.place,
    year: record.year,
    description: record.description,
    overview: record.overview || record.description,
    tags: (record.tags || '').split(';').map((tag) => tag.trim()).filter(Boolean),
    latitude: record.latitude ? Number(record.latitude) : null,
    longitude: record.longitude ? Number(record.longitude) : null,
    image: record.cover_image || fallbackImage,
  };
}

export async function getAllSystems() {
  if (systemsCache) return systemsCache;
  const rows = parseCsv((await readFile(csvPath, 'utf8')).replace(/^\uFEFF/, ''));
  const [headers, ...values] = rows;
  systemsCache = values.map((row, index) => normaliseRecord(Object.fromEntries(headers.map((header, column) => [header, row[column] ?? ''])), index));
  return systemsCache;
}

export function findSystem(systems, id) { return systems.find((system) => system.id === id); }

export function filterSystems(systems, { search = '', state, region, type }) {
  const query = search.trim().toLowerCase();
  return systems.filter((system) => (!state || system.state === state) && (!region || system.region === region) && (!type || system.type === type) && (!query || [system.name, system.type, system.state, system.region, system.place, system.year, system.description, ...system.tags].join(' ').toLowerCase().includes(query)));
}
