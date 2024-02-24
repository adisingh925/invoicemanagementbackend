import { Router } from "express";
const router = Router();
import { getFileTypesForUser } from "../database/db.js";
import { validationResult, body } from "express-validator";
import NodeCache from "node-cache";
const myCache = new NodeCache();

/**
 * @route POST /extension
 */
router.post(
  "/extension",
  [body("email", "Enter a valid email").trim().isEmail().escape()],
  async (req, res) => {
    try {
      const result = validationResult(req);

      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      let cachedFileTypes = myCache.get(req.body.email);

      if (cachedFileTypes) {
        return res.status(200).json({
          msg: "FileType found!",
          fileTypes: cachedFileTypes.fileTypes,
          code: 1,
        });
      }

      let fileTypes = await getFileTypesForUser(req.body.email);

      if (fileTypes == -1) {
        return res
          .status(400)
          .json({ msg: "Internal Server Error!", code: -1 });
      }

      myCache.set(req.body.email, { fileTypes: fileTypes.fileTypes }, 10);

      return res.status(200).json({
        msg: "FileType found!",
        fileTypes: fileTypes.fileTypes,
        code: 1,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

export default router;
