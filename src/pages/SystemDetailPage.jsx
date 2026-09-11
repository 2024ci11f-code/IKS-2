import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, Droplets, MapPin, Play } from 'lucide-react';
import { useSystem } from '../hooks/useSystems';

export default function SystemDetailPage() {
  const { id } = useParams();
  const { system, loading, error } = useSystem(id);
  if (loading) return <main className="detail">Loading water system…</main>;
  if (error || !system) return <main className="detail"><Link className="back" to="/archive">← Back to archive</Link><p className="empty">{error || 'Water system not found.'}</p></main>;
  return <main className="detail"><Link className="back" to="/archive">← Back to archive</Link><section className="detail-hero"><div><p className="eyebrow">{system.type} · {system.state}</p><h1>{system.name}</h1><p>{system.description}</p><div className="metadata"><span><MapPin/> {system.place}</span><span><Droplets/> {system.year}</span></div></div><img src={system.image} alt={system.name}/></section><section className="detail-body"><aside><span>01</span><p>Overview</p><span>02</span><p>Media & references</p></aside><div><p className="eyebrow">Overview</p><h2>Architecture shaped by the rhythms of rain.</h2><p>{system.overview}</p><div className="tags">{system.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="media-block"><div><Play fill="currentColor" size={22}/><p className="mono">Field documentation</p></div><img src={system.image} alt={`${system.name} detail`}/></div><div className="references"><p className="eyebrow">Related references</p>{system.references?.map((reference) => <a key={reference.id} href={reference.url} target="_blank" rel="noreferrer">{reference.title} <ArrowUpRight size={15}/></a>)}</div></div></section></main>;
}
