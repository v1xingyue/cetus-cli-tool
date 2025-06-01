import {
  initCetusSDK,
  TickMath,
  ClmmPoolUtil,
} from "@cetusprotocol/cetus-sui-clmm-sdk";

import { CetusNetwork } from "./common";
import BN from "bn.js";
import { Decimal } from "decimal.js";

export const getCetusSdk = (network: CetusNetwork) => {
  const cetusClmmSDK = initCetusSDK({ network });
  return cetusClmmSDK;
};

export const getPriceFromSqrtPrice = (
  sqrtPrice: BN,
  decimalA: number,
  decimalB: number
): Decimal => {
  return TickMath.sqrtPriceX64ToPrice(sqrtPrice, decimalA, decimalB);
};
