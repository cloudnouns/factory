import type { NounParts, NounBgColors } from "../.bolt/noun";
import ImageData from "../data/nouns.json" assert { type: "json" };
import { Factory } from "../index.js";

const factory = new Factory<NounParts, NounBgColors>(ImageData);
const op = factory.utils.getBackgroundIdByColor("d5d7e1");

console.log(op);
