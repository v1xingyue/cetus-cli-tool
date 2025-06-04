import { loadRuntime } from "../../utils.js";
import { getCetusSdk } from "../../cetus_tool.js";
import { ClmmPoolUtil, TickMath, } from "@cetusprotocol/cetus-sui-clmm-sdk";
import BN from "bn.js";
const createLiquidity = {
    command: "create-liquidity",
    describe: "create liquidity",
    builder: (yargs) => {
        return yargs
            .option("pool", {
            type: "string",
            description: "pool address",
            demandOption: true,
            default: "",
        })
            .option("amount", {
            type: "string",
            description: "amount of coin a, this is human readable amount.",
            demandOption: true,
            default: "",
        })
            .option("position", {
            type: "string",
            description: "position id",
            demandOption: false,
            default: "",
        });
    },
    async handler(args) {
        const slippage = 0.05;
        const runtime = loadRuntime();
        console.log(`current network: ${runtime.network}`);
        const sdk = getCetusSdk(runtime.getNetwork());
        sdk.senderAddress = runtime.getWalletAddress();
        const pool = await sdk.Pool.getPool(args.pool);
        const lowerTick = TickMath.getPrevInitializableTickIndex(new BN(pool.current_tick_index).toNumber(), new BN(pool.tickSpacing).toNumber());
        const upperTick = TickMath.getNextInitializableTickIndex(new BN(pool.current_tick_index).toNumber(), new BN(pool.tickSpacing).toNumber());
        const metaA = await runtime.getCoinMetadata(pool.coinTypeA);
        if (!metaA) {
            console.error("coin metadata not found");
            return;
        }
        const coinAmount = new BN(Math.floor(parseFloat(args.amount) * Math.pow(10, metaA.decimals)));
        const fix_amount_a = true;
        const curSqrtPrice = new BN(pool.current_sqrt_price);
        const liquidityInput = ClmmPoolUtil.estLiquidityAndcoinAmountFromOneAmounts(lowerTick, upperTick, coinAmount, fix_amount_a, true, slippage, curSqrtPrice);
        const amount_a = fix_amount_a
            ? coinAmount.toNumber()
            : liquidityInput.tokenMaxA.toNumber();
        const amount_b = fix_amount_a
            ? liquidityInput.tokenMaxB.toNumber()
            : coinAmount.toNumber();
        console.log("amount: ", { amount_a, amount_b });
        const addLiquidityPayloadParams = {
            coinTypeA: pool.coinTypeA,
            coinTypeB: pool.coinTypeB,
            pool_id: pool.poolAddress,
            tick_lower: lowerTick.toString(),
            tick_upper: upperTick.toString(),
            fix_amount_a,
            amount_a,
            amount_b,
            slippage: slippage,
            rewarder_coin_types: [],
            collect_fee: false,
            is_open: args.position === "",
            pos_id: args.position,
        };
        const createAddLiquidityTransactionPayload = await sdk.Position.createAddLiquidityFixTokenPayload(addLiquidityPayloadParams, {
            slippage,
            curSqrtPrice: curSqrtPrice,
        });
        const result = await runtime.signAndExecute(createAddLiquidityTransactionPayload);
        console.log(`create liquidity transaction link: ${runtime.getTransactionLink(result.digest)}`);
    },
};
export default createLiquidity;
