import { CommandModule } from "yargs";
import { loadRuntime } from "../utils.js";

interface Option {
  package: string;
  recipient: string;
  amount: number;
  freeze: boolean;
}

const mint: CommandModule<Option, Option> = {
  command: "mint",
  describe: "mint some token",

  builder: (yargs) => {
    return yargs
      .option("package", {
        alias: "p",
        type: "string",
        description: "package id",
        demandOption: true,
      })
      .option("recipient", {
        alias: "r",
        type: "string",
        description:
          "recipient address, default is current loadRuntime address",
        default: "",
      })
      .option("amount", {
        alias: "a",
        type: "number",
        description: "amount to mint, in human readable format",
        default: 1,
      })
      .option("freeze", {
        alias: "f",
        type: "boolean",
        description: "freeze the treasuryCap after minting",
        default: false,
      });
  },

  async handler(args: Option) {
    try {
      const runtime = loadRuntime();
      const client = runtime.getSuiClient();
      console.log(`network: ${runtime.getNetwork()}`);
      const address = runtime.getWalletAddress();
      console.log(`address: ${address}`);

      const treasuryCap = await runtime.getTreasuryCap(args.package);
      if (!treasuryCap) {
        console.log("treasuryCap not found !");
        return;
      }
      if (treasuryCap) {
        console.log(`treasuryCap is : ${treasuryCap}`);
      }

      const coinType = `${args.package}::token::TOKEN`;

      const meta = await client.getCoinMetadata({
        coinType: `${coinType}`,
      });
      if (!meta) {
        console.log("no coin metadata found !");
      } else {
        const realAmount =
          BigInt(args.amount) * BigInt(10) ** BigInt(meta.decimals);
        console.log(`realAmount ${realAmount}`);
        const tx = runtime.getMintTransaction(
          treasuryCap.data?.objectId as string,
          realAmount.toString(),
          args.recipient,
          args.freeze,
          coinType,
        );

        const resp = await runtime.signAndExecute(tx);
        console.log(
          `mint transaction : ${runtime.getTransactionLink(resp.digest)}`,
        );
      }
    } catch (error) {
      console.log("load failed", error);
    }
  },
};

export default mint;
