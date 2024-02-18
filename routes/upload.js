const express = require("express");
const upload = require("../middleware/multer");
const verifytoken = require("../middleware/verifyToken");
const router = express.Router();

/**
 * @route POST /upload
 */
router.post("/upload", verifytoken, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: req.email + "/" + Date.now(),
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      await s3.upload(params).promise();
      res.status(200).json({ msg: "File Successfully Uploaded!", code: 1 });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Error Uploading File!", code: -1 });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
});

module.exports = router;
