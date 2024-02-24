import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export const fetchAndCheckObjectMetadata = async (message) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: message.key,
    };

    const data = await s3Client.send(new HeadObjectCommand(params));
    console.log("Object Metadata:", data.Metadata);
    console.log("Content Type:", data.ContentType);
    console.log("Content Length:", data.ContentLength);
  } catch (error) {
    console.error(error.message);
  }
};
