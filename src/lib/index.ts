import type { Layers, Seed, Traits, PartialTraits } from "../types";
import type { BigNumberish } from "@ethersproject/bignumber";
import { buildSVG, getItemParts } from "./builder.js";
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

    const { palette } = this.layers;
    const { parts, background } = getItemParts(seed, this.layers);
    const svg = buildSVG(parts, palette, background, size);
    const traits = this.utils.seedToTraits(seed);

    return {
      ...traits,
      seed,
      dataUrl: "data:image/svg+xml;base64," + btoa(svg),
    };
  }

  utils = {
    /** Emulates Noun.sol to generate a pseudorandom seed
     * @param {BigNumberish} id
     * @param {string} [blockHash]
     */
    getSeedFromBlockHash: (id: BigNumberish, blockHash?: string): Seed => {
      if (!blockHash) {
        blockHash =
          "0x305837d283efbc5a8ea53934fb122ac88473c68c1db0ebe2a2279f09f5772878";
      }
      return helpers.getSeedFromBlockHash(id, blockHash, this.layers);
    },

    /** Generates a random seed */
    getRandomSeed: (): Seed => {
      return helpers.getRandomSeed(this.layers);
    },

    /** Transforms seed array into a seed object
     * @param {number[]} arr
     * @returns Seed
     */
    arrayToSeed: (arr: number[]): Seed => {
      return helpers.arrayToSeed(arr, this.layers);
    },

    /** Transforms seed array into a traits object
     * @param {number[]} arr
     * @returns Traits
     */
    arrayToTraits: (arr: number[]): Traits => {
      return helpers.arrayToTraits(arr, this.layers);
    },

    /** Transforms seed object into a seed array
     * @param {Seed} seed
     * @returns number[]
     */
    seedToArray: (seed: Seed): number[] => {
      return helpers.seedToArray(seed, this.layers);
    },

    /** Transforms seed object into a traits object
     * @param {Seed} seed
     * @returns Traits
     */
    seedToTraits: (seed: Seed): Traits => {
      return helpers.seedToTraits(seed, this.layers);
    },

    /** Transforms traits object into a seed object
     * @param {Traits|PartialTraits} traits
     * @returns Seed
     */
    traitsToSeed: (traits: Traits | PartialTraits): Seed => {
      return helpers.traitsToSeed(traits, this.layers);
    },

    /** Transforms traits object into a seed array
     * @param {Traits|PartialTraits} traits
     * @returns number[]
     */
    traitsToArray: (traits: Traits | PartialTraits): number[] => {
      return helpers.traitsToArray(traits, this.layers);
    },

    /** Confirms validity of given seed
     * @param {Seed} seed
     * @throws if provided Seed has unknown or missing keys, or value can't be located
     */
    validateSeed: (seed: Seed): void => {
      return helpers.validateSeed(seed, this.layers);
    },
  };
}
