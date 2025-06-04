import { getCreatedObject, loadRuntime } from "../utils.js";
import { getDeployJson } from "../deploy_jsons/index.js";
import { generateTokenIconSVG, svgToBase64 } from "../svg.js";
const createToken = {
    command: "create-token",
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
            choices: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
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
        })
            .option("icon", {
            description: "Specify the icon url or base64 of the token",
            default: "",
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
            if (args.icon == "") {
                args.icon = svgToBase64(generateTokenIconSVG(args.symbol));
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
            console.log(`updateCap : ${updateCap?.objectID}`);
            console.log(`metaData : ${metaData?.objectID}`);
            console.log(`treasuryCap : ${treasuryCap?.objectID}`);
            console.log(`transaction link : ${runtime.getTransactionLink(resp.digest)}`);
            if (!treasuryCap || !metaData || !updateCap) {
                throw new Error("Failed to create treasury cap");
            }
            const coinType = metaData.objectType.substring(24, metaData.objectType.length - 1);
            const update_tx = runtime.updateMetaTransaction(treasuryCap.objectID, metaData.objectID, args.name, args.symbol, args.description, coinType, args.icon);
            const updateResp = await runtime.signAndExecute(update_tx);
            console.log(`update transaction : ${runtime.getTransactionLink(updateResp.digest)}`);
        }
        catch (error) {
            console.log("create token error :", error);
        }
    },
};
export default createToken;
