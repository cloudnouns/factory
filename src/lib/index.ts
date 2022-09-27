import type { Layers, Seed, Traits, PartialTraits } from "../types";
import helpers from "./helpers.js";

export class Factory {
  private layerData: Layers;

  constructor(layerData: Layers) {
    this.layerData = layerData;
  }

  create(traits: PartialTraits = {}, options?: { size?: number }) {
    return this.utils.traitsToSeed(traits);
  }

  createFromSeed(seed: Seed, options?: { size?: number }) {}

  private buildItem() {}

  utils = {
    getRandomSeed: () => helpers.getRandomSeed(this.layerData),
    arrayToSeed: (arr: number[]) => helpers.arrayToSeed(arr, this.layerData),
    arrayToTraits: (arr: number[]) =>
      helpers.arrayToTraits(arr, this.layerData),
    seedToArray: (seed: Seed) => helpers.seedToArray(seed, this.layerData),
    seedToTraits: (seed: Seed) => helpers.seedToArray(seed, this.layerData),
    traitsToSeed: (traits: Traits | PartialTraits) =>
      helpers.traitsToSeed(traits, this.layerData),
    traitsToArray: (traits: Traits | PartialTraits) =>
      helpers.traitsToSeed(traits, this.layerData),
  };
}
