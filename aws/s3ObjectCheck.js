import {
  S3Client,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export const fetchAndCheckObjectMetadata = async (clientFileTypes, key) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    const data = await s3Client.send(new HeadObjectCommand(params));

    console.log("fetchAndCheckObjectMetadata() => File ContentType : ", data.ContentType);

    if (clientFileTypes.includes(data.ContentType)) {
      console.log("fetchAndCheckObjectMetadata() => File type is allowed!");
    } else {
      console.log("fetchAndCheckObjectMetadata() => File type is not allowed!");
      await s3Client.send(new DeleteObjectCommand(params));
      console.log(
        "fetchAndCheckObjectMetadata() => File deleted successfully!"
      );
      return -1;
    }

    if (data.ContentLength > 1000000) {
      console.log(
        "fetchAndCheckObjectMetadata() => File size is greater than 1MB!"
      );
      await s3Client.send(new DeleteObjectCommand(params));
      console.log(
        "fetchAndCheckObjectMetadata() => File deleted successfully!"
      );
      return -1;
    } else {
      console.log(
        "fetchAndCheckObjectMetadata() => File size is less than 1MB!"
      );
    }
  } catch (error) {
    console.error("fetchAndCheckObjectMetadata() => " + error.message);
    return -1;
  }

  return 1;
};
