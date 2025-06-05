import { CommandModule } from "yargs";
import { loadRuntime } from "../../utils.js";
import { getCetusSdk } from "../../cetus_tool.js";
import { CetusNetwork } from "../../common.js";
import {
  Percentage,
  adjustForSlippage,
} from "@cetusprotocol/cetus-sui-clmm-sdk";
import { d } from "@cetusprotocol/cetus-sui-clmm-sdk";
import BN from "bn.js";
import Decimal from "decimal.js";

interface Option {
  poolAddress: string;
  amount: string;
  slippage: number;
  a2b: boolean;
  b2a: boolean;
}

const swapCommand: CommandModule<Option, Option> = {
  command: "swap",
  describe: "swap from pool by pool address and input amount of coin a.",

  builder: (yargs) => {
    return yargs
      .option("pool-address", {
        type: "string",
        description: "pool address",
        demandOption: true,
      })
      .option("amount", {
        type: "string",
        description:
          "amount of coin to swap. if a2b is true, this is amount of coin a to swap, or amount of coin b to swap.this is human readable number",
        demandOption: true,
        default: "0.1",
      })
      .option("a2b", {
        type: "boolean",
        description: "swap a to b",
        demandOption: true,
        default: true,
      })
      .option("b2a", {
        type: "boolean",
        description: "swap b to a.",
        demandOption: true,
        default: false,
      })
      .option("slippage", {
        type: "number",
        description: "slippage in percentage",
        demandOption: true,
        default: 5,
      });
  },

  async handler(args: Option) {
    const runtime = loadRuntime();
    console.log(`current network: ${runtime.network}`);
    const sdk = getCetusSdk(runtime.getNetwork() as CetusNetwork);
    sdk.senderAddress = runtime.getWalletAddress();

    const slippage = Percentage.fromDecimal(d(args.slippage));
    const pool = await sdk.Pool.getPool(args.poolAddress);

    if (!pool || !pool.current_sqrt_price) {
      console.error("pool not found");
      return;
    }

    const metadataA = await runtime.getCoinMetadata(pool.coinTypeA);
    const metadataB = await runtime.getCoinMetadata(pool.coinTypeB);

    if (!metadataA || !metadataB) {
      console.error("metadata not found");
      return;
    }

    let inputAmount: Decimal = new Decimal(0);
    let a2b = args.a2b;
    if (args.b2a) {
      a2b = false;
    }
    if (a2b) {
      inputAmount = d(Number(args.amount) * 10 ** metadataA.decimals);
    } else {
      inputAmount = d(Number(args.amount) * 10 ** metadataB.decimals);
    }

    // a2b true means input a swap b
    const preSwap: any = await sdk.Swap.preswap({
      pool: pool,
      currentSqrtPrice: pool.current_sqrt_price,
      coinTypeA: pool.coinTypeA,
      coinTypeB: pool.coinTypeB,
      decimalsA: metadataA.decimals, // coin a 's decimals
      decimalsB: metadataB.decimals, // coin b 's decimals
      a2b,
      byAmountIn: true, // fix token a amount
      amount: inputAmount.toString(),
    });

    console.log(`preswap: ${JSON.stringify(preSwap, null, 2)}`);

    const toAmount = preSwap.byAmountIn
      ? preSwap.estimatedAmountOut
      : preSwap.estimatedAmountIn;

    const amountLimit = adjustForSlippage(
      new BN(toAmount),
      slippage,
      !preSwap.byAmountIn
    );

    const swapPayload = await sdk.Swap.createSwapTransactionPayload({
      pool_id: pool.poolAddress,
      a2b,
      by_amount_in: true,
      amount: preSwap.amount.toString(),
      amount_limit: amountLimit.toString(),
      swap_partner: undefined,
      coinTypeA: pool.coinTypeA,
      coinTypeB: pool.coinTypeB,
    });

    const swapTxn = await runtime.signAndExecute(swapPayload);
    if (swapTxn) {
      console.log(
        `swapTxn: ${swapTxn?.digest} , ${runtime.getTransactionLink(
          swapTxn?.digest
        )}`
      );
    }
  },
};

export default swapCommand;
