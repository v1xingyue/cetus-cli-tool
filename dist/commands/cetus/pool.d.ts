import { CommandModule } from "yargs";
interface Option {
    coins: string[];
}
declare const info: CommandModule<Option, Option>;
export default info;
