import type { LayerData, Seed, Traits, PartialTraits } from "../types";
import helpers from "./helpers.js";

export class Factory {
  private layerData: LayerData;

  constructor(layerData: LayerData) {
    this.layerData = layerData;
  }

  create(traits: PartialTraits = {}, options?: { size?: number }) {
    const seed = this.utils.getRandomSeed();
    if (Object.keys(traits).length) {
      // Object.entries(traits).map();
    }
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
    traitsToSeed: (traits: Traits) =>
      helpers.traitsToSeed(traits, this.layerData),
    traitsToArray: (traits: Traits) =>
      helpers.traitsToSeed(traits, this.layerData),
  };
}
