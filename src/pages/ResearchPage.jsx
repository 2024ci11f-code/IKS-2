import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, FileText } from 'lucide-react';
import { useResearchPapers } from '../hooks/useSystems';

export default function ResearchPage() {
  const { papers, loading, error } = useResearchPapers();
  return <main className="research"><div className="page-heading"><p className="eyebrow">Knowledge library</p><h1>Research papers<br/><em>& references.</em></h1><p>A growing reading room on indigenous water knowledge, conservation and community-led revival.</p></div>{loading && <p>Loading references…</p>}{error && <p className="empty">{error}</p>}<div className="research-list">{papers.map((paper,index) => <motion.a initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:index*.09}} key={paper.id} href={paper.url} target="_blank" rel="noreferrer"><span className="paper-num">{String(index+1).padStart(2,'0')}</span><FileText size={20}/><div><h3>{paper.title}</h3><p>{paper.authors} · {paper.kind} · {paper.year}</p></div><ArrowUpRight/></motion.a>)}</div><div className="contribute"><BookOpen/><div><h3>Help grow the archive</h3><p>Know a relevant paper, oral history or water system? We welcome contributions.</p></div><a href="mailto:archive@jalsanskriti.in" className="btn primary">Contribute <ArrowUpRight size={16}/></a></div></main>;
}
