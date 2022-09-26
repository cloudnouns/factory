import type { LayerData, Seed, PartialTraits } from "../types";
import { getRandomSeed } from "./utils.js";

export class Factory {
  private layerData: LayerData;

  constructor(layerData: LayerData) {
    this.layerData = layerData;
  }

  create(traits?: PartialTraits, options?: { size?: number }) {}

  createFromSeed(seed: Seed, options?: { size?: number }) {}

  private buildItem() {}

  utils = {
    getRandomSeed: () => getRandomSeed(this.layerData),
    arrayToSeed: () => {},
    arrayToTraitNames: () => {},
    seedToArray: () => {},
    seedToTraitNames: () => {},
    traitNamesToSeed: () => {},
    traitNamesToArray: () => {},
  };
}
