import { CommandModule } from "yargs";
interface Option {
    package: string;
    recipient: string;
    amount: number;
    freeze: boolean;
}
declare const mint: CommandModule<Option, Option>;
export default mint;
