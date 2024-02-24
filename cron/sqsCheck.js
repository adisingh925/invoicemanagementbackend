import cron from "node-cron";
import { fetchSingleMessage } from "../aws/sns.js";
import dotenv from "dotenv";
dotenv.config();

cron.schedule("* * * * *", () => {
  fetchSingleMessage();
});
