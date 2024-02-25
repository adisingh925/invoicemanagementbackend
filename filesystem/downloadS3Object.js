import fs from "fs";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import path from "path";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export const downloadObject = async (params, filePath) => {
  try {
    console.log("downloadObject() => Downloading object from S3 bucket...");

    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    const { Body } = await s3Client.send(new GetObjectCommand(params));

    const fileStream = fs.createWriteStream(filePath);
    Body.pipe(fileStream);

    await new Promise((resolve, reject) => {
      fileStream.on("finish", resolve);
      fileStream.on("error", reject);
    });

    console.log("downloadObject => Object downloaded successfully.");
  } catch (error) {
    console.error("downloadObject => ", error);
    return -1;
  }

  return 1;
};
