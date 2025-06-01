import { CommandModule } from "yargs";
import { loadRuntime } from "../utils.js";

interface Option {
  verbose: boolean;
}

const tokens: CommandModule<Option, Option> = {
  command: "tokens",
  describe: "display tokens you created",

  builder: (yargs) => {
    return yargs.option("verbose", {
      alias: "v",
      type: "boolean",
      description: "verbose output",
      default: false,
    });
  },

  async handler() {
    try {
      const runtime = loadRuntime();
      console.log(`network: ${runtime.getNetwork()}`);
      const address = runtime.getWalletAddress();
      console.log(`address: ${address}`);

      const client = runtime.getSuiClient();

      const resp = await client.getOwnedObjects({
        owner: address,
        filter: {
          StructType: "0x2::package::UpgradeCap",
        },
        options: {
          showContent: true,
        },
      });
      const results = await Promise.all(
        resp.data.map(async (item) => {
          const content_any = item.data?.content as any;
          const packageId = content_any.fields.package;
          const modules = await client.getNormalizedMoveModulesByPackage({
            package: packageId,
          });

          if (modules.token) {
            const meta = await client.getCoinMetadata({
              coinType: `${packageId}::token::TOKEN`,
            });
            if (meta) {
              const { id, iconUrl, name, ...metaData } = meta;
              return {
                ...metaData,
                packageId,
              };
            }
          }

          return null;
        }),
      );

      const filteredResults = results.filter((result: any) => result !== null);
      console.table(filteredResults);
    } catch (error) {
      console.log("load failed", error);
    }
  },
};

export default tokens;
