import { loadRuntime } from "../../utils.js";
import { getCetusSdk } from "../../cetus_tool.js";
import { adjustForCoinSlippage, ClmmPoolUtil, } from "@cetusprotocol/cetus-sui-clmm-sdk";
import { Percentage } from "@cetusprotocol/cetus-sui-clmm-sdk";
import { TickMath } from "@cetusprotocol/cetus-sui-clmm-sdk";
import BN from "bn.js";
const removeLiquidity = {
    command: "remove-liquidity",
    describe: "remove liquidity from a position (based on Cetus remove_liquidity documentation)",
    builder: (yargs) => {
        return yargs
            .option("position", {
            type: "string",
            description: "position object ID to remove liquidity from",
            demandOption: true,
        })
            .option("liquidity", {
            type: "string",
            description: "amount of liquidity to remove",
            demandOption: true,
        });
    },
    async handler(args) {
        const runtime = loadRuntime();
        try {
            console.log(`Current network: ${runtime.network}`);
            const sdk = getCetusSdk(runtime.getNetwork());
            sdk.senderAddress = runtime.getWalletAddress();
            const position = await sdk.Position.getPositionById(args.position, true, true);
            // Get pool information for validation
            const pool = await sdk.Pool.getPool(position.pool);
            if (!pool) {
                throw new Error(`Pool ${position.pool} not found`);
            }
            console.log(`Pool validated: ${pool.coinTypeA} / ${pool.coinTypeB}`);
            const lowerSqrtPrice = TickMath.tickIndexToSqrtPriceX64(position.tick_lower_index);
            const upperSqrtPrice = TickMath.tickIndexToSqrtPriceX64(position.tick_upper_index);
            const ticksHandle = pool.ticks_handle;
            // input liquidity amount for remove
            const liquidity = new BN(args.liquidity);
            // slippage value
            const slippageTolerance = new Percentage(new BN(5), new BN(100));
            const curSqrtPrice = new BN(pool.current_sqrt_price);
            // // Get token amount from liquidity.
            const coinAmounts = ClmmPoolUtil.getCoinAmountFromLiquidity(liquidity, curSqrtPrice, lowerSqrtPrice, upperSqrtPrice, false);
            // // adjust  token a and token b amount for slippage
            const { tokenMaxA, tokenMaxB } = adjustForCoinSlippage(coinAmounts, slippageTolerance, false);
            const rewards = await sdk.Rewarder.fetchPositionRewarders(pool, position.pos_object_id);
            // // build remove liquidity params
            const removeLiquidityParams = {
                coinTypeA: pool.coinTypeA,
                coinTypeB: pool.coinTypeB,
                delta_liquidity: liquidity.toString(),
                min_amount_a: tokenMaxA.toString(),
                min_amount_b: tokenMaxB.toString(),
                pool_id: pool.poolAddress,
                pos_id: position.pos_object_id,
                collect_fee: true, // Whether to collect fee
                rewarder_coin_types: rewards.map((rewarder) => rewarder.coin_address),
            };
            const removeLiquidityTransactionPayload = await sdk.Position.removeLiquidityTransactionPayload(removeLiquidityParams);
            const result = await runtime.signAndExecute(removeLiquidityTransactionPayload);
            console.log(`remove liquidity transaction link: ${runtime.getTransactionLink(result.digest)}`);
        }
        catch (error) {
            console.error("❌ Error in remove liquidity operation:", error);
            process.exit(1);
        }
    },
};
export default removeLiquidity;
