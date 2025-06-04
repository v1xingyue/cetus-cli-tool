import { CommandModule, string } from "yargs";
import { loadRuntime } from "../../utils.js";
import { getCetusSdk, getPriceFromSqrtPrice } from "../../cetus_tool.js";
import { CetusNetwork, SuiCoin } from "../../common.js";
import { ClmmPoolUtil, TickMath } from "@cetusprotocol/cetus-sui-clmm-sdk";
import BN from "bn.js";

interface Option {
  pool: string;
  coin_a: string;
  coin_b: string;
  amount_a: string;
  amount_b: string;
}

const addLiquidity: CommandModule<Option, Option> = {
  command: "add-liquidity",
  describe: "add liquidity to a pool",

  builder: (yargs) => {
    return yargs
      .option("owner", {
        type: "string",
        description: "owner address",
        demandOption: false,
        default: "",
      })
      .option("width", {
        alias: "w",
        type: "boolean",
        description: "display much more information",
        demandOption: false,
        default: false,
      });
  },

  async handler(args: Option) {
    const runtime = loadRuntime();

    console.log(`current network: ${runtime.network}`);
    const sdk = getCetusSdk(runtime.getNetwork() as CetusNetwork);
  },
};

export default addLiquidity;
