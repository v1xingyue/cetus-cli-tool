import { CommandModule } from "yargs";
import { loadRuntime } from "../../utils.js";
import { getCetusSdk } from "../../cetus_tool.js";
import { CetusNetwork } from "../../common.js";
import { configDotenv } from "dotenv";

interface Option {}

const info: CommandModule<Option, Option> = {
  command: "info",
  describe: "diplay cetus sdk info",

  async handler() {
    console.log(`this is cetus info tool.`);
  },
};

export default info;
