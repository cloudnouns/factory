import type { LayerData, Seed, PartialTraits } from "../types";
import utils from "./utils.js";

export class Factory {
  private layerData: LayerData;

  constructor(layerData: LayerData) {
    this.layerData = layerData;
  }

  create(traits?: PartialTraits, options?: { size?: number }) {}

  createFromSeed(seed: Seed, options?: { size?: number }) {}

  private buildItem() {}

  helpers = {
    getRandomSeed: () => utils.getRandomSeed(this.layerData),
    arrayToSeed: () => {},
    arrayToTraitNames: () => {},
    seedToArray: (seed: Seed) => utils.seedToArray(seed, this.layerData),
    seedToTraitNames: () => {},
    traitNamesToSeed: () => {},
    traitNamesToArray: () => {},
  };
}
