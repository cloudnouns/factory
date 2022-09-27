import Config from "../kit.config.js";
import { Factory } from "./lib/index.js";

const f = new Factory(Config.layers);
const { utils } = f;

const seed = utils.getRandomSeed();
const seedArray = utils.seedToArray(seed);
const seedFromArray = utils.arrayToSeed(seedArray);
const traitsFromArray = utils.arrayToTraits(seedArray);
const seedFromTraits = utils.traitsToSeed(traitsFromArray);
// console.log(seedArray);
// console.log(seedFromArray);
// console.log(traitsFromArray);
// console.log(seedFromTraits);
// console.log(f.create({ background: "#d5d7e1", heads: "head-zebra" }));
// f.createFromSeed({
//   background: 1,
//   bodies: 16,
//   accessories: 133,
//   heads: 233,
//   glasses: 22,
// });
// console.log(utils.getSeedFromBlockHash(60008));
// console.log(
//   utils.getSeedFromBlockHash(
//     60008,
//     "0x73d88d376f6b4d232d70dc950d9515fad3b5aa241937e362fdbfd74d1c901781"
//   )
// );
