import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

cron.schedule("* * * * *", () => {
  console.log("Running a task every minute");
});
