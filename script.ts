import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import rimraf from "rimraf";
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

const template = `export type {ITEM_NAME}Parts = {
	**OBJECT_DEFINITIONS**
};

export type {ITEM_NAME}BgColors = **BG_COLORS**;

**INDIVIDUAL_DEFINITIONS**
`;

export const readConfigAndGenerateTypes = async (
  path: string = "bolt.toml"
) => {
  if (!existsSync(path)) {
    throw new Error("Unable to find or read config file");
  }

  const config = readFileSync(path, "utf-8");
  let { items } = toml.parse(config) as unknown as ConfigFile;

  if (existsSync("./.bolt")) rimraf("./.bolt", () => {});
  else mkdirSync("./.bolt");

  for (const item of items) {
    const { name, config_path } = item;
    const imageData = JSON.parse(readFileSync(config_path, "utf-8"));
    const { path, content } = generateTypes(item.name, imageData);
    writeFileSync(path, content);

    console.log();
  }

  return;
};

export const createConfigFile = () => {
  const template = `[[items]]\nname = 'Item Name'\nconfig_path = '/path_to_config_file'`;
  writeFileSync("bolt.toml", template);
};

const generateTypes = (item: string, imageData: ImageData) => {
  item = item.replace(/ /g, "");
  const path = `./.bolt/${item.toLowerCase()}.ts`;
  const { bgcolors, images } = imageData;
  const parts = Object.keys(images);

  const entries = parts.map((part) => {
    const entry = {
      part,
      label:
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() + "Part",
      types: "",
    };

    entry.types = images[part]
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
      .map((entry) => `${entry.part}: ${entry.label};`)
      .join("\n\t"),
    individual: entries
      .map((entry) => `export type ${entry.label} =\n\t| ${entry.types};`)
      .join("\n\n"),
  };

  const content = template
    .replace(/{ITEM_NAME}/g, item)
    .replace("**BG_COLORS**", bgColors)
    .replace("**OBJECT_DEFINITIONS**", definitions.object)
    .replace("**INDIVIDUAL_DEFINITIONS**", definitions.individual);

  return { path, content };
};
