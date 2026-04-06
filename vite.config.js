import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: "dist",
    lib: {
      entry: "lib/index.js",
      name: "SvelteFroala",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ["svelte", "svelte/internal", "froala-editor"],
      output: {
        globals: {
          "svelte": "Svelte",
          "froala-editor": "FroalaEditor"
        }
      }
    }
  }
});