import { CommandModule, string } from "yargs";
import { loadRuntime } from "../../utils.js";
import { getCetusSdk, getPriceFromSqrtPrice } from "../../cetus_tool.js";
import { CetusNetwork, SuiCoin } from "../../common.js";
import BN from "bn.js";

interface Option {
  coins: string[];
}

const listPool: CommandModule<Option, Option> = {
  command: "list-pool",
  describe: "list pools by coins. This not work for testnet.",

  builder: (yargs) => {
    return yargs.option("coins", {
      type: "array",
      description: "coins to query",
      demandOption: true,
      coerce: (arr) => arr.map(String),
      requiresArg: true,
      min: 2,
      default: [SuiCoin.SUI, SuiCoin.USDC],
    });
  },

  async handler(args: Option) {
    const runtime = loadRuntime();
    console.log(`current network: ${runtime.network}`);
    const sdk = getCetusSdk(runtime.getNetwork() as CetusNetwork);

    const pools = await sdk.Pool.getPoolByCoins(args.coins);

    for (let pool of pools) {
      console.log(`======== ${pool.poolAddress} ========`);
      const metadataA = await runtime.getCoinMetadata(pool.coinTypeA);
      const metadataB = await runtime.getCoinMetadata(pool.coinTypeB);
      if (!metadataA || !metadataB) {
        console.error("coin metadata not found");
        return;
      }

      if (!metadataA || !metadataB) {
        console.error("coin metadata not found");
        return;
      }
      console.log(pool.coinTypeA, pool.coinTypeB);
    }
  },
};

export default listPool;
