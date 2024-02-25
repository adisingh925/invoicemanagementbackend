import { createPool } from "mysql2";
import dotenv from "dotenv";
dotenv.config();
import NodeCache from "node-cache";
const myCache = new NodeCache();

var connection = createPool({
  connectionLimit: 5,
  host: process.env.DB_HOSTNAME,
  user: process.env.LOCALDB_USERNAME,
  password: process.env.LOCALDB_PASSWORD,
  database: process.env.DATABASE_NAME,
});

connection.getConnection((err, connection) => {
  if (err) {
    console.log("Error connecting to MySQL", err);
    return;
  }
  console.log("Connected to MySQL");
  connection.release();
});

export const getUser = async (email) => {
  return new Promise((resolve, reject) => {
    var query = `SELECT * FROM ?? where email = ?`;

    connection.query(
      query,
      [process.env.CLIENT_TABLE_NAME, email],
      function (err, result) {
        if (err) {
          console.log(err.message);
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

export const createUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    var query = `INSERT INTO ?? (email, password) VALUES (?, ?)`;

    connection.query(
      query,
      [process.env.CLIENT_TABLE_NAME, email, password],
      function (err) {
        if (err) {
          console.log(err.message);
          reject(err);
        } else {
          console.log("User created successfully!");
          resolve(1);
        }
      }
    );
  });
};

export const getFileTypesForUser = async (clientId) => {
  return new Promise((resolve, reject) => {
    let cachedFileTypes = myCache.get(clientId);

    if (cachedFileTypes) {
      resolve(cachedFileTypes.fileTypes);
    } else {
      var query = `SELECT fileTypes FROM ?? WHERE fk_client_id = ?`;

      connection.query(
        query,
        [process.env.CUSTOMER_TABLE_NAME, clientId],
        function (err, result) {
          if (err) {
            console.log(err.message);
            reject(err);
          } else {
            if (result.length > 0) {
              myCache.set(clientId, result, 60);
              resolve(result);
            }

            resolve(-1);
          }
        }
      );
    }
  });
};

export const getCustomerForFileTypes = async (fileType) => {
  return new Promise((resolve, reject) => {
    var query = `SELECT fk_client_id, parsing_data FROM ?? WHERE fileTypes = ?`;

    connection.query(
      query,
      [process.env.CUSTOMER_TABLE_NAME, fileType],
      function (err, result) {
        if (err) {
          console.log(err.message);
          reject(err);
        } else {
          if (result.length > 0) {
            resolve(result);
          }

          resolve(-1);
        }
      }
    );
  });
};
