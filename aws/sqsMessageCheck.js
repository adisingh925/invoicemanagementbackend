import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import dotenv from "dotenv";
import { fetchAndCheckObjectMetadata } from "./s3ObjectCheck.js";
import { getFileTypesForUser } from "../database/db.js";
dotenv.config();

const client = new SQSClient({ region: process.env.AWS_REGION });

const receiveMessage = (queueUrl) =>
  client.send(
    new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 0,
      VisibilityTimeout: 20,
    })
  );

export const fetchSingleMessage = async () => {
  try {
    const { Messages } = await receiveMessage(process.env.SQS_URL);

    if (!Messages || Messages.length === 0) {
      console.log("No messages available in the queue.");
      return;
    }

    const message = JSON.parse(Messages[0].Body);
    const clientId = message.key.split("/").slice(0, -1).join("/");

    let clientFileTypes = await getFileTypesForUser(clientId);

    if (clientFileTypes === -1) {
      console.log("File types not found for the client!");
    } else {
      console.log("File types found for the client!");
      await fetchAndCheckObjectMetadata(clientFileTypes, message.key);
    }

    await client.send(
      new DeleteMessageCommand({
        QueueUrl: process.env.SQS_URL,
        ReceiptHandle: message.ReceiptHandle,
      })
    );

    console.log("Message deleted successfully.");
  } catch (error) {
    console.error(error.message);
  }
};
