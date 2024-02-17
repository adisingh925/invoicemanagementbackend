"strict mode";

const express = require("express");
const app = express();
const http = require("http");
require("dotenv").config();
const port = process.env.PORT;

app.use(express.json());

//All routes
app.use("/", require("./routes/ping"));
app.use("/", require("./routes/login"));
app.use("/", require("./routes/signup"));
app.use("/", require("./routes/createTable"));
app.use("/", require("./routes/wildCard"));

const httpServer = http.createServer(app);

/**
 * starting http server
 */
httpServer.listen(process.env.HTTP_PORT, () => {
  console.log(`HTTP Server running on port ${process.env.HTTP_PORT}`);
});
