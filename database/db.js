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

export const getUser = async (email, uuid, ip) => {
  logger.info(`[${uuid} <> ${ip}] -> Fetching user from DB`);
  return new Promise((resolve, reject) => {
    var query = `SELECT client_id, password FROM ?? where email = ?`;

    connection.query(
      query,
      [process.env.CLIENT_TABLE_NAME, email],
      function (err, result) {
        if (err) {
          logger.error(`[${uuid} <> ${ip}] -> ${err}`);
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

export const createUser = async (email, password, uuid, ip) => {
  logger.info(`[${uuid} <> ${ip}] -> Creating new user in DB`);
  return new Promise((resolve, reject) => {
    var query = `INSERT INTO ?? (email, password, password_update_time) VALUES (?, ?, ?)`;

    connection.query(
      query,
      [process.env.CLIENT_TABLE_NAME, email, password, new Date()],
      function (err, result) {
        if (err) {
          logger.error(`[${uuid} <> ${ip}] -> ${err}`);
          reject(err);
        } else {
          resolve(result.insertId);
        }
      }
    );
  });
};

export const checkPasswordUpdateTime = async (userId, uuid, ip) => {
  logger.info(
    `[${uuid} <> ${ip}] -> Checking password update time for user from DB`
  );
  return new Promise((resolve, reject) => {
    var query = `SELECT password_update_time from ?? where client_id = ?`;

    connection.query(
      query,
      [process.env.CLIENT_TABLE_NAME, userId],
      function (err, result) {
        if (err) {
          logger.error(`[${uuid} <> ${ip}] -> ${err}`);
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

export const updatePassword = async (userId, password, uuid, ip) => {
  logger.info(`[${uuid} <> ${ip}] -> Updating password for user in DB`);
  return new Promise((resolve, reject) => {
    var query = `UPDATE ?? SET password = ?, password_update_time = ? WHERE client_id = ?`;

    connection.query(
      query,
      [process.env.CLIENT_TABLE_NAME, password, new Date(), userId],
      function (err, result) {
        if (err) {
          logger.error(`[${uuid} <> ${ip}] -> ${err}`);
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

export const insertGym = async (
  gym_name,
  gym_Address,
  gym_phone_number,
  gym_email,
  client_id,
  uuid,
  ip
) => {
  logger.info(`[${uuid} <> ${ip}] -> Creating new gym entry in DB`);
  return new Promise((resolve, reject) => {
    var query = `INSERT INTO gym (gym_name, gym_address, gym_phone_number, gym_email, client_id) VALUES (?, ?, ?, ?, ?)`;

    connection.query(
      query,
      [gym_name, gym_Address, gym_phone_number, gym_email, client_id],
      function (err, result) {
        if (err) {
          logger.error(`[${uuid} <> ${ip}] -> ${err}`);
          reject(err);
        } else {
          logger.info(
            `[${uuid} <> ${ip}] -> Gym insert response from DB -> [result = ${JSON.stringify(
              result
            )}]`
          );
          resolve(result.insertId);
        }
      }
    );
  });
};

export const updateGym = async (
  gym_name,
  gym_Address,
  gym_phone_number,
  gym_email,
  gym_id,
  client_id,
  uuid,
  ip
) => {
  logger.info(`[${uuid} <> ${ip}] -> Updating gym entry in DB`);
  return new Promise((resolve, reject) => {
    var query = `UPDATE gym SET gym_name = ?, gym_address = ?, gym_phone_number = ?, gym_email = ? WHERE gym_id = ? and client_id = ? and is_deleted = ?`;

    connection.query(
      query,
      [
        gym_name,
        gym_Address,
        gym_phone_number,
        gym_email,
        gym_id,
        client_id,
        false,
      ],
      function (err, result) {
        if (err) {
          logger.error(`[${uuid} <> ${ip}] -> ${err}`);
          reject(err);
        } else {
          logger.info(
            `[${uuid} <> ${ip}] -> Gym update response from DB -> [result = ${JSON.stringify(
              result
            )}]`
          );
          resolve(result.insertId);
        }
      }
    );
  });
};

export const readGym = async (client_id, uuid, ip) => {
  logger.info(`[${uuid} <> ${ip}] -> Reading gym entry in DB`);
  return new Promise((resolve, reject) => {
    var query = `SELECT gym_id, gym_name, gym_address, gym_phone_number, gym_email FROM gym WHERE client_id = ? and  is_deleted = ?`;

    connection.query(query, [client_id, false], function (err, result) {
      if (err) {
        logger.error(`[${uuid} <> ${ip}] -> ${err}`);
        reject(err);
      } else {
        logger.info(
          `[${uuid} <> ${ip}] -> Gym read response from DB -> [result = ${JSON.stringify(
            result
          )}]`
        );
        resolve(result);
      }
    });
  });
};

export const insertMembership = async (
  membership_name,
  membership_price,
  membership_duration,
  client_id,
  gym_id,
  uuid,
  ip
) => {
  logger.info(`[${uuid} <> ${ip}] -> Creating New Nembership Entry In DB`);
  return new Promise((resolve, reject) => {
    var query = `INSERT INTO membership (membership_name, membership_price, membership_duration_months, client_id, gym_id) VALUES (?, ?, ?, ?, ?)`;

    connection.query(
      query,
      [
        membership_name,
        membership_price,
        membership_duration,
        client_id,
        gym_id,
      ],
      function (err, result) {
        if (err) {
          logger.error(`[${uuid} <> ${ip}] -> ${err}`);
          reject(err);
        } else {
          logger.info(
            `[${uuid} <> ${ip}] -> Membership Insert Response From DB -> [result = ${JSON.stringify(
              result
            )}]`
          );
          resolve(result.insertId);
        }
      }
    );
  });
};

export const updateMembership = async (
  membership_id,
  membership_name,
  membership_price,
  membership_duration,
  client_id,
  gym_id,
  uuid,
  ip
) => {
  logger.info(`[${uuid} <> ${ip}] -> Updating Membership Entry In DB`);
  return new Promise((resolve, reject) => {
    var query = `UPDATE membership SET membership_name = ?, membership_price = ?, membership_duration_months = ? WHERE gym_id = ? and membership_id = ? and client_id = ?`;

    connection.query(
      query,
      [
        membership_name,
        membership_price,
        membership_duration,
        gym_id,
        membership_id,
        client_id,
      ],
      function (err, result) {
        if (err) {
          logger.error(`[${uuid} <> ${ip}] -> ${err}`);
          reject(err);
        } else {
          logger.info(
            `[${uuid} <> ${ip}] -> Membership Update Response From DB -> [result = ${JSON.stringify(
              result
            )}]`
          );
          resolve(result.insertId);
        }
      }
    );
  });
};

export const readMembership = async (gym_id, client_id, uuid, ip) => {
  logger.info(`[${uuid} <> ${ip}] -> Reading Membership Entry From DB`);
  return new Promise((resolve, reject) => {
    var query = `SELECT membership_id, membership_name, membership_price, membership_duration_months FROM membership WHERE client_id = ? and gym_id = ?`;

    connection.query(query, [client_id, gym_id], function (err, result) {
      if (err) {
        logger.error(`[${uuid} <> ${ip}] -> ${err}`);
        reject(err);
      } else {
        logger.info(
          `[${uuid} <> ${ip}] -> Membership Read Response From DB -> [result = ${JSON.stringify(
            result
          )}]`
        );
        resolve(result);
      }
    });
  });
};

export const deleteMembership = async (
  membership_ids,
  gym_id,
  client_id,
  uuid,
  ip
) => {
  logger.info(
    `[${uuid} <> ${ip}] -> Deleting Membership Entry In DB by Iterating The Array`
  );

  return new Promise((resolve, reject) => {
    for (let i = 0; i < membership_ids.length; i++) {
      var query = `DELETE FROM membership WHERE client_id = ? and gym_id = ? and membership_id = ?`;

      connection.query(
        query,
        [client_id, gym_id, membership_ids[i]],
        function (err, result) {
          if (err) {
            logger.error(`[${uuid} <> ${ip}] -> ${err}`);
            reject(err);
          } else {
            logger.info(
              `[${uuid} <> ${ip}] -> Membership Delete Response From DB -> [result = ${JSON.stringify(
                result
              )}]`
            );
            resolve(result);
          }
        }
      );
    }
  });
};

/**
 * Manager Functions
 */

export const insertManager = async (
  manager_name,
  manager_phone_number,
  manager_email,
  manager_password,
  client_id,
  gym_id,
  uuid,
  ip
) => {
  logger.info(`[${uuid} <> ${ip}] -> Creating New Nembership Entry In DB`);
  return new Promise((resolve, reject) => {
    var query = `INSERT INTO manager (
      manager_name,
      manager_phone_number,
      manager_email,
      manager_password, 
      client_id, 
      gym_id
    ) VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(
      query,
      [
        manager_name,
        manager_phone_number,
        manager_email,
        manager_password,
        client_id,
        gym_id,
      ],
      function (err, result) {
        if (err) {
          logger.error(`[${uuid} <> ${ip}] -> ${err}`);
          reject(err);
        } else {
          logger.info(
            `[${uuid} <> ${ip}] -> Manager Insert Response From DB -> [result = ${JSON.stringify(
              result
            )}]`
          );
          resolve(result.insertId);
        }
      }
    );
  });
};

export const updateManager = async (
  manager_id,
  manager_name,
  manager_phone_number,
  manager_email,
  manager_password,
  client_id,
  gym_id,
  uuid,
  ip
) => {
  logger.info(`[${uuid} <> ${ip}] -> Updating Manager Entry In DB`);
  return new Promise((resolve, reject) => {
    var query = `UPDATE manager 
    SET manager_name = ?, 
    manager_phone_number = ?, 
    manager_email = ?, 
    manager_password = ? 
    WHERE gym_id = ? and manager_id = ? and client_id = ?`;

    connection.query(
      query,
      [
        manager_name,
        manager_phone_number,
        manager_email,
        manager_password,
        gym_id,
        manager_id,
        client_id,
      ],
      function (err, result) {
        if (err) {
          logger.error(`[${uuid} <> ${ip}] -> ${err}`);
          reject(err);
        } else {
          logger.info(
            `[${uuid} <> ${ip}] -> Manager Update Response From DB -> [result = ${JSON.stringify(
              result
            )}]`
          );
          resolve(result.insertId);
        }
      }
    );
  });
};

export const readManager = async (gym_id, client_id, uuid, ip) => {
  logger.info(`[${uuid} <> ${ip}] -> Reading Manager Entry From DB`);
  return new Promise((resolve, reject) => {
    var query = `SELECT manager_id,
    manager_name,
    manager_phone_number,
    manager_email,
    manager_password 
    FROM manager 
    WHERE client_id = ? and gym_id = ?`;

    connection.query(query, [client_id, gym_id], function (err, result) {
      if (err) {
        logger.error(`[${uuid} <> ${ip}] -> ${err}`);
        reject(err);
      } else {
        logger.info(
          `[${uuid} <> ${ip}] -> Manager Read Response From DB -> [result = ${JSON.stringify(
            result
          )}]`
        );
        resolve(result);
      }
    });
  });
};

export const deleteManager = async (
  manager_ids,
  gym_id,
  client_id,
  uuid,
  ip
) => {
  logger.info(
    `[${uuid} <> ${ip}] -> Deleting Manager Entry In DB by Iterating The Array -> [manager_ids = ${manager_ids}]`
  );

  return new Promise((resolve, reject) => {
    for (let i = 0; i < manager_ids.length; i++) {
      var query = `DELETE FROM manager 
      WHERE client_id = ? 
      and gym_id = ? 
      and manager_id = ?`;

      connection.query(
        query,
        [client_id, gym_id, manager_ids[i]],
        function (err, result) {
          if (err) {
            logger.error(`[${uuid} <> ${ip}] -> ${err}`);
            reject(err);
          } else {
            logger.info(
              `[${uuid} <> ${ip}] -> Manager Delete Response From DB -> [result = ${JSON.stringify(
                result
              )}]`
            );
            resolve(result);
          }
        }
      );
    }
  });
};

/**
 * Member Fucntions
 */

export const insertMember = async (
  member_name,
  member_email,
  member_phone_number,
  member_membership_type,
  client_id,
  gym_id,
  uuid,
  ip
) => {
  logger.info(`[${uuid} <> ${ip}] -> Creating New Member Entry In DB`);
  return new Promise((resolve, reject) => {
    var query = `INSERT INTO member (
      member_name,
      member_email,
      member_phone_number,
      member_membership_type, 
      client_id, 
      gym_id
    ) VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(
      query,
      [
        member_name,
        member_email,
        member_phone_number,
        member_membership_type,
        client_id,
        gym_id,
      ],
      function (err, result) {
        if (err) {
          logger.error(`[${uuid} <> ${ip}] -> ${err}`);
          reject(err);
        } else {
          logger.info(
            `[${uuid} <> ${ip}] -> Member Insert Response From DB -> [result = ${JSON.stringify(
              result
            )}]`
          );
          resolve(result.insertId);
        }
      }
    );
  });
};

export const updateMember = async (
  member_id,
  member_name,
  member_email,
  member_phone_number,
  member_membership_type,
  client_id,
  gym_id,
  uuid,
  ip
) => {
  logger.info(`[${uuid} <> ${ip}] -> Updating Member Entry In DB`);
  return new Promise((resolve, reject) => {
    var query = `UPDATE member SET 
    member_name = ?, 
    member_phone_number = ?, 
    member_email = ?, 
    member_membership_type = ? 
    WHERE 
    gym_id = ? 
    and member_id = ? 
    and client_id = ?
    and EXISTS (
      SELECT 1
      FROM membership
      WHERE membership_id = ?
    )`;

    connection.query(
      query,
      [
        member_name,
        member_phone_number,
        member_email,
        member_membership_type,
        gym_id,
        member_id,
        client_id,
        member_membership_type,
      ],
      function (err, result) {
        if (err) {
          logger.error(`[${uuid} <> ${ip}] -> ${err}`);
          reject(err);
        } else {
          logger.info(
            `[${uuid} <> ${ip}] -> Member Update Response From DB -> [result = ${JSON.stringify(
              result
            )}]`
          );
          resolve(result.insertId);
        }
      }
    );
  });
};

export const readMember = async (gym_id, client_id, uuid, ip) => {
  logger.info(`[${uuid} <> ${ip}] -> Reading Member Entry From DB`);
  return new Promise((resolve, reject) => {
    var query = `SELECT member_id,
    member_name,
    member_email,
    member_phone_number,
    member_membership_type, 
    insert_time,
    payment_due_date 
    FROM member WHERE client_id = ? and gym_id = ?`;

    connection.query(query, [client_id, gym_id], function (err, result) {
      if (err) {
        logger.error(`[${uuid} <> ${ip}] -> ${err}`);
        reject(err);
      } else {
        logger.info(
          `[${uuid} <> ${ip}] -> Member Read Response From DB -> [result = ${JSON.stringify(
            result
          )}]`
        );
        resolve(result);
      }
    });
  });
};

export const deleteMember = async (member_ids, gym_id, client_id, uuid, ip) => {
  logger.info(
    `[${uuid} <> ${ip}] -> Deleting Member Entry In DB by Iterating The Array -> [member_ids = ${member_ids}]`
  );

  return new Promise((resolve, reject) => {
    for (let i = 0; i < member_ids.length; i++) {
      var query = `DELETE FROM member WHERE client_id = ? and gym_id = ? and member_id = ?`;

      connection.query(
        query,
        [client_id, gym_id, member_ids[i]],
        function (err, result) {
          if (err) {
            logger.error(`[${uuid} <> ${ip}] -> ${err}`);
            reject(err);
          } else {
            logger.info(
              `[${uuid} <> ${ip}] -> Member Delete Response From DB -> [result = ${JSON.stringify(
                result
              )}]`
            );
            resolve(result);
          }
        }
      );
    }
  });
};
