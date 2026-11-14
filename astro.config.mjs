// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  // Public URL, set at build time so the real domain is not stored in the repo.
  site: process.env.SITE_URL || undefined,
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file",
    inlineStylesheets: "never",
  },
  vite: {
    build: {
      // Emit scripts as separate files so the Content-Security-Policy can forbid inline scripts.
      assetsInlineLimit: 0,
    },
  },
});
