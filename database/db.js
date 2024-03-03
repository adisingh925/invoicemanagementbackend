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
    var query = `SELECT client_id, password FROM ?? where email = ?`;

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
      function (err, result) {
        if (err) {
          console.log(err.message);
          reject(err);
        } else {
          console.log("User created successfully!");
          resolve(result.insertId);
        }
      }
    );
  });
};

export const getFileTypesForUser = async (clientId) => {
  return new Promise((resolve, reject) => {
    let cachedFileTypes = myCache.get(clientId);

    if (cachedFileTypes) {
      resolve(cachedFileTypes);
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

export const getCustomerForFileTypes = async (fileType, clientId) => {
  return new Promise((resolve, reject) => {
    var query = `SELECT customer_id, parsing_data FROM ?? WHERE fileTypes = ? and fk_client_id = ?`;

    connection.query(
      query,
      [process.env.CUSTOMER_TABLE_NAME, fileType, clientId],
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

export const insertData = async (tableName, columns, values) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO ${tableName} (${columns.join(
      ", "
    )}) VALUES (${values.join(", ")})`;

    connection.query(query, values, (err, result) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(result);
      }
    });
  });
};

export const fetchDataForCustomerInPages = async (
  customerId,
  page,
  limit,
  tableName
) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    const query = `SELECT * FROM ?? WHERE fk_customer_id = ? LIMIT ? OFFSET ?`;

    connection.query(
      query,
      [tableName, customerId, limit, offset],
      (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          if (result.length === 0) {
            resolve(-1);
          }

          resolve(result);
        }
      }
    );
  });
};

export const getConfigsForClient = async (client_id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT customer_id, customer_name, parsing_data FROM ?? WHERE fk_client_id = ?`;

    connection.query(
      query,
      [process.env.CUSTOMER_TABLE_NAME, client_id],
      (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          if (result.length === 0) {
            resolve(-1);
          }

          resolve(result);
        }
      }
    );
  });
};
