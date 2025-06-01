import { compare } from "../deploy_jsons/index.js";
const compareCmd = {
    command: "compare",
    describe: "compare two modules",
    async handler() {
        try {
            const lines = compare();
            console.table(lines);
        }
        catch (error) {
            console.log("load failed, please run init first!!");
        }
    },
};
export default compareCmd;
