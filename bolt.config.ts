import ImageData from "./nouns-image-data.json" assert { type: "json" };
// import ImageData from "./wizards.json" assert { type: "json" };

const config = {
  item: "Noun",
  layers: ImageData,
  options: {
    dir: "./src/pkg",
  },
};

export default config;
