import { getCreatedObject, loadRuntime } from "../utils.js";
import { getDeployJson } from "../deploy_jsons/index.js";
const newToken = {
    command: "new-token",
    describe: "create a new token",
    builder: (yargs) => {
        return yargs
            .option("name", {
            alias: "n",
            description: "Specify the name of the token",
            default: "x",
        })
            .option("decimal", {
            alias: "d",
            description: "Specify the decimal of the token",
            choices: [6, 7, 8, 9, 10, 11, 12],
            default: 9,
        })
            .option("symbol", {
            alias: "s",
            description: "Specify the symbol of the token",
            default: "X",
        })
            .option("description", {
            description: "Specify the description of the token",
            default: "No description",
        });
    },
    async handler(args) {
        try {
            const runtime = loadRuntime();
            console.log(`you will create a new token : ${args.name}`);
            const packageData = getDeployJson(args.decimal);
            if (!packageData) {
                throw new Error("Failed to load package data");
            }
            const tx = runtime.publishPackageTransaction(packageData);
            const resp = await runtime.signAndExecute(tx);
            const transactionBlock = await runtime.waitAndReturn(resp.digest);
            const updateCap = getCreatedObject(transactionBlock, {
                expectPrefix: "0x2::package::UpgradeCap",
            });
            const metaData = getCreatedObject(transactionBlock, {
                expectPrefix: "0x2::coin::CoinMetadata",
            });
            const treasuryCap = getCreatedObject(transactionBlock, {
                expectPrefix: "0x2::coin::TreasuryCap",
            });
            console.log(`updateCap : ${updateCap}`);
            console.log(`metaData : ${metaData}`);
            console.log(`treasuryCap : ${treasuryCap}`);
            console.log(`transaction link : ${runtime.getTransactionLink(resp.digest)}`);
        }
        catch (error) {
            console.log("create token error :", error);
        }
    },
};
export default newToken;
