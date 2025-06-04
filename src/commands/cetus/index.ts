import { CommandModule } from "yargs";
import hello from "./hello.js";
import info from "./info.js";
import listPool from "./list-pool.js";
import createPool from "./create-pool.js";
import listPositions from "./positions.js";
import swapCommand from "./swap.js";
import removeLiquidity from "./remove-liquidity.js";

let commands: CommandModule<any, any>[] = [
  hello,
  info,
  listPool,
  createPool,
  listPositions,
  swapCommand,
  removeLiquidity,
];

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
