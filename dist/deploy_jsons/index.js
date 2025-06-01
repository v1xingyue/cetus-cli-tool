import { patch492thByte } from "./tool.js";
import fastCoinTx6 from "./fast_coin_6_tx.json" with { type: "json" };
import fastCoinTx12 from "./fast_coin_12_tx.json" with { type: "json" };
export const compare = () => {
    const module6 = fastCoinTx6.modules[0];
    const module12 = fastCoinTx12.modules[0];
    const bytes6 = base64ToBytes(module6);
    const bytes12 = base64ToBytes(module12);
    const lines = [];
    for (let i = 0; i < bytes6.length; i++) {
        if (bytes6[i] !== bytes12[i]) {
            console.log(`Mismatch at index ${i}: ${bytes6[i]} !== ${bytes12[i]}`);
            lines.push({
                module6: bytes6[i],
                module12: bytes12[i],
            });
        }
    }
    return lines;
};
export const getDeployJson = (decimal) => {
    let baseJson = fastCoinTx6;
    const newModules = patch492thByte(baseJson.modules[0], decimal);
    baseJson.modules = [newModules];
    return baseJson;
};
function base64ToBytes(base64Str) {
    if (typeof Buffer !== "undefined") {
        return Uint8Array.from(Buffer.from(base64Str, "base64")); // Node.js
    }
    else {
        const binaryStr = atob(base64Str);
        const byteArray = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
            byteArray[i] = binaryStr.charCodeAt(i);
        }
        return byteArray;
    }
}
