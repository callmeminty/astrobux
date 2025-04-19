
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Custom particle component to avoid tsparticles dependency issues
export function ParticleBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-astro-dark" />
      
      {/* Generate multiple particles with different animations */}
      {Array.from({ length: 50 }).map((_, i) => (
        <Particle key={i} />
      ))}
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-astro-dark opacity-70" />
    </div>
  );
}

// Individual particle component with randomized properties
function Particle() {
  const size = Math.random() * 3 + 1;
  const duration = Math.random() * 20 + 10;
  const delay = Math.random() * 5;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  
  // Randomly choose between purple and blue
  const isBlue = Math.random() > 0.7;
  const color = isBlue ? "#4338ca" : "#8B5CF6";
  
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        left: `${left}%`,
        top: `${top}%`,
      }}
      animate={{
        opacity: [0.1, 0.5, 0.1],
        scale: [1, 1.2, 1],
        x: [0, Math.random() * 50 - 25, 0],
        y: [0, Math.random() * 50 - 25, 0],
      }}
      transition={{
        duration: duration,
        ease: "easeInOut",
        times: [0, 0.5, 1],
        repeat: Infinity,
        delay: delay,
      }}
    />
  );
}
