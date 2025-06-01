import { initCetusSDK, TickMath, } from "@cetusprotocol/cetus-sui-clmm-sdk";
export const getCetusSdk = (network) => {
    const cetusClmmSDK = initCetusSDK({ network });
    return cetusClmmSDK;
};
export const getPriceFromSqrtPrice = (sqrtPrice, decimalA, decimalB) => {
    return TickMath.sqrtPriceX64ToPrice(sqrtPrice, decimalA, decimalB);
};
