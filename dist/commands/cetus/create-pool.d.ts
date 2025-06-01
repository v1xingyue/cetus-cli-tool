import { CommandModule } from "yargs";
interface Option {
    coin_a: string;
    coin_b: string;
    price: string;
    amount_a: string;
}
declare const createPool: CommandModule<Option, Option>;
export default createPool;
