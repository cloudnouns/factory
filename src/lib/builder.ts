import type { Layers, Seed } from "../types";
import { BigNumber, type BigNumberish } from "@ethersproject/bignumber";

interface DecodedImage {
  paletteIndex: number;
  bounds: ImageBounds;
  rects: [length: number, colorIndex: number][];
}

interface ImageBounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const getItemParts = (seed: Seed, layers: Layers) => {
  const { bgcolors, images } = layers;
  const dataLayers = Object.entries(seed).filter(([layer]) => {
    return layer !== "background";
  });

  return {
    parts: dataLayers.map(([layer, value]) => {
      return images[layer as keyof Layers["images"]][value];
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

export const decodeImage = (image: string): DecodedImage => {
  const data = image.replace(/^0x/, "");
  const paletteIndex = parseInt(data.substring(0, 2), 16);
  const bounds = {
    top: parseInt(data.substring(2, 4), 16),
    right: parseInt(data.substring(4, 6), 16),
    bottom: parseInt(data.substring(6, 8), 16),
    left: parseInt(data.substring(8, 10), 16),
  };
  const rects = data.substring(10);

  return {
    paletteIndex,
    bounds,
    rects:
      rects
        ?.match(/.{1,4}/g)
        ?.map((rect) => [
          parseInt(rect.substring(0, 2), 16),
          parseInt(rect.substring(2, 4), 16),
        ]) ?? [],
  };
};

const getRectLength = (
  currentX: number,
  drawLength: number,
  rightBound: number
): number => {
  const remainingPixelsInLine = rightBound - currentX;
  return drawLength <= remainingPixelsInLine
    ? drawLength
    : remainingPixelsInLine;
};

export const buildSVG = (
  parts: { data: string }[],
  palette: string[],
  background: string,
  size = 320
): string => {
  let openingTag = `<svg width="${size}" height="${size}" viewBox="0 0 190 190" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">`;
  if (background !== "transparent") {
    openingTag += `<rect width="100%" height="100%" fill="#${background}" />`;
  }

  const svgWithoutEndTag = parts.reduce((result, part) => {
    const svgRects: string[] = [];
    const { bounds, rects } = decodeImage(part.data);

    let currentX = bounds.left;
    let currentY = bounds.top;

    rects.forEach((draw) => {
      let [drawLength, colorIndex] = draw;
      const hexColor = palette[colorIndex];

      let length = getRectLength(currentX, drawLength, bounds.right);
      while (length > 0) {
        // Do not push rect if transparent
        if (colorIndex !== 0) {
          svgRects.push(
            `<rect width="${length * 10}" height="10" x="${currentX * 10}" y="${
              currentY * 10
            }" fill="#${hexColor}" />`
          );
        }

        currentX += length;
        if (currentX === bounds.right) {
          currentX = bounds.left;
          currentY++;
        }

        drawLength -= length;
        length = getRectLength(currentX, drawLength, bounds.right);
      }
    });
    result += svgRects.join("");
    return result;
  }, openingTag);

  return svgWithoutEndTag + "</svg>";
};
