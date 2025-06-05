import { CommandModule } from "yargs";
interface Option {
    pool: string;
    amount: string;
    position: string;
}
declare const addLiquidity: CommandModule<Option, Option>;
export default addLiquidity;
