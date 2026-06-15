'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  variant = 'primary',
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    const maxDistance = 140;
    if (distance < maxDistance) {
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const force = (1 - distance / maxDistance) * 24;
      setMousePosition({
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force,
      });
    } else {
      setMousePosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={buttonRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={mousePosition}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
    >
      {variant === 'primary' ? (
        <motion.button
          type="button"
          className="relative overflow-hidden rounded-2xl px-8 py-3.5 text-base font-bold shadow-lg transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #00AEEF, #00AEEF)',
            color: '#000000',
            boxShadow: '0 8px 32px rgba(0,174,239,0.25)',
          }}
          whileHover={{
            scale: 1.04,
            boxShadow: '0 0 40px rgba(0,174,239,0.45)',
          }}
          whileTap={{ scale: 0.96 }}
          onClick={onClick}
        >
          <span className="relative z-10">{children}</span>
          <motion.span
            className="absolute inset-0 opacity-0"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)' }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      ) : (
        <motion.button
          type="button"
          className="relative overflow-hidden rounded-2xl px-8 py-3.5 text-base font-bold transition-all duration-300"
          style={{
            border: '1.5px solid rgba(0,174,239,0.35)',
            background: 'rgba(255,255,255,0.03)',
            color: 'rgba(51,200,255,0.9)',
            boxShadow: '0 8px 32px rgba(0,174,239,0.08)',
          }}
          whileHover={{
            scale: 1.04,
            boxShadow: '0 0 40px rgba(0,174,239,0.25)',
            borderColor: 'rgba(0,174,239,0.6)',
          }}
          whileTap={{ scale: 0.96 }}
          onClick={onClick}
        >
          <span className="relative z-10">{children}</span>
          <motion.span
            className="absolute inset-0 opacity-0"
            style={{ background: 'linear-gradient(135deg, rgba(0,174,239,0.08), transparent)' }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      )}
    </motion.div>
  );
};

export default MagneticButton;
