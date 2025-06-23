import { CommandModule, string } from "yargs";
import { loadRuntime } from "../../utils.js";
import { getCetusSdk, getPriceFromSqrtPrice } from "../../cetus_tool.js";
import { CetusNetwork, SuiCoin } from "../../common.js";
import {
  adjustForCoinSlippage,
  ClmmPoolUtil,
  Percentage,
  TickMath,
} from "@cetusprotocol/cetus-sui-clmm-sdk";
import BN from "bn.js";

interface Option {
  position: string;
}

const closePosition: CommandModule<Option, Option> = {
  command: "close-position",
  describe: "close position",

  builder: (yargs) => {
    return yargs.option("position", {
      type: "string",
      description: "position id",
      demandOption: true,
    });
  },

  async handler(args: Option) {
    const runtime = loadRuntime();

    console.log(`current network: ${runtime.network}`);
    const sdk = getCetusSdk(runtime.getNetwork() as CetusNetwork);
    sdk.senderAddress = runtime.getWalletAddress();

    const position = await sdk.Position.getPositionById(
      args.position,
      true,
      true
    );
    const pool = await sdk.Pool.getPool(position.pool);

    // build tick data
    const lowerSqrtPrice = TickMath.tickIndexToSqrtPriceX64(
      position.tick_lower_index
    );
    const upperSqrtPrice = TickMath.tickIndexToSqrtPriceX64(
      position.tick_upper_index
    );
    const ticksHandle = pool.ticks_handle;
    const tickLower = await sdk.Pool.getTickDataByIndex(
      ticksHandle,
      position.tick_lower_index
    );
    const tickUpper = await sdk.Pool.getTickDataByIndex(
      ticksHandle,
      position.tick_upper_index
    );
    // input liquidity amount for remove
    const liquidity = new BN(position.liquidity);
    // slippage value
    const slippageTolerance = new Percentage(new BN(5), new BN(100));
    const curSqrtPrice = new BN(pool.current_sqrt_price);
    // Get token amount from liquidity.
    const coinAmounts = ClmmPoolUtil.getCoinAmountFromLiquidity(
      liquidity,
      curSqrtPrice,
      lowerSqrtPrice,
      upperSqrtPrice,
      false
    );
    // adjust  token a and token b amount for slippage
    const { tokenMaxA, tokenMaxB } = adjustForCoinSlippage(
      coinAmounts,
      slippageTolerance,
      false
    );

    const rewards = await sdk.Rewarder.fetchPositionRewarders(
      pool,
      position.pos_object_id
    );

    // build close position payload
    const closePositionTransactionPayload =
      await sdk.Position.closePositionTransactionPayload({
        coinTypeA: pool.coinTypeA,
        coinTypeB: pool.coinTypeB,
        min_amount_a: tokenMaxA.toString(),
        min_amount_b: tokenMaxB.toString(),
        pool_id: pool.poolAddress,
        pos_id: args.position,
        collect_fee: true,
        rewarder_coin_types: rewards.map((rewarder) => rewarder.coin_address),
      });

    const result = await runtime.signAndExecute(
      closePositionTransactionPayload
    );
    console.log(
      `close position transaction link: ${runtime.getTransactionLink(
        result.digest
      )}`
    );
  },
};

export default closePosition;
