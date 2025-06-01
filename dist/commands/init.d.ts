import { CommandModule } from "yargs";
interface Option {
    network: string;
}
declare const init: CommandModule<Option, Option>;
export default init;
