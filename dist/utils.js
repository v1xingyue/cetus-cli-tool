import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Runtime } from "./runtime.js";
const cacheFile = "./cache.json";
export const generateAccount = () => {
    const pair = Ed25519Keypair.generate();
    return pair;
};
export const loadAccount = () => {
    const privateKeyEnv = process.env.SUI_PRIVATEKEY;
    if (!privateKeyEnv) {
        throw new Error("SUI_KEYPAIR environment variable is not set.");
    }
    return Ed25519Keypair.fromSecretKey(privateKeyEnv);
};
export const loadNetwork = () => {
    const networkEnv = process.env.SUI_NETWORK;
    if (!networkEnv) {
        throw new Error("SUI_NETWORK environment variable is not set.");
    }
    return networkEnv;
};
export let runtimeInstance = null;
export const loadRuntime = () => {
    if (runtimeInstance) {
        return runtimeInstance;
    }
    const account = loadAccount();
    const network = loadNetwork();
    const runtime = new Runtime(account, network);
    runtime.cache.load_from_file(cacheFile);
    runtimeInstance = runtime;
    return runtime;
};
export const getRuntime = (pair, network) => {
    return new Runtime(pair, network);
};
export const getCreatedObject = (resp, filterOpitons) => {
    let result = null;
    resp.objectChanges?.forEach((object) => {
        if (object.type === "created") {
            const objType = object.objectType;
            if (filterOpitons.expectPrefix) {
                if (objType.startsWith(filterOpitons.expectPrefix)) {
                    result = {
                        objectID: object.objectId,
                        objectType: object.objectType,
                        version: object.version,
                    };
                }
            }
            if (filterOpitons.expectSuffix) {
                if (objType.endsWith(filterOpitons.expectSuffix)) {
                    result = {
                        objectID: object.objectId,
                        objectType: object.objectType,
                        version: object.version,
                    };
                }
            }
        }
    });
    return result;
};
export const saveCache = () => {
    if (runtimeInstance) {
        runtimeInstance.cache.save_to_file(cacheFile);
    }
};
