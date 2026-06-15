import { motion } from 'framer-motion';

const HoverGlow = ({
  children,
  scale = 1.03,
  glowColor = 'rgba(147, 51, 234, 0.3)',
  className = '',
  intensity = 'medium',
  ...props
}) => {
  const glowSizes = {
    subtle: '15px',
    medium: '30px',
    strong: '50px',
  };

  const glowSize = glowSizes[intensity] || glowSizes.medium;

  return (
    <motion.div
      className={`${className} group`}
      whileHover={{
        scale,
        boxShadow: `0 0 ${glowSize} ${glowColor}`,
      }}
      whileTap={{ scale: scale * 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
        mass: 0.8,
      }}
      style={{ willChange: 'transform' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default HoverGlow;