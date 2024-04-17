import { createPool } from "mysql2";
import dotenv from "dotenv";
dotenv.config();
import logger from "../logging/winston.js";

var connection = createPool({
  connectionLimit: 5,
  host: process.env.DB_HOSTNAME,
  user: process.env.LOCALDB_USERNAME,
  password: process.env.LOCALDB_PASSWORD,
  database: process.env.DATABASE_NAME,
});

connection.getConnection((err, connection) => {
  if (err) {
    logger.info("Error connecting to MySQL", err);
    return;
  }
  logger.info("Connected to MySQL");
  connection.release();
});

export const getUser = async (req) => {
  logger.info(`[${req.uuid} <> ${req.ip}] -> Fetching user from DB`);
  return new Promise((resolve, reject) => {
    var query = `SELECT client_id, password FROM ?? where email = ?`;

    connection.query(
      query,
      [process.env.CLIENT_TABLE_NAME, req.params.email],
      function (err, result) {
        if (err) {
          logger.error(`[${req.uuid} <> ${req.ip}] -> ${err}`);
          reject(err);
        } else {
          if (result.length > 0) {
            resolve(result[0]);
          }

          resolve(-1);
        }
      }
    );
  });
};

export const createUser = async (email, password, req) => {
  logger.info(`[${req.uuid} <> ${req.ip}] -> Creating new user in DB`);
  return new Promise((resolve, reject) => {
    var query = `INSERT INTO ?? (email, password, password_update_time) VALUES (?, ?, ?)`;

    connection.query(
      query,
      [process.env.CLIENT_TABLE_NAME, email, password, new Date()],
      function (err, result) {
        if (err) {
          logger.error(`[${req.uuid} <> ${req.ip}] -> ${err}`);
          reject(err);
        } else {
          resolve(result.insertId);
        }
      }
    );
  });
};

export const checkPasswordUpdateTime = async (userId, req) => {
  logger.info(
    `[${req.uuid} <> ${req.ip}] -> Checking password update time for user from DB`
  );
  return new Promise((resolve, reject) => {
    var query = `SELECT password_update_time from ?? where client_id = ?`;

    connection.query(
      query,
      [process.env.CLIENT_TABLE_NAME, userId],
      function (err, result) {
        if (err) {
          logger.error(`[${req.uuid} <> ${req.ip}] -> ${err}`);
          reject(err);
        } else {
          if (result.length > 0) {
            resolve(result[0]);
          }

          resolve(-1);
        }
      }
    );
  });
};

export const updatePassword = async (userId, password, req) => {
  logger.info(`[${req.uuid} <> ${req.ip}] -> Updating password for user in DB`);
  return new Promise((resolve, reject) => {
    var query = `UPDATE ?? SET password = ?, password_update_time = ? WHERE client_id = ?`;

    connection.query(
      query,
      [process.env.CLIENT_TABLE_NAME, password, new Date(), userId],
      function (err, result) {
        if (err) {
          logger.error(`[${req.uuid} <> ${req.ip}] -> ${err}`);
          reject(err);
        } else {
          if (result.length > 0) {
            resolve(result[0]);
          }

          resolve(-1);
        }
      }
    );
  });
};
