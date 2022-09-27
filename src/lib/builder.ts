import type { Layers, DataLayer, Seed } from "../types";
import { BigNumber, type BigNumberish } from "@ethersproject/bignumber";

export const getItemParts = (seed: Seed, layers: Layers) => {
  const { bgcolors, images } = layers;
  const dataLayers = Object.entries(seed).filter(([layer]) => {
    return layer !== "background";
  });

  return {
    parts: dataLayers.map(([layer, value]) => {
      return images[layer as DataLayer][value];
    }),
    background: bgcolors[seed.background],
  };
};

const shiftRightAndCast = (
  value: BigNumberish,
  shiftAmount: number,
  uintSize: number
): string => {
  const shifted = BigNumber.from(value).shr(shiftAmount).toHexString();
  return `0x${shifted.substring(shifted.length - uintSize / 4)}`;
};

export const getPseudorandomPart = (
  pseudorandomness: string,
  partCount: number,
  shiftAmount: number,
  uintSize: number = 48
): number => {
  const hex = shiftRightAndCast(pseudorandomness, shiftAmount, uintSize);
  return BigNumber.from(hex).mod(partCount).toNumber();
};
