import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import dotenv from "dotenv";
import { fetchAndCheckObjectMetadata } from "./s3ObjectCheck.js";
import {
  getCustomerForFileTypes,
  getFileTypesForUser,
  insertData,
} from "../database/db.js";
import { downloadObject } from "../filesystem/downloadS3Object.js";
dotenv.config();
import fs from "fs";
import { parsePdf } from "../parser/pdfParser.js";

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

const deleteLocalFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
    console.log("deleteLocalFile() => Local File deleted successfully!");
  } catch (error) {
    console.error("deleteLocalFile() => " + error.message);
  }
};

export const fetchSingleMessage = async () => {
  try {
    const { Messages } = await receiveMessage(process.env.SQS_URL);

    if (!Messages || Messages.length === 0) {
      console.log("sqsMessageCheck() => No messages available in the queue.");
      return;
    }

    const message = Messages[0];
    const parsedMessage = JSON.parse(message.Body);
    const clientId = parsedMessage.key.split("/").slice(0, -1).join("/");

    let clientFileTypes = await getFileTypesForUser(clientId);

    if (clientFileTypes === -1) {
      console.log("sqsMessageCheck() => File types not found for the client!");
    } else {
      console.log("sqsMessageCheck() => File types found for the client!");

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: parsedMessage.key,
      };

      let response = await fetchAndCheckObjectMetadata(clientFileTypes, params);

      console.log("sqsMessageCheck() => response: " + response);

      if (response === -1) {
        console.log("sqsMessageCheck() => File metadata checks failed!");
      } else {
        console.log("sqsMessageCheck() => File metadata checks passed!");
        let filePath = "downloads/" + new Date().getTime();
        try {
          await downloadObject(params, filePath);
          let customers = await getCustomerForFileTypes(response, clientId);

          if (customers != -1) {
            let parsedPdf = await parsePdf(filePath);

            for (let data of customers) {
              let parsingData = JSON.parse(data.parsing_data);
              const re = new RegExp(parsingData.identifier_regex);
              const match = re.test(parsedPdf);

              if (match) {
                var columnArray = [];
                var valueArray = [];

                for (var key in parsingData) {
                  if (parsingData.hasOwnProperty(key)) {
                    if (!key.includes("identifier_regex")) {
                      const re = new RegExp(parsingData[key]);

                      const match = re.test(parsedPdf);
                      if (match) {
                        columnArray.push(key);
                        valueArray.push(parsedPdf.match(re)[1]);
                      }
                    }
                  }
                }

                insertData(clientId + "_invoices", columnArray, valueArray)
                  .then((result) => {
                    console.log("Data inserted successfully");
                  })
                  .catch((error) => {
                    console.error("sqsMessageCheck() => " + error);
                  });
              }
            }
          }
        } catch (error) {
          console.error("sqsMessageCheck() => " + error.message);
          deleteLocalFile(filePath);
        }
      }
    }

    await client.send(
      new DeleteMessageCommand({
        QueueUrl: process.env.SQS_URL,
        ReceiptHandle: message.ReceiptHandle,
      })
    );

    console.log("sqsMessageCheck() => Message deleted successfully.");
  } catch (error) {
    console.error("sqsMessageCheck() => " + error.message);
  }
};
