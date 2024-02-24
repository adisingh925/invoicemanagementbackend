import { SQSClient, ReceiveMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient();

export const fetchSingleMessage = async (queueUrl) => {
  try {
    const params = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      VisibilityTimeout: 10,
      WaitTimeSeconds: 0,
    };

    const { Messages } = await sqs.receiveMessage(
      new ReceiveMessageCommand(params)
    );

    if (Messages && Messages.length > 0) {
      const message = Messages[0];
      console.log("Received message:", message.Body);
      return message;
    } else {
      console.log("No messages available in the queue.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching message:", error);
  }
};
