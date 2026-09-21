import systemsData from '../data/systems.json';
import researchData from '../data/research-papers.json';

// Utility for pagination
function paginate(items, params) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit) || 12));
  const total = items.length;
  return {
    data: items.slice((page - 1) * limit, page * limit),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}

// Clean params
function cleanParams(params = {}) {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''));
}

export async function getSystems(params) {
  const clean = cleanParams(params);
  const search = (clean.search || '').trim().toLowerCase();
  
  const filtered = systemsData.filter((system) => {
    const matchState = !clean.state || system.state === clean.state;
    const matchRegion = !clean.region || system.region === clean.region;
    const matchType = !clean.type || system.type === clean.type;
    
    let matchSearch = true;
    if (search) {
      const searchString = [
        system.name, system.type, system.state, system.region, system.place, system.year, system.description, ...(system.tags || [])
      ].join(' ').toLowerCase();
      matchSearch = searchString.includes(search);
    }
    
    return matchState && matchRegion && matchType && matchSearch;
  });

  // Return wrapped in a promise to maintain async API
  return Promise.resolve(paginate(filtered, clean));
}

export async function getSystem(id) {
  const system = systemsData.find((s) => s.id === id);
  if (!system) {
    return Promise.reject(new Error('Water system not found'));
  }
  
  const references = researchData.filter((reference) => 
    reference.coverage === 'all' || (reference.relatedTypes && reference.relatedTypes.includes(system.type))
  );
  
  return Promise.resolve({ ...system, references });
}

export async function getFilters() {
  const states = [...new Set(systemsData.map((s) => s.state))].sort();
  const regions = [...new Set(systemsData.map((s) => s.region))].sort();
  const types = [...new Set(systemsData.map((s) => s.type))].sort();
  
  return Promise.resolve({ states, regions, types });
}

export async function getMapSystems() {
  const mapped = systemsData.filter((system) => system.latitude !== null && system.longitude !== null);
  return Promise.resolve(mapped);
}

export async function getResearchPapers(params) {
  const clean = cleanParams(params);
  return Promise.resolve(paginate(researchData, clean));
}
