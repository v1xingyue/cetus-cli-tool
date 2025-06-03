import { CommandModule, string } from "yargs";
import { loadRuntime } from "../../utils.js";
import { getCetusSdk, getPriceFromSqrtPrice } from "../../cetus_tool.js";
import { CetusNetwork, SuiCoin } from "../../common.js";

interface Option {
  owner: string;
  width: boolean;
}

const listPositions: CommandModule<Option, Option> = {
  command: "positions",
  describe: "list positions by owner",

  builder: (yargs) => {
    return yargs
      .option("owner", {
        type: "string",
        description: "owner address",
        demandOption: false,
        default: "",
      })
      .option("width", {
        type: "boolean",
        description: "width",
        demandOption: false,
        default: false,
      });
  },

  async handler(args: Option) {
    const runtime = loadRuntime();
    if (!args.owner) {
      args.owner = runtime.getWalletAddress();
    }
    console.log(`current network: ${runtime.network}`);
    const sdk = getCetusSdk(runtime.getNetwork() as CetusNetwork);
    const positions = await sdk.Position.getPositionList(args.owner, [], true);

    const lines = [];
    for (let i = 0; i < positions.length; i++) {
      const { pos_object_id, tick_lower_index, tick_upper_index, liquidity } =
        positions[i];

      if (args.width) {
        console.log(
          JSON.stringify(
            {
              pool: positions[i].pool,
              pos_object_id,
              coin_type_a: positions[i].coin_type_a,
              coin_type_b: positions[i].coin_type_b,
              tick_lower_index,
              tick_upper_index,
              liquidity,
            },
            null,
            2
          )
        );
      } else {
        lines.push({
          pos_object_id,
          tick_lower_index,
          tick_upper_index,
          liquidity,
        });
      }
    }
    if (!args.width) {
      console.table(lines);
    }
  },
};

export default listPositions;
