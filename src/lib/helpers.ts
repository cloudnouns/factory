import type { DataLayer, Layers, PartialTraits, Seed, Traits } from "../types";
import type { BigNumberish } from "@ethersproject/bignumber";
import { keccak256 as solidityKeccak256 } from "@ethersproject/solidity";
import { getPseudorandomPart } from "./builder.js";

const getSeedFromBlockHash = (
  id: BigNumberish,
  blockHash: string,
  layers: Layers
): Seed => {
  const { bgcolors, images } = layers;
  const pseudorandomness = solidityKeccak256(
    ["bytes32", "uint256"],
    [blockHash, id]
  );
  const keys = ["background", ...Object.keys(images)];
  const seed: any = {};

  keys.forEach((key, i) => {
    if (key === "background") {
      seed.background = getPseudorandomPart(
        pseudorandomness,
        bgcolors.length,
        0
      );
    } else {
      seed[key] = getPseudorandomPart(
        pseudorandomness,
        images[key as DataLayer].length,
        i * 48
      );
    }
  });

  return seed;
};

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
  const traits = Object.entries(seed).map(([layer, value]) => {
    if (layer === "background") {
      return [layer, "#" + layers.bgcolors[value]];
    }
    const { images } = layers;
    const image = images[layer as DataLayer][value];
    return [layer, image.filename];
  });

  return Object.fromEntries(traits);
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

const validateSeed = (seed: Seed, layers: Layers): void => {
  const { bgcolors, images } = layers;
  const seedKeys = Object.keys(seed);
  const layerKeys = ["background", ...Object.keys(images)];

  if (seedKeys.length < layerKeys.length) {
    const missingKeys = layerKeys.filter((key) => !seedKeys.includes(key));
    throw new Error(
      `invalid_seed. seed is missing following properties: ${missingKeys.join(
        ", "
      )}`
    );
  }

  Object.entries(seed).forEach(([layer, value]) => {
    try {
      if (layer === "background") {
        const color = bgcolors[value];
        if (!color) throw new Error();
      } else {
        const image = images[layer as DataLayer][value];
        if (!image) throw new Error();
      }
    } catch (err) {
      throw new Error(
        `invalid_seed. bad property or value: { ..., ${layer}: ${value} }`
      );
    }
  });
};

export default {
  getSeedFromBlockHash,
  getRandomSeed,
  arrayToSeed,
  arrayToTraits,
  seedToArray,
  seedToTraits,
  traitsToArray,
  traitsToSeed,
  validateSeed,
};
