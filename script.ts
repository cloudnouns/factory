import fs from "fs";
import Config from "./kit.config.js";

const { layers } = Config;

const labels: string[] = [];
const typeLabels: string[] = [];
const typeOpts: string[] = [];

const bgTypes = layers.bgcolors
  .map((color: string) => `"#${color.toLowerCase().replace(/#/g, "")}"`)
  .join("\n\t| ");
typeOpts.push("type BackgroundColor = \n\t| " + bgTypes + ";");

Object.entries(layers.images).forEach(([label, items]) => {
  const typeLabel =
    label.charAt(0).toUpperCase() + label.slice(1).toLowerCase() + "Layer";
  labels.push(label);
  typeLabels.push(`${label}?: ${typeLabel};`);

  const typeString = `type ${typeLabel} = \n\t| `;
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
	options?: { [key: string]: string };
  layers: LayerData;
}

export interface **ITEM_LABEL** extends Traits {
  dataUrl: string;
  seed: Seed;
}

type LayerData = {
  bgcolors: string[];
  palette: string[];
  images: Images;
};
type Layer = "background" | DataLayer;
type DataLayer = **DATA_LAYER_LABELS**;
type Images = { [key in DataLayer]: Image[] };
type Image = {
  filename: string;
  data: string;
};
type Seed = { [key in Layer]: number };
type ArraySeed = [**ARRAY_SEED**];
type Traits = { [key in Layer]: string };
type PartialTraits = {
	background?: BackgroundColor;
	**LAYER_TYPE_LABELS**
};

**DATA_LAYER_TYPES**
`;

const template = configTemplate
  .replace("**ITEM_LABEL**", Config.item)
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

fs.writeFile("./src/types/index.d.ts", template, (err) => {
  if (err) throw err;
});
