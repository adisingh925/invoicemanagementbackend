import cron from "node-cron";
import { fetchSingleMessage } from "../aws/sqsMessageCheck.js";
import dotenv from "dotenv";
dotenv.config();

cron.schedule("* * * * *", () => {
  fetchSingleMessage();
});
