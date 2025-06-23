import { CommandModule } from "yargs";
import { generateAccount, getRuntime, loadRuntime } from "../utils.js";
import { run } from "node:test";

interface Option {
  network: string;
}

const init: CommandModule<Option, Option> = {
  command: "init",
  describe: "init cetus cli tools",

  builder: (yargs) => {
    return yargs.option("network", {
      alias: "n",
      choices: ["mainnet", "testnet", "devnet"],
      description: "Specify the network to use",
      default: "mainnet",
    });
  },

  async handler(args: Option) {
    try {
      const runtime = loadRuntime();
      console.log("tool has been initialized");
      console.log(`network: ${args.network}`);
      console.log("cluster url : ", runtime.getClusterUrl());
      console.log("wallet address : ", runtime.getWalletAddress());
    } catch (error) {
      const pair = generateAccount();
      const runtime = getRuntime(pair, args.network);
      runtime.save();
      console.log(`network: ${args.network}`);
      console.log("cluster url : ", runtime.getClusterUrl());
      console.log("wallet address : ", runtime.getWalletAddress());
    }
  },
};

export default init;
