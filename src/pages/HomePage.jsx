import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { animate, stagger } from 'animejs';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import IndiaMap from '../components/IndiaMap';
import SystemCard from '../components/SystemCard';
import Footer from '../components/Footer';
import { useSystems } from '../hooks/useSystems';

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function HomePage() {
  const hero = useRef(null);
  const { systems:featured, pagination, loading, error } = useSystems({ limit:3 });
  
  useEffect(() => { 
    animate(hero.current.querySelectorAll('.reveal'), { 
      opacity:[0,1], 
      translateY:[30,0], 
      delay:stagger(150,{start:200}), 
      duration:900, 
      ease:'outExpo' 
    }); 
  }, []);

  return (
    <>
      {error && <p className="api-notice">{error}</p>}
      
      <section className="hero" ref={hero}>
        <div className="hero-copy">
          <p className="eyebrow reveal">A digital archive of indigenous water wisdom</p>
          <h1 className="reveal">Water holds<br/><em>memory.</em></h1>
          <p className="lede reveal">Discover the ingenious systems that have sustained communities across India for centuries.</p>
          <div className="hero-actions reveal">
            <Link to="/archive" className="btn primary">
              Explore the archive <ArrowUpRight size={17}/>
            </Link>
            <a href="#map" className="text-link">
              View the map <ChevronRight size={16}/>
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <motion.div 
            className="sun"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <div className="arch-stack">
            {featured.map((system,index) => (
              <motion.div 
                key={system.id} 
                className={`arch-card arch-card-${index+1}`} 
                initial={{opacity:0,x:index===0?40:20+index*15,y:40+index*30,rotate:index===0?-8:index===1?6:-4}} 
                animate={{opacity:1,x:0,y:0,rotate:0}} 
                transition={{duration:0.8,delay:0.3+index*0.15,ease:[0.16,1,0.3,1]}} 
                whileHover={{y:-15,scale:1.05,zIndex:10,transition:{duration:0.3}}}
              >
                <Link to={`/archive/${system.id}`} className="arch-card-link">
                  <span className="mono">{system.state} · {String(index+1).padStart(2,'0')}</span>
                  <img src={system.image} alt={system.name}/>
                  <div className="arch-caption">
                    <span>{system.name}</span><ArrowUpRight size={17}/>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="water-line"/>
        </div>
      </section>

      <section className="intro">
        <FadeIn>
          <p className="eyebrow">A shared inheritance</p>
          <h2>Ingenious systems, shaped by land and community.</h2>
          <p>From the geometric depths of baoris to the living networks of eris, India’s water heritage tells a story of resilience, reciprocity and care.</p>
        </FadeIn>
        
        <div className="stat-row">
          <FadeIn delay={0.1}>
            <strong>{pagination?.total ?? (loading ? '…' : 0)}</strong>
            <span>systems archived</span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <strong>32</strong>
            <span>states represented</span>
          </FadeIn>
          <FadeIn delay={0.3}>
            <strong>1000+</strong>
            <span>years of knowledge</span>
          </FadeIn>
        </div>
      </section>

      <section className="map-section" id="map">
        <div className="section-top">
          <FadeIn>
            <p className="eyebrow">Explore by place</p>
            <h2>A country of water<br/><em>cultures.</em></h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p>Browse the archive to trace systems rooted in each landscape.</p>
          </FadeIn>
        </div>
        <IndiaMap interactive systems={featured}/>
        <FadeIn delay={0.3}>
          <Link to="/archive" className="text-link map-link" style={{ marginTop: "30px" }}>
            See all water systems <ArrowUpRight size={16}/>
          </Link>
        </FadeIn>
      </section>

      <section className="featured">
        <div className="section-top">
          <FadeIn>
            <p className="eyebrow">From the archive</p>
            <h2>Stories beneath<br/>the surface.</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link to="/archive" className="text-link">
              Browse all <ArrowUpRight size={16}/>
            </Link>
          </FadeIn>
        </div>
        <div className="card-grid">
          {featured.map((system,index) => (
            <SystemCard key={system.id} system={system} index={index}/>
          ))}
        </div>
      </section>

      <Footer/>
    </>
  );
}
