import { motion } from 'framer-motion';
import { Children, isValidElement } from 'react';

const easings = {
  smooth: [0.16, 1, 0.3, 1],
  spring: [0.34, 1.56, 0.64, 1],
  out: [0.25, 0.46, 0.45, 0.94],
};

const StaggerContainer = ({
  children,
  staggerDelay = 0.08,
  duration = 0.7,
  yOffset = 30,
  className = '',
  once = true,
  margin = "-80px",
  ease = "smooth",
}) => {
  const e = typeof ease === "string" ? easings[ease] || easings.smooth : ease;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: e,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      style={{ willChange: 'transform, opacity' }}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;
        return (
          <motion.div
            key={child.key || index}
            variants={itemVariants}
            style={{ willChange: 'transform, opacity' }}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StaggerContainer;