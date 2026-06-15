'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Service {
  id: string;
  icon: string;
  title: string;
  color: string;
  startPosition: { x: number; y: number };
}

interface PuzzlePieceProps {
  service: Service;
  index: number;
  isScrolling: boolean;
  isHovered: boolean;
  onAssemblyComplete: () => void;
}

const getPieceShape = (index: number) => {
  const shapes = [
    'polygon(20% 0, 100% 0, 100% 100%, 0 100%, 0 20%)',
    'polygon(0 0, 80% 0, 100% 20%, 100% 100%, 0 100%)',
    'polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)',
    'polygon(0 0, 100% 0, 100% 100%, 20% 100%, 0 80%)',
  ];
  return shapes[index];
};

const getPiecePosition = (index: number) => {
  const positions = [
    { x: -100, y: -100 },
    { x: 100, y: -100 },
    { x: -100, y: 100 },
    { x: 100, y: 100 },
  ];
  return positions[index];
};

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  service,
  index,
  isScrolling,
  isHovered,
  onAssemblyComplete,
}) => {
  const piecePosition = getPiecePosition(index);

  const pieceVariants = {
    hidden: {
      x: service.startPosition.x,
      y: service.startPosition.y,
      rotateZ: index * 18 - 20,
      opacity: 0,
      scale: 0.3,
    },
    assembled: {
      x: piecePosition.x,
      y: piecePosition.y,
      rotateZ: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
        onComplete: () => {
          if (!isScrolling) {
            onAssemblyComplete();
          }
        },
      },
    },
    disassembled: {
      x: service.startPosition.x * 0.35,
      y: service.startPosition.y * 0.35,
      rotateZ: index * 10,
      opacity: 0.5,
      scale: 0.8,
      transition: {
        duration: 0.9,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      variants={pieceVariants}
      initial="hidden"
      animate={isScrolling ? 'disassembled' : 'assembled'}
      whileHover={isHovered && !isScrolling ? { scale: 1.08 } : {}}
    >
      <div className="relative w-36 h-36 sm:w-40 sm:h-40">
        <motion.div
          className="absolute inset-0 rounded-2xl blur-xl"
          style={{ background: 'linear-gradient(135deg, rgba(0,174,239,0.15), rgba(0,174,239,0.15))' }}
          animate={
            !isScrolling
              ? { opacity: [0.15, 0.4, 0.15], scale: [1, 1.06, 1] }
              : { opacity: 0 }
          }
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.15,
          }}
        />

        <motion.div
          className="relative w-full h-full rounded-2xl border overflow-hidden"
          style={{
            clipPath: getPieceShape(index),
            background: 'linear-gradient(135deg, rgba(0,174,239,0.08), rgba(0,174,239,0.06))',
            borderColor: !isScrolling
              ? 'rgba(0,174,239,0.12)'
              : 'rgba(255,255,255,0.04)',
            boxShadow: !isScrolling
              ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)'
              : 'none',
          }}
          animate={!isScrolling ? { y: [0, -8, 0] } : {}}
          transition={{
            duration: 5 + index * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        >
          <div className="absolute inset-0" style={{ backdropFilter: 'blur(4px)' }} />
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center">
            <motion.div
              className="mb-2 text-3xl sm:text-4xl"
              animate={isHovered && !isScrolling ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {service.icon}
            </motion.div>
            <motion.div
              className="text-[10px] sm:text-xs font-semibold"
              style={{ color: 'rgba(240,244,248,0.8)' }}
              initial={{ opacity: 0, y: 8 }}
              animate={isHovered && !isScrolling ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
            >
              {service.title}
            </motion.div>
          </div>

          {!isScrolling && (
            <>
              <motion.span
                className="absolute top-2 right-2 block h-1.5 w-1.5 rounded-full"
                style={{ background: '#00AEEF' }}
                animate={{
                  boxShadow: [
                    '0 0 6px rgba(0,174,239,0.3)',
                    '0 0 14px rgba(0,174,239,0.7)',
                    '0 0 6px rgba(0,174,239,0.3)',
                  ],
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.span
                className="absolute bottom-2 left-2 block h-1.5 w-1.5 rounded-full"
                style={{ background: '#00AEEF' }}
                animate={{
                  boxShadow: [
                    '0 0 6px rgba(0,174,239,0.3)',
                    '0 0 14px rgba(0,174,239,0.7)',
                    '0 0 6px rgba(0,174,239,0.3)',
                  ],
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PuzzlePiece;
