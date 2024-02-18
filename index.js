"strict mode";

// Importing required modules
import express, { json } from "express";
const app = express();
import { readFileSync } from "fs";
import { createServer } from "http";
import { createServer as _createServer } from "https";
import checkBusy from "./middleware/toobusy.js";
import dotenv from 'dotenv';
dotenv.config();
import ping from "./routes/ping.js";
import login from "./routes/login.js";
import signup from "./routes/signup.js";
import createTable from "./routes/createTable.js";
import upload from "./routes/upload.js";
import wildCard from "./routes/wildCard.js";

const httpServer = createServer(app);

const httpsServer = _createServer(
  {
    key: readFileSync("ssl/key.key"),
    cert: readFileSync("ssl/certificate_chain.cer"),
    requestCert: true,
    rejectUnauthorized: false,
  },
  app
);

app.use(checkBusy);
app.use(json({ limit: "1mb" }));

//All routes
app.use("/", ping);
app.use("/", login);
app.use("/", signup);
app.use("/", createTable);
app.use("/", upload);
app.use("/", wildCard);

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
