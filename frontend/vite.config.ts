import * as path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: "dist-stats.html",
    }),
  ],
  build: {
    cssCodeSplit: true,
    minify: "esbuild",
    outDir: "../build/public",
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
