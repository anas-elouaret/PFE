'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PuzzlePiece from './PuzzlePiece';
import ServiceCard from './ServiceCard';
import ParticleEffects from './ParticleEffects';
import ConnectionLines from './ConnectionLines';
import MagneticButton from './MagneticButton';

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  startPosition: { x: number; y: number };
}

const puzzleServices: Service[] = [
  {
    id: 'ugc',
    icon: '🎥',
    title: 'UGC Content Creation',
    description: 'Vidéos courtes authentiques qui convertissent.',
    color: 'from-[#00AEEF] to-[#33C8FF]',
    startPosition: { x: -520, y: -380 },
  },
  {
    id: 'marketing',
    icon: '📊',
    title: 'Marketing Strategy',
    description: 'Stratégies data-driven pour votre marque.',
    color: 'from-[#00AEEF] to-[#33C8FF]',
    startPosition: { x: 520, y: -380 },
  },
  {
    id: 'design',
    icon: '🎨',
    title: 'Graphic Design',
    description: 'Designs visuels qui captivent votre audience.',
    color: 'from-[#00AEEF] to-[#33C8FF]',
    startPosition: { x: -520, y: 380 },
  },
  {
    id: 'social',
    icon: '📱',
    title: 'Social Media Management',
    description: 'Croissance stratégique et contenu engageant.',
    color: 'from-[#00AEEF] to-[#33C8FF]',
    startPosition: { x: 520, y: 380 },
  },
];

const cardServices: Service[] = [
  ...puzzleServices,
  {
    id: 'photography',
    icon: '📸',
    title: 'Photographie',
    description: 'Photos studio et lifestyle professionnelles.',
    color: 'from-[#00AEEF] to-[#33C8FF]',
    startPosition: { x: 0, y: 0 },
  },
];

const PuzzleHero: React.FC = () => {
  const [assemblyPhase, setAssemblyPhase] = useState<'initial' | 'particles' | 'assembling' | 'complete'>('initial');
  const [showServices, setShowServices] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setAssemblyPhase('particles'), 400);
    const t2 = setTimeout(() => setAssemblyPhase('assembling'), 1400);
    const t3 = setTimeout(() => setAssemblyPhase('complete'), 3800);
    const t4 = setTimeout(() => setShowServices(true), 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.04;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.03;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePieceSnap = () => {};

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      style={{ background: '#060a0d' }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,174,239,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 20% 60%, rgba(0,174,239,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 50% 50% at 80% 60%, rgba(0,174,239,0.06) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(0,174,239,0.03) 0%, transparent 70%)
          `
        }}
        animate={{
          background: [
            `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,174,239,0.12) 0%, transparent 60%),
             radial-gradient(ellipse 50% 50% at 20% 60%, rgba(0,174,239,0.08) 0%, transparent 50%),
             radial-gradient(ellipse 50% 50% at 80% 60%, rgba(0,174,239,0.06) 0%, transparent 50%),
             radial-gradient(circle at 50% 50%, rgba(0,174,239,0.03) 0%, transparent 70%)`,
            `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,174,239,0.15) 0%, transparent 60%),
             radial-gradient(ellipse 50% 50% at 20% 60%, rgba(0,174,239,0.10) 0%, transparent 50%),
             radial-gradient(ellipse 50% 50% at 80% 60%, rgba(0,174,239,0.08) 0%, transparent 50%),
             radial-gradient(circle at 50% 50%, rgba(0,174,239,0.05) 0%, transparent 70%)`,
            `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,174,239,0.12) 0%, transparent 60%),
             radial-gradient(ellipse 50% 50% at 20% 60%, rgba(0,174,239,0.08) 0%, transparent 50%),
             radial-gradient(ellipse 50% 50% at 80% 60%, rgba(0,174,239,0.06) 0%, transparent 50%),
             radial-gradient(circle at 50% 50%, rgba(0,174,239,0.03) 0%, transparent 70%)`,
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-1/4 top-1/3 h-80 w-80 rounded-full"
          style={{ background: 'rgba(0,174,239,0.06)', filter: 'blur(100px)' }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.05, 1],
            x: [0, 10, -10, 0],
            y: [0, -10, 10, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-1/4 top-1/4 h-72 w-72 rounded-full"
          style={{ background: 'rgba(0,174,239,0.05)', filter: 'blur(100px)' }}
          animate={{ opacity: [0.1, 0.5, 0.1], y: [0, 25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/3 bottom-20 h-56 w-56 rounded-full"
          style={{ background: 'rgba(0,174,239,0.04)', filter: 'blur(90px)' }}
          animate={{ opacity: [0.1, 0.4, 0.1], x: [0, -25, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Subtle grid overlay for tech feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,174,239,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,174,239,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <ParticleEffects isActive={assemblyPhase !== 'initial'} />

      {/* Assembly glow burst */}
      <AnimatePresence>
        {assemblyPhase === 'complete' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0,174,239,0.10) 0%, transparent 60%)',
                filter: 'blur(50px)',
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: [0, 1, 0] }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0,174,239,0.08) 0%, transparent 60%)',
                filter: 'blur(40px)',
              }}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1.5, opacity: [0, 0.8, 0] }}
              transition={{ duration: 2.5, ease: 'easeOut', delay: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Energy light streaks on assembly */}
      <AnimatePresence>
        {assemblyPhase === 'complete' && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={`streak-${i}`}
                className="absolute pointer-events-none"
                style={{
                  width: 2,
                  height: 120,
                  background: `linear-gradient(to bottom, transparent, rgba(0,174,239,0.4), transparent)`,
                  filter: 'blur(2px)',
                  left: `${30 + i * 14}%`,
                  top: '50%',
                  transform: `rotate(${i * 20 - 30}deg)`,
                  transformOrigin: 'center center',
                }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scaleY: [0, 1.5, 0],
                  y: [-60, 60],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="space-y-6"
            style={{ perspective: 1200 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-lg backdrop-blur-xl"
              style={{
                borderColor: 'rgba(0,174,239,0.2)',
                background: 'rgba(0,174,239,0.04)',
                color: '#00AEEF',
                boxShadow: '0 0 40px rgba(0,174,239,0.06)',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: '#00AEEF', boxShadow: '0 0 12px rgba(0,174,239,0.9)' }}
              />
              UGC · Marketing · Design · Social Media
            </motion.div>

            <motion.h1
              className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl xl:text-7xl"
              style={{ color: '#f0f4f8' }}
              initial={{ opacity: 0, y: 24 }}
              animate={assemblyPhase !== 'initial' ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            >
              Tout ce dont votre marque a besoin.
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #00AEEF, #33C8FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Connecté.
              </span>
            </motion.h1>

            <motion.p
              className="max-w-xl text-lg leading-8 sm:text-xl"
              style={{ color: 'rgba(240,244,248,0.6)' }}
              initial={{ opacity: 0, y: 24 }}
              animate={assemblyPhase !== 'initial' ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
            >
              UGC, marketing, design et social media management réunis
              dans un écosystème créatif.
            </motion.p>

            <motion.div
              className="flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 24 }}
              animate={assemblyPhase === 'complete' ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
            >
              <MagneticButton
                variant="primary"
                onClick={() => { window.location.hash = '#get-started'; }}
              >
                Commencer
              </MagneticButton>
              <MagneticButton
                variant="secondary"
                onClick={() => { window.location.hash = '#services'; }}
              >
                Nos Services
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right — Puzzle / Logo Area with 3D tilt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-[560px]"
            style={{ perspective: 1000 }}
          >
            <motion.div
              className="rounded-[2rem]"
              animate={{
                rotateX: mousePosition.y * -0.3,
                rotateY: mousePosition.x * 0.3,
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[0_0_120px_rgba(0,174,239,0.12)] backdrop-blur-2xl"
                style={{
                  border: '1px solid rgba(255,255,255,0.04)',
                  background: 'rgba(6,10,13,0.4)',
                }}
              />
              <motion.div
                className="relative overflow-hidden rounded-[2rem] p-6 sm:p-8"
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(10,15,20,0.5)',
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle at 50% 40%, rgba(0,174,239,0.06), transparent 60%)',
                  }}
                />
                <div className="relative flex h-full min-h-[500px] items-center justify-center">
                  <motion.div
                    initial="hidden"
                    animate={assemblyPhase === 'assembling' || assemblyPhase === 'complete' ? 'assembled' : 'hidden'}
                    className="relative h-full w-full"
                  >
                    {puzzleServices.map((service, index) => (
                      <PuzzlePiece
                        key={service.id}
                        service={service}
                        index={index}
                        isScrolling={isScrolling}
                        onAssemblyComplete={handlePieceSnap}
                        isHovered={hoveredCard === service.id}
                      />
                    ))}

                    {/* Animated connection lines */}
                    <ConnectionLines isAssembled={assemblyPhase === 'complete'} isVisible />

                    {/* Center logo */}
                    <motion.div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={assemblyPhase === 'complete' ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.2,
                      }}
                    >
                      <div className="relative flex items-center justify-center">
                        <div
                          className="absolute rounded-full"
                          style={{
                            width: 180,
                            height: 180,
                            background: 'radial-gradient(circle, rgba(0,174,239,0.18) 0%, transparent 70%)',
                            filter: 'blur(35px)',
                          }}
                        />
                        <motion.div
                          className="relative flex h-28 w-28 items-center justify-center rounded-full sm:h-32 sm:w-32"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(0,174,239,0.15)',
                            boxShadow: '0 0 60px rgba(0,174,239,0.12), inset 0 0 30px rgba(0,174,239,0.04)',
                          }}
                          animate={{
                            boxShadow: [
                              '0 0 40px rgba(0,174,239,0.10), inset 0 0 20px rgba(0,174,239,0.02)',
                              '0 0 100px rgba(0,174,239,0.30), inset 0 0 50px rgba(0,174,239,0.08)',
                              '0 0 40px rgba(0,174,239,0.10), inset 0 0 20px rgba(0,174,239,0.02)',
                            ],
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          {/* Inner glow ring */}
                          <motion.div
                            className="absolute inset-2 rounded-full"
                            style={{
                              border: '1px solid rgba(0,174,239,0.08)',
                              background: 'radial-gradient(circle, rgba(0,174,239,0.03), transparent)',
                            }}
                            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          />

                          <motion.span
                            className="text-3xl font-black tracking-wider sm:text-4xl"
                            style={{
                              background: 'linear-gradient(135deg, #00AEEF, #33C8FF, #00AEEF)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundSize: '200% 200%',
                              textShadow: '0 0 30px rgba(0,174,239,0.2)',
                            }}
                            animate={{
                              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                          >
                            G
                          </motion.span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Service cards */}
        <AnimatePresence>
          {showServices && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
            >
              {cardServices.map((service, i) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isHovered={hoveredCard === service.id}
                  onHover={setHoveredCard}
                  index={i}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PuzzleHero;
