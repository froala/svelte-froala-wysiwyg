import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";


export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    include: ["svelte"]
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    commonjsOptions: {
      transformMixedEsModules: true    // ← Vite's built-in, no extra plugin needed
    },
    lib: {
      entry: "lib/index.js",
      name: "SvelteFroala",
      formats: ["iife"],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ["froala-editor"],
      output: {
        globals: {
          "froala-editor": "FroalaEditor"
        }
      }
    }
  }
});