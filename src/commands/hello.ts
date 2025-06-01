import { CommandModule } from "yargs";

interface Option {}

const hello: CommandModule<Option, Option> = {
  command: "hello",
  describe: "just say hello",

  async handler() {
    console.log("hello world!");
  },
};

export default hello;
