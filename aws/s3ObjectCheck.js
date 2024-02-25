import {
  S3Client,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const deleteS3Object = async (params) => {
  try {
    await s3Client.send(new DeleteObjectCommand(params));
    console.log("deleteS3Object() => S3 File deleted successfully!");
  } catch (error) {
    console.error("deleteS3Object() => " + error.message);
  }
};

export const fetchAndCheckObjectMetadata = async (clientFileTypes, params) => {
  try {
    const data = await s3Client.send(new HeadObjectCommand(params));
    let passedChecks = 0;
    let matchedFileType = "";

    for (const fileType of clientFileTypes) {
      if (fileType.fileTypes.includes(data.ContentType)) {
        passedChecks++;
        matchedFileType = data.ContentType;
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
      return matchedFileType;
    } else {
      console.log("fetchAndCheckObjectMetadata() => All checks did not pass!");
      await deleteS3Object(params);
      return -1;
    }
  } catch (error) {
    console.error("fetchAndCheckObjectMetadata() => " + error.message);
    return -1;
  }
};
