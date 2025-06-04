import { CommandModule } from "yargs";
interface Option {
    position: string;
    liquidity: string;
}
declare const removeLiquidity: CommandModule<Option, Option>;
export default removeLiquidity;
