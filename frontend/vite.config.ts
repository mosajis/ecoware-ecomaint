import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import { defineConfig } from "vite";
// @ts-ignore: Unreachable code error

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    outDir: "../build/public",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "lodash"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
