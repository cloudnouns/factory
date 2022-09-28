// export interface Env {}

// export default {
//   async fetch(request: Request, env: Env): Promise<Response> {
//     return new Response("Hello World!");
//   },
// };

import { Factory } from "../../src/index.js";
import WizardConfig from "../../wizards.json" assert { type: "json" };

const hogwarts = new Factory(WizardConfig);
const harry = hogwarts.create({ acc: "acc_4" });
const dumbledore = hogwarts.createFromSeed({
  background: 0,
  skin: 4,
  cloth: 9,
  eye: 5,
  mouth: 1,
  acc: 2,
  item: 8,
  hat: 0,
  one: 0,
});

console.log(dumbledore.dataUrl);
