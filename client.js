const net = require("net");
const readline = require("readline");
const read_InputValue = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = new net.Socket();
const port = 8000;
const host = "localhost";

const functionInstructions = {
  floor: "Enter a number including the decimal point. Example: 5.36515",
  nroot: "Enter numbers in an array. Example: [4,6]",
  reverse: `Enter a string. Example: "testinput"`,
  validAnagram:
    `Enter two strings in an array. Example: ["testinput","inputtest"]`,
  sort: `Enter strings in an array. Example: ["test"]`,
};

function promptForRequest() {
  read_InputValue.question(
    "which select functions?\n" +
      "options: floor, nroot, reverse, validAnagram, sort.\n",
    function (functionName) {
      if (!functionInstructions.hasOwnProperty(functionName)) {
        console.log("error: function does not exist.");
        client.destroy();
        read_InputValue.close();
        return;
      }

      const instruction = functionInstructions[functionName];
      console.log(instruction);

      read_InputValue.question("enter the parameters: ", function (param) {
        let params;

        switch (functionName) {
          case "floor":
            params = parseFloat(param);
            break;
          case "nroot":
          case "validAnagram":
          case "sort":
            params = JSON.parse(param);
            break;
          default:
            params = param;
        }

        let request = {
          method: functionName,
          params: params,
          param_types: typeof params,
          id: 1,
        };

        client.connect(port, host, () => {
          console.log("connected to server on " + host + ":" + port);
          client.write(JSON.stringify(request));
        });

        read_InputValue.close();
      });
    }
  );
}

client.on("data", (data) => {
  console.log("received: " + data);
  const response = JSON.parse(data);
  console.log("response:", response);
  client.destroy();
});

client.on("close", () => {
  console.log("connection closed");
});

client.on("error", (error) => {
  console.error("connection error: " + error.message);
});

promptForRequest();
