#! /usr/bin/env node
import type { BoltConfig } from "./src/types";
import fs from "fs";
import Config from "./bolt.config.js";

console.log(Config.items);
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const args = process.argv.slice(2, process.argv.length);
const action = args[0];

if (action === "init") {
  console.log("Looking for config file...");
  const file = "./bolt.config.js";

  if (fs.existsSync(file)) {
    console.log("found!");
    const config = fs.readFileSync(file, "utf8");
    console.log(config);
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
