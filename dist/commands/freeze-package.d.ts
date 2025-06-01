import { CommandModule } from "yargs";
interface Option {
    package: string;
}
declare const freezePackage: CommandModule<Option, Option>;
export default freezePackage;
