import { CommandModule } from "yargs";
interface Option {
    poolAddress: string;
    amount: string;
    slippage: number;
    a2b: boolean;
    b2a: boolean;
}
declare const swapCommand: CommandModule<Option, Option>;
export default swapCommand;
