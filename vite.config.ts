import { defineConfig } from "vite";
import { resolve } from "path";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte({
    preprocess: [
      {
        markup: ({ content, filename }) =>
          filename?.endsWith("/json-viewer/src/lib/JsonViewer.svelte")
            ? { code: content.replace('<svelte:options customElement="json-viewer" />', "") }
            : undefined,
      },
      vitePreprocess(),
    ],
  })],
  resolve: {
    alias: {
      "@": resolve("json-viewer/src"),
      "@utils": resolve("json-viewer/src/utils"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: { api: "modern-compiler" },
    },
  },
  build: {
    outDir: "dist",
    lib: {
      entry: "src/content.ts",
      name: "JsonViewerExtension",
      formats: ["iife"],
      fileName: () => "content.js",
    },
  },
});
