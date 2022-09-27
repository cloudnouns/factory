import type { Layers, Seed, Traits, PartialTraits } from "../types";
import type { BigNumberish } from "@ethersproject/bignumber";
import { getItemParts } from "./builder.js";
import helpers from "./helpers.js";

export class Factory {
  private layers: Layers;

  constructor(layers: Layers) {
    this.layers = layers;
  }

  create(traits: PartialTraits = {}, options?: { size?: number }) {
    const seed = this.utils.traitsToSeed(traits);
    return this.buildItem(seed, options?.size);
  }

  createFromSeed(seed: Seed, options?: { size?: number }) {
    return this.buildItem(seed, options?.size);
  }

  private buildItem(seed: Seed, size?: number) {
    this.utils.validateSeed(seed);
    const { parts, background } = getItemParts(seed, this.layers);
  }

  utils = {
    getSeedFromBlockHash: (id: BigNumberish, blockHash?: string) => {
      if (!blockHash) {
        blockHash =
          "0x305837d283efbc5a8ea53934fb122ac88473c68c1db0ebe2a2279f09f5772878";
      }
      return helpers.getSeedFromBlockHash(id, blockHash, this.layers);
    },
    getRandomSeed: () => helpers.getRandomSeed(this.layers),
    arrayToSeed: (arr: number[]) => helpers.arrayToSeed(arr, this.layers),
    arrayToTraits: (arr: number[]) => helpers.arrayToTraits(arr, this.layers),
    seedToArray: (seed: Seed) => helpers.seedToArray(seed, this.layers),
    seedToTraits: (seed: Seed) => helpers.seedToArray(seed, this.layers),
    traitsToSeed: (traits: Traits | PartialTraits) =>
      helpers.traitsToSeed(traits, this.layers),
    traitsToArray: (traits: Traits | PartialTraits) =>
      helpers.traitsToSeed(traits, this.layers),
    validateSeed: (seed: Seed) => helpers.validateSeed(seed, this.layers),
  };
}
