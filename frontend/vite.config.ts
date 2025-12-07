import * as path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

// @ts-ignore: Unreachable code error

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: "dist-stats.html",
    }),
  ],
  build: {
    cssCodeSplit: true,
    minify: "esbuild",
    outDir: "../build/public",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // MUI Libraries
          if (id.includes("node_modules")) {
            if (id.includes("@mui/material")) return "mui-core";
            if (id.includes("@mui/icons-material")) return "mui-icons";
            if (id.includes("@emotion")) return "emotion";
            if (id.includes("@mui/x-data-grid")) return "datagrid";
            if (id.includes("react-dom")) return "react-vendor";
            if (id.includes("react")) return "react-vendor";
            if (id.includes("lodash-es")) return "lodash-es";
            return "vendors";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
