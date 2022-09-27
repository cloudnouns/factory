import { ArraySeed, DataLayer, LayerData, Seed, Traits } from "../types";

const getRandomSeed = (layerData: LayerData): Seed => {
  const { bgcolors, images } = layerData;
  const temporarySeed: any = {};

  Object.entries(images).forEach(([trait, items]) => {
    temporarySeed[trait] = Math.floor(Math.random() * items.length);
  });

  return {
    background: Math.floor(Math.random() * bgcolors.length),
    ...temporarySeed,
  };
};

const arrayToSeed = (array: number[], layerData: LayerData): Seed => {
  const layers = ["background", ...Object.keys(layerData.images)];
  const entries = layers.map((layer, i) => [layer, array[i]]);
  return Object.fromEntries(entries);
};

const arrayToTraitNames = (array: number[], layerData: LayerData) => {
  const seed = arrayToSeed(array, layerData);
  return seedToTraitNames(seed, layerData);
};

const seedToArray = (seed: Seed, layerData: LayerData): number[] => {
  const keys = Object.keys(layerData.images);
  const arr = [seed.background];

  keys.forEach((trait) => {
    arr.push(seed[trait as DataLayer]);
  });

  return arr;
};

const seedToTraitNames = (seed: Seed, layerData: LayerData): Traits => {
  const names = Object.entries(seed).map(([layer, value]) => {
    if (layer === "background") {
      return [layer, "#" + layerData.bgcolors[value]];
    }
    const { images } = layerData;
    const image = images[layer as DataLayer][value];
    return [layer, image.filename];
  });

  return Object.fromEntries(names);
};

const traitNamesToArray = (traits: Traits, layerData: LayerData): number[] => {
  const arr = Object.entries(traits).map(([layer, value]) => {
    if (layer === "background") {
      value = value.replace("#", "");
      return layerData.bgcolors.findIndex((color) => value === color);
    }
    const { images } = layerData;
    const index = images[layer as DataLayer].findIndex(
      (image) => value === image.filename
    );
    return index;
  });
  return arr;
};

const traitNamesToSeed = (traits: Traits, layerData: LayerData): Seed => {
  const arr = traitNamesToArray(traits, layerData);
  return arrayToSeed(arr, layerData);
};

export default {
  getRandomSeed,
  arrayToSeed,
  arrayToTraitNames,
  seedToArray,
  seedToTraitNames,
  traitNamesToSeed,
};
