#! /usr/bin/env node

import fs from "fs";
import toml from "@ltd/j-toml";
import { readConfigAndGenerateTypes } from "./script.js";

const args = process.argv.slice(2, process.argv.length);
const action = args[0];

if (["init", "i"].includes(action)) {
  console.log("Looking for config file...");
  const filename = "bolt.toml";

  if (fs.existsSync(filename)) {
    console.log("Found! Generating types...");
    await readConfigAndGenerateTypes();
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
