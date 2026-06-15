'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ConnectionLineProps {
  isAssembled: boolean;
  isVisible: boolean;
}

const ConnectionLines: React.FC<ConnectionLineProps> = ({ isAssembled, isVisible }) => {
  const lineVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: {
      opacity: 1,
      pathLength: 1,
      transition: { duration: 1.2, ease: 'easeInOut', delay: 0.3 },
    },
  };

  if (!isAssembled || !isVisible) return null;

  return (
    <svg
      className="absolute top-1/2 left-1/2 w-80 h-80 sm:w-[420px] sm:h-[420px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      viewBox="0 0 420 420"
    >
      <motion.line
        x1="100" y1="100" x2="210" y2="210"
        stroke="#00AEEF"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        style={{ filter: 'drop-shadow(0 0 6px rgba(0,174,239,0.3))', opacity: 0.5 }}
      />
      <motion.line
        x1="320" y1="100" x2="210" y2="210"
        stroke="#33C8FF"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        style={{ filter: 'drop-shadow(0 0 6px rgba(51,200,255,0.3))', opacity: 0.5 }}
      />
      <motion.line
        x1="100" y1="320" x2="210" y2="210"
        stroke="#33C8FF"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        style={{ filter: 'drop-shadow(0 0 6px rgba(51,200,255,0.3))', opacity: 0.5 }}
      />
      <motion.line
        x1="320" y1="320" x2="210" y2="210"
        stroke="#00AEEF"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        style={{ filter: 'drop-shadow(0 0 6px rgba(0,174,239,0.3))', opacity: 0.5 }}
      />

      <motion.circle
        cx="210" cy="210" r="50"
        fill="none"
        stroke="rgba(0,174,239,0.12)"
        strokeWidth="1.5"
        animate={{ opacity: [0, 0.6, 0], scale: [0.9, 1, 1.1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <defs>
        <linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,174,239,0)" />
          <stop offset="50%" stopColor="rgba(0,174,239,0.6)" />
          <stop offset="100%" stopColor="rgba(51,200,255,0)" />
        </linearGradient>
        <linearGradient id="cg2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(51,200,255,0)" />
          <stop offset="50%" stopColor="rgba(51,200,255,0.6)" />
          <stop offset="100%" stopColor="rgba(0,174,239,0)" />
        </linearGradient>
        <linearGradient id="cg3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(51,200,255,0)" />
          <stop offset="50%" stopColor="rgba(51,200,255,0.6)" />
          <stop offset="100%" stopColor="rgba(0,174,239,0)" />
        </linearGradient>
        <linearGradient id="cg4" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,174,239,0)" />
          <stop offset="50%" stopColor="rgba(0,174,239,0.6)" />
          <stop offset="100%" stopColor="rgba(51,200,255,0)" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ConnectionLines;
