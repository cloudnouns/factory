import type { Layers, DataLayer, Seed } from "../types";

export const getItemParts = (seed: Seed, layers: Layers) => {
  const { bgcolors, images } = layers;
  const dataLayers = Object.entries(seed).filter(([layer]) => {
    return layer !== "background";
  });

  return {
    parts: dataLayers.map(([layer, value]) => {
      return images[layer as DataLayer][value];
    }),
    background: bgcolors[seed.background],
  };
};
