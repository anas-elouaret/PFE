import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            animation: ["framer-motion", "gsap"],
            three: ["three", "@react-three/fiber", "@react-three/drei"],
            ui: ["lucide-react", "react-icons"],
            i18n: ["i18next", "react-i18next", "i18next-browser-languagedetector"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
    },
    optimizeDeps: {
      include: ["hls.js", "three"],
      exclude: ["@react-three/fiber"],
    },
    plugins: [
      tailwindcss(),
      react(),
    ],
  };
});
