import { CommandModule } from "yargs";
interface Option {
    pool: string;
    coin_a: string;
    coin_b: string;
    amount_a: string;
    amount_b: string;
}
declare const addLiquidity: CommandModule<Option, Option>;
export default addLiquidity;
