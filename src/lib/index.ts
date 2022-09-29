import type { Layers, Seed, Traits, PartialTraits } from "../types";
import type { BigNumberish } from "@ethersproject/bignumber";
import { keccak256 as solidityKeccak256 } from "@ethersproject/solidity";
import { buildSVG, getItemParts, getPseudorandomPart } from "./builder.js";

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
     * @returns Seed
     */
    getSeedFromBlockHash: (id: BigNumberish, blockHash?: string): Seed => {
      if (!blockHash) {
        blockHash =
          "0x305837d283efbc5a8ea53934fb122ac88473c68c1db0ebe2a2279f09f5772878";
      }

      const { bgcolors, images } = this.layers;
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
            images[key as keyof Layers["images"]].length,
            i * 48
          );
        }
      });

      return seed;
    },

    /** Generates a random seed
     * @returns Seed
     */
    getRandomSeed: (): Seed => {
      const { bgcolors, images } = this.layers;
      const temporarySeed: any = {};

      Object.entries(images).forEach(([trait, items]) => {
        temporarySeed[trait] = Math.floor(Math.random() * items.length);
      });

      return {
        background: Math.floor(Math.random() * bgcolors.length),
        ...temporarySeed,
      };
    },

    /** Transforms seed array into a seed object
     * @param {number[]} arr
     * @returns Seed
     */
    arrayToSeed: (arr: number[]): Seed => {
      const keys = ["background", ...Object.keys(this.layers.images)];
      const entries = keys.map((layer, i) => [layer, arr[i]]);
      return Object.fromEntries(entries);
    },

    /** Transforms seed array into a traits object
     * @param {number[]} arr
     * @returns Traits
     */
    arrayToTraits: (arr: number[]): Traits => {
      const seed = this.utils.arrayToSeed(arr);
      return this.utils.seedToTraits(seed);
    },

    /** Transforms seed object into a seed array
     * @param {Seed} seed
     * @returns number[]
     */
    seedToArray: (seed: Seed): number[] => {
      const keys = Object.keys(this.layers.images);
      const arr = [seed.background];

      keys.forEach((trait) => {
        arr.push(seed[trait as keyof Layers["images"]]);
      });

      return arr;
    },

    /** Transforms seed object into a traits object
     * @param {Seed} seed
     * @returns Traits
     */
    seedToTraits: (seed: Seed): Traits => {
      const traits = Object.entries(seed).map(([layer, value]) => {
        if (layer === "background") {
          return [layer, "#" + this.layers.bgcolors[value]];
        }
        const { images } = this.layers;
        const image = images[layer as keyof Layers["images"]][value];
        return [layer, image.filename];
      });

      return Object.fromEntries(traits);
    },

    /** Transforms traits object into a seed array
     * @param {Traits|PartialTraits} traits
     * @returns number[]
     */
    traitsToArray: (traits: Traits | PartialTraits): number[] => {
      const seed = this.utils.traitsToSeed(traits);
      return this.utils.seedToArray(seed);
    },

    /** Transforms traits object into a seed object
     * @param {Traits|PartialTraits} traits
     * @returns Seed
     */
    traitsToSeed: (traits: Traits | PartialTraits): Seed => {
      const seed = this.utils.getRandomSeed();

      Object.entries(traits).forEach(([layer, value]) => {
        if (layer === "background") {
          const index = this.layers.bgcolors.findIndex(
            (color) => value.replace("#", "") === color
          );
          seed.background = index;
        } else if (Object.keys(seed).includes(layer)) {
          const { images } = this.layers;
          const index = images[layer as keyof Layers["images"]].findIndex(
            (image) => value === image.filename
          );
          seed[layer as keyof Layers["images"]] = index;
        }
      });

      return seed;
    },

    /** Confirms validity of given seed
     * @param {Seed} seed
     * @throws if provided Seed has unknown or missing keys, or value can't be located
     */
    validateSeed: (seed: Seed): void => {
      const { bgcolors, images } = this.layers;
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
            const image = images[layer as keyof Layers["images"]][value];
            if (!image) throw new Error();
          }
        } catch (err) {
          throw new Error(
            `invalid_seed. bad property or value: { ..., ${layer}: ${value} }`
          );
        }
      });
    },
  };
}
