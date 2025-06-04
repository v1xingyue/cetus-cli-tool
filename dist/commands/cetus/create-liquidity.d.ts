import { CommandModule } from "yargs";
interface Option {
    pool: string;
    amount: string;
    position: string;
}
declare const createLiquidity: CommandModule<Option, Option>;
export default createLiquidity;
