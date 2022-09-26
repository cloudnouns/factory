import Config from "../kit.config.js";
import { Factory } from "./lib/index.js";

const f = new Factory(Config.layers);
const { utils } = f;

const seed = utils.getRandomSeed();
const seedArray = utils.seedToArray(seed);
console.log(seedArray);
