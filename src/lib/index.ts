import type { Layers, Seed, Traits, PartialTraits } from "../types";
import helpers from "./helpers.js";

export class Factory {
  private layers: Layers;

  constructor(layers: Layers) {
    this.layers = layers;
  }

  create(traits: PartialTraits = {}, options?: { size?: number }) {
    const seed = this.utils.traitsToSeed(traits);
  }

  createFromSeed(seed: Seed, options?: { size?: number }) {}

  private buildItem() {}

  utils = {
    getRandomSeed: () => helpers.getRandomSeed(this.layers),
    arrayToSeed: (arr: number[]) => helpers.arrayToSeed(arr, this.layers),
    arrayToTraits: (arr: number[]) => helpers.arrayToTraits(arr, this.layers),
    seedToArray: (seed: Seed) => helpers.seedToArray(seed, this.layers),
    seedToTraits: (seed: Seed) => helpers.seedToArray(seed, this.layers),
    traitsToSeed: (traits: Traits | PartialTraits) =>
      helpers.traitsToSeed(traits, this.layers),
    traitsToArray: (traits: Traits | PartialTraits) =>
      helpers.traitsToSeed(traits, this.layers),
  };
}
