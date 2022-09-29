#! /usr/bin/env node

import fs from "fs";
import toml from "@ltd/j-toml";

// const Config = require("./bolt.config.js");

// console.log(Config.items);
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const args = process.argv.slice(2, process.argv.length);
const action = args[0];

if (action === "init") {
  console.log("Looking for config file...");
  const file = "./bolt.toml";

  if (fs.existsSync(file)) {
    console.log("found!");
    const config = fs.readFileSync(file, "utf8");
    const f = toml.parse(config);
    // @ts-ignore
    const { config_path } = f.items[0];
    const layers = JSON.parse(fs.readFileSync(config_path, "utf8"));
    console.log(f);
    console.log(config_path);
    console.log(layers);
    // console.log(config);
    // const file2 = ((await import("./bolt.config.js")) as BoltConfig).default;
    // console.log(file2);
  } else {
    console.log("not found. create?");
  }

  /**
   * check for dir
   * generate file
   * gitignore .bolt dir
   */
} else {
  console.error("Missing or unknown command");
}

process.exit(0);
