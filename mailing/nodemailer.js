"use strict";

import nodemailer from "nodemailer";
import fs from "fs";
import Handlebars from "handlebars";
import dotenv from "dotenv";
import logger from "../logging/winston.js";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (
  emailList,
  templateData,
  subject,
  templatePath,
  fromMail,
  fromName
) => {
  try {
    logger.info("Sending reset link email");

    const source = fs.readFileSync(templatePath, { encoding: "utf-8" });
    const template = Handlebars.compile(source);
    const html = template(templateData);

    const info = await transporter.sendMail({
      from: `${fromName} ${fromMail}@blivix.com`,
      to: emailList,
      subject: subject,
      html: html,
    });

    transporter.sendMail(info, function (error) {
      if (error) {
        logger.error(error.message);
      }
    });
  } catch (error) {
    logger.error(error.message);
  }
};
