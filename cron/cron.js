import cron from "node-cron";
import dotenv from "dotenv";
import logger from "../logging/winston.js";
dotenv.config();

cron.schedule("* * * * *", () => {
  
});
