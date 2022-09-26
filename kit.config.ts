import type { BoltConfig } from "./src/types/index.js";
import ImageData from "./nouns-image-data.json" assert { type: "json" };

const config: BoltConfig = {
  item: "Noun",
  layers: ImageData,
};

export default config;
