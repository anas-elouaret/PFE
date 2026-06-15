import { motion } from 'framer-motion';

const easings = {
  smooth: [0.16, 1, 0.3, 1],
  spring: [0.34, 1.56, 0.64, 1],
  out: [0.25, 0.46, 0.45, 0.94],
};

const ScrollReveal = ({
  children,
  delay = 0,
  duration = 0.9,
  direction = 'up',
  distance = 50,
  scale = 1,
  className = '',
  once = true,
  margin = "-80px",
  ease = "smooth",
  willChange = true,
}) => {
  const e = typeof ease === "string" ? easings[ease] || easings.smooth : ease;

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
      x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
      scale: scale !== 1 ? scale : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: e,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={variants}
      style={willChange ? { willChange: 'transform, opacity' } : undefined}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;