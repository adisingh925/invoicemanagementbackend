import pkg from "unirest";
const { post } = pkg;
import dotenv from "dotenv";
import logger from "./winston.js";
dotenv.config();

async function postSupportDataToGoogleChat(message, uuid, ip) {
  if (process.env.ENVIRONMENT === "development") {
    try {
      logger.info(
        `[${uuid} <> ${ip}] -> Posting message to Google Chat -> [message = ${message}]`
      );
      await post(
        `https://chat.googleapis.com/v1/spaces/${process.env.SUPPORT_DATA_UPLOADER_SPACE_ID}/messages?key=${process.env.GOOGLE_API_KEY}&token=${process.env.SUPPORT_DATA_UPLOADER_TOKEN}`
      )
        .headers({
          "Content-Type": "application/json",
        })
        .send(
          JSON.stringify({
            text: message,
          })
        );
    } catch (error) {
      logger.error(`[${uuid} <> ${ip}] -> ${error}`);
    }
  }
}

export default postSupportDataToGoogleChat;
