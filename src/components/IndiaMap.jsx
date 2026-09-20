import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { motion } from "framer-motion";
import indiaTopo from "../data/india.json";

export default function IndiaMap({ systems = [], interactive = false }) {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState("");

  return (
    <motion.div 
      className={`map-container ${interactive ? "interactive" : ""}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 900,
          center: [80, 22] // Centered on India
        }}
        width={800}
        height={600}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={indiaTopo}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="rgba(191, 234, 255, 0.15)"
                stroke="#bfeaff"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "rgba(191, 234, 255, 0.3)", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {systems.filter((s) => s.latitude && s.longitude).map((system, idx) => (
          <Marker 
            key={`${system.id}-${idx}`} 
            coordinates={[system.longitude, system.latitude]}
            onClick={() => interactive && navigate("/archive/" + system.id)}
            onMouseEnter={() => setTooltip(system.name)}
            onMouseLeave={() => setTooltip("")}
            style={{
              cursor: interactive ? "pointer" : "default"
            }}
          >
            <motion.circle 
              r={5} 
              fill="#f4d46a" 
              stroke="#3e173d" 
              strokeWidth={1.5}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.05, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.5, fill: "#ffffff" }}
            />
            {tooltip === system.name && (
              <text
                textAnchor="middle"
                y={-12}
                style={{
                  fontFamily: "DM Mono",
                  fontSize: "12px",
                  fill: "#ffffff",
                  textShadow: "0px 2px 4px rgba(0,0,0,0.8)"
                }}
              >
                {system.name}
              </text>
            )}
          </Marker>
        ))}
      </ComposableMap>
    </motion.div>
  );
}
