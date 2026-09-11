import { useEffect, useState } from 'react';
import { getFilters, getResearchPapers, getSystem, getSystems } from '../api/systems';

function useRequest(load, dependencies) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(null);
    load().then((result) => active && setData(result)).catch(() => active && setError('Unable to load data. Please try again.')).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, dependencies);
  return { data, loading, error };
}

export function useSystems(query) {
  const key = JSON.stringify(query);
  const request = useRequest(() => getSystems(query), [key]);
  return { systems:request.data?.data || [], pagination:request.data?.pagination, loading:request.loading, error:request.error };
}

export function useSystem(id) {
  const request = useRequest(() => getSystem(id), [id]);
  return { system:request.data, loading:request.loading, error:request.error };
}

export function useFilters() {
  const request = useRequest(getFilters, []);
  return { filters:request.data || { states:[], regions:[], types:[] }, loading:request.loading, error:request.error };
}

export function useResearchPapers() {
  const request = useRequest(() => getResearchPapers({ limit:100 }), []);
  return { papers:request.data?.data || [], loading:request.loading, error:request.error };
}
