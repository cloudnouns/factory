import type { BigNumberish } from "@ethersproject/bignumber";
import { keccak256 } from "@ethersproject/solidity";
import { buildSVG, getPseudorandomPart } from "./builder.js";

type EncodedImage = { filename: string; data: string };

type ImageData<Parts> = {
  bgcolors: string[];
  palette: string[];
  images: {
    [T in keyof Parts]: EncodedImage[];
  };
};

type Image<Parts, BgColors> = Parts & {
  background: BgColors;
};

type Seed<Image> = {
  [T in keyof Image]: number;
};

type NamedSeed<Image> = {
  [T in keyof Image]: Image[T];
};

export class Factory<Parts, BgColors> {
  readonly bgcolors;
  readonly palette;
  readonly images;

  constructor(imageData: ImageData<Parts>) {
    this.bgcolors = imageData.bgcolors;
    this.palette = imageData.palette;
    this.images = imageData.images;
  }

  create = (
    traits: Partial<Image<Parts, BgColors>> = {},
    options?: { size?: number }
  ) => {
    const seed = this.utils.traitsToSeed(traits);
    return this.buildItem(seed, options?.size);
  };

  createFromSeed = (
    seed: Seed<Image<Parts, BgColors>>,
    options?: { size?: number }
  ) => {
    return this.buildItem(seed, options?.size);
  };

  private buildItem = (seed: Seed<Image<Parts, BgColors>>, size?: number) => {
    this.utils.validateSeed(seed);

    const { parts, background } = this.utils.getItemParts(seed);
    const svg = buildSVG(parts, this.palette, background, size);
    const namedSeed = this.utils.seedToTraits(seed);

    return {
      ...namedSeed,
      seed,
      dataUrl: "data:image/svg+xml;base64," + btoa(svg),
    };
  };

  utils = {
    /** Given a seed, returns RLE-encoded data or color string
     * @param {Seed} seed
     */
    getItemParts: (seed: Seed<Image<Parts, BgColors>>) => {
      const dataLayers = Object.entries(seed).filter(([layer]) => {
        return layer !== "background";
      });

      return {
        parts: dataLayers.map(([layer, value]) => {
          const part = layer as keyof Parts;
          const index = value as number;
          return this.images[part][index];
        }),
        background: this.bgcolors[seed.background],
      };
    },

    /** Emulates Noun.sol to generate a pseudorandom seed
     * @param {BigNumberish} id
     * @param {string} [blockHash]
     * @returns Seed
     */
    getSeedFromBlockHash: (
      id: BigNumberish,
      blockHash?: string
    ): Seed<Image<Parts, BgColors>> => {
      if (!blockHash) {
        blockHash =
          "0x305837d283efbc5a8ea53934fb122ac88473c68c1db0ebe2a2279f09f5772878";
      }

      const pseudorandomness = keccak256(
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
            this.images[key as keyof Parts].length,
            i * 48
          );
        }
      });

      return seed;
    },

    /** Generates a random seed
     * @returns Seed
     */
    getRandomSeed: (): Seed<Image<Parts, BgColors>> => {
      const _seed: any = {};

      Object.entries(this.images).forEach(([trait, items]: any) => {
        _seed[trait] = Math.floor(Math.random() * items.length);
      });

      return {
        background: Math.floor(Math.random() * this.bgcolors.length),
        ..._seed,
      };
    },

    /** Transforms seed array into a seed object
     * @param {number[]} arr
     * @returns Seed
     */
    arrayToSeed: (arr: number[]): Seed<Image<Parts, BgColors>> => {
      const keys = ["background", ...Object.keys(this.images)];
      const entries = keys.map((layer, i) => [layer, arr[i]]);
      return Object.fromEntries(entries);
    },

    /** Transforms seed array into a traits object
     * @param {number[]} arr
     * @returns Traits
     */
    arrayToTraits: (arr: number[]): NamedSeed<Image<Parts, BgColors>> => {
      const seed = this.utils.arrayToSeed(arr);
      return this.utils.seedToTraits(seed);
    },

    /** Transforms seed object into a seed array
     * @param {Seed} seed
     * @returns number[]
     */
    seedToArray: (seed: Seed<Image<Parts, BgColors>>): number[] => {
      const keys = Object.keys(this.images);
      const arr = [seed.background];

      keys.forEach((trait) => {
        arr.push(seed[trait as keyof Parts]);
      });

      return arr;
    },

    /** Transforms seed object into a traits object
     * @param {Seed} seed
     * @returns Traits
     */
    seedToTraits: (
      seed: Seed<Image<Parts, BgColors>>
    ): NamedSeed<Image<Parts, BgColors>> => {
      const traits = Object.entries(seed).map(([layer, value]) => {
        if (layer === "background") {
          return [layer, "#" + this.bgcolors[value as number]];
        }
        const image: EncodedImage =
          this.images[layer as keyof Parts][value as number];
        return [layer, image.filename];
      });

      return Object.fromEntries(traits);
    },

    /** Transforms traits object into a seed array
     * @param {Traits|Partial} traits
     * @returns number[]
     */
    traitsToArray: (
      traits:
        | NamedSeed<Image<Parts, BgColors>>
        | Partial<NamedSeed<Image<Parts, BgColors>>>
    ): number[] => {
      const seed = this.utils.traitsToSeed(traits);
      return this.utils.seedToArray(seed);
    },

    /** Transforms traits object into a seed object
     * @param {Traits|Partial} traits
     * @returns Seed
     */
    traitsToSeed: (
      traits:
        | NamedSeed<Image<Parts, BgColors>>
        | Partial<NamedSeed<Image<Parts, BgColors>>>
    ): Seed<Image<Parts, BgColors>> => {
      const seed = this.utils.getRandomSeed();

      Object.entries(traits).forEach(([layer, value]) => {
        if (layer === "background") {
          const index = this.bgcolors.findIndex((color) => {
            const v = value as string;
            return v.replace("#", "") === color;
          });
          seed.background = index;
        } else if (Object.keys(seed).includes(layer)) {
          const index = this.images[layer as keyof Parts].findIndex(
            (image) => value === image.filename
          );
          seed[layer as keyof Parts] = index;
        }
      });

      return seed;
    },

    /** Confirms validity of given seed
     * @param {Seed} seed
     * @throws if provided Seed has unknown or missing keys, or value can't be located
     */
    validateSeed: (seed: Seed<Image<Parts, BgColors>>): void => {
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
            const color = this.bgcolors[value as number];
            if (!color) throw new Error();
          } else {
            const image = this.images[layer as keyof Parts][value as number];
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
