import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { playArrivalSound } from "../../utils/sounds";

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const getQuadraticPoint = (t, p0, p1, p2) => ({
  x: Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x,
  y: Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y,
});

const createParticleConfig = () => {
  const angle = Math.random() * Math.PI * 2;
  const distance = 18 + Math.random() * 20;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 8,
    size: 4 + Math.random() * 4,
    delay: Math.random() * 0.12,
    opacity: 0.35 + Math.random() * 0.35,
    color: `rgba(124,58,237,${0.22 + Math.random() * 0.18})`,
  };
};

export default function FlyingItem({ item, targetRect, onComplete, setShakeCart }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const particles = useMemo(() => Array.from({ length: 6 }, () => createParticleConfig()), []);

  if (!item || !targetRect || !item.startRect) return null;

  const startRect = item.startRect;
  const startPoint = { x: startRect.left, y: startRect.top };
  const endPoint = {
    x: targetRect.left + targetRect.width / 2 - startRect.width / 2,
    y: targetRect.top + targetRect.height / 2 - startRect.height / 2,
  };
  const controlPoint = {
    x: (startPoint.x + endPoint.x) / 2,
    y: Math.min(startPoint.y, endPoint.y) - Math.max(120, startRect.height),
  };

  useEffect(() => {
    const duration = 700;
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const t = Math.min(elapsed / duration, 1);
      setProgress(easeOutCubic(t));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
        playArrivalSound();
        setShakeCart(true);
        window.setTimeout(() => onComplete(), 100);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startTimeRef.current = null;
    };
  }, [endPoint.x, endPoint.y, onComplete, setShakeCart]);

  const position = getQuadraticPoint(progress, startPoint, controlPoint, endPoint);
  const scale = 1 - progress * 0.45;
  const rotate = progress * 28;
  const opacity = 1 - progress * 0.35;
  const glow = 0.1 + progress * 0.2;

  return (
    <motion.div
      className="fixed z-50 pointer-events-none rounded-full bg-white/10 shadow-[0_0_40px_rgba(124,58,237,0.25)] backdrop-blur-md"
      initial={{
        left: startRect.left,
        top: startRect.top,
        width: startRect.width,
        height: startRect.height,
        opacity: 1,
        rotate: 0,
        filter: "blur(0px)"
      }}
      animate={{
        left: endPoint.x,
        top: endPoint.y,
        width: 36,
        height: 36,
        opacity: 0.75,
        rotate: 25,
        filter: "blur(2px)"
      }}
      transition={{
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1]
      }}
      onAnimationComplete={() => {
        playArrivalSound();
        setShakeCart(true);
        onComplete();
      }}
      style={{
        willChange: "transform, width, height, filter"
      }}
    >
      <div className="relative h-full w-full flex items-center justify-center text-lg text-white">
        {item.image}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/30 via-violet-500/20 to-blue-400/20"
          animate={{ opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}