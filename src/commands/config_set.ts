import { CommandModule } from "yargs";
import { loadRuntime } from "../utils.js";

interface Option {
  network: string;
}

const configSet: CommandModule<Option, Option> = {
  command: "config-set",
  describe: "set config value",

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
      console.log(`Set network : ${args.network}`);
      runtime.setNetwork(args.network);
      runtime.save();
    } catch (error) {
      console.log("load failed, please run init first!!");
    }
  },
};

export default configSet;
