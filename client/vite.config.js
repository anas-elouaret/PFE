import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/") || id.includes("node_modules/react-router-dom")) return "vendor";
          if (id.includes("node_modules/framer-motion") || id.includes("node_modules/gsap")) return "animation";
          if (id.includes("node_modules/three") || id.includes("node_modules/@react-three")) return "three";
          if (id.includes("node_modules/lucide-react") || id.includes("node_modules/react-icons")) return "ui";
          if (id.includes("node_modules/i18next")) return "i18n";
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
});
