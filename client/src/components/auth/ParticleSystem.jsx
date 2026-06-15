import { useCallback, useEffect, useRef } from "react";

const GOLDEN = { r: 0, g: 174, b: 239 };
const WHITE = { r: 255, g: 255, b: 255 };

function lerp(a, b, t) { return a + (b - a) * t; }

export default function ParticleSystem({ isActive = false, count = 80 }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animRef = useRef(null);

  const initParticle = useCallback((w, h) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -Math.random() * 0.25 - 0.05,
    size: Math.random() * 2.5 + 0.8,
    life: Math.random(),
    maxLife: Math.random() * 300 + 200,
    color: Math.random() > 0.6 ? GOLDEN : WHITE,
    alpha: Math.random() * 0.4 + 0.1,
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e) => {
      mouseRef.current.x = e.clientX / w;
      mouseRef.current.y = e.clientY / h;
    };
    window.addEventListener("mousemove", onMouse);

    const particles = particlesRef.current;
    for (let i = 0; i < count; i++) {
      particles.push(initParticle(w, h));
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        if (isActive) {
          const parallaxX = (mx - 0.5) * 15;
          const parallaxY = (my - 0.5) * 15;

          p.x += p.vx + parallaxX * 0.002;
          p.y += p.vy + parallaxY * 0.002;
          p.life++;

          const alphaFactor = p.life < 60 ? p.life / 60 : p.life > p.maxLife - 60 ? (p.maxLife - p.life) / 60 : 1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.alpha * alphaFactor})`;
          ctx.fill();

          if (p.color === GOLDEN && p.size > 1.5) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${GOLDEN.r},${GOLDEN.g},${GOLDEN.b},${0.04 * alphaFactor})`;
            ctx.fill();
          }

          if (p.life > p.maxLife || p.y < -20 || p.x < -20 || p.x > w + 20) {
            Object.assign(p, initParticle(w, h));
            p.y = h + 10;
          }
        }
      }

      if (isActive) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              const alpha = (1 - dist / 120) * 0.06;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(0,174,239,${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [isActive, count, initParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10"
      style={{ opacity: isActive ? 1 : 0, transition: "opacity 1.5s ease" }}
    />
  );
}
