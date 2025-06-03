#!/usr/bin/env node
import dotenv from "dotenv";
dotenv.config();
import yargs from "yargs";
import { hideBin } from "yargs/helpers"; // 必须加这行
import { commands } from "./commands/index.js";
import { saveCache } from "./utils.js";
import chalk from "chalk";
const main = async () => {
    console.log(chalk.blue("=== This is One Cetus CLI Tool ==="));
    await yargs(hideBin(process.argv))
        .scriptName("cetus-cli-tool")
        .command(commands)
        .demandCommand(1, "You need at least one command before moving on")
        .recommendCommands()
        .help()
        .strict()
        .parse();
    saveCache();
};
main();
