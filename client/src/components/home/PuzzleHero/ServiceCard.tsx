'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface ServiceCardProps {
  service: Service;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isHovered, onHover, index }) => {
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.12,
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 5 + index * 0.3,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.2,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      onHoverStart={() => onHover(service.id)}
      onHoverEnd={() => onHover(null)}
      className="relative group cursor-pointer h-full"
    >
      <motion.div
        className="absolute -inset-1 rounded-xl opacity-20 blur-lg"
        style={{
          background: index % 2 === 0
            ? 'linear-gradient(135deg, rgba(0,174,239,0.3), transparent)'
            : 'linear-gradient(135deg, rgba(0,174,239,0.3), transparent)',
        }}
        animate={isHovered ? { opacity: 0.35, scale: 1.05 } : { opacity: 0.15, scale: 1 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="relative rounded-xl p-5 sm:p-6 h-full flex flex-col overflow-hidden"
        style={{
          background: 'rgba(10,15,20,0.6)',
          backdropFilter: 'blur(16px)',
          border: isHovered
            ? '1px solid rgba(0,174,239,0.2)'
            : '1px solid rgba(255,255,255,0.06)',
        }}
        animate={isHovered ? 'animate' : 'initial'}
        variants={floatingVariants}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10 }}
      >
        <motion.div
          className="absolute inset-0 opacity-0"
          style={{
            background: index % 2 === 0
              ? 'linear-gradient(135deg, rgba(0,174,239,0.04), transparent)'
              : 'linear-gradient(135deg, rgba(0,174,239,0.04), transparent)',
          }}
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <motion.div
            className="mb-4"
            animate={isHovered ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{
                background: index % 2 === 0
                  ? 'rgba(0,174,239,0.08)'
                  : 'rgba(0,174,239,0.08)',
                border: index % 2 === 0
                  ? '1px solid rgba(0,174,239,0.15)'
                  : '1px solid rgba(0,174,239,0.15)',
              }}
            >
              {service.icon}
            </div>
          </motion.div>

          <h3 className="text-base sm:text-lg font-bold mb-2" style={{ color: '#f0f4f8' }}>
            {service.title}
          </h3>

          <p className="text-xs sm:text-sm leading-relaxed flex-grow" style={{ color: 'rgba(240,244,248,0.5)' }}>
            {service.description}
          </p>

          <motion.button
            className="mt-4 w-full px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300"
            style={{
              border: '1px solid rgba(0,174,239,0.1)',
              color: 'rgba(240,244,248,0.6)',
              background: 'rgba(255,255,255,0.02)',
            }}
            whileHover={{
              background: 'rgba(0,174,239,0.06)',
              borderColor: 'rgba(0,174,239,0.25)',
              color: '#00AEEF',
              scale: 1.03,
            }}
            whileTap={{ scale: 0.97 }}
          >
            En savoir plus →
          </motion.button>
        </div>

        <div
          className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-15 transition-opacity duration-300"
          style={{
            background: index % 2 === 0
              ? 'linear-gradient(135deg, rgba(0,174,239,0.4), transparent)'
              : 'linear-gradient(135deg, rgba(0,174,239,0.4), transparent)',
            clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ServiceCard;
