import { loadRuntime } from "../../utils.js";
import { getCetusSdk } from "../../cetus_tool.js";
import { ClmmPoolUtil, TickMath } from "@cetusprotocol/cetus-sui-clmm-sdk";
import BN from "bn.js";
const listPositions = {
    command: "positions",
    describe: "list positions by owner",
    builder: (yargs) => {
        return yargs
            .option("owner", {
            type: "string",
            description: "owner address",
            demandOption: false,
            default: "",
        })
            .option("width", {
            alias: "w",
            type: "boolean",
            description: "display much more information",
            demandOption: false,
            default: false,
        });
    },
    async handler(args) {
        const runtime = loadRuntime();
        if (!args.owner) {
            args.owner = runtime.getWalletAddress();
        }
        console.log(`current network: ${runtime.network}`);
        const sdk = getCetusSdk(runtime.getNetwork());
        const positions = await sdk.Position.getPositionList(args.owner, [], true);
        const lines = [];
        for (let i = 0; i < positions.length; i++) {
            const { pos_object_id, tick_lower_index, tick_upper_index, liquidity } = positions[i];
            const metaA = await runtime.getCoinMetadata(positions[i].coin_type_a);
            const metaB = await runtime.getCoinMetadata(positions[i].coin_type_b);
            if (!metaA || !metaB) {
                console.log(`metaA or metaB is null`);
                continue;
            }
            // // 将 tick 转换为 sqrt price
            const lowerSqrtPrice = TickMath.tickIndexToSqrtPriceX64(tick_lower_index);
            const upperSqrtPrice = TickMath.tickIndexToSqrtPriceX64(tick_upper_index);
            const lowerPrice = TickMath.sqrtPriceX64ToPrice(lowerSqrtPrice, metaA.decimals, metaB.decimals);
            const upperPrice = TickMath.sqrtPriceX64ToPrice(upperSqrtPrice, metaA.decimals, metaB.decimals);
            const pool = await sdk.Pool.getPool(positions[i].pool);
            const curSqrtPrice = new BN(pool.current_sqrt_price);
            const coinAmounts = ClmmPoolUtil.getCoinAmountFromLiquidity(new BN(liquidity), curSqrtPrice, lowerSqrtPrice, upperSqrtPrice, false // roundUp
            );
            if (args.width) {
                console.log(JSON.stringify({
                    pool: positions[i].pool,
                    pos_object_id,
                    coin_type_a: positions[i].coin_type_a,
                    coin_type_b: positions[i].coin_type_b,
                    tick_lower_index,
                    tick_upper_index,
                    lowerPrice,
                    upperPrice,
                    liquidity,
                    coin_amount_a: coinAmounts.coinA.toString(),
                    coin_amount_b: coinAmounts.coinB.toString(),
                }, null, 2));
            }
            else {
                lines.push({
                    pos_object_id,
                    tick_lower_index,
                    tick_upper_index,
                    liquidity,
                });
            }
        }
        if (!args.width) {
            console.table(lines);
        }
    },
};
export default listPositions;
