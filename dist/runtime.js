import { Transaction } from "@mysten/sui/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import fs from "fs";
import { MemoryCache } from "./memory_cache.js";
export class Runtime {
    constructor(account, network) {
        this.account = account;
        this.network = network;
        this.cache = new MemoryCache();
    }
    setNetwork(network) {
        this.network = network;
    }
    getClusterUrl() {
        return getFullnodeUrl(this.network);
    }
    getNetwork() {
        return this.network;
    }
    getSuiClient() {
        return new SuiClient({ url: this.getClusterUrl() });
    }
    publishPackageTransaction(params) {
        const tx = new Transaction();
        const [upgradeCap] = tx.publish(params);
        tx.transferObjects([upgradeCap], this.getWalletAddress());
        return tx;
    }
    updateMetaTransaction(treasury, meta, name, symbol, description, coinType) {
        console.log("cointype is ", coinType);
        const tx = new Transaction();
        tx.moveCall({
            target: `0x2::coin::update_name`,
            typeArguments: [coinType],
            arguments: [tx.object(treasury), tx.object(meta), tx.pure.string(name)],
        });
        tx.moveCall({
            target: `0x2::coin::update_symbol`,
            typeArguments: [coinType],
            arguments: [tx.object(treasury), tx.object(meta), tx.pure.string(symbol)],
        });
        tx.moveCall({
            target: `0x2::coin::update_description`,
            typeArguments: [coinType],
            arguments: [
                tx.object(treasury),
                tx.object(meta),
                tx.pure.string(description),
            ],
        });
        tx.moveCall({
            target: "0x2::transfer::public_freeze_object",
            typeArguments: [`0x2::coin::CoinMetadata<${coinType}>`],
            arguments: [tx.object(meta)],
        });
        return tx;
    }
    getWalletAddress() {
        return this.account.getPublicKey().toSuiAddress();
    }
    async getUpgradeCap(packageId) {
        const upgradeCaps = await this.getSuiClient().getOwnedObjects({
            owner: this.getWalletAddress(),
            filter: {
                StructType: `0x2::package::UpgradeCap`,
            },
            options: {
                showContent: true,
            },
        });
        let filterCaps = upgradeCaps.data.filter((item) => {
            const content_any = item.data?.content;
            return content_any.fields.package == packageId;
        });
        return filterCaps[0];
    }
    async getTreasuryCap(packageId) {
        const resp = await this.getSuiClient().getOwnedObjects({
            owner: this.getWalletAddress(),
            filter: {
                StructType: `0x2::coin::TreasuryCap<${packageId}::token::TOKEN>`,
            },
        });
        return resp.data[0];
    }
    async waitAndReturn(digest) {
        const client = this.getSuiClient();
        await client.waitForTransaction({
            digest,
        });
        const transaction = await client.getTransactionBlock({
            digest,
            options: {
                showEffects: true,
                showEvents: true,
                showObjectChanges: true,
            },
        });
        return transaction;
    }
    async signAndExecute(tx) {
        tx.setGasBudget(300000000);
        return this.getSuiClient().signAndExecuteTransaction({
            transaction: tx,
            signer: this.account,
            signal: AbortSignal.timeout(60000),
        });
    }
    freezePackageTransaction(coinType, upgradeCap, treasuryCap) {
        const tx = new Transaction();
        tx.moveCall({
            target: `0x2::package::make_immutable`,
            arguments: [tx.object(upgradeCap)],
        });
        if (treasuryCap) {
            tx.moveCall({
                target: `0x2::transfer::public_freeze_object`,
                typeArguments: [`0x2::coin::TreasuryCap<${coinType}>`],
                arguments: [tx.object(treasuryCap)],
            });
        }
        return tx;
    }
    getMintTransaction(treasury, amount, recipient, freeze, coinType) {
        recipient = recipient || this.getWalletAddress();
        const tx = new Transaction();
        const [minted] = tx.moveCall({
            target: `0x2::coin::mint`,
            typeArguments: [coinType],
            arguments: [tx.object(treasury), tx.pure.u64(amount)],
        });
        tx.transferObjects([minted], tx.pure.address(recipient));
        if (freeze) {
            tx.moveCall({
                target: `0x2::transfer::public_freeze_object`,
                typeArguments: [`0x2::coin::TreasuryCap<${coinType}>`],
                arguments: [tx.object(treasury)],
            });
        }
        return tx;
    }
    getTransactionLink(digest) {
        const network = this.getNetwork();
        if (network == "mainnet") {
            return `https://suivision.xyz/txblock/${digest}`;
        }
        return `https://${network}.suivision.xyz/txblock/${digest}`;
        // return `https://suiscan.xyz/${this.getNetwork()}/tx/${digest}`;
    }
    async getCoinMetadata(coinType) {
        const cacheKey = `coin_metadata_${coinType}`;
        const dataCache = this.cache.get(cacheKey);
        if (dataCache) {
            return dataCache;
        }
        const client = this.getSuiClient();
        const resp = await client.getCoinMetadata({
            coinType,
        });
        this.cache.set(cacheKey, resp);
        return resp;
    }
    save() {
        const privateKeyHex = this.account.getSecretKey().toString();
        const network = this.network;
        fs.writeFileSync(".env", `SUI_PRIVATEKEY=${privateKeyHex}\nSUI_NETWORK=${network}`, {
            encoding: "utf8",
        });
    }
}
