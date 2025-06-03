import { CommandModule } from "yargs";
interface Option {
    owner: string;
    width: boolean;
}
declare const listPositions: CommandModule<Option, Option>;
export default listPositions;
