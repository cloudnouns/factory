import type { Layers } from "./src/types";
import fs from "fs";
import toml from "@ltd/j-toml";

export type BoltConfig = {
  items: BoltItem[];
};

export interface BoltItem {
  name: string;
  config_path: string;
  options?: { [key: string]: any };
}

const typeTemplate = `export interface **ITEM_NAME** extends Traits {
  dataUrl: string;
  seed: Seed;
}

export type Traits = {
	**TRAIT_DEFINITIONS**
 }

export type Seed = { [key in Layer]: number };
export type ArraySeed = [**ARRAY_SEED**];
export type PartialTraits = { [T in keyof Traits]?: Traits[T] }

export type DataLayer = **DATA_LAYER_NAMES**;
export type Layer = "background" | DataLayer;
export type Layers = {
  bgcolors: string[];
  palette: string[];
  images: Images;
}

type Images = { [key in DataLayer]: EncodedImage[] };

type EncodedImage = {
  filename: string;
  data: string;
}

export interface DecodedImage {
  paletteIndex: number;
  bounds: ImageBounds;
  rects: [length: number, colorIndex: number][];
}

interface ImageBounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Types below are generated from config file

**TRAIT_TYPES**
`;

export const generateTypes = (
  item: string,
  layers: Layers,
  outDir?: string
) => {
  if (!outDir) outDir = "./.bolt/";
  const { bgcolors, images } = layers;
  const layerKeys = ["background", ...Object.keys(images)];

  const entries = layerKeys.map((key) => {
    const entry = {
      trait: key,
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase() + "Layer",
      types: "",
    };

    if (key === "background") {
      entry.label = "BackgroundColor";
      entry.types = bgcolors
        .map((hex) => '"#' + hex.toLowerCase().replace(/#/g, "") + '"')
        .join("\n\t| ");
    } else {
      entry.types = images[key as keyof Layers["images"]]
        .map((data) => {
          return '"' + data.filename.toLowerCase().replace(/ /g, "-") + '"';
        })
        .join("\n\t| ");
    }

    return entry;
  });

  const definitions = entries
    .map((entry) => `${entry.trait}: ${entry.label};`)
    .join("\n\t");
  const layerCountString = layerKeys.map((k) => "number").join(", ");
  const dataLayerNamees = layerKeys
    .filter((k) => k !== "background")
    .map((k) => `"${k}"`)
    .join(` | `);
  const traitTypes = entries
    .map((entry) => `export type ${entry.label} =\n\t| ${entry.types};`)
    .join("\n\n");

  const generated = typeTemplate
    .replace("**ITEM_NAME**", item)
    .replace("**TRAIT_DEFINITIONS**", definitions)
    .replace("**ARRAY_SEED**", layerCountString)
    .replace("**DATA_LAYER_NAMES**", dataLayerNamees)
    .replace("**TRAIT_TYPES**", traitTypes);

  const outFile = `./src/types/${item.toLowerCase().replace(/ /g, "-")}.ts`;

  fs.writeFile(outFile, generated, (err) => {
    if (err) throw err;
  });
};

const config = fs.readFileSync("bolt.toml", "utf8");
let { items } = toml.parse(config) as unknown as BoltConfig;
if (items.length) {
  items.forEach((item) => {
    const layers = JSON.parse(fs.readFileSync(item.config_path, "utf-8"));
    generateTypes(item.name, layers);
  });
}
