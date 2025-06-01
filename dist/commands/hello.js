const hello = {
    command: "hello",
    describe: "just say hello",
    async handler() {
        console.log("hello world!");
    },
};
export default hello;
