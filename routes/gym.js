import { Router } from "express";
const router = Router();
import dotenv from "dotenv";
import logger from "../logging/winston.js";
import { validationResult, body } from "express-validator";
import { insertGym, updateGym } from "../database/db.js";
import verifytoken from "../middleware/verifyToken.js";
dotenv.config();

/**
 * @post /gym
 */
router.post(
  "/insert/gym",
  verifytoken,
  [
    body("name", "Name is required").trim().notEmpty().escape(),
    body("address", "Address is required").trim().notEmpty().escape(),
    body("email", "Enter a valid email").trim().isEmail().escape(),
    body("phone", "Enter a valid phone number").trim().isMobilePhone().escape(),
  ],
  async (req, res) => {
    try {
      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Insert Gym request received, Validating body`
      );

      const result = validationResult(req);

      if (!result.isEmpty()) {
        logger.info(
          `[${req.uuid} <> ${
            req.ip
          }] -> Validation failed, Returning response -> ${JSON.stringify(
            result.array()
          )}`
        );
        return res.status(400).json({ errors: result.array() });
      }

      const { name, address, phone, email } = req.body;

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Validating Success, Inserting data -> [name = ${name}, address = ${address}, phone = ${phone}, email = ${email}]`
      );

      await insertGym(name, address, phone, email, req.id, req.uuid, req.ip);

      return res
        .status(200)
        .json({ msg: "Gym Inserted Successfully!", code: 1 });
    } catch (error) {
      logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

/**
 * @post /gym
 */
router.post(
  "/update/gym",
  [
    body("id", "Id is required").trim().notEmpty().escape(),
    body("name", "Name is required").trim().notEmpty().escape(),
    body("address", "Address is required").trim().notEmpty().escape(),
    body("email", "Enter a valid email").trim().isEmail().escape(),
    body("phone", "Enter a valid phone number").trim().isMobilePhone().escape(),
  ],
  async (req, res) => {
    try {
      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Update Gym request received, Validating body`
      );

      const result = validationResult(req);

      if (!result.isEmpty()) {
        logger.info(
          `[${req.uuid} <> ${
            req.ip
          }] -> Validation failed, Returning response -> ${JSON.stringify(
            result.array()
          )}`
        );
        return res.status(400).json({ errors: result.array() });
      }

      const { id, name, address, phone, email } = req.body;

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Validating Success, Updating data -> [name = ${name}, address = ${address}, phone = ${phone}, email = ${email}]`
      );

      await updateGym(
        name,
        address,
        phone,
        email,
        id,
        req.id,
        req.uuid,
        req.ip
      );

      return res
        .status(200)
        .json({ msg: "Gym Updated Successfully!", code: 1 });
    } catch (error) {
      logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

export default router;
