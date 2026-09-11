import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import SystemCard from '../components/SystemCard';
import { useFilters, useSystems } from '../hooks/useSystems';

export default function ArchivePage() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const [state, setState] = useState(params.get('state') || 'All states');
  const [type, setType] = useState(params.get('type') || 'All systems');
  const [page, setPage] = useState(Math.max(1, Number(params.get('page')) || 1));
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => { const next={}; if(search) next.search=search; if(state !== 'All states') next.state=state; if(type !== 'All systems') next.type=type; if(page > 1) next.page=String(page); setParams(next,{replace:true}); }, [search,state,type,page,setParams]);
  useEffect(() => { const timer = setTimeout(() => setDebouncedSearch(search), 300); return () => clearTimeout(timer); }, [search]);
  const { systems, pagination, loading, error } = useSystems({ search:debouncedSearch, state:state === 'All states' ? undefined : state, type:type === 'All systems' ? undefined : type, page, limit:12 });
  const { filters } = useFilters();
  const resetPage = (update) => { setPage(1); update(); };
  const pages = Array.from({ length:pagination?.pages || 0 }, (_, index) => index + 1);
  return <main className="archive-page"><div className="page-heading"><p className="eyebrow">The living collection</p><h1>Explore the archive.</h1><p>Photographs, oral histories and research on India’s traditional water systems.</p></div><div className="archive-tools"><label className="search"><Search size={19}/><input placeholder="Search water systems, places…" value={search} onChange={(event) => resetPage(() => setSearch(event.target.value))}/></label><label><SlidersHorizontal size={16}/><select value={state} onChange={(event) => resetPage(() => setState(event.target.value))}><option>All states</option>{filters.states.map((value) => <option key={value}>{value}</option>)}</select></label><label><select value={type} onChange={(event) => resetPage(() => setType(event.target.value))}><option>All systems</option>{filters.types.map((value) => <option key={value}>{value}</option>)}</select></label></div><p className="result-count">{loading ? 'Searching…' : `${pagination?.total ?? 0} systems found`}</p>{error && <div className="empty">{error}</div>}<div className="archive-grid">{systems.map((system,index) => <SystemCard key={system.id} system={system} index={index}/>)}</div>{!loading && !error && !systems.length && <div className="empty">No systems match those filters. Try a wider search.</div>}{!loading && !error && (pagination?.pages || 0) > 1 && <nav className="pagination" aria-label="Archive pages"><button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>{pages.map((pageNumber) => <button key={pageNumber} className={pageNumber === page ? 'active' : ''} aria-current={pageNumber === page ? 'page' : undefined} onClick={() => setPage(pageNumber)}>{pageNumber}</button>)}<button disabled={page === pagination.pages} onClick={() => setPage(page + 1)}>Next</button></nav>}</main>;
}
