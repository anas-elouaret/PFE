import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

const Parallax = ({
  children,
  speed = 0.5,
  className = '',
  type = 'translateY',
  spring = true,
  damping = 50,
  stiffness = 400,
  offset = ['start end', 'end start'],
  ...props
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, 1 + speed * 0.05]);

  const y = spring ? useSpring(rawY, { damping, stiffness }) : rawY;
  const scale = spring ? useSpring(rawScale, { damping, stiffness }) : rawScale;

  const style = type === 'scale'
    ? { scale, willChange: 'transform' }
    : { y, willChange: 'transform' };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Parallax;