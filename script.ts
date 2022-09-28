import fs from "fs";
import Config from "./bolt.config.js";

const Item = Config.items[0];
const { item, config } = Item;

const layers = config;

const labels: string[] = [];
const typeLabels: string[] = [];
const typeOpts: string[] = [];

const bgTypes = layers.bgcolors
  .map((color: string) => `"#${color.toLowerCase().replace(/#/g, "")}"`)
  .join("\n\t| ");
typeOpts.push("export type BackgroundColor = \n\t| " + bgTypes + ";");

Object.entries(layers.images).forEach(([label, items]) => {
  const firstLetter = label.charAt(0).toUpperCase();
  const typeLabel = firstLetter + label.slice(1).toLowerCase() + "Layer";
  labels.push(label);
  typeLabels.push(`${label}: ${typeLabel};`);

  const typeString = `export type ${typeLabel} = \n\t| `;
  const types = items
    .map(({ filename }) => `'${filename.toLowerCase().replace(/ /g, "-")}'`)
    .join("\n\t| ");
  typeOpts.push(typeString + types + ";");
});

/**
 * **ITEM_LABEL** e.g. Noun, Lost Noun, Punk, Wizard, etc...
 * **DATA_LAYER_LABELS** e.g. "bodies" | "accessories" | "heads" | "glasses";
 * **LAYER_TYPE_LABELS** e.g. bodies?: BodyLayer; heads?: HeadLayer;
 * **ARRAY_SEED** DATA_LAYER_LABELS.length + 1 (for background)
 * **DATA_LAYER_TYPES**
 */
const configTemplate = `export interface BoltConfig {
  item: string;
	options?: { [key: string]: any };
  layers: Layers;
}

export interface **ITEM_LABEL** extends Traits {
  dataUrl: string;
  seed: Seed;
}

export type Traits = {
	background: BackgroundColor;
	**LAYER_TYPE_LABELS**
 }

export type Seed = { [key in Layer]: number };
export type ArraySeed = [**ARRAY_SEED**];
export type PartialTraits = { [T in keyof Traits]?: Traits[T] }

export type DataLayer = **DATA_LAYER_LABELS**;
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

**DATA_LAYER_TYPES**
`;

const template = configTemplate
  .replace("**ITEM_LABEL**", item)
  .replace(
    "**DATA_LAYER_LABELS**",
    labels.map((label) => `"${label}"`).join(" | ")
  )
  .replace(
    "**ARRAY_SEED**",
    new Array(labels.length + 1).fill("number").join(", ")
  )
  .replace("**LAYER_TYPE_LABELS**", typeLabels.join("\n\t"))
  .replace("**DATA_LAYER_TYPES**", typeOpts.join("\n\n"));

fs.writeFile("./src/types/index.ts", template, (err) => {
  if (err) throw err;
});
