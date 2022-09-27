import type {
  LayerData,
  Seed,
  PartialTraits,
  ArraySeed,
  Traits,
} from "../types";
import helpers from "./helpers.js";

export class Factory {
  private layerData: LayerData;

  constructor(layerData: LayerData) {
    this.layerData = layerData;
  }

  create(traits?: PartialTraits, options?: { size?: number }) {}

  createFromSeed(seed: Seed, options?: { size?: number }) {}

  private buildItem() {}

  utils = {
    getRandomSeed: () => helpers.getRandomSeed(this.layerData),
    arrayToSeed: (arr: number[]) => helpers.arrayToSeed(arr, this.layerData),
    arrayToTraitNames: (arr: number[]) =>
      helpers.arrayToTraitNames(arr, this.layerData),
    seedToArray: (seed: Seed) => helpers.seedToArray(seed, this.layerData),
    seedToTraitNames: (seed: Seed) => helpers.seedToArray(seed, this.layerData),
    traitNamesToSeed: (traits: Traits) =>
      helpers.traitNamesToSeed(traits, this.layerData),
    traitNamesToArray: (traits: Traits) =>
      helpers.traitNamesToSeed(traits, this.layerData),
  };
}
