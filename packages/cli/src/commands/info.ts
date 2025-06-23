import { CommandModule } from "yargs";
import { loadRuntime } from "../utils.js";
import { SuiCoin } from "../common.js";
import Decimal from "decimal.js";

interface Option {}

const info: CommandModule<Option, Option> = {
  command: "info",
  describe: "display cetus cli tools info",

  async handler() {
    try {
      const runtime = loadRuntime();
      console.log(`network: ${runtime.getNetwork()}`);
      console.log("cluster url : ", runtime.getClusterUrl());
      console.log("wallet address : ", runtime.getWalletAddress());

      const suiBalance = await runtime.getSuiClient().getBalance({
        owner: runtime.getWalletAddress(),
        coinType: SuiCoin.SUI,
      });

      if (suiBalance.totalBalance.toString() == "0") {
        console.log("sui balance is 0");
        const network = runtime.getNetwork();
        if (network == "devnet" || network == "testnet") {
          console.log(
            "You can get faucet from : https://faucet.testnet.sui.io/"
          );
        }
        return;
      }

      const balances = await runtime.getSuiClient().getAllBalances({
        owner: runtime.getWalletAddress(),
      });

      const tables = [];

      for (const balance of balances) {
        const meta = await runtime.getCoinMetadata(balance.coinType);
        tables.push({
          coinType: balance.coinType,
          balance: new Decimal(balance.totalBalance).div(
            new Decimal(10).pow(new Decimal(meta?.decimals || 0))
          ),
          name: meta?.name,
        });
      }

      console.table(tables);
    } catch (error) {
      console.log("load failed, please run init first!!");
    }
  },
};

export default info;
