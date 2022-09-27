export interface DecodedImage {
  paletteIndex: number;
  bounds: ImageBounds;
  rects: [length: number, colorIndex: number][];
}

export interface ImageBounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
