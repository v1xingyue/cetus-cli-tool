import { loadRuntime } from "../../utils.js";
import { getCetusSdk } from "../../cetus_tool.js";
import { SuiCoin } from "../../common.js";
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
        const pools = await sdk.Pool.getPoolImmutablesWithPage();
        for (let pool of pools.data) {
            const metadataA = await runtime.getCoinMetadata(pool.coinTypeA);
            const metadataB = await runtime.getCoinMetadata(pool.coinTypeB);
            console.log(pool.coinTypeA, pool.coinTypeB, pool.poolAddress);
            if (!metadataA || !metadataB) {
                console.error("coin metadata not found");
                return;
            }
            if (!metadataA || !metadataB) {
                console.error("coin metadata not found");
                return;
            }
            console.log(pool.poolAddress, pool.coinTypeA, pool.coinTypeB);
        }
    },
};
export default listPool;
