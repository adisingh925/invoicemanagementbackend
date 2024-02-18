import { createPool } from "mysql2";
import dotenv from 'dotenv';
dotenv.config();

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

export const getUser = async (username) => {
  return new Promise((resolve, reject) => {
    var query = `SELECT * FROM ?? where username = ?`;

    connection.query(
      query,
      [process.env.USER_TABLE_NAME, username],
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

export const createUserTable = () => {
  return new Promise((resolve, reject) => {
    var query = `CREATE TABLE ?? (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        username VARCHAR(255) UNIQUE NOT NULL, 
        password VARCHAR(255) NOT NULL, 
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`;

    connection.query(query, [process.env.USER_TABLE_NAME], function (err) {
      if (err) {
        console.log(err.message);
        reject(err);
      } else {
        console.log("Table created successfully!");
        resolve(1);
      }
    });
  });
};

export const createUser = async (username, password) => {
  return new Promise((resolve, reject) => {
    var query = `INSERT INTO ?? (username, password) VALUES (?, ?)`;

    connection.query(
      query,
      [process.env.USER_TABLE_NAME, username, password],
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

