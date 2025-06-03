import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Runtime } from "./runtime.js";
import chalk from "chalk";

const cacheFile = "./.cache.json";

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

export let runtimeInstance: Runtime | null = null;

export const loadRuntime = (): Runtime => {
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

export const getRuntime = (pair: Ed25519Keypair, network: string) => {
  return new Runtime(pair, network);
};

export const getCreatedObject = (
  resp: SuiTransactionBlockResponse,
  filterOpitons: {
    expectSuffix?: string;
    expectPrefix?: string;
  }
): null | {
  objectID: string;
  objectType: string;
  version: string;
} => {
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
    console.log("save cache to file", chalk.gray(cacheFile));
    runtimeInstance.cache.save_to_file(cacheFile);
  }
};
