import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LightEngine({ isOn, intensity = 1 }) {
  const styleRef = useRef(null);

  useEffect(() => {
    const target = {
      bloomOpacity: isOn ? 0.6 * intensity : 0,
      fogOpacity: isOn ? 0.4 * intensity : 0,
      glowIntensity: isOn ? 1 : 0,
      cardReveal: isOn ? 1 : 0,
      ambientWarmth: isOn ? 1 : 0,
      topEdgeGlow: isOn ? 1 : 0,
    };

    gsap.to(target, {
      bloomOpacity: isOn ? 0.6 * intensity : 0,
      fogOpacity: isOn ? 0.4 * intensity : 0,
      glowIntensity: isOn ? 1 : 0,
      cardReveal: isOn ? 1 : 0,
      ambientWarmth: isOn ? 1 : 0,
      topEdgeGlow: isOn ? 1 : 0,
      duration: 1.2,
      ease: "power3.inOut",
      onUpdate: () => {
        const root = document.documentElement;
        root.style.setProperty("--lamp-bloom", target.bloomOpacity);
        root.style.setProperty("--lamp-fog", target.fogOpacity);
        root.style.setProperty("--lamp-glow", target.glowIntensity);
        root.style.setProperty("--lamp-card-reveal", target.cardReveal);
        root.style.setProperty("--lamp-ambient-warmth", target.ambientWarmth);
        root.style.setProperty("--lamp-top-edge", target.topEdgeGlow);
      },
    });
  }, [isOn, intensity]);

  return null;
}
