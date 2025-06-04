import { loadRuntime } from "../../utils.js";
import { getCetusSdk } from "../../cetus_tool.js";
const addLiquidity = {
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
    async handler(args) {
        const runtime = loadRuntime();
        console.log(`current network: ${runtime.network}`);
        const sdk = getCetusSdk(runtime.getNetwork());
    },
};
export default addLiquidity;
