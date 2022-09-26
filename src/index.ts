import Config from "../kit.config.js";
import { Factory } from "./lib/index.js";

const f = new Factory(Config.layers);
const { helpers } = f;

const seed = helpers.getRandomSeed();
const seedArray = helpers.seedToArray(seed);
console.log(seedArray);
