import type { Traits } from "../types";
import type { BigNumberish } from "@ethersproject/bignumber";
import { keccak256 as solidityKeccak256 } from "@ethersproject/solidity";
import { buildSVG, getPseudorandomPart } from "./builder.js";

export type Seed = { [T in keyof Traits]: number };
type PartialTraits = { [T in keyof Traits]?: Traits[T] };

type ImageData = {
  bgcolors: string[];
  palette: string[];
  images: {
    [T in keyof Traits]: {
      filename: string;
      data: string;
    }[];
  };
};

export class Factory {
  readonly bgcolors;
  readonly palette;
  readonly images;

  constructor(imageData: ImageData) {
    this.bgcolors = imageData.bgcolors;
    this.palette = imageData.palette;
    this.images = imageData.images;
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

    const { parts, background } = this.utils.getItemParts(seed);
    const svg = buildSVG(parts, this.palette, background, size);
    const traits = this.utils.seedToTraits(seed);

    return {
      ...traits,
      seed,
      dataUrl: "data:image/svg+xml;base64," + btoa(svg),
    };
  }

  utils = {
    /** Given a seed, grabs the
     * @param {Seed} seed
     */
    getItemParts: (seed: Seed) => {
      const dataLayers = Object.entries(seed).filter(([layer]) => {
        return layer !== "background";
      });

      return {
        parts: dataLayers.map(([layer, value]) => {
          return this.images[layer as keyof ImageData["images"]][value];
        }),
        background: this.bgcolors[seed.background],
      };
    },

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

      const pseudorandomness = solidityKeccak256(
        ["bytes32", "uint256"],
        [blockHash, id]
      );
      const keys = ["background", ...Object.keys(this.images)];
      const seed: any = {};

      keys.forEach((key, i) => {
        if (key === "background") {
          seed.background = getPseudorandomPart(
            pseudorandomness,
            this.bgcolors.length,
            0
          );
        } else {
          seed[key] = getPseudorandomPart(
            pseudorandomness,
            this.images[key as keyof ImageData["images"]].length,
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
      const temporarySeed: any = {};

      Object.entries(this.images).forEach(([trait, items]) => {
        temporarySeed[trait] = Math.floor(Math.random() * items.length);
      });

      return {
        background: Math.floor(Math.random() * this.bgcolors.length),
        ...temporarySeed,
      };
    },

    /** Transforms seed array into a seed object
     * @param {number[]} arr
     * @returns Seed
     */
    arrayToSeed: (arr: number[]): Seed => {
      const keys = ["background", ...Object.keys(this.images)];
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
      const keys = Object.keys(this.images);
      const arr = [seed.background];

      keys.forEach((trait) => {
        arr.push(seed[trait as keyof ImageData["images"]]);
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
          return [layer, "#" + this.bgcolors[value]];
        }
        const image = this.images[layer as keyof ImageData["images"]][value];
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
          const index = this.bgcolors.findIndex(
            (color) => value.replace("#", "") === color
          );
          seed.background = index;
        } else if (Object.keys(seed).includes(layer)) {
          const index = this.images[
            layer as keyof ImageData["images"]
          ].findIndex((image) => value === image.filename);
          seed[layer as keyof ImageData["images"]] = index;
        }
      });

      return seed;
    },

    /** Confirms validity of given seed
     * @param {Seed} seed
     * @throws if provided Seed has unknown or missing keys, or value can't be located
     */
    validateSeed: (seed: Seed): void => {
      const seedKeys = Object.keys(seed);
      const layerKeys = ["background", ...Object.keys(this.images)];

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
            const color = this.bgcolors[value];
            if (!color) throw new Error();
          } else {
            const image =
              this.images[layer as keyof ImageData["images"]][value];
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
