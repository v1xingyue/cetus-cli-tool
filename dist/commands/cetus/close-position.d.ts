import { CommandModule } from "yargs";
interface Option {
    position: string;
}
declare const closePosition: CommandModule<Option, Option>;
export default closePosition;
