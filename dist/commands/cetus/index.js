import hello from "./hello.js";
import info from "./info.js";
import listPool from "./list-pool.js";
import createPool from "./create-pool.js";
import listPositions from "./positions.js";
import swapCommand from "./swap.js";
import removeLiquidity from "./remove-liquidity.js";
import closePosition from "./close-position.js";
import addLiquidity from "./add-liquidity.js";
let commands = [
    hello,
    info,
    listPool,
    createPool,
    listPositions,
    swapCommand,
    removeLiquidity,
    closePosition,
    addLiquidity,
];
const cetusCommand = {
    command: "cetus",
    describe: "cetus command tools",
    builder: (yargs) => {
        return yargs
            .command(commands)
            .demandCommand(1, "You need at least one command before moving on")
            .strict();
    },
    handler: async (_argv) => { },
};
export default cetusCommand;
