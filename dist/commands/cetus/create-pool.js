import { loadRuntime } from "../../utils.js";
import { getCetusSdk } from "../../cetus_tool.js";
const createPool = {
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
    async handler(args) {
        const runtime = loadRuntime();
        console.log(`current network: ${runtime.network}`);
        const sdk = getCetusSdk(runtime.getNetwork());
    },
};
export default createPool;
