import { loadRuntime } from "../utils.js";
const freezePackage = {
    command: "freeze-package",
    describe: "freeze a package",
    builder: (yargs) => {
        return yargs.option("package", {
            alias: "p",
            type: "string",
            description: "package id",
            demandOption: true,
        });
    },
    async handler(args) {
        try {
            const runtime = loadRuntime();
            console.log(`network: ${runtime.getNetwork()}`);
            const address = runtime.getWalletAddress();
            console.log(`address: ${address}`);
            const upgradeCap = await runtime.getUpgradeCap(args.package);
            if (!upgradeCap) {
                console.log("upgradeCap not found !");
                return;
            }
            if (upgradeCap) {
                console.log(`treasuryCap is : ${upgradeCap}`);
            }
            let treasuryCapId = null;
            const treasuryCap = await runtime.getTreasuryCap(args.package);
            if (treasuryCap) {
                treasuryCapId = treasuryCap.data?.objectId;
            }
            const coinType = `${args.package}::token::TOKEN`;
            const freezeTx = runtime.freezePackageTransaction(coinType, upgradeCap.data?.objectId, treasuryCapId);
            const resp = await runtime.signAndExecute(freezeTx);
            console.log(`freeze transaction : ${runtime.getTransactionLink(resp.digest)}`);
        }
        catch (error) {
            console.log("load failed", error);
        }
    },
};
export default freezePackage;
