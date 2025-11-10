import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import {defineConfig} from "vite";
// @ts-ignore: Unreachable code error
import {tanstackRouter} from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    react(),

    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
  ],
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