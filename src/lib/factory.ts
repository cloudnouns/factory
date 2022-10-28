import { BigNumber, type BigNumberish } from "@ethersproject/bignumber";
import { keccak256 } from "@ethersproject/solidity";
import { buildSVG } from "./builder.js";

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

type RLESeed<Image> = {
  [T in keyof Image]: number | string;
};

type ItemOptions = { size?: number };

export class Factory<Parts, BgColors> {
  private bgcolors;
  private palette;
  private images;

  constructor(imageData: ImageData<Parts>) {
    this.bgcolors = imageData.bgcolors;
    this.palette = imageData.palette;
    this.images = imageData.images;
  }

  /** Create new item.
   * @param {Partial<NamedSeed>} [namedSeed]
   * @param {object} [options]
   * @param {number} [options.size]
   */
  createItem = (
    namedSeed: Partial<Image<Parts, BgColors>> = {},
    options?: ItemOptions
  ) => {
    const seed = this.utils.namedSeedToSeed(namedSeed);
    return this.buildItem(seed, options?.size);
  };

  createItemFromSeed = (
    seed: Seed<Image<Parts, BgColors>>,
    options?: ItemOptions
  ) => {
    return this.buildItem(seed, options?.size);
  };

  createItemFromRLESeed = (
    rleSeed: RLESeed<Image<Parts, BgColors>>,
    options?: ItemOptions
  ) => {
    return this.buildItem(rleSeed, options?.size);
  };

  private buildItem = (
    inputSeed: Seed<Image<Parts, BgColors>> | RLESeed<Image<Parts, BgColors>>,
    size?: number
  ) => {
    const { seed, hasRLEParts } = this.utils.validateSeed(inputSeed);

    const { parts, background } = this.utils.getItemParts(seed, hasRLEParts);
    const svg = buildSVG(parts, this.palette, background, size);
    const namedSeed = this.utils.seedToNamedSeed(seed);

    return {
      ...namedSeed,
      seed,
      dataUrl: "data:image/svg+xml;base64," + btoa(svg),
    };
  };

  utils = {
    /** Collects encoded data or color string for Seed
     * @param {Seed} seed
     */
    getItemParts: (
      seed: Seed<Image<Parts, BgColors>>,
      hasRLEParts: boolean
    ) => {
      const parts = Object.entries(seed).filter(([part]) => {
        return part !== "background";
      });

      return {
        parts: parts.map(([part, value]) => {
          const currentPart = part as keyof Parts;
          if (hasRLEParts && String(value).startsWith("0x")) {
            return { filename: "custom", data: value as unknown as string };
          } else {
            const index = value as number;
            return this.images[currentPart][index];
          }
        }),
        background: this.bgcolors[seed.background],
      };
    },

    /** Emulates NounsSeeder.sol methodology for pseudorandomly selecting a part
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
      const parts = ["background", ...Object.keys(this.images)];
      const seed: any = {};

      parts.forEach((part, i) => {
        if (part === "background") {
          seed.background = getPseudorandomPart(
            pseudorandomness,
            this.bgcolors.length,
            0
          );
        } else {
          seed[part] = getPseudorandomPart(
            pseudorandomness,
            this.images[part as keyof Parts].length,
            i * 48
          );
        }
      });

      return seed;
    },

    /** Generate a random Seed
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

    /** Transform number[] into NamedSeed
     * @param {number[]} arr
     * @returns NamedSeed
     */
    arraySeedToNamedSeed: (
      arr: number[]
    ): NamedSeed<Image<Parts, BgColors>> => {
      const seed = this.utils.arraySeedToSeed(arr);
      return this.utils.seedToNamedSeed(seed);
    },

    /** Transform number[] into Seed
     * @param {number[]} arr
     * @returns Seed
     */
    arraySeedToSeed: (arr: number[]): Seed<Image<Parts, BgColors>> => {
      const parts = ["background", ...Object.keys(this.images)];
      const entries = parts.map((part, i) => [part, arr[i]]);
      return Object.fromEntries(entries);
    },

    /** Transform NamedSeed into number[]
     * @param {NamedSeed} namedSeed
     * @returns number[]
     */
    namedSeedToArraySeed: (
      namedSeed:
        | NamedSeed<Image<Parts, BgColors>>
        | Partial<NamedSeed<Image<Parts, BgColors>>>
    ): number[] => {
      const seed = this.utils.namedSeedToSeed(namedSeed);
      return this.utils.seedToArraySeed(seed);
    },

    /** Transform NamedSeed into Seed
     * @param {NamedSeed} namedSeed
     * @returns Seed
     */
    namedSeedToSeed: (
      namedSeed:
        | NamedSeed<Image<Parts, BgColors>>
        | Partial<NamedSeed<Image<Parts, BgColors>>>
    ): Seed<Image<Parts, BgColors>> => {
      const seed = this.utils.getRandomSeed();

      Object.entries(namedSeed).forEach(([part, value]) => {
        if (part === "background") {
          const index = this.bgcolors.findIndex((color) => {
            const v = value as string;
            return v.replace("#", "") === color;
          });
          seed.background = index;
        } else if (Object.keys(seed).includes(part)) {
          const index = this.images[part as keyof Parts].findIndex(
            (image) => value === image.filename
          );
          seed[part as keyof Parts] = index;
        }
      });

      return seed;
    },

    /** Transform Seed into number[]
     * @param {Seed} inputSeed
     * @returns number[]
     */
    seedToArraySeed: (inputSeed: Seed<Image<Parts, BgColors>>): number[] => {
      const { seed } = this.utils.validateSeed(inputSeed);

      const parts = Object.keys(this.images);
      const arr = [seed.background];

      parts.forEach((part) => {
        arr.push(seed[part as keyof Parts]);
      });

      return arr;
    },

    /** Transform Seed into NamedSeed
     * @param {Seed} inputSeed
     * @returns NamedSeed
     */
    seedToNamedSeed: (
      inputSeed: Seed<Image<Parts, BgColors>>
    ): NamedSeed<Image<Parts, BgColors>> => {
      const { seed } = this.utils.validateSeed(inputSeed);

      const parts = Object.entries(seed).map(([part, value]) => {
        if (part === "background") {
          return [part, "#" + this.bgcolors[value as number]];
        } else if (String(value).startsWith("0x")) {
          return [part, "custom"];
        }

        const image: EncodedImage =
          this.images[part as keyof Parts][value as number];
        return [part, image.filename];
      });

      return Object.fromEntries(parts);
    },

    /** Validates Seed against factory data
     * @param {Seed} inputSeed
     * @throws if Seed has unknown or missing keys, or item otherwise can't be found
     */
    validateSeed: (
      inputSeed: Seed<Image<Parts, BgColors>> | RLESeed<Image<Parts, BgColors>>
    ) => {
      const seedParts = Object.keys(inputSeed);
      const imageParts = ["background", ...Object.keys(this.images)];
      let hasRLEParts = false;

      if (seedParts.length < imageParts.length) {
        const missingKeys = imageParts.filter(
          (key) => !seedParts.includes(key)
        );
        throw new Error(
          `invalid_seed. seed is missing following properties: ${missingKeys.join(
            ", "
          )}`
        );
      }

      Object.entries(inputSeed).forEach(([part, value]) => {
        try {
          if (part === "background") {
            const color = this.bgcolors[value as number];
            if (!color) throw new Error();
          } else {
            let image;
            if (String(value).startsWith("0x")) {
              image = value as unknown as string;
              hasRLEParts = true;
            } else image = this.images[part as keyof Parts][value as number];
            if (!image) throw new Error();
          }
        } catch (err) {
          throw new Error(
            `invalid_seed. bad property or value: { ..., ${part}: ${value} }`
          );
        }
      });

      let sortedSeedEntries: any[] = [];
      for (const part of imageParts) {
        sortedSeedEntries.push([part, inputSeed[part as keyof Parts]]);
      }

      const sortedSeed = Object.fromEntries(sortedSeedEntries);
      return { hasRLEParts, seed: sortedSeed as Seed<Image<Parts, BgColors>> };
    },
  };
}

const getPseudorandomPart = (
  pseudorandomness: string,
  partCount: number,
  shiftAmount: number,
  uintSize: number = 48
): number => {
  const hex = shiftRightAndCast(pseudorandomness, shiftAmount, uintSize);
  return BigNumber.from(hex).mod(partCount).toNumber();
};

const shiftRightAndCast = (
  value: BigNumberish,
  shiftAmount: number,
  uintSize: number
): string => {
  const shifted = BigNumber.from(value).shr(shiftAmount).toHexString();
  return `0x${shifted.substring(shifted.length - uintSize / 4)}`;
};
