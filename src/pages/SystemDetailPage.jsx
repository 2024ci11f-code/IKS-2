import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, Droplets, MapPin, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSystem } from '../hooks/useSystems';
import { useState, useEffect } from 'react';



export default function SystemDetailPage() {
  const { id } = useParams();
  const { system, loading, error } = useSystem(id);
  const [idx, setIdx] = useState(0);
  const images = system && system.images && system.images.length ? system.images : (system?.image ? [system.image] : []);

  if (loading) return <main className="detail">Loading water system…</main>;
  if (error || !system) return (
    <main className="detail">
      <Link className="back" to="/archive">← Back to archive</Link>
      <p className="empty">{error || 'Water system not found.'}</p>
    </main>
  );

  return (
    <main className="detail">
      <Link className="back" to="/archive">← Back to archive</Link>
      
      <section className="detail-hero">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow">{system.type} · {system.state}</p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {system.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {system.description}
          </motion.p>
          <motion.div 
            className="metadata"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span><MapPin/> {system.place}</span>
            <span><Droplets/> {system.year}</span>
          </motion.div>
        </motion.div>
        
        {/* Image Gallery */}
        <div className="gallery">
          <button className="prev" onClick={() => setIdx((idx - 1 + images.length) % images.length)} aria-label="Previous image">←</button>
          <motion.img
            src={images[idx]}
            alt={`${system.name} image ${idx + 1}`}
            key={images[idx]}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="gallery-img"
          />
          <button className="next" onClick={() => setIdx((idx + 1) % images.length)} aria-label="Next image">→</button>
        </div>
      </section>

      <section className="detail-body">
        <aside>
          <span>01</span><p>Overview</p>
          <span>02</span><p>Media & references</p>
        </aside>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow">Overview</p>
          <h2>Architecture shaped by the rhythms of rain.</h2>
          <p>{system.overview}</p>
          
          <div className="tags">
            {system.origin && (
            <p className="origin"><strong>Origin:</strong> {system.origin}</p>
          )}
          {system.history && (
            <p className="history"><strong>History:</strong> {system.history}</p>
          )}
          </div>
          
          <motion.div 
            className="media-block"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <Play fill="currentColor" size={22}/>
              <p className="mono">Field documentation</p>
            </div>
            <img src={system.image} alt={`${system.name} detail`}/>
          </motion.div>
          
          <div className="references">
            <p className="eyebrow">Related references</p>
            {system.references?.map((reference) => (
              <a key={reference.id} href={reference.url} target="_blank" rel="noreferrer">
                {reference.title} <ArrowUpRight size={15}/>
              </a>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
