import Config from "../kit.config.js";
import { Factory } from "./lib/index.js";

const f = new Factory(Config.layers);
const { utils } = f;

console.log(utils.getRandomSeed());
