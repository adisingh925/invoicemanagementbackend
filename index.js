"strict mode";

// Importing required modules
const express = require("express");
const app = express();
const fs = require("fs");
const http = require("http");
const https = require("https");
const checkBusy = require("./middleware/toobusy");
require("dotenv").config();

const httpServer = http.createServer(app);

const httpsServer = https.createServer(
  {
    key: fs.readFileSync("ssl/key.key"),
    cert: fs.readFileSync("ssl/certificate_chain.cer"),
    requestCert: true,
    rejectUnauthorized: false,
  },
  app
);

app.use(checkBusy);
app.use(express.json({ limit: "1mb" }));

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

httpServer.listen(process.env.HTTP_PORT, () => {
  console.log(`HTTP Server running on port ${process.env.HTTP_PORT}`);
});

httpsServer.listen(process.env.HTTPS_PORT, () => {
  console.log(`HTTPS Server running on port ${process.env.HTTPS_PORT}`);
});
