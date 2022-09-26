import type { LayerData, Seed, PartialTraits } from "../types";
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
    arrayToSeed: () => {},
    arrayToTraitNames: () => {},
    seedToArray: (seed: Seed) => helpers.seedToArray(seed, this.layerData),
    seedToTraitNames: () => {},
    traitNamesToSeed: () => {},
    traitNamesToArray: () => {},
  };
}
