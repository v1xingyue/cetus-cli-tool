import { loadRuntime } from "../../utils.js";
import { getCetusSdk } from "../../cetus_tool.js";
const info = {
    command: "info",
    describe: "diplay cetus sdk info",
    builder: (yargs) => {
        return yargs.option("coins", {
            type: "array",
            description: "coins to query",
            demandOption: true,
        });
    },
    async handler(args) {
        const runtime = loadRuntime();
        console.log(`current network: ${runtime.network}`);
        const sdk = getCetusSdk(runtime.getNetwork());
        const pools = await sdk.Pool.getPoolByCoins(args.coins);
        console.log(pools.length, " pools found ");
    },
};
export default info;
