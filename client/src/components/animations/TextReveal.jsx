import { motion } from 'framer-motion';

const easings = {
  smooth: [0.16, 1, 0.3, 1],
  spring: [0.34, 1.56, 0.64, 1],
  out: [0.25, 0.46, 0.45, 0.94],
};

const TextReveal = ({
  text,
  className = '',
  delay = 0,
  duration = 0.8,
  mode = 'word',
  once = true,
  margin = "-60px",
  ease = "smooth",
  ...props
}) => {
  const e = typeof ease === "string" ? easings[ease] || easings.smooth : ease;

  if (mode === 'word' || mode === 'char') {
    const isChar = mode === 'char';
    const items = isChar ? text.split('') : text.split(' ');

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: isChar ? 0.015 : 0.06,
          delayChildren: delay,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20, rotateX: 15 },
      visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
          duration: duration * 0.7,
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
        {...props}
      >
        {items.map((item, index) => (
          <motion.span
            key={index}
            variants={itemVariants}
            style={{
              display: isChar ? 'inline-block' : 'inline-block',
              whiteSpace: isChar ? 'inline' : 'inline',
              marginRight: isChar ? '0' : '0.25em',
            }}
          >
            {item === ' ' ? '\u00A0' : item}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
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
      style={{ willChange: 'transform, opacity' }}
      {...props}
    >
      {text}
    </motion.div>
  );
};

export default TextReveal;