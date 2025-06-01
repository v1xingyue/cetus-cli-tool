import { CommandModule } from "yargs";

interface Option {}

const hello: CommandModule<Option, Option> = {
  command: "hello",
  describe: "just say hello",

  async handler() {
    console.log("hello cetus world!");
  },
};

export default hello;
