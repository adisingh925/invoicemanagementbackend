"strict mode";

// Importing required modules
import express, { json } from "express";
import { readFileSync } from "fs";
import { createServer } from "http";
import { createServer as _createServer } from "https";
import checkBusy from "./middleware/toobusy.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import ping from "./routes/ping.js";
import login from "./routes/login.js";
import signup from "./routes/signup.js";
import wildCard from "./routes/wildCard.js";
import resetPassword from "./routes/resetPassword.js";
import resetPasswordLink from "./routes/resetPasswordLink.js";
import "./cron/cron.js";
import morganMiddleware from "./logging/morgan.js";
import logger from "./logging/winston.js";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(helmet());
app.use(morganMiddleware);
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

app.use(cors());
app.use(checkBusy);
app.use(json({ limit: "1mb" }));

// Middleware to add UUID to each request
app.use((req, _res, next) => {
  req.uuid = uuidv4(); // Generate UUID and attach it to the request object
  logger.info(`[${req.uuid} <> ${req.ip}] -> generated UUID for new request`);
  next();
});

// Middleware to upgrade insecure requests to secure requests
app.use((req, res, next) => {
  if (!req.secure) {
    logger.warn(
      `[${req.uuid} <> ${req.ip}] -> Redirecting insecure request! -> [URL = ${req.url}]`
    );
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }

  next();
});

//All routes
app.use("/", ping);
app.use("/auth", login);
app.use("/auth", signup);
app.use("/auth", resetPassword);
app.use("/auth", resetPasswordLink);
app.use("/", wildCard);

/**
 * Global error handler
 */
app.use((error, req, res, next) => {
  if (error) {
    logger.error(`[${req.uuid} <> ${req.ip}] -> error`);
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
  next();
});

httpServer.listen(process.env.HTTP_PORT, () => {
  logger.info(`HTTP Server running on port ${process.env.HTTP_PORT}`);
});

httpsServer.listen(process.env.HTTPS_PORT, () => {
  logger.info(`HTTPS Server running on port ${process.env.HTTPS_PORT}`);
});
