import {
  ArraySeed,
  DataLayer,
  Layers,
  PartialTraits,
  Seed,
  Traits,
} from "../types";

const getRandomSeed = (layers: Layers): Seed => {
  const { bgcolors, images } = layers;
  const temporarySeed: any = {};

  Object.entries(images).forEach(([trait, items]) => {
    temporarySeed[trait] = Math.floor(Math.random() * items.length);
  });

  return {
    background: Math.floor(Math.random() * bgcolors.length),
    ...temporarySeed,
  };
};

const arrayToSeed = (array: number[], layers: Layers): Seed => {
  const arr = ["background", ...Object.keys(layers.images)];
  const entries = arr.map((layer, i) => [layer, array[i]]);
  return Object.fromEntries(entries);
};

const arrayToTraits = (array: number[], layers: Layers) => {
  const seed = arrayToSeed(array, layers);
  return seedToTraits(seed, layers);
};

const seedToArray = (seed: Seed, layers: Layers): number[] => {
  const keys = Object.keys(layers.images);
  const arr = [seed.background];

  keys.forEach((trait) => {
    arr.push(seed[trait as DataLayer]);
  });

  return arr;
};

const seedToTraits = (seed: Seed, layers: Layers): Traits => {
  const names = Object.entries(seed).map(([layer, value]) => {
    if (layer === "background") {
      return [layer, "#" + layers.bgcolors[value]];
    }
    const { images } = layers;
    const image = images[layer as DataLayer][value];
    return [layer, image.filename];
  });

  return Object.fromEntries(names);
};

const traitsToArray = (
  traits: Traits | PartialTraits,
  layers: Layers
): number[] => {
  const seed = traitsToSeed(traits, layers);
  return seedToArray(seed, layers);
};

const traitsToSeed = (traits: Traits | PartialTraits, layers: Layers): Seed => {
  const seed = getRandomSeed(layers);

  Object.entries(traits).forEach(([layer, value]) => {
    if (layer === "background") {
      const index = layers.bgcolors.findIndex(
        (color) => value.replace("#", "") === color
      );
      seed.background = index;
    } else if (Object.keys(seed).includes(layer)) {
      const { images } = layers;
      const index = images[layer as DataLayer].findIndex(
        (image) => value === image.filename
      );
      seed[layer as DataLayer] = index;
    }
  });

  return seed;
};

export default {
  getRandomSeed,
  arrayToSeed,
  arrayToTraits,
  seedToArray,
  seedToTraits,
  traitsToArray,
  traitsToSeed,
};
