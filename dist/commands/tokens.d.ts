import { CommandModule } from "yargs";
interface Option {
    verbose: boolean;
}
declare const tokens: CommandModule<Option, Option>;
export default tokens;
