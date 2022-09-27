import Config from "../kit.config.js";
import { Factory } from "./lib/index.js";

const f = new Factory(Config.layers);
const { utils } = f;

const seed = utils.getRandomSeed();
const seedArray = utils.seedToArray(seed);
const seedFromArray = utils.arrayToSeed(seedArray);
const traitsFromArray = utils.arrayToTraitNames(seedArray);
const seedFromTraits = utils.traitNamesToSeed(traitsFromArray);
// console.log(seedArray);
// console.log(seedFromArray);
// console.log(traitsFromArray);
console.log(seedFromTraits);
