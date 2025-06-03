import { loadRuntime } from "../../utils.js";
import { getCetusSdk, getPriceFromSqrtPrice } from "../../cetus_tool.js";
import { SuiCoin } from "../../common.js";
import BN from "bn.js";
const listPool = {
    command: "list-pool",
    describe: "list pools by coins",
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
    async handler(args) {
        const runtime = loadRuntime();
        console.log(`current network: ${runtime.network}`);
        const sdk = getCetusSdk(runtime.getNetwork());
        const pools = await sdk.Pool.getPoolByCoins(args.coins);
        for (let i = 0; i < pools.length; i++) {
            const pool = pools[i];
            const metadataA = await runtime.getCoinMetadata(pool.coinTypeA);
            const metadataB = await runtime.getCoinMetadata(pool.coinTypeB);
            if (!metadataA || !metadataB) {
                console.error("coin metadata not found");
                return;
            }
            console.log(pool.poolAddress, pool.coinTypeA, pool.coinTypeB, getPriceFromSqrtPrice(new BN(pool.current_sqrt_price), metadataA.decimals, metadataB.decimals).toString());
        }
    },
};
export default listPool;
