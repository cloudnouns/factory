import fs from "fs";
import toml from "@ltd/j-toml";

type ConfigFile = {
  items: Item[];
};

type Item = {
  name: string;
  config_path: string;
  options?: { [key: string]: any };
};

type ImageData = {
  bgcolors: string[];
  palette: string[];
  images: { [key: string]: any[] };
};

const typeTemplate = `export type {ITEM_NAME}Parts = {
	**OBJECT_DEFINITIONS**
};

export type {ITEM_NAME}BgColors = **BG_COLORS**;

**INDIVIDUAL_DEFINITIONS**
`;

export const readConfigAndGenerateTypes = async (
  path: string = "bolt.toml"
) => {
  if (!fs.existsSync(path)) {
    throw new Error("Unable to read or find config file");
  }

  const config = fs.readFileSync(path, "utf-8");
  let { items } = toml.parse(config) as unknown as ConfigFile;
  if (items.length) {
    items.forEach((item) => {
      const imageData = JSON.parse(fs.readFileSync(item.config_path, "utf-8"));
      generateTypes(item.name, imageData);
    });
  }

  return;
};

const generateTypes = (item: string, imageData: ImageData, outDir?: string) => {
  if (!outDir) outDir = "./.bolt/";
  const { bgcolors, images } = imageData;
  const imageKeys = Object.keys(images);

  const entries = imageKeys.map((key) => {
    const entry = {
      trait: key,
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase() + "Layer",
      types: "",
    };

    entry.types = images[key]
      .map((data) => {
        return '"' + data.filename.toLowerCase().replace(/ /g, "-") + '"';
      })
      .join("\n\t| ");

    return entry;
  });

  const bgColors = bgcolors
    .map((hex) => '"#' + hex.toLowerCase().replace(/#/g, "") + '"')
    .join(" | ");

  const definitions = {
    object: entries
      .map((entry) => `${entry.trait}: ${entry.label};`)
      .join("\n\t"),
    individual: entries
      .map((entry) => `export type ${entry.label} =\n\t| ${entry.types};`)
      .join("\n\n"),
  };

  const generated = typeTemplate
    .replace(/{ITEM_NAME}/g, item)
    .replace("**BG_COLORS**", bgColors)
    .replace("**OBJECT_DEFINITIONS**", definitions.object)
    .replace("**INDIVIDUAL_DEFINITIONS**", definitions.individual);

  const outFile = `./src/types/${item.toLowerCase().replace(/ /g, "-")}.ts`;
  fs.writeFileSync(outFile, generated);
};
