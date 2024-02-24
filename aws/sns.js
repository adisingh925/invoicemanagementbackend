import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import dotenv from "dotenv";
dotenv.config();


const client = new SQSClient({ region: process.env.AWS_REGION });

const receiveMessage = (queueUrl) =>
  client.send(
    new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 20,
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

    const message = Messages[0];
    console.log("Message Body:", message.Body);

    await client.send(
      new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      })
    );

    console.log("Message deleted successfully.");
  } catch (error) {
    console.error(error.message);
  }
};
