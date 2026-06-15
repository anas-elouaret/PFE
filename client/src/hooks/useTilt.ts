'use client';

import { useRef, useState, useCallback } from 'react';

interface TiltPosition {
  x: number;
  y: number;
}

interface UseTiltReturn {
  ref: React.RefObject<HTMLDivElement>;
  tilt: TiltPosition;
}

export const useTilt = (intensity: number = 0.5): UseTiltReturn => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltPosition>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotationX = ((y - rect.height / 2) / rect.height) * intensity * -1;
    const rotationY = ((x - rect.width / 2) / rect.width) * intensity;

    setTilt({ x: rotationX, y: rotationY });
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  if (ref.current) {
    ref.current.addEventListener('mousemove', handleMouseMove as any);
    ref.current.addEventListener('mouseleave', handleMouseLeave as any);
  }

  return { ref, tilt };
};

export default useTilt;
