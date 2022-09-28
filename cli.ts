#! /usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2, process.argv.length);
const action = args[0];

// const path =

if (action === "init") {
  console.log("Looking for config file...");
  console.log(__dirname);

  /**
   * check for dir
   * generate file
   * gitignore .bolt dir
   */
} else {
  console.error("Missing or unknown command");
}

process.exit(0);
