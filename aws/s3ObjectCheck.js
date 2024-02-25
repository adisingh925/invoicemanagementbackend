import {
  S3Client,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { downloadObject } from "../filesystem/downloadS3Object.js";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const deleteS3Object = async (params) => {
  try {
    await s3Client.send(new DeleteObjectCommand(params));
    console.log("deleteS3Object() => File deleted successfully!");
  } catch (error) {
    console.error("deleteS3Object() => " + error.message);
  }
};

export const fetchAndCheckObjectMetadata = async (clientFileTypes, key) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    const data = await s3Client.send(new HeadObjectCommand(params));
    let passedChecks = 0;

    for (const fileType of clientFileTypes) {
      if (fileType.fileTypes.includes(data.ContentType)) {
        passedChecks++;
        console.log("fetchAndCheckObjectMetadata() => File type is allowed!");
      } else {
        console.log(
          "fetchAndCheckObjectMetadata() => File type is not allowed!"
        );
      }
    }

    if (data.ContentLength > 1000000) {
      console.log(
        "fetchAndCheckObjectMetadata() => File size is greater than 1MB!"
      );
    } else {
      passedChecks++;
      console.log(
        "fetchAndCheckObjectMetadata() => File size is less than 1MB!"
      );
    }

    if (passedChecks === 2) {
      console.log("fetchAndCheckObjectMetadata() => All checks passed!");
      downloadObject(params, "downloadedfiles/" + new Date());
    } else {
      console.log("fetchAndCheckObjectMetadata() => All checks did not pass!");
      await deleteS3Object(params);
      return -1;
    }
  } catch (error) {
    console.error("fetchAndCheckObjectMetadata() => " + error.message);
    return -1;
  }

  return 1;
};
