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
  background: "#e1d7d5",
  bodies: "body-foggrey",
  heads: "head-bagpipe",
  glasses: "glasses-square-black",
});
const bed = bot.utils.arrayToNamedSeed([1, 3, 4, 3, 1]);

console.log(ted);

const hogwarts = new Factory<WizardParts, WizardBgColors>(wConfig);
const harry = hogwarts.create({
  mouth: "mouth_2",
});

console.log(harry.hat);
