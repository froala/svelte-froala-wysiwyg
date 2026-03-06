import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: "lib/index.js",
      name: "SvelteFroala",
      fileName: "index"
    },
    rollupOptions: {
      external: ["froala-editor"]
    }
  }
});