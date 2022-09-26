import { ArraySeed, DataLayer, LayerData, Seed } from "../types";

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

const seedToArray = (seed: Seed, layerData: LayerData): number[] => {
  const fromConfig = Object.keys(layerData.images);
  const arr = [seed.background];

  fromConfig.forEach((trait) => {
    arr.push(seed[trait as DataLayer]);
  });

  return arr;
};

export default {
  getRandomSeed,
  seedToArray,
};
