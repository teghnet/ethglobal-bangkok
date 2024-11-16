import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    outDir: "../../encore/vlayer/dist",
    emptyOutDir: true,
    sourcemap: true,
    target: "esnext",
  },
  plugins: [tsconfigPaths()],
});
