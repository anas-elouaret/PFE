import { useState, useCallback } from 'react';

interface TiltPosition {
  x: number;
  y: number;
}

interface UseTiltReturn {
  tilt: TiltPosition;
  handlers: {
    onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
    onMouseLeave: () => void;
  };
}

export const useTilt = (intensity: number = 0.5): UseTiltReturn => {
  const [tilt, setTilt] = useState<TiltPosition>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotationX = ((y - rect.height / 2) / rect.height) * intensity * -1;
    const rotationY = ((x - rect.width / 2) / rect.width) * intensity;

    setTilt({ x: rotationX, y: rotationY });
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return {
    tilt,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
};

export default useTilt;
