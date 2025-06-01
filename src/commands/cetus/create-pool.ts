import { CommandModule, string } from "yargs";
import { loadRuntime } from "../../utils.js";
import { getCetusSdk, getPriceFromSqrtPrice } from "../../cetus_tool.js";
import { CetusNetwork, SuiCoin } from "../../common.js";
import BN from "bn.js";

interface Option {
  coin_a: string;
  coin_b: string;
  price: string;
  amount_a: string;
}

const createPool: CommandModule<Option, Option> = {
  command: "create-pool",
  describe: "create pool by coins 、price and input amount of coin a",

  builder: (yargs) => {
    return yargs
      .option("coin_a", {
        type: "string",
        description: "coin a type",
        demandOption: true,
      })
      .option("coin_b", {
        type: "string",
        description: "coin b type",
        demandOption: true,
      })
      .option("price", {
        type: "string",
        description: "price of coin a",
        demandOption: true,
      })
      .option("amount_a", {
        type: "string",
        description: "amount of coin a",
        demandOption: true,
      });
  },

  async handler(args: Option) {
    const runtime = loadRuntime();
    console.log(`current network: ${runtime.network}`);
    const sdk = getCetusSdk(runtime.getNetwork() as CetusNetwork);
  },
};

export default createPool;
