import { LayerData, Noun } from "../types";

export const getRandomSeed = (layerData: LayerData): Noun => {
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
