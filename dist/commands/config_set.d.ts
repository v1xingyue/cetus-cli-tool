import { CommandModule } from "yargs";
interface Option {
    network: string;
}
declare const configSet: CommandModule<Option, Option>;
export default configSet;
