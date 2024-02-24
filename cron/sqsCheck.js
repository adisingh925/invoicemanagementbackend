import cron from "node-cron";
import { fetchSingleMessage } from "../aws/sns.js";
import dotenv from 'dotenv';
dotenv.config();

cron.schedule("* * * * *", () => {
  fetchSingleMessage(process.env.SQS_URL);
  console.log("running a task every minute");
});
