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

    if (clientFileTypes.includes(data.ContentType)) {
      console.log("File type is allowed!");
    } else {
      await s3Client.send(new DeleteObjectCommand(params));
      console.log("File deleted successfully!");
      return -1;
    }

    if (data.ContentLength > 1000000) {
      console.log("File size is greater than 1MB!");
      await s3Client.send(new DeleteObjectCommand(params));
      console.log("File deleted successfully!");
      return -1;
    } else {
      console.log("File size is less than 1MB!");
    }
  } catch (error) {
    console.error(error.message);
    return -1;
  }

  return 1;
};
