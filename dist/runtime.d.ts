import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { CoinMetadata, SuiClient } from "@mysten/sui/client";
import { PublishParams } from "./common.js";
import { MemoryCache } from "./memory_cache.js";
export declare class Runtime {
    account: Ed25519Keypair;
    network: string;
    cache: MemoryCache;
    constructor(account: Ed25519Keypair, network: string);
    setNetwork(network: string): void;
    getClusterUrl(): "https://fullnode.mainnet.sui.io:443" | "https://fullnode.testnet.sui.io:443" | "https://fullnode.devnet.sui.io:443" | "http://127.0.0.1:9000";
    getNetwork(): string;
    getSuiClient(): SuiClient;
    publishPackageTransaction(params: PublishParams): Transaction;
    updateMetaTransaction(treasury: string, meta: string, name: string, symbol: string, description: string, coinType: string): Transaction;
    getWalletAddress(): string;
    getUpgradeCap(packageId: string): Promise<import("@mysten/sui/dist/cjs/client/index.js").SuiObjectResponse>;
    getTreasuryCap(packageId: string): Promise<import("@mysten/sui/dist/cjs/client/index.js").SuiObjectResponse>;
    waitAndReturn(digest: string): Promise<import("@mysten/sui/dist/cjs/client/index.js").SuiTransactionBlockResponse>;
    signAndExecute(tx: Transaction): Promise<import("@mysten/sui/dist/cjs/client/index.js").SuiTransactionBlockResponse>;
    freezePackageTransaction(coinType: string, upgradeCap: string, treasuryCap: string | null): Transaction;
    getMintTransaction(treasury: string, amount: string, recipient: string | null, freeze: boolean, coinType: string): Transaction;
    getTransactionLink(digest: string): string;
    getCoinMetadata(coinTypeOrAlias: string): Promise<CoinMetadata | null>;
    save(): void;
}
