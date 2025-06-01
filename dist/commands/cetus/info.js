import { loadRuntime } from "../../utils.js";
import { getCetusSdk } from "../../cetus_tool.js";
const info = {
    command: "info",
    describe: "diplay cetus sdk info",
    async handler() {
        const runtime = loadRuntime();
        console.log(`current network: ${runtime.network}`);
        const sdk = getCetusSdk(runtime.getNetwork());
        const pools = await sdk.Pool.getPoolByCoins([
            "0x2::sui::SUI",
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
        ]);
        console.log(pools.length, " pools found ");
    },
};
export default info;
