import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mouse = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

const scroll = { progress: 0 };

const S = 0.45;
const T = 0.2;

function createPuzzleShape(top, right, bottom, left) {
  const s = new THREE.Shape();
  s.moveTo(-S, S);

  if (top === "tab") {
    s.lineTo(-T, S);
    s.quadraticCurveTo(-T, S + T, 0, S + T);
    s.quadraticCurveTo(T, S + T, T, S);
    s.lineTo(S, S);
  } else if (top === "hole") {
    s.lineTo(-T, S);
    s.quadraticCurveTo(-T, S - T, 0, S - T);
    s.quadraticCurveTo(T, S - T, T, S);
    s.lineTo(S, S);
  } else {
    s.lineTo(S, S);
  }

  if (right === "tab") {
    s.lineTo(S, T);
    s.quadraticCurveTo(S + T, T, S + T, 0);
    s.quadraticCurveTo(S + T, -T, S, -T);
    s.lineTo(S, -S);
  } else if (right === "hole") {
    s.lineTo(S, T);
    s.quadraticCurveTo(S - T, T, S - T, 0);
    s.quadraticCurveTo(S - T, -T, S, -T);
    s.lineTo(S, -S);
  } else {
    s.lineTo(S, -S);
  }

  if (bottom === "tab") {
    s.lineTo(T, -S);
    s.quadraticCurveTo(T, -(S + T), 0, -(S + T));
    s.quadraticCurveTo(-T, -(S + T), -T, -S);
    s.lineTo(-S, -S);
  } else if (bottom === "hole") {
    s.lineTo(T, -S);
    s.quadraticCurveTo(T, -(S - T), 0, -(S - T));
    s.quadraticCurveTo(-T, -(S - T), -T, -S);
    s.lineTo(-S, -S);
  } else {
    s.lineTo(-S, -S);
  }

  if (left === "tab") {
    s.lineTo(-S, -T);
    s.quadraticCurveTo(-(S + T), -T, -(S + T), 0);
    s.quadraticCurveTo(-(S + T), T, -S, T);
    s.lineTo(-S, S);
  } else if (left === "hole") {
    s.lineTo(-S, -T);
    s.quadraticCurveTo(-(S - T), -T, -(S - T), 0);
    s.quadraticCurveTo(-(S - T), T, -S, T);
    s.lineTo(-S, S);
  } else {
    s.lineTo(-S, S);
  }

  return s;
}

const pieceConfigs = [
  { edges: { top: "straight", right: "tab", bottom: "tab", left: "straight" } },
  { edges: { top: "straight", right: "straight", bottom: "tab", left: "hole" } },
  { edges: { top: "hole", right: "tab", bottom: "straight", left: "straight" } },
  { edges: { top: "hole", right: "straight", bottom: "straight", left: "hole" } },
];

const piecePositions = [
  [-S, S, 0],
  [S, S, 0],
  [-S, -S, 0],
  [S, -S, 0],
];

const pieceMaterials = [
  {
    color: "#0a0a0f",
    metalness: 0.95,
    roughness: 0.04,
    clearcoat: 0.8,
    clearcoatRoughness: 0.05,
    envMapIntensity: 4.0,
    emissive: "#0ea5e9",
    emissiveIntensity: 0.2,
  },
  {
    color: "#1a1a2e",
    metalness: 0.92,
    roughness: 0.07,
    clearcoat: 0.7,
    clearcoatRoughness: 0.07,
    envMapIntensity: 3.5,
    emissive: "#00AEEF",
    emissiveIntensity: 0.16,
  },
  {
    color: "#16213e",
    metalness: 0.90,
    roughness: 0.09,
    clearcoat: 0.6,
    clearcoatRoughness: 0.09,
    envMapIntensity: 3.0,
    emissive: "#3b82f6",
    emissiveIntensity: 0.14,
  },
  {
    color: "#0f3460",
    metalness: 0.93,
    roughness: 0.06,
    clearcoat: 0.75,
    clearcoatRoughness: 0.06,
    envMapIntensity: 3.8,
    emissive: "#38bdf8",
    emissiveIntensity: 0.18,
  },
];

const extrudeSettings = {
  depth: 0.15,
  bevelEnabled: true,
  bevelThickness: 0.035,
  bevelSize: 0.018,
  bevelSegments: 12,
  curveSegments: 32,
};

function PuzzlePiece({ config, materialProps, position, floatOffset }) {
  const meshRef = useRef();
  const geometry = useMemo(() => {
    const shape = createPuzzleShape(
      config.edges.top,
      config.edges.right,
      config.edges.bottom,
      config.edges.left
    );
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const floatY = Math.sin(state.clock.elapsedTime * 0.6 + floatOffset) * 0.025;
      meshRef.current.position.y = floatY;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <meshPhysicalMaterial {...materialProps} />
    </mesh>
  );
}

function PuzzleLogo() {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;

    const targetRotY = mouse.x * 0.25;
    const targetRotX = mouse.y * 0.12;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.04;

    const floatY = Math.sin(state.clock.elapsedTime * 0.5) * 0.06;
    groupRef.current.position.y = floatY;

    const p = scroll.progress;
    const s = 1 - p * 0.5;
    groupRef.current.scale.setScalar(s);
    groupRef.current.position.y = floatY + p * -0.8;
    groupRef.current.position.z = p * -0.6;
    groupRef.current.rotation.x += (targetRotX + p * 0.25 - groupRef.current.rotation.x) * 0.03;
  });

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 4]}>
      <group rotation={[0, 0, -Math.PI / 4]}>
        {piecePositions.map((pos, i) => (
          <PuzzlePiece
            key={i}
            config={pieceConfigs[i]}
            materialProps={pieceMaterials[i]}
            position={pos}
            floatOffset={i * 1.2}
          />
        ))}
      </group>
    </group>
  );
}

function ParticleField({ count = 150 }) {
  const ref = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#0ea5e9"),
      new THREE.Color("#00AEEF"),
      new THREE.Color("#3b82f6"),
      new THREE.Color("#38bdf8"),
      new THREE.Color("#ffffff"),
    ];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 3 + Math.random() * 4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * 0.6;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.008) * 0.04;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function LogoScene() {
  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.08} color="#4466aa" />
      <directionalLight position={[5, 7, 6]} intensity={2.0} color="#88bbff" />
      <directionalLight position={[-4, -3, 5]} intensity={0.6} color="#00AEEF" />
      <pointLight position={[-4, 3, 6]} intensity={0.8} color="#0ea5e9" />
      <pointLight position={[4, -2, 7]} intensity={0.5} color="#33C8FF" />
      <pointLight position={[0, 0, 8]} intensity={0.3} color="#ffffff" />
      <PuzzleLogo />
      <ParticleField />
      <ContactShadows position={[0, -2.2, 0]} opacity={0.35} scale={8} blur={2.5} far={4} color="#000000" />
    </>
  );
}

export default function GrowstackScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom 15%",
        scrub: 1.2,
        onUpdate: (self) => { scroll.progress = self.progress; },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-svh relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <Canvas
        camera={{ position: [0, 0.1, 4.8], fov: 42 }}
        gl={{ antialias: true, alpha: true, outputColorSpace: "srgb", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.3 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <LogoScene />
        <EffectComposer>
          <Bloom intensity={1.0} kernelSize={3} luminanceThreshold={0.15} luminanceSmoothing={0.7} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.001, 0.001]} />
          <Noise opacity={0.015} />
        </EffectComposer>
      </Canvas>
    </motion.div>
  );
}
