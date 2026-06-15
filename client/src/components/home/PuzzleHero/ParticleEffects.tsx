'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

interface ParticleEffectsProps {
  isActive: boolean;
}

const ParticleEffects: React.FC<ParticleEffectsProps> = ({ isActive }) => {
  const particles = useMemo<Particle[]>(() => {
    const colors = [
      'rgba(0,174,239,0.6)',
      'rgba(0,174,239,0.5)',
      'rgba(0,174,239,0.4)',
      'rgba(0,174,239,0.4)',
      'rgba(0,174,239,0.7)',
      'rgba(0,174,239,0.6)',
      'rgba(0,174,239,0.3)',
      'rgba(0,174,239,0.3)',
    ];

    return Array.from({ length: 40 }, (_, i) => {
      const angle = (i / 40) * Math.PI * 2;
      const radius = 100 + Math.random() * 100;
      return {
        id: i,
        x: Math.cos(angle) * radius * (0.6 + Math.random() * 0.4),
        y: Math.sin(angle) * radius * (0.6 + Math.random() * 0.4),
        size: 1.5 + Math.random() * 3,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 3,
        color: colors[i % colors.length],
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: '50%',
            top: '50%',
            background: particle.color,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
          }}
          animate={
            isActive
              ? {
                  x: [0, particle.x, particle.x * 0.3, 0],
                  y: [0, particle.y, particle.y * 0.3, 0],
                  opacity: [0, 0.6, 0.2, 0],
                  scale: [0.2, 1, 0.5, 0.1],
                }
              : { opacity: 0 }
          }
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  );
};

export default ParticleEffects;
