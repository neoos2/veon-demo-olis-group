// VEON demo base: technical setup only. Visual design comes from design/concept.md of each client.
// The demo is published under a sub-path (GitHub Pages), so every built asset is linked relatively:
// assetsPrefix "." gives ./_astro/… and stylesheets are inlined, so font url()s resolve from index.html.
import { defineConfig } from "astro/config";

export default defineConfig({
  build: { inlineStylesheets: "always", assetsPrefix: "." },
  compressHTML: true,
});
