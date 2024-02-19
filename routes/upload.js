import { Router } from "express";
import verifytoken from "../middleware/verifyToken.js";
const router = Router();
import multer, { memoryStorage } from "multer";
import { uploadRateLimiter } from "../ratelimiters/rateLimiters.js";
const storage = memoryStorage();
import dotenv from 'dotenv';
dotenv.config();
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    cb(new Error("Invalid file type!"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 1 },
});

/**
 * @route POST /upload
 */
router.post(
  "/upload",
  uploadRateLimiter,
  verifytoken,
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ msg: "Please upload a file!", code: -1 });
      } else if (file.size === 0) {
        return res.status(400).json({ msg: "File is empty!", code: -1 });
      }

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: req.email + "/" + Date.now(),
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      try {
        await client.send(command);
        res.status(200).json({ msg: "File Successfully Uploaded!", code: 1 });
        console.log(response);
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Error Uploading File!", code: -1 });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

export default router;
