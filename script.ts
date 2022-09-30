import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
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

  if (!existsSync("./.bolt")) mkdirSync("./.bolt");

  for (const item of items) {
    const imageData = JSON.parse(readFileSync(item.config_path, "utf-8"));
    const { path, content } = generateTypes(item.name, imageData);
    writeFileSync(path, content);
  }

  // if (existsSync("tsconfig.json")) {
  //   const config = JSON.parse(readFileSync("tsconfig.json", "utf-8"));
  //   let { compilerOptions } = config;

  //   if (compilerOptions.typeRoots) {
  //     const { typeRoots } = compilerOptions;
  //     if (typeRoots.includes("./.bolt")) return;
  //     compilerOptions.typeRoots.push("./.bolt");
  //   } else {
  //     compilerOptions = {
  //       typeRoots: ["node_modules/@types", "./.bolt"],
  //       ...compilerOptions,
  //     };
  //   }

  //   config.compilerOptions = compilerOptions;
  //   writeFileSync("tsconfig.json", JSON.stringify(config, null, 2));
  // } else {
  //   console.log('TSConfig not found. Remember to add "./.bolt" to typeRoots');
  // }

  return;
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
