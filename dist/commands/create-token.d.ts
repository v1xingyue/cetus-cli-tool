import { CommandModule } from "yargs";
interface Option {
    name: string;
    decimal: number;
    symbol: string;
    description: string;
}
declare const createToken: CommandModule<Option, Option>;
export default createToken;
