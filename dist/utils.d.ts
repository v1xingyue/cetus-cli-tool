import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Runtime } from "./runtime.js";
export declare const generateAccount: () => Ed25519Keypair;
export declare const loadAccount: () => Ed25519Keypair;
export declare const loadNetwork: () => string;
export declare let runtimeInstance: Runtime | null;
export declare const loadRuntime: () => Runtime;
export declare const getRuntime: (pair: Ed25519Keypair, network: string) => Runtime;
export declare const getCreatedObject: (resp: SuiTransactionBlockResponse, filterOpitons: {
    expectSuffix?: string;
    expectPrefix?: string;
}) => null | {
    objectID: string;
    objectType: string;
    version: string;
};
export declare const saveCache: () => void;
