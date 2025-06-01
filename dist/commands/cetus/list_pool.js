import { loadRuntime } from "../../utils";
const listPool = {
    command: "list-pool",
    describe: "list all pools",
    async handler() {
        const runtime = loadRuntime();
        console.log(`current network: ${runtime.network}`);
    },
};
export default listPool;
