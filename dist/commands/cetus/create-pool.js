import { loadRuntime } from "../../utils.js";
import { getCetusSdk } from "../../cetus_tool.js";
import { ClmmPoolUtil, TickMath } from "@cetusprotocol/cetus-sui-clmm-sdk";
import { d } from "@cetusprotocol/cetus-sui-clmm-sdk";
import BN from "bn.js";
import chalk from "chalk";
const createPool = {
    command: "create-pool",
    describe: "create pool by coins 、price and input amount of coin a",
    builder: (yargs) => {
        return yargs
            .option("coin-a", {
            type: "string",
            description: "coin a type or alias name",
            demandOption: true,
        })
            .option("coin-b", {
            type: "string",
            description: "coin b type or alias name",
            demandOption: true,
            default: "sui",
        })
            .option("init-price", {
            type: "number",
            description: "init price of coin a , such as 1a = 0.1b , then the price will be 0.1",
            demandOption: true,
            default: 1,
        })
            .option("amount-a", {
            type: "string",
            description: "amount of coin a , this is human readable number",
            demandOption: true,
            default: "0.1",
        });
    },
    async handler(args) {
        const runtime = loadRuntime();
        console.log(`current network: ${runtime.network}`);
        const sdk = getCetusSdk(runtime.getNetwork());
        sdk.senderAddress = runtime.getWalletAddress();
        const metaA = await runtime.getCoinMetadata(args.coinA);
        const metaB = await runtime.getCoinMetadata(args.coinB);
        if (!metaA || !metaB || !metaA.id || !metaB.id) {
            console.error("coin metadata not found");
            return;
        }
        console.log(`initialize price : ${args.initPrice}`);
        const initialize_sqrt_price = TickMath.priceToSqrtPriceX64(d(args.initPrice), metaA.decimals, metaB.decimals).toString();
        const tick_spacing = 2;
        const current_tick_index = TickMath.sqrtPriceX64ToTickIndex(new BN(initialize_sqrt_price));
        // build tick range
        const tick_lower = TickMath.getPrevInitializableTickIndex(new BN(current_tick_index).toNumber(), new BN(tick_spacing).toNumber());
        const tick_upper = TickMath.getNextInitializableTickIndex(new BN(current_tick_index).toNumber(), new BN(tick_spacing).toNumber());
        const fix_coin_amount = new BN(Math.floor(parseFloat(args.amountA) * Math.pow(10, metaA.decimals)));
        const fix_amount_a = true;
        const slippage = 0.05;
        const cur_sqrt_price = new BN(initialize_sqrt_price);
        // Estimate liquidity and token amount from one amounts
        const liquidityInput = ClmmPoolUtil.estLiquidityAndcoinAmountFromOneAmounts(tick_lower, tick_upper, fix_coin_amount, fix_amount_a, true, slippage, cur_sqrt_price);
        // Estimate  token a and token b amount
        const amount_a = fix_amount_a
            ? fix_coin_amount.toNumber()
            : liquidityInput.tokenMaxA.toNumber();
        const amount_b = fix_amount_a
            ? liquidityInput.tokenMaxB.toNumber()
            : fix_coin_amount.toNumber();
        console.log(`need amount_a: ${amount_a} , amount_b: ${amount_b}`);
        const creatPoolPayload = await sdk.Pool.createPoolTransactionPayload({
            coinTypeA: args.coinA,
            coinTypeB: args.coinB,
            tick_spacing: tick_spacing,
            initialize_sqrt_price: initialize_sqrt_price,
            uri: "",
            amount_a,
            amount_b,
            fix_amount_a,
            tick_lower,
            tick_upper,
            metadata_a: metaA.id.toString(),
            metadata_b: metaB.id.toString(),
            slippage: slippage,
        });
        console.log("`create pool payload`", creatPoolPayload);
        const resp = await runtime.signAndExecute(creatPoolPayload);
        console.log("`create pool response`", resp);
        console.log(`create pool transaction : ${chalk.green(runtime.getTransactionLink(resp.digest))}`);
    },
};
export default createPool;
