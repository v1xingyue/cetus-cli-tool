import { CommandModule } from "yargs";
interface Option {
    coins: string[];
}
declare const listPool: CommandModule<Option, Option>;
export default listPool;
