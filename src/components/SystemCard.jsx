import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";

export default function SystemCard({ system, index = 0 }) {
  return (
    <motion.article
      className="system-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <Link to={`/archive/${system.id}`}>
        <div className="image-wrap">
          <img src={system.image} alt={system.name} />
          <span>{system.type}</span>
        </div>
        <div className="card-info">
          <p className="mono">
            <MapPin size={13} />
            {system.state}
          </p>
          <h3>{system.name}</h3>
          <p>{system.description}</p>
          <div className="card-arrow">
            <ArrowUpRight size={19} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
