"strict mode";

// Importing required modules
const express = require("express");
const app = express();
const http = require("http");
const multer = require("multer");
require("dotenv").config();
const port = process.env.PORT;
const httpServer = http.createServer(app);

app.use(express.json());

//All routes
app.use("/", require("./routes/ping"));
app.use("/", require("./routes/login"));
app.use("/", require("./routes/signup"));
app.use("/", require("./routes/createTable"));
app.use("/", require("./routes/upload"));
app.use("/", require("./routes/wildCard"));

/**
 * Global error handler
 */
app.use((error, _req, res, next) => {
  if (error) {
    res.status(500).json({ msg: error.message, code: -1 });
  }
  next();
});

/**
 * starting http server
 */
httpServer.listen(process.env.HTTP_PORT, () => {
  console.log(`HTTP Server running on port ${process.env.HTTP_PORT}`);
});
