import { CommandModule } from "yargs";
import hello from "./hello.js";
import info from "./info.js";
import listPool from "./list-pool.js";
import createPool from "./create-pool.js";

let commands: CommandModule<any, any>[] = [hello, info, listPool, createPool];

const cetusCommand: CommandModule<any, any> = {
  command: "cetus",
  describe: "cetus command tools",

  builder: (yargs) => {
    return yargs
      .command(commands)
      .demandCommand(1, "You need at least one command before moving on")
      .strict();
  },

  handler: async (_argv: any) => {},
};

export default cetusCommand;
