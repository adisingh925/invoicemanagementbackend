`client`CREATE DATABASE lndtraining;

SELECT * FROM invoice_table;

DROP TABLE CLIENT;

CREATE TABLE CLIENT (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    PASSWORD VARCHAR(255),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    password_update_time TIMESTAMP
);

CREATE TABLE gym (
    gym_id INT AUTO_INCREMENT PRIMARY KEY,
    gym_name VARCHAR(255),
    gym_address VARCHAR(255),
    gym_phone_number VARCHAR(20),
    gym_email VARCHAR(255),
    client_id INT,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES CLIENT(client_id)
);

DROP TABLE gym;

CREATE TABLE membership (
    membership_id INT AUTO_INCREMENT PRIMARY KEY,
    membership_name VARCHAR(255),
    membership_price DECIMAL(10, 2),
    membership_duration_months INT,
    client_id INT,
    gym_id INT,
    insert_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES CLIENT(client_id),
    FOREIGN KEY (gym_id) REFERENCES gym(gym_id)
);

DROP TABLE membership;

DROP TABLE CLIENT;

CREATE TABLE customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    fk_client_id INT,
    customer_name VARCHAR(255),
    fileTypes VARCHAR(50),
    parsing_data TEXT,
    is_client BOOLEAN,
    FOREIGN KEY (fk_client_id) REFERENCES CLIENT(client_id)
);

CREATE TABLE invoice();

DESC invoice_table;

DROP TABLE 1_invoices;

DROP TABLE customer;

INSERT INTO invoice_table VALUES (19, "IN", 12, "test", "2008-11-11", 12, 0, 1, 12, "abc", 12);

SHOW DATABASES;

SELECT fileTypes FROM customer WHERE fk_client_id = 1;
