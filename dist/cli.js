#!/usr/bin/env node
import dotenv from "dotenv";
dotenv.config();
import yargs from "yargs";
import { hideBin } from "yargs/helpers"; // 必须加这行
import { commands } from "./commands/index.js";
import { saveCache } from "./utils.js";
const main = async () => {
    yargs(hideBin(process.argv)) // ← 这才是 yargs 的正确用法
        .scriptName("cetus-cli-tool")
        .command(commands)
        .demandCommand(1, "You need at least one command before moving on")
        .recommendCommands()
        .help()
        .strict()
        .parse(); // ← 别忘了 parse()
    saveCache();
};
main();
