#! /usr/bin/env node

import fs from "fs";
import { readConfigAndGenerateTypes } from "./script.js";

const args = process.argv.slice(2, process.argv.length);
const action = args[0];

if (["init", "i"].includes(action)) {
  console.log("Looking for config file...");

  if (fs.existsSync("bolt.toml")) {
    console.log("Found! Generating types...");
    await readConfigAndGenerateTypes();
  } else {
    console.log("not found. create?");
  }
} else if (["generate", "g"].includes(action)) {
  console.log("generating types...");
  const pathToConfig = args[1] || "bolt.toml";

  if (!fs.existsSync(pathToConfig)) {
    console.error("config file not found:", pathToConfig);
    process.exit(1);
  }

  await readConfigAndGenerateTypes(pathToConfig);
} else {
  console.error("Missing or unknown command");
}

process.exit(0);
