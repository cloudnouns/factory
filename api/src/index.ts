// export interface Env {}

// export default {
//   async fetch(request: Request, env: Env): Promise<Response> {
//     return new Response("Hello World!");
//   },
// };

import type { NounParts, NounBgColors } from "../../src/types/noun.js";
import type { WizardParts, WizardBgColors } from "../../src/types/wizard.js";
import { Factory } from "../../src/index.js";
import nConfig from "../../nouns-image-data.json" assert { type: "json" };
import wConfig from "../../wizards.json" assert { type: "json" };

const bot = new Factory<NounParts, NounBgColors>(nConfig);
const ted = bot.create({
  glasses: "glasses-square-black",
  heads: "head-bagpipe",
  background: "#e1d7d5",
  bodies: "body-foggrey",
});
const bed = bot.utils.arraySeedToNamedSeed([1, 3, 4, 3, 1]);

console.log(ted);
console.log(bed);

const hogwarts = new Factory<WizardParts, WizardBgColors>(wConfig);
const harry = hogwarts.createFromSeed({
  cloth: 5,
  hat: 0,
  one: 13,
  skin: 6,
  background: 1,
  mouth: 1,
  acc: 2,
  eye: 1,
  item: 1,
});

// console.log(harry.hat);
