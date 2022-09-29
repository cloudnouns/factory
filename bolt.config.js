// import ImageData from "./nouns-image-data.json" assert { type: "json" };
import ImageData from "./wizards.json" assert { type: "json" };

const config = {
  items: [
    {
      item: "Wizard",
      config: ImageData,
      options: {
        outDir: "./src/pkg",
        rpc: "",
      },
    },
  ],
};

export default config;
