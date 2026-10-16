import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",

  build: {
    outDir: "../dist",

    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        details: resolve(__dirname, "src/anime-details/index.html"),
        findScene: resolve(__dirname, "src/find_scene/index.html"),
      },
    },
  },
});