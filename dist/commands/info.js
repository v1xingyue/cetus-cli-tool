import { loadRuntime } from "../utils.js";
const info = {
    command: "info",
    describe: "display cetus cli tools info",
    async handler() {
        try {
            const runtime = loadRuntime();
            console.log(`network: ${runtime.getNetwork()}`);
            console.log("cluster url : ", runtime.getClusterUrl());
            console.log("wallet address : ", runtime.getWalletAddress());
            const balances = await runtime.getSuiClient().getAllBalances({
                owner: runtime.getWalletAddress(),
            });
            for (const balance of balances) {
                console.log(balance.coinType, balance.totalBalance);
            }
        }
        catch (error) {
            console.log("load failed, please run init first!!");
        }
    },
};
export default info;
