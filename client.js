const net = require("net");
const readline = require("readline");
const read_InputValue = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = new net.Socket();
const port = 12345;
const host = "localhost";

function promptForRequest() {
  read_InputValue.question(
    "which select functions?\n" +
      "[floor]: truncates the decimal point and returns an integer.\n" +
      "[hello]: add 'hello' to the beginning of the input string and returns it.\n",
    function (functionName) {
      if (functionName !== "hello" && functionName !== "floor") {
        console.log("error: function does not exist.");
        client.destroy();
        read_InputValue.close();
        return;
      }

      read_InputValue.question(
        "'hello' is enter a string\n" +
          "'floor' is enter a number including float.\n",
        function (param) {
          let params = functionName === "floor" ? parseFloat(param) : param;
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
        }
      );
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
