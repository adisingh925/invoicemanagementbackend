import fs from "fs";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import path from "path";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export const downloadObject = (params, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("downloadObject() => Downloading object from S3 bucket...");

      const directory = path.dirname(filePath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      const fileStream = fs.createWriteStream(filePath);
      const getObjectCommand = new GetObjectCommand(params);

      const response = s3Client.send(getObjectCommand);
      response
        .then((data) => {
          data.Body.pipe(fileStream);
          fileStream.on("finish", () => {
            console.log("downloadObject() => Object downloaded successfully.");
            resolve(1);
          });
          fileStream.on("error", (error) => {
            console.error("downloadObject() => " + error.message);
            reject(-1);
          });
        })
        .catch((error) => {
          console.error("downloadObject() => " + error.message);
          reject(-1);
        });
    } catch (error) {
      console.error("downloadObject() => " + error.message);
      reject(-1);
    }
  });
};
