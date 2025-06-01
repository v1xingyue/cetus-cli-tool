import { CommandModule } from "yargs";
interface Option {
    verbose: boolean;
}
declare const minted: CommandModule<Option, Option>;
export default minted;
