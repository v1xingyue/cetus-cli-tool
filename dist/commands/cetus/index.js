import hello from "./hello.js";
import info from "./info.js";
import listPool from "./list-pool.js";
import createPool from "./create-pool.js";
let commands = [hello, info, listPool, createPool];
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
