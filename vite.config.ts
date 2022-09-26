import type { UserConfig } from "vite";
import path from "path";

const config: UserConfig = {
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Bolt",
      fileName: (format) => `bolt.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {},
    },
  },
};

export default config;
