import { CommandModule } from "yargs";
interface Option {
    coinA: string;
    coinB: string;
    initPrice: number;
    amountA: string;
}
declare const createPool: CommandModule<Option, Option>;
export default createPool;
