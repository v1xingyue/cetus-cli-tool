import { CetusNetwork } from "./common";
import BN from "bn.js";
import { Decimal } from "decimal.js";
export declare const getCetusSdk: (network: CetusNetwork) => import("@cetusprotocol/cetus-sui-clmm-sdk").CetusClmmSDK;
export declare const getPriceFromSqrtPrice: (sqrtPrice: BN, decimalA: number, decimalB: number) => Decimal;
